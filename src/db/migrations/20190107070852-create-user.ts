import {
    QueryInterface,
    SequelizeStatic,
} from "sequelize";

export = {
    up: (queryInterface: QueryInterface, sequelize: SequelizeStatic) => {
        return queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize.INTEGER,
            },

            name: {
                type: sequelize.STRING,
            },

            email: {
                type: sequelize.STRING,
            },

            emailAttributes: {
                defaultValue: {},
                type: sequelize.JSON,
            },

            role: {
                defaultValue: "USER",
                type: sequelize.ENUM("ADMIN", "USER", "MANAGER"),
            },
            status: {
                defaultValue: "ACTIVE",
                type: sequelize.ENUM("ACTIVE", "INACTIVE"),
            },
            gender: {
                type: sequelize.ENUM("MALE", "FEMALE", "OTHER"),
            },

            passwordAttributes: {
                defaultValue: {},
                type: sequelize.JSON,
            },

            createdAt: {
                allowNull: false,
                type: sequelize.DATE,
            },

            updatedAt: {
                allowNull: false,
                type: sequelize.DATE,
            },
        });
    },

    down: (queryInterface: QueryInterface, sequelize: SequelizeStatic) => {
        return queryInterface.dropTable("Users");
    },
};
