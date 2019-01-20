"use strict";
import {Sequelize} from "sequelize-typescript";
import Config from "../config/Config";
const config = Config.DB_CONFIG;
console.log(config);
class SequelizeInstance {

    static instance: Sequelize = null;

    static getInstance (): Sequelize{
        if (!SequelizeInstance.instance) {
            SequelizeInstance.instance = new Sequelize(config);
        }
        return SequelizeInstance.instance;
    }
}

export {
    SequelizeInstance
};
