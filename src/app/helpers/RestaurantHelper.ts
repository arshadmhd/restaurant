import {User, Restaurant, Review} from "../../db/models";
import Permissions from "./Permissions";
import ReturnVal from "./ReturnVal";
import {Op} from "sequelize";
import config from "../../config/Config";

const RESTAURANT_PARAMS = ['id', 'name', 'address', 'rating'];

export default class RestaurantHelper {

    static isValidArray (v: []) {
        return !!(v && v.length > 0);
    }

    static async searchAllRestaurants (user: User, searchParams: any, page: number, order: string) {
        try {
            const query = await this.makeQueryForSearch(user, searchParams);
            const restaurants = await Restaurant.findAll({
                limit: config.PAGE_LIMIT,
                offset: config.PAGE_LIMIT * page,
                where: query,
                attributes: RESTAURANT_PARAMS,
                order: [[ "rating", order ]]
            });
            return new ReturnVal(true, 'Restaurants retrieved', restaurants);
        } catch (e) {
            return new ReturnVal(false, e.message, null);
        }
    }

    // static async getAllRestaurants (user: User, page:number, order: string) {
    //     try {
    //         const query = await this.makeQueryForSearch(user, {});
    //         const restaurants = await Restaurant.findAll({
    //             limit: config.PAGE_LIMIT,
    //             offset: config.PAGE_LIMIT * page,
    //             where: query,
    //             attributes: RESTAURANT_PARAMS,
    //             order: [[ "rating", order ]]
    //         });
    //         if (restaurants) {
    //             if (Permissions.canSearchGetRestaurants(user)) {
    //                 return new ReturnVal(true, 'Restaurants found.', restaurants);
    //             } else {
    //                 return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS, null);
    //             }
    //         } else {
    //             return new ReturnVal(false, 'No restaurants found.', null);
    //         }
    //     } catch (e) {
    //         return new ReturnVal(false, e.message, null);
    //     }
    //
    // }

    static async createRestaurant (user: User, data: object) {
        try {
            if (Permissions.canCreateRestaurant(user)) {
                // @ts-ignore
                const restaurant = new Restaurant({name: data.name, address: data.address});
                await restaurant.save();
                if (restaurant) {
                    if (user.role === "MANAGER") {
                        await restaurant.$set('user', user);
                    }
                    return new ReturnVal(true, 'Restaurants created successfully.', restaurant);
                } else {
                    return new ReturnVal(false, 'Restaurant not created.', null);
                }
            } else {
                return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS, null);
            }
        } catch (e) {
            return new ReturnVal(false, e.message, null);
        }
    }

    static async updateRestaurant (user: User, data: object, restaurantId: number) {
        try {
            if (await Permissions.canUpdateRestaurant(user, restaurantId)) {
                const updateResult = await Restaurant.update(data, {where: {id: restaurantId}});
                if (updateResult[0] > 0) {
                    return new ReturnVal(true, 'Restaurant updated successfully.', updateResult);
                } else {
                    return new ReturnVal(false, 'There has been a problem while trying to update the restaurant.', null);
                }
            } else {
                return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS, null);
            }
        } catch (e) {
            return new ReturnVal(false, e.message, null);
        }
    }

    static async deleteRestaurant (user: User, restaurantId: number) {
        try {
            if (await Permissions.canDeleteRestaurant(user, restaurantId)) {
                const deletedRestaurant = await Restaurant.destroy({where: {id: restaurantId}});
                const restaurantResult = await Restaurant.findOne({where: {id: restaurantId}});
                let reviewResult;
                if (!restaurantResult) {
                    await Review.destroy({where: {restaurantId}});
                    reviewResult = await Review.findOne({where: {restaurantId}});
                }
                if (!restaurantResult && !reviewResult) {
                    return new ReturnVal(true, 'Restaurant deleted successfully.', deletedRestaurant);
                } else {
                    return new ReturnVal(false, 'There has been a problem while trying to delete the restaurant.', null);
                }
            } else {
                return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS, null);
            }
        } catch (e) {
            return new ReturnVal(false, e.message, null);
        }
    }

    static async getRestaurant (user: User, id: number) {
        try {
            const query = await this.makeQueryForSearch(user, {ids: [id]});
            const restaurant: Restaurant = await Restaurant.findOne({where: query});

            if (restaurant) {
                if (Permissions.canGetRestaurant(user, restaurant)) {
                    const lowestReview: Review = await Review.findOne({where:{restaurantId: restaurant.id}, order:[['rating', 'ASC']]});
                    const highestReview: Review = await Review.findOne({where:{restaurantId: restaurant.id}, order:[['rating', 'DESC']]});
                    const lastReview: Review = await Review.findOne({where:{restaurantId: restaurant.id}, order:[['id', 'DESC']]});
                    const userReview: Review = await Review.findOne({where: {restaurantId: restaurant.id, userId: user.id}});
                    const reviews = {
                        lowest: lowestReview ? lowestReview.toJSON(): {},
                        highest: highestReview ? highestReview.toJSON(): {},
                        last: lastReview ? lastReview.toJSON():{} ,
                        userReview: userReview ? userReview.toJSON(): {}
                    };
                    const r = Object.assign({}, restaurant.toJSON(), {reviews});
                    return new ReturnVal(true, 'Restaurants found.', r);
                } else {
                    return new ReturnVal(false, config.MESSAGES.UNAUTHORIZED_ACCESS, null);
                }
            } else {
                return new ReturnVal(false, 'No restaurants found.', null);
            }
        } catch (e) {
            return new ReturnVal(false, e.message, null);
        }
    }

    static async makeQueryForSearch (currentUser: User, searchParams: any) {
        let query: object = {};

        if (this.isValidArray(searchParams.rating)) {
            query = {
                ...query,
                rating: {[Op.between]: searchParams.rating}
            };
        }
        if (this.isValidArray(searchParams.ids)) {
            query = {
                ...query,
                id: {[Op.in]: searchParams.ids}
            };
        }

        if (currentUser.role === "MANAGER") {
            query = {
                ...query,
                userId: currentUser.id
            };
        }

        if (searchParams.name) {
            const name: string = "%" + searchParams.name + "%";
            query = {
                ...query,
                name: {$like: name}
            };
        }
        return query;
    }
}
