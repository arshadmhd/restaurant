"use strict";

import RestaurantFactory from "../../test/factories/RestaurantFactory";
import {Restaurant, User} from "../models";
import Lodash from "lodash";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users: User[] = await User.findAll({where: {role: "MANAGER"}});
        for (let i = 0; i < 30; i++) {
            const user = Lodash.sample(users);
            await RestaurantFactory.generate({user});
        }
    },

    down: async (queryInterface, Sequelize) => {
        await Restaurant.destroy({where: {}});
    }
};
