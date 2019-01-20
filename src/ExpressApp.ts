import ReviewController from "./app/controllers/api/v1/ReviewController";
import Config from "./config/Config";
import {User} from "./db/models";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import swaggerUi from 'swagger-ui-express';
import "reflect-metadata";
import path from "path";
import {Action, useExpressServer} from "routing-controllers";
import swaggerDocument from "./swagger.json";

import IndexController from "./app/controllers/api/v1/IndexController";
import UserController from "./app/controllers/api/v1/UserController";
import RestaurantController from "./app/controllers/api/v1/RestaurantController";


import GenUtil from "./app/helpers/GenUtil";

const app = express(); // your created express server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// view engine setup
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use( express.static( path.join( __dirname, "../build" ) ) );
app.use( express.static( path.join( __dirname, "../public" ) ) );

app.use(cookieParser());


useExpressServer(app, {
    defaults: {
        undefinedResultCode: 401
    },
    authorizationChecker: async (action: Action, roles: string[]) => {
        const user: User = await GenUtil.getUserFromSession(action, roles);
        if (user !== null) {
            return true;
        } else {
            GenUtil.sendJsonResponse(action.response, 401, Config.MESSAGES.UNAUTHORIZED_ACCESS, null);
            // return false;
        }
    },
    currentUserChecker: async (action: Action) => {
        const user = await GenUtil.getUserFromSession(action, []);
        if (user) {
            return user;
        } else {
            GenUtil.sendJsonResponse(action.response, 401, Config.MESSAGES.UNAUTHORIZED_ACCESS, null);
            // return null;
        }
    },
    controllers: [UserController, RestaurantController, ReviewController],
});

const router = express.Router();

/* GET home page. */
router.get( "/*", ( req, res, next ) => {
    res.render( "index", { "title": "Express" } );
} );

app.use("/", router);


export default app;
