import Faker from "faker";
import {Review} from "../../db/models/index";
import Lodash from "lodash";

export default class ReviewFactory {
    static createObject ({dateOfVisit, comment, rating, reply, user, restaurant}: any): any{
        comment = comment || Faker.name.findName();
        dateOfVisit = dateOfVisit || new Date();
        rating = rating || Math.random() * 4 + 1;
        reply = reply || Lodash.sample([Faker.name.findName(), null]);
        const restaurantId = restaurant && restaurant.id ? restaurant.id: null;
        const userId = user && user.id ? user.id: null;

        return {comment, dateOfVisit, rating, reply, userId, restaurantId};
    }

    static async generate ({dateOfVisit, comment, rating, reply, user, restaurant}: any): Promise<Review> {
        comment = comment || Faker.name.findName();
        dateOfVisit = dateOfVisit || new Date();
        rating = rating || Math.random() * 4 + 1;
        rating = Number(Number(rating).toFixed(2));
        reply = reply || Lodash.sample([Faker.name.findName(), null]);
        const restaurantId = restaurant && restaurant.id ? restaurant.id: null;
        const userId = user && user.id ? user.id: null;
        const review: Review = new Review({comment, dateOfVisit, rating, reply, restaurantId, userId});
        await review.save();
        // if(user) {
        //     await review.$set('user', user);
        // }
        // if(restaurant) {
        //     await review.$set('restaurant', restaurant);
        // }

        return review;
    }
}
