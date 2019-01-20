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
import {User} from "../../../../db/models";
import RestaurantHelper from "../../../helpers/RestaurantHelper";
import GenUtil from "../../../helpers/GenUtil";
import UrlEncodeJson from "urlcode-json";
const UNDEFINED = undefined;
@Controller("/api/v1/restaurant")
@OnUndefined(401)
class RestaurantController {

    @Post("/search")
    @Authorized()
    async searchAllRestaurants (@CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const page: number = req.query.page || 0;
        const order: string = req.query.order || 'DESC';
        const retVal = await RestaurantHelper.searchAllRestaurants(currentUser, req.body, page, order);
        const prevUrl = page > 0 ? req.originalUrl.split("?")[0] + "?" + UrlEncodeJson.encode(Object.assign({}, req.query, {page: Number(page) - 1}), true) : null;
        const nextUrl = retVal.returnVal.length > 0 ? req.originalUrl.split("?")[0] + "?" + UrlEncodeJson.encode(Object.assign({}, req.query, {page: Number(page) + 1}), true) : null;
        GenUtil.sendJsonResponse(res, retVal.success? 201: 400, retVal.message, retVal.returnVal, nextUrl, prevUrl);
        return UNDEFINED;
    }


    @Put("/:id")
    @Authorized()
    async updateRestaurant (@Param("id") restaurantId: number, @CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal = await RestaurantHelper.updateRestaurant(currentUser, req.body, req.params.id);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;

    }

    @Get("/:id")
    @Authorized()
    async getRestaurant (@Param("id") restaurantId: number, @CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal = await RestaurantHelper.getRestaurant(currentUser, req.params.id);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }

    @Delete("/:id")
    @Authorized()
    async deleteRestaurant (@Param("id") restaurantId: number, @CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        console.log("params",req.params);
        const retVal = await RestaurantHelper.deleteRestaurant(currentUser, req.params.id);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }

    @Get("/")
    @Authorized()
    async getAllRestaurants (@CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const page: number = req.query.page || 0;
        const order: string = req.query.order || 'DESC';
        const retVal = await RestaurantHelper.searchAllRestaurants(currentUser, {}, page, order);
        const prevUrl = page > 0 ? req.originalUrl.split("?")[0] + "?" + UrlEncodeJson.encode(Object.assign({}, req.query, {page: Number(page) - 1}), true) : null;
        const nextUrl = retVal.returnVal.length > 0 ? req.originalUrl.split("?")[0] + "?" + UrlEncodeJson.encode(Object.assign({}, req.query, {page: Number(page) + 1}), true) : null;
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal, nextUrl, prevUrl);
        return UNDEFINED;
    }

    @Post("/")
    @Authorized()
    async createRestaurant (@CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal = await RestaurantHelper.createRestaurant(currentUser, req.body);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }

}

export default RestaurantController;
