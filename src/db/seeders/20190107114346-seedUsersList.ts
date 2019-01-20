"use strict";

import UserFactory from "../../test/factories/UserFactory";
import {User} from "../models/";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await UserFactory.generate({
            name: "arshad AM",
            role: "ADMIN",
            status: "ACTIVE",
            email: "arshad.admin@gmail.com"
        });
        await UserFactory.generate({
            name: "arshad MG",
            role: "MANAGER",
            status: "ACTIVE",
            email: "arshad.manager@gmail.com"
        });
        await UserFactory.generate({
            name: "arshad RG",
            role: "USER",
            status: "ACTIVE",
            email: "arshad.user@gmail.com"
        });
        for (let i = 0; i < 12; i++) {
            await UserFactory.generate({});
        }
    },

    down: async (queryInterface, Sequelize) => {
        await User.destroy({where: {}});
    },
};
