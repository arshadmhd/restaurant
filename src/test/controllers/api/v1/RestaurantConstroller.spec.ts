import Chai, {assert} from "chai";
import ChaiHTTP from "chai-http";
import {suite, test} from "mocha-typescript";
import {Restaurant} from "../../../../db/models";
import RestaurantFactory from "../../../factories/RestaurantFactory";
import Truncate from "../../../Truncate";
import UserFactory from "../../../factories/UserFactory";
import server from '../../../../ExpressApp';
import GenUtil from "../../../../app/helpers/GenUtil";


Chai.use(ChaiHTTP);
Chai.should();

describe("User Controller Tests", async () => {
    beforeEach(async () => await Truncate());
    @suite class CreateRestaurant {
        @test async shouldCreateRestaurantAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant = RestaurantFactory.createObject({});
            const res = await Chai.request(server).post('/api/v1/restaurant/')
                .send(restaurant)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);

        }

        @test async shouldCreateOwnRestaurantAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = RestaurantFactory.createObject({});
            const res = await Chai.request(server).post('/api/v1/restaurant/')
                .send(restaurant)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);

        }

        @test async shouldNotCreateRestaurantAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = RestaurantFactory.createObject({});
            const res = await Chai.request(server).post('/api/v1/restaurant/')
                .send(restaurant)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(400);

        }

        @test async shouldNotCreateRestaurantWithoutAuth () {
            const restaurant = RestaurantFactory.createObject({});
            const res = await Chai.request(server).post('/api/v1/restaurant/')
                .send(restaurant);
            res.should.have.status(401);
        }
    }

    @suite class UpdateRestaurant {
        @test async shouldUpdateRestaurantAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).put(`/api/v1/restaurant/${restaurant.id}`)
                .send({name: 'karim\'s'})
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldUpdateOwnRestaurantAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({user});
            const res = await Chai.request(server).put(`/api/v1/restaurant/${restaurant.id}`)
                .send({name: 'karim\'s'})
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldNotUpdateSomeonesRestaurantAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).put(`/api/v1/restaurant/${restaurant.id}`)
                .send({name: 'karim\'s'})
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(400);
        }

        @test async shouldNotUpdateRestaurantAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({user});
            const res = await Chai.request(server).put(`/api/v1/restaurant/${restaurant.id}`)
                .send({name: 'karim\'s'})
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(400);
        }

        @test async shouldNotUpdateRestaurantWithoutAuth () {
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).put(`/api/v1/restaurant/${restaurant.id}`)
                .send({name: 'karim\'s'});
            res.should.have.status(401);

        }
    }

    @suite class DeleteRestaurant {
        @test async shouldDeleteRestaurantAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({user});
            const res = await Chai.request(server).delete(`/api/v1/restaurant/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(400);
        }

        @test async shouldDeleteOwnRestaurantAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({user});
            const res = await Chai.request(server).delete(`/api/v1/restaurant/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldDeleteRestaurantAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).delete(`/api/v1/restaurant/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldDeleteRestaurantWithoutAuth () {
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).delete(`/api/v1/restaurant/${restaurant.id}`);
            res.should.have.status(401);
        }
    }

    @suite class GetRestaurant {
        @test async shouldGetOwnRestaurantAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({user});
            const res = await Chai.request(server).get(`/api/v1/restaurant/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            // const body = res.body;
            // console.log(body);
            res.should.have.status(200);
        }

        @test async shouldNotGetSomeonesRestaurantAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/restaurant/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(400);
        }

        @test async shouldGetAnyRestaurantAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/restaurant/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldGetAnyRestaurantAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/restaurant/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldNotGetRestaurantWithoutAuth () {
            const restaurant: Restaurant = await RestaurantFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/restaurant/${restaurant.id}`);
            res.should.have.status(401);
        }

    }

    @suite
    class GetAllRestaurants {
        @test async shouldGetAllRestaurantsAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            await RestaurantFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/restaurant/`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldGetOwnRestaurantsAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            await RestaurantFactory.generate({});
            await RestaurantFactory.generate({user});
            const res = await Chai.request(server).get(`/api/v1/restaurant/`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
            assert(res.body.success.data.length === 1);
        }

        @test async shouldGetAllRestaurantsAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            await RestaurantFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/restaurant/`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async shouldNotGetAllRestaurantsWithoutAuth () {
            await RestaurantFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/restaurant/`);
            res.should.have.status(401);
        }
    }

    @suite
    class SearchRestaurants {
        @test async shouldSearchAllRestaurantsAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const searchParams = {name: 'karim\'s', address: 'chandni chowk'};
            await RestaurantFactory.generate(searchParams);
            const res = await Chai.request(server).post(`/api/v1/restaurant/search`)
                .send(searchParams)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(201);
        }

        @test async shouldSearchOwnRestaurantsAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const searchParams = {name: 'karim\'s', address: 'chandni chowk'};
            await RestaurantFactory.generate(searchParams);
            await RestaurantFactory.generate({...searchParams, user});
            const res = await Chai.request(server).post(`/api/v1/restaurant/search`)
                .send(searchParams)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(201);
            assert(res.body.success.data.length === 1);
        }

        @test async shouldSearchAllRestaurantsAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const searchParams = {name: 'karim\'s', address: 'chandni chowk'};
            await RestaurantFactory.generate(searchParams);
            const res = await Chai.request(server).post(`/api/v1/restaurant/search`)
                .send(searchParams)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(201);
        }

        @test async shouldNotGetAllRestaurantsWithoutAuth () {
            await RestaurantFactory.generate({});
            const searchParams = {name: 'karim\'s', address: 'chandni chowk'};
            const res = await Chai.request(server).post(`/api/v1/restaurant/search`)
                .send(searchParams);
            res.should.have.status(401);
        }
    }
});
