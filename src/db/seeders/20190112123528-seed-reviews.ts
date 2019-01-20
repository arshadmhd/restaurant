"use strict";
import {Op} from "sequelize";
import ReviewFactory from "../../test/factories/ReviewFactory";
import {Restaurant, Review, User} from "../models";
import Lodash from "lodash";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users: User[] = await User.findAll({where: {role: {[Op.in]: ["USER", "ADMIN"]}}});
        const restaurants: Restaurant[] = await Restaurant.findAll({where: {}});
        for (let i = 0; i < 1000; i++) {
            const user = Lodash.sample(users);
            const restaurant = Lodash.sample(restaurants);
            const review: Review = await ReviewFactory.generate({user, restaurant});
        }
    },

    down: async (queryInterface, Sequelize) => {
        await Review.destroy({where: {}});
    }
};
