import Fs from "fs";
import Environment from "../app/constants/Environment";
const DBCONFIG: any = JSON.parse(Fs.readFileSync("./src/db/dbconfig.json").toString());
// @ts-ignore
const ENV = process.env.NODE_ENV || 'development';

const DevConfig = {
    PORT: 3000,
    ENV: Environment.DEVELOPMENT,
    JWT_SECRET: "BIUGIUWniohdiwd973012jdwy9812yjbwqiso0918390jsqw90isniuwgs128gsbi2biu12sg12iusb12s12s1232098209su209dn239dnu932nx289nnny28yey9230euionsiodhe",
    MESSAGES: {
        RESOURCE_NOT_FOUND: "Resource not found ",
        RESOURCE_UPDATED_SUCCESSFULLY: "Resource has been updated successfully",
        RESOURCE_CREATED_SUCCESSFULLY: "Resource has been created successfully",
        UNAUTHORIZED_ACCESS: "You are not authorized for this action",
        INVALID_EMAIL: "Your email is invalid",
        EMAIL_ALREADY_EXISTS: "The email you have entered already exists.",
        EMAIL_VERIFICATION_FAILED: "Your email verification failed, probably your link expired or email already verified.",
        PASSWORD_RESET_FAILED: "Your password token is expired or wrong, in case of expiration you can request a new one.",
        SUCCESSFUL_EMAIL_VERIFICATION: "Your email is successfully verified",
        SUCCESSFULLY_RESEND_CONFIRMATION_MAIL: "Confirmation mail is successfully send.",
        SUCCESSFULLY_PASSWORD_TOKEN_SENT: "Password token been sent successfully",
        SUCCESSFULLY_PASSWORD_RESET: "Password has been reset successfully",
        SIGNUP_SUCCESSFUL_MESSAGE: "You have successfully signed up.",
        LOGOUT_SUCCESS_MESSAGE: "You have successfully logged out.",
        PASSWORD_MIN_LENGTH: 6,
        INVALID_PASSWORD: "Password should be at least 6 digits long.",
        RECORD_DELETED_SUCCESSFULLY: "Record is deleted successfully",
        MANAGER_NOT_FOUND: "Manager not found",
    },
    DB_CONFIG: DBCONFIG[ENV],
    CONSTANTS: {
        GENDERS: ["MALE", "FEMALE", "OTHER"],
    },
    BASE_URL: "http://localhost:3000",
    PAGE_LIMIT: 50,
};

export default DevConfig;
