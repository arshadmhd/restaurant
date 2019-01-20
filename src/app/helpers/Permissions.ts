import {Restaurant, Review, User} from "../../db/models";

export default class Permissions {

    static canSeeUsersList (requester: User) {
        return requester.role === "ADMIN";
    }

    static canUpdateUser (currentUser: User, user: User): boolean {
        return currentUser.id === user.id || currentUser.role === "ADMIN";
    }

    static canSeeUserDetails (currentUser: User, user: User): boolean {
        return currentUser.id === user.id || currentUser.role === "ADMIN";
    }

    static canDeleteUser (currentUser: User, user: User) {
        return currentUser.role === "ADMIN";
    }

    static canCreateRestaurant (currentUser: User): boolean {
        return (currentUser.role === "ADMIN" || currentUser.role === "MANAGER");
    }

    static async canUpdateRestaurant (currentUser: User, restaurantId: number): Promise<boolean>{
        const restaurant = await Restaurant.findOne({where:{id: restaurantId}});
        if (restaurant.userId === currentUser.id && currentUser.role === "MANAGER"|| currentUser.role === "ADMIN") {
            return true;
        }
        else return false;
    }

    static canGetRestaurant (currentUser: User, restaurant: Restaurant): boolean{
        if (restaurant && restaurant.userId === currentUser.id || currentUser.role === "ADMIN" || currentUser.role === "USER") {
            return true;
        }
        else return false;
    }

    static canSearchGetRestaurants (currentUser: User): boolean{
        if (currentUser.role === "ADMIN" || currentUser.role === "USER" || currentUser.role === "MANAGER"){
            return true;
        }
        else return false;
    }

    static async canDeleteRestaurant (currentUser: User, restaurantId: number): Promise<boolean>{
        const restaurant = await Restaurant.findOne({where:{id: restaurantId}});
        if (restaurant.userId === currentUser.id && currentUser.role === "MANAGER"|| currentUser.role === "ADMIN") {
            return true;
        }
        else return false;
    }

    static canCreateReview (currentUser: User): boolean{
        if (currentUser.role === "ADMIN" || currentUser.role === "USER") {
            return true;
        }
        else return false;
    }

    static canUpdateReview (currentUser: User, review: Review): boolean{
        if(currentUser.role === "ADMIN" || (currentUser.role === "USER" && review.userId === currentUser.id)){
            return true;
        } else return false;
    }

    static canDeleteReview (currentUser: User, review: Review): boolean{
        if(currentUser.role === "ADMIN" || (currentUser.role === "USER" && review.userId === currentUser.id)){
            return true;
        } else return false;
    }

    static canViewReview (currentUser: User, review: Review, restaurant: Restaurant): boolean{
        if(currentUser.role === "ADMIN" || currentUser.role === "USER" ) {
            return true;
        } else return restaurant && currentUser.role === "MANAGER" && restaurant.id === review.restaurantId && currentUser.id === restaurant.userId;
    }


    static canModifyReply (currentUser: User, review: Review, restaurant: Restaurant){
        if (currentUser.role==="MANAGER" && restaurant.userId === currentUser.id && review.restaurantId===restaurant.id) {
            return true;
        }
        else return currentUser.role === "ADMIN";
    }




}
