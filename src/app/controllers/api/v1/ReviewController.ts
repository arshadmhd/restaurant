import {NextFunction, Request, Response} from "express";
import {
    Authorized,
    CurrentUser,
    Delete,
    Get,
    JsonController,
    OnUndefined, Param,
    Post,
    Put,
    Req,
    Res,
} from "routing-controllers";
import {User} from "../../../../db/models";
import GenUtil from "../../../helpers/GenUtil";
import ReturnVal from "../../../helpers/ReturnVal";
import ReviewHelper from "../../../helpers/ReviewHelper";
import UrlEncodeJson from "urlcode-json";

const UNDEFINED = undefined;
@JsonController("/api/v1/review")
@OnUndefined(401)
@Authorized()
class ReviewController {

    @Get("/unreplied")
    async getAllUnRepliedReview (@CurrentUser() currentUser,  @Req() req: Request, @Res() res: Response, next: NextFunction){
        const retVal: ReturnVal = await ReviewHelper.getAllUnRepliedReviews(currentUser);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
    }


    @Post("/:resId/:reviewId")  // only update comment on review row
    @Put("/:resId/:reviewId/reply") // only update comment on review row
    async createReply (@CurrentUser() currentUser: User, @Param("resId") resId: number,
                      @Param('reviewId') reviewId: number,
                      @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await ReviewHelper.updateReply(currentUser, resId, reviewId, req.body);
        GenUtil.sendJsonResponse(res, retVal.success? 201: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }

    @Delete("/:resId/:reviewId/reply") // only update comment on review row
    async deleteReply (@CurrentUser() currentUser: User, @Param("resId") resId: number,
                      @Param('reviewId') reviewId: number,
                      @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await ReviewHelper.updateReply(currentUser, resId, reviewId,{reply: null});
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;

    }



    @Post('/:resId')
    async createReview (@CurrentUser() currentUser: User, @Param("resId") resId: number,
                       @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await ReviewHelper.createReview(currentUser, resId, req.body);
        GenUtil.sendJsonResponse(res, retVal.success? 201: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }

    @Put('/:resId/:reviewId')
    async updateReview (@CurrentUser() currentUser: User, @Param("resId") resId: number,
                       @Param('reviewId') reviewId: number,
                       @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await ReviewHelper.updateReview(currentUser, resId, reviewId, req.body);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;

    }

    @Get('/:resId/:reviewId')
    async getReview (@CurrentUser() currentUser: User, @Param("resId") resId: number,
                    @Param('reviewId') reviewId: number,
                    @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await ReviewHelper.getReview(currentUser, resId, reviewId);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }

    @Get('/:resId')
    async getAllRestaurantReview (@CurrentUser() currentUser: User, @Param("resId") resId: number,
                       @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await ReviewHelper.getAllReviewsOfManager(currentUser, resId);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }

    @Delete("/:resId/:reviewId")
    async deleteReview (@CurrentUser() currentUser: User, @Param("resId") resId: number,
                       @Param('reviewId') reviewId: number,
                       @Req() req: Request, @Res() res: Response, next: NextFunction) {
        const retVal: ReturnVal = await ReviewHelper.deleteReview(currentUser, resId, reviewId);
        GenUtil.sendJsonResponse(res, retVal.success? 200: 400, retVal.message, retVal.returnVal);
        return UNDEFINED;
    }


    @Get("/")
    async getAllReviewOfUser (@CurrentUser() currentUser: User, @Req() req: Request, @Res() res: Response, next: NextFunction ) {
        const page: number = req.query.page || 0;
        const retVal: ReturnVal = await ReviewHelper.getAllReviewsOfManager(currentUser, null);
        const prevUrl = page > 0 ? req.originalUrl.split("?")[0] + "?" + UrlEncodeJson.encode(Object.assign({}, req.query, {page: Number(page) - 1}), true) : null;
        const nextUrl = retVal.returnVal.length > 0 ? req.originalUrl.split("?")[0] + "?" + UrlEncodeJson.encode(Object.assign({}, req.query, {page: Number(page) + 1}), true) : null;
        GenUtil.sendJsonResponse(res, retVal.success ? 200 : 400, retVal.message, retVal.returnVal, nextUrl, prevUrl);
    }




}

export default ReviewController;
