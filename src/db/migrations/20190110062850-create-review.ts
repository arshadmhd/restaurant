import {
    QueryInterface,
    SequelizeStatic,
} from "sequelize";

export = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.createTable("Reviews", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            restaurantId: {
                type: Sequelize.INTEGER
            },

            userId: {
                type: Sequelize.INTEGER
            },

            rating: {
                type: Sequelize.DOUBLE,
            },

            reply: {
                type: Sequelize.STRING,
            },

            comment: {
                type: Sequelize.STRING,
            },

            dateOfVisit: {
                type: Sequelize.DATE,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.dropTable("Reviews");
    },
};
