import Lodash from "lodash";
import {skip} from "mocha-typescript";
import validator from 'validator';
import Moment from "moment";
import sha256 from "sha256";
import Util from "util";
import uuidv4 from "uuid/v4";
import config from "../../config/Config";
import {Restaurant, User} from "../../db/models";
import Notifier from "./Notifier";
import Permissions from "./Permissions";
import ReturnVal from "./ReturnVal";

const USER_DETAILS_FIELDS = ["role", "status", "gender", "name", "email", "id", "createdAt", "updatedAt"];
const SELF_UPDATE_ALLOWED_FIELDS = ["sex", "name", "email"];
const ADMIN_UPDATE_ALLOWED_FIELDS = SELF_UPDATE_ALLOWED_FIELDS.concat(["role", "status"]);

const STRS = {
    EMAIL_ALREADY_EXIST: "Email already exist. if you forgot your password you can request for one.",
    EMAIL_NOT_VERIFIED: "Your email is not verified.",
    EMAIL_PASSWORD_NOT_MATCHED: "Email and password combination didn't matched.",
    INACTIVE_ACCOUNT: "Your account have been deactivated.",
    INVALID_EMAIL: "Your email is invalid.",
    INVALID_NAME: "Name is invalid. it should be at least 6 chars long.",
    INVALID_PASSWORD: "Password should be at least 6 digits long.",
    INVALID_ROLE: "You can only sign-up as consumer.",
    INVALID_SEX: "Sex is invalid. Accepted values are " + config.CONSTANTS.GENDERS + ".",
    LOGGED_IN_SUCCESSFUL: "You have been logged in successful.",
    NAME_MIN_LENGTH: 6,
    PASSWORD_MIN_LENGTH: 6,
};

const TIME = {
    EMAIL_TOKEN_EXPIRATION: 24 * 60 * 60, // seconds
    PASSWORD_TOKEN_EXPIRATION: 15 * 60,  // seconds

};

export default class UserHelper {

    static async doSignup ({email, password, name, gender, role}): Promise<ReturnVal> {
        const uuid = uuidv4();
        try {
            const user = new User({
                email,
                name,
                gender,
                passwordAttributes: {
                    hash: sha256(password + uuid),
                    salt: uuid,
                },
                role,
            });
            user.emailAttributes = {
                created: Moment().toISOString(),
                expired: Moment().add(TIME.EMAIL_TOKEN_EXPIRATION, "seconds").toISOString(),
                token: uuidv4(),
                verified: false
            };
            await user.save();
            return new ReturnVal(true, config.MESSAGES.SIGNUP_SUCCESSFUL_MESSAGE, Lodash.pick(user.toJSON(), USER_DETAILS_FIELDS));
        } catch (e) {
            console.log(e);
            return new ReturnVal(false, e.message || e.errors[0].message, null);
        }
    }

    static async doLogin ({email, password}): Promise<ReturnVal> {
        try {
            const user = await User.findOne({
                where: {email: email.trim().toLowerCase()},
            });
            if (!user) {
                return new ReturnVal(false, STRS.INVALID_EMAIL, null);
            }
            const hash = sha256(password + user.passwordAttributes.salt);
            if (hash !== user.passwordAttributes.hash) {
                return new ReturnVal(false, STRS.EMAIL_PASSWORD_NOT_MATCHED, null);
            }
            if (user.emailAttributes.verified === false) {
                return new ReturnVal(false, STRS.EMAIL_NOT_VERIFIED, null);
            }
            if (user.status !== "ACTIVE") {
                return new ReturnVal(false, STRS.INACTIVE_ACCOUNT, null);
            }
            return new ReturnVal(true, STRS.LOGGED_IN_SUCCESSFUL, user);
        } catch (e) {
            console.log(e);
            return new ReturnVal(true, "Error occurred while logging in.", null);
        }
    }

    static async verifyEmail (email: string, emailToken: string): Promise<ReturnVal> {
        const user = await User.findOne({where: {email: validator.trim(email, "").toLowerCase()}});
        if (!user) {
            return new ReturnVal(false, config.MESSAGES.EMAIL_VERIFICATION_FAILED);
        }

        if (user.emailAttributes.token === emailToken && Moment().toISOString() < user.emailAttributes.expired) {

            user.emailAttributes = Object.assign({}, user.emailAttributes, {
                updated: Moment().toISOString(),
                verified: true,
            });
            await user.save();

            return new ReturnVal(true, config.MESSAGES.SUCCESSFUL_EMAIL_VERIFICATION);
        }
        return new ReturnVal(false, config.MESSAGES.EMAIL_VERIFICATION_FAILED);
    }

    static async resendEmailConfirmation (email: string): Promise<ReturnVal> {
        const user = await User.findOne({where: {email: validator.trim(email, "").toLowerCase()}});
        if (!user) {
            return new ReturnVal(false, config.MESSAGES.INVALID_EMAIL);
        }
        user.emailAttributes = {
            token: uuidv4(),
            created: Moment().toISOString(),
            expired: Moment().add(TIME.EMAIL_TOKEN_EXPIRATION, "seconds").toISOString(),
            verified: false,
        };

        await user.save();
        return new ReturnVal(true, config.MESSAGES.SUCCESSFULLY_RESEND_CONFIRMATION_MAIL, user);
    }

    static async resendPasswordResetToken (email: string | any | string): Promise<ReturnVal> {
        const user = await User.findOne({where: {email: validator.trim(email, "").toLowerCase()}});
        if (!user) {
            return new ReturnVal(false, config.MESSAGES.INVALID_EMAIL);
        }

        user.passwordAttributes = {
            created: Moment().toISOString(),
            expired: Moment().add(TIME.PASSWORD_TOKEN_EXPIRATION, "seconds").toISOString(),
            token: (Math.floor(Math.random() * 10000000) + 1000000) + "",
        };
        await user.save();
        return new ReturnVal(true, config.MESSAGES.SUCCESSFULLY_PASSWORD_TOKEN_SENT, user);
    }

    static async resetPassword (email: string | any | string, passwordToken: string, password: string): Promise<ReturnVal> {
        const user = await User.findOne({where: {email: validator.trim(email, "").toLowerCase()}});
        if (!user) {
            return new ReturnVal(false, config.MESSAGES.INVALID_EMAIL);
        }
        if (validator.trim(password, "").length < config.MESSAGES.PASSWORD_MIN_LENGTH) {
            return new ReturnVal(false, config.MESSAGES.INVALID_PASSWORD);
        }

        if (user.passwordAttributes.token === passwordToken && Moment().toISOString() < user.passwordAttributes.expired) {
            const uuid = uuidv4();
            user.passwordAttributes = {
                salt: uuid,
                hash: sha256(password + uuid),
                updated: Moment().toISOString(),
            };
            await user.save();
            return new ReturnVal(true, config.MESSAGES.SUCCESSFULLY_PASSWORD_RESET, user);
        }
        return new ReturnVal(false, config.MESSAGES.PASSWORD_RESET_FAILED);
    }

    static async searchUsers (requester: User, searchParams: any) {
        if (Permissions.canSeeUsersList(requester)) {
            const page: number = searchParams.page || 0;

            const users = await User.findAll({
                limit: config.PAGE_LIMIT,
                offset: config.PAGE_LIMIT * page,
                attributes: USER_DETAILS_FIELDS,
                order: [
                    ["id", "DESC"],
                ],
            });
            return new ReturnVal(true, "", users);
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

    static async updateUserDetails (currentUser: User, userArgs: any, userId: number): Promise<ReturnVal> {
        const user = await User.findOne({where: {id: userId}});
        if (!user) {
            return new ReturnVal(false, Util.format(config.MESSAGES.RESOURCE_NOT_FOUND, userId));
        }
        if (await Permissions.canUpdateUser(currentUser, user)) {
            try {
                let updateVals: object = {};
                let emailUpdate: boolean;
                if (currentUser.role !== "ADMIN") {  // updating self or manager updating client
                    updateVals = Lodash.pick(userArgs, SELF_UPDATE_ALLOWED_FIELDS);
                } else {
                    updateVals = Lodash.pick(userArgs, ADMIN_UPDATE_ALLOWED_FIELDS);
                }
                emailUpdate = userArgs.email ? user.email.toLowerCase() !== userArgs.email.toLowerCase() : false;
                Object.assign(user, user, updateVals);
                if (emailUpdate) {
                    await user.validate();
                    user.emailAttributes = {
                        token: uuidv4(),
                        created: Moment().toISOString(),
                        expired: Moment().add(TIME.EMAIL_TOKEN_EXPIRATION, "seconds").toISOString(),
                        verified: false,
                    };
                } else {
                    await user.validate({skip: ["email"]});
                }
                await user.save();
                if (emailUpdate) {
                    await Notifier.notifyEmailConfirmation(user);
                }
                return new ReturnVal(true, emailUpdate ? "Field updated. Since your have also updated your email your need to confirm by clicking confirmation link in your email inbox" : "Fields are updated");
            } catch (e) {
                return new ReturnVal(false, e.message || e.errors[0].message);
            }
        }
    }

    static async findUserDetails (currentUser: User, userId: number): Promise<ReturnVal> {
        const user = await User.findOne({
            where: {id: userId},
            attributes: USER_DETAILS_FIELDS,
        });
        if (!user) {
            return new ReturnVal(false, config.MESSAGES.RESOURCE_NOT_FOUND);
        }
        if (Permissions.canSeeUserDetails(currentUser, user)) {
            return new ReturnVal(true, "", user);
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

    static async deleteUser (currentUser: User, userId: number): Promise<ReturnVal> {
        const user = await User.findOne({where: {id: userId}});
        if (!user) {
            return new ReturnVal(false, config.MESSAGES.RESOURCE_NOT_FOUND);
        }
        if (Permissions.canDeleteUser(currentUser, user)) {
            await Restaurant.destroy({
                where: {
                    userId: user.id,
                },
            });
            await user.destroy();

            return new ReturnVal(true, config.MESSAGES.RECORD_DELETED_SUCCESSFULLY, user);
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }

    }
}
