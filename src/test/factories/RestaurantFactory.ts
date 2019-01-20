import Faker from "faker";
import {Restaurant} from "../../db/models/index";

export default class RestaurantFactory {
    static async createObject ({name, address, rating}: any){
        name = name || Faker.name.findName();
        address = address || Faker.address.streetAddress();
        rating = rating || Math.random()*4 + 1;
        return {name, address, rating};
    }

    static async generate ({name, address, rating, user}: any){
        name = name || Faker.name.findName();
        address = address || Faker.address.streetAddress();
        rating = rating || Math.random()*4 + 1;
        rating = Number(Number(rating).toFixed(2));
        const restaurant: Restaurant = new Restaurant({name, address, rating});
        await restaurant.save();
        if(user) {
            await restaurant.$set('user', user);
        }
        return restaurant;
    }
}
