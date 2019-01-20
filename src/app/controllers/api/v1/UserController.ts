import {NextFunction, Request, Response} from "express";
import {
    Authorized, Controller,
    CurrentUser,
    Delete,
    Get,
    JsonController,
    OnUndefined,
    Param,
    Post,
    Put,
    Req,
    Res,
} from "routing-controllers";
import UrlcodeJson from "urlcode-json";
import config from "../../../../config/Config";
import {User} from "../../../../db/models";
import GenUtil from "../../../helpers/GenUtil";
import Notifier from "../../../helpers/Notifier";
import ReturnVal from "../../../helpers/ReturnVal";
import UserHelper from "../../../helpers/UserHelper";

@Controller("/api/v1/user")
@OnUndefined(401)
class UserController {

    @Post("/signup")
    async signUpUser (@Req() req: Request, @Res() res: Response, next: any) {
        const retVal: ReturnVal = await UserHelper.doSignup(req.body);
        const statusCode: number = retVal.success ? 201 : 400;
        GenUtil.sendJsonResponse(res, statusCode, retVal.message, retVal.returnVal, null, null);
        return undefined;
    }

    @Post("/login")
    async loginUser (@Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await UserHelper.doLogin(req.body);
        if (retVal.success) {
            const jwtToken: string = GenUtil.getJWTToken(retVal.returnVal);
            res.cookie("access_token", jwtToken);
            const user: User = retVal.returnVal;
            GenUtil.sendJsonResponse(res, 200, retVal.message, {
                email: user.email,
                id: user.id,
                role: user.role,
                name: user.name,
                jwtToken
            });
        } else {
            GenUtil.sendJsonResponse(res, 400, retVal.message, retVal.returnVal);
        }
    }

    @Post("/logout")
    @Authorized()
    async logoutUser (@Req() req: Request, @Res() res: Response, next: NextFunction) {
        // @ts-ignore
        // req.session.destroy();
        res.cookie("access_token", null);
        res.setHeader("access_token", null);
        GenUtil.sendJsonResponse(res, 200, config.MESSAGES.LOGOUT_SUCCESS_MESSAGE, null, null, null);
        return undefined;
    }

    @Get("/verify_email")
    async verifyEmail (@Req() req: Request, @Res() res: Response, next: NextFunction) {
        const email: string = req.query.email || "";
        const emailToken: string = req.query.emailToken || "";
        const retVal = await UserHelper.verifyEmail(email, emailToken);
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, null, null, null);

    }

    @Get("/email_confirmation")
    async emailConfirmation (@Req() req: Request, @Res() res: Response, next: NextFunction) {
        const email: string = req.query.email;
        const retVal: ReturnVal = await UserHelper.resendEmailConfirmation(email);
        if (retVal.success) {
            await Notifier.notifyEmailConfirmation(retVal.returnVal);
        }
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, null);
    }

    @Get("/password_reset")
    async passwordResetGet (@Req() req: Request, @Res() res: Response, next: NextFunction) {
        const email = req.query.email;
        const retVal: ReturnVal = await UserHelper.resendPasswordResetToken(email);
        if (retVal.success) {
            await Notifier.notifyPasswordReset(retVal.returnVal);
        }
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, null);
    }

    @Post("/password_reset")
    async passwordResetPost (@Req() req: Request, @Res() res: Response, next: NextFunction) {
        const email = req.body.email || "";
        const password = req.body.password || "";
        const passwordToken = req.body.passwordToken || "";

        const retVal: ReturnVal = await UserHelper.resetPassword(email, passwordToken, password);
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, null);
    }

    @Get("/:id")
    @Authorized()
    async getUser (@Param("id") userId: string, @CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        if (userId === 'details') {
            userId = currentUser.id+"";
        }
        const retVal = await UserHelper.findUserDetails(currentUser, Number(userId));
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, retVal.returnVal);
    }

    @Delete("/:id")
    @Authorized()
    async deleteUser (@Param("id") userId: number, @CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await UserHelper.deleteUser(currentUser, userId);
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, null);
    }

    @Get("/")
    @Authorized()
    async getAllUsers (@CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const page = req.query.page || 0;
        const retVal: ReturnVal = await UserHelper.searchUsers(currentUser, req.query);

        if (retVal.success) {
            const prevUrl = page > 0 ? req.originalUrl.split("?")[0] + "?" + UrlcodeJson.encode(Object.assign({}, req.query, {page: Number(page) - 1}), true) : null;
            const nextUrl = retVal.returnVal.length > 0 ? req.originalUrl.split("?")[0] + "?" + UrlcodeJson.encode(Object.assign({}, req.query, {page: Number(page) + 1}), true) : null;

            GenUtil.sendJsonResponse(res, 200, "Received list of users", retVal.returnVal, nextUrl, prevUrl);
        } else {
            GenUtil.sendJsonResponse(res, 400, retVal.message, null);
        }
        return undefined;
    }

    @Put("/:id")
    @Authorized()
    async updateUser (@Param("id") userId: number, @CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const userArgs = req.body;
        const retVal = await UserHelper.updateUserDetails(currentUser, userArgs, userId);
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, null);
    }
}

export default UserController;
