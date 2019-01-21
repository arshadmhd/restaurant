import config from "../../config/Config";
import {Restaurant, Review, User} from "../../db/models";
import Permissions from "./Permissions";
import ReturnVal from "./ReturnVal";
import Lodash from "lodash";
import {Op} from "sequelize";

const REVIEW_UPDATES = ['id', 'rating', 'comment', 'reply', 'dateOfVisit', 'createdAt', 'userId', 'restaurantId'];

export default class ReviewHelper {

    static async createReview (currentUser: User, resId: number, params: any) {
        if (Permissions.canCreateReview(currentUser)) {
            const {rating, comment, dateOfVisit} = params;
            const existingReview: Review = await Review.findOne({where: {restaurantId: resId, userId: currentUser.id}});
            if (existingReview) {
                return new ReturnVal(false, "You have already reviewed this restaurant");
            }
            try {
                const review: Review = new Review({
                    rating,
                    comment,
                    dateOfVisit,
                    restaurantId: resId,
                    userId: currentUser.id
                });
                await review.validate();
                await review.save();
                return ReturnVal.create(true, config.MESSAGES.RESOURCE_CREATED_SUCCESSFULLY, review);
            } catch (e) {
                return ReturnVal.create(false, e.message || e.errors[0].message, null);
            }
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

    static async updateReview (currentUser: User, resId: number, reviewId: number, params: any) {
        const review: Review = await Review.findOne({where: {id: reviewId}});
        if (true) {
            try {
                const {rating, comment, dateOfVisit, reply} = params;
                if (currentUser.role === "MANAGER"){
                    if (rating !== review.rating || comment !== review.comment) {
                        return new ReturnVal(false, "You can only reply", null);
                    }
                } else if (currentUser.role === "USER"){
                    if (review.reply !== reply){
                        return new ReturnVal(false, "You can't change reply", null);
                    }
                }
                await Review.update({rating, comment, dateOfVisit, reply}, {where: {id: reviewId}});
                return ReturnVal.create(true, config.MESSAGES.RESOURCE_UPDATED_SUCCESSFULLY, review);
            } catch (e) {
                return ReturnVal.create(false, e.message || e.errors[0].message, null);
            }
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

    static async getReview (currentUser: User, resId: number, reviewId: number) {
        const review: Review = await Review.findOne({where: {id: reviewId}});
        const restaurant: Restaurant = await Restaurant.findOne({where: {id: resId}});

        if (Permissions.canViewReview(currentUser, review, restaurant)) {
            try {
                return ReturnVal.create(true, "", review);
            } catch (e) {
                return ReturnVal.create(false, e.message || e.errors[0].message, null);
            }
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

    static async getAllReviewsOfManager (currentUser: User, resId?: number) {
        let query = {};
        if (resId) {
            query = {restaurantId: resId};
        } else if (currentUser.role === "ADMIN") {
            query = {};
        } else if (currentUser.role === "MANAGER") {
            const restaurants: Restaurant[] = await Restaurant.findAll({where: {userId: currentUser.id}});
            const resIds = Lodash.map(restaurants, (res: Restaurant) => res.id);
            query = {restaurantId: {[Op.in]: resIds}};
        }
        const reviews: Review[] = await Review.findAll({
            where: query,
            attributes: REVIEW_UPDATES
        });
        return ReturnVal.create(true, "", reviews);
    }

    static async deleteReview (currentUser: User, resId: number, reviewId: number) {
        const restaurent: Restaurant = await Restaurant.findOne({where: {id: resId}});
        const review: Review = await Review.findOne({where: {id: reviewId}});
        if (Permissions.canDeleteReview(currentUser, review)) {
            try {
                const deleteInfo = await review.destroy();
                return ReturnVal.create(true, config.MESSAGES.RECORD_DELETED_SUCCESSFULLY, deleteInfo);
            } catch (e) {
                return ReturnVal.create(false, e.message || e.errors[0].message, null);
            }
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

    static async updateReply (currentUser: User, resId: number, reviewId: number, params: any) {
        const restaurant: Restaurant = await Restaurant.findOne({where: {id: resId}});
        const review: Review = await Review.findOne({where: {id: reviewId}});
        if (Permissions.canModifyReply(currentUser, review, restaurant)) {
            try {
                const {reply} = params;
                review.reply = reply;
                const reviewResult = await review.save();
                return ReturnVal.create(true, "", reviewResult);
            } catch (e) {
                return ReturnVal.create(false, e.message || e.errors[0].message, null);
            }

        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

    static async getAllUnRepliedReviews (currentUser: User) {
        if (currentUser.role === "MANAGER") {
            const restaurants: Restaurant[] = await Restaurant.findAll({where: {userId: currentUser.id}});
            const resIds = Lodash.map(restaurants, r => r.id);
            const reviews: Review[] = await Review.findAll({where: {restaurantId: {[Op.in]: resIds}}});
            const unreplied: Review[] = Lodash.filter(reviews, r => !r.reply );
            const reviewsArr = Lodash.map(unreplied,  r => r.toJSON());
            return new ReturnVal(true, "", reviewsArr);
        } else {
            return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS, null);
        }
    }
}
