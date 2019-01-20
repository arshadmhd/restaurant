import {
    QueryInterface,
    SequelizeStatic,
} from "sequelize";

export = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.createTable("Restaurants", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            userId: {
                type: Sequelize.INTEGER
            },

            name: {
                type: Sequelize.STRING,
            },

            address: {
                type: Sequelize.STRING,
            },

            rating: {
                type: Sequelize.DOUBLE,
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
        return queryInterface.dropTable("Restaurants");
    },
};
