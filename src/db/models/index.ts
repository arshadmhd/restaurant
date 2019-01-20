import {Sequelize} from "sequelize-typescript";
import {SequelizeInstance} from "../sequelize";
import Restaurant from "./restaurant";
import Review from "./review";
import User from "./user";

export const InitializeSequelize = (): boolean => {
    console.log("Initializing sequelize and adding models");
    const instance: Sequelize = SequelizeInstance.getInstance();
    instance.addModels([User, Review, Restaurant]);
    return true;
};


SequelizeInstance.getInstance().addModels([User, Review, Restaurant]);

export {
    User, Restaurant, Review
};

