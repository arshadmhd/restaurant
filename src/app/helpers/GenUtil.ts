import {Response} from "express";
import Jwt from "jsonwebtoken";
import {Action} from "routing-controllers";

import UUIDV4 from "uuid/v4";
import Config from "../../config/Config";
import {User} from "../../db/models";

class GenUtil {

    static sendJsonResponse = (res: Response, statusCode: number, message: string,
                                      data: object, nextUrl?: string, prevUrl?: string) => {
        let dataToSend: object = {};
        let key: string = null;
        key = statusCode >= 200 && statusCode <= 300 ? "success" : "error";
        dataToSend[key] = {
            data,
            message,
        };

        if (nextUrl) {
            dataToSend = {...dataToSend, nextUrl};
        }

        if (prevUrl) {
            dataToSend = {...dataToSend, prevUrl};
        }

        res.status(statusCode).json(dataToSend);
    };

    static async getUserFromSession (action: Action, roles: string[]): Promise<User> {
        const token: string = action.request.cookies.access_token || action.request.headers.access_token;
        if (token) {
            try {
                const data: any = Jwt.verify(token, Config.JWT_SECRET);
                const user: User = await User.findOne({where: {id: data.user_id}});
                if (user && user.status === "ACTIVE") {
                    return user;
                } else {
                    return null;
                }
            } catch (e) {
                return null;
            }
        }
    }

    static getJWTToken (user: User): any {
        return Jwt.sign({user_id: user.id, email: user.email, random: UUIDV4().toString()}, Config.JWT_SECRET);
    }
}

export default GenUtil;
