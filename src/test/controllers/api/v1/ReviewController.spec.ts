import Chai, {assert} from "chai";
import ChaiHTTP from "chai-http";
import {suite, test} from "mocha-typescript";
import {Restaurant, Review, User} from "../../../../db/models";
import RestaurantFactory from "../../../factories/RestaurantFactory";
import ReviewFactory from "../../../factories/ReviewFactory";
import Truncate from "../../../Truncate";
import UserFactory from "../../../factories/UserFactory";
import server from '../../../../ExpressApp';
import GenUtil from "../../../../app/helpers/GenUtil";
import {where} from "sequelize";


Chai.use(ChaiHTTP);
Chai.should();

describe("User Controller Tests", async () => {
    beforeEach(async () => await Truncate());

    @suite class RestaurantRating{
        @test async shouldUpdateReview () {
            const restaurant = await RestaurantFactory.generate({rating: 1});
            await ReviewFactory.generate({rating: 5, restaurant});
            await ReviewFactory.generate({rating: 3, restaurant});
            const r = await Restaurant.findOne({where:{id: restaurant.id}});
            assert.equal(r.rating, 4, "Expected rating to be 4");
        }

    }

    @suite class CreateReviews {
        @test async shouldCreateReviewsAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = ReviewFactory.createObject({user, restaurant});
            const res = await Chai.request(server).post(`/api/v1/review/${restaurant.id}`)
                .send(review)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(201);
        }

        @test async shouldNotCreateReviewsAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = ReviewFactory.createObject({user, restaurant});
            const res = await Chai.request(server).post(`/api/v1/review/${restaurant.id}`)
                .send(review)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(400);
        }

        @test async shouldCreateReviewsAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = ReviewFactory.createObject({user, restaurant});
            const res = await Chai.request(server).post(`/api/v1/review/${restaurant.id}`)
                .send(review)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(201);
        }

        @test async shouldNotCreateReviewsWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = ReviewFactory.createObject({user, restaurant});
            const res = await Chai.request(server).post(`/api/v1/review/${restaurant.id}`)
                .send(review);

            res.should.have.status(401);
        }
    }

    @suite class GetAllReviews {
        @test async shouldGetAllReviewsAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldGetAllReviewsAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldGetOwnReviewsAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({user});
            await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldNotGetAllReviewsAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
            assert(res.body.success.data.length === 1);
        }

        @test async shouldNotGetAllReviewsWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}`);

            res.should.have.status(401);
        }
    }

    @suite class GetReviewById {
        @test async shouldGetReviewAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}/${review.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldNotGetReviewAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}/${review.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(400);
        }

        @test async shouldGetReviewAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}/${review.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldNotGetReviewWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).get(`/api/v1/review/${restaurant.id}/${review.id}`);

            res.should.have.status(401);
        }
    }

    @suite class UpdateReviewById {
        @test async shouldUpdateReviewAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {rating: 2, comment: 'something'};
            const res = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldNotUpdateReviewAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {rating: 2, comment: 'something'};
            const res = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(400);
        }

        @test async shouldUpdateReviewAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {rating: 2, comment: 'something'};
            const res = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldNotUpdateReviewWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {rating: 2, comment: 'something'};
            const res = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams);

            res.should.have.status(401);
        }
    }

    @suite class DeleteReviewById {
        @test async shouldDeleteAnyReviewAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const userParams2 = await UserFactory.createObject({role: "USER"});
            const user2 = await UserFactory.generate(userParams2);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const review2 = await ReviewFactory.generate({user2, restaurant});
            const res1 = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            const res2 = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review2.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res1.should.have.status(200);
            res2.should.have.status(200);

        }

        @test async shouldDeleteOwnReviewAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const userParams2 = await UserFactory.createObject({role: "USER"});
            const user2 = await UserFactory.generate(userParams2);
            const restaurant2 = await RestaurantFactory.generate({});
            const review2 = await ReviewFactory.generate({user2, restaurant2});
            const res1 = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}`)
                .set('access_token', GenUtil.getJWTToken(user));
            const res2 = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review2.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res1.should.have.status(200);
            res2.should.have.status(400);
        }

        @test async shouldUpdateReviewAsUser () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(400);
        }

        @test async shouldNotUpdateReviewWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {rating: 2, comment: 'something'};
            const res = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams);

            res.should.have.status(401);
        }
    }

    @suite class PostAReply {
        @test async shouldPostAReplyAsAdmin () {
                const userParams = await UserFactory.createObject({role: "ADMIN"});
                const user = await UserFactory.generate(userParams);
                const restaurant = await RestaurantFactory.generate({});
                const review = await ReviewFactory.generate({user, restaurant});
                const reviewParams = {reply: 'hey'};
                const res = await Chai.request(server).post(`/api/v1/review/${restaurant.id}/${review.id}`)
                    .send(reviewParams)
                    .set('access_token', GenUtil.getJWTToken(user));

                res.should.have.status(201);
        }

        @test async shouldNotPostAReplyAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {reply: 'hey'};
            const res = await Chai.request(server).post(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(400);
        }

        @test async shouldPostAReplyToOwnRestaurantReviewAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({user});
            const review = await ReviewFactory.generate({user, restaurant});
            const userParams2 = await UserFactory.createObject({role: "MANAGER"});
            const user2 = await UserFactory.generate(userParams2);
            const restaurant2 = await RestaurantFactory.generate({user2});
            const review2 = await ReviewFactory.generate({user2, restaurant2});
            const reviewParams = {reply: 'hey'};
            const res1 = await Chai.request(server).post(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));
            const res2 = await Chai.request(server).post(`/api/v1/review/${restaurant.id}/${review2.id}`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res1.should.have.status(201);
            res2.should.have.status(400);
        }

        @test async shouldNotPostAReplyWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {reply: 'hey'};
            const res = await Chai.request(server).post(`/api/v1/review/${restaurant.id}/${review.id}`)
                .send(reviewParams);

            res.should.have.status(401);
        }
    }

    @suite class UpdateAReply {
        @test async shouldPostAReplyAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {reply: 'hey'};
            const res = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}/reply`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(201);
        }

        @test async shouldNotPostAReplyAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {reply: 'hey'};
            const res = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}/reply`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(400);
        }

        @test async shouldPostAReplyToOwnRestaurantReviewAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({user});
            const review = await ReviewFactory.generate({user, restaurant});
            const userParams2 = await UserFactory.createObject({role: "MANAGER"});
            const user2 = await UserFactory.generate(userParams2);
            const restaurant2 = await RestaurantFactory.generate({user2});
            const review2 = await ReviewFactory.generate({user2, restaurant2});
            const reviewParams = {reply: 'hey'};
            const res1 = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}/reply`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));
            const res2 = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review2.id}/reply`)
                .send(reviewParams)
                .set('access_token', GenUtil.getJWTToken(user));

            res1.should.have.status(201);
            res2.should.have.status(400);
        }

        @test async shouldNotPostAReplyWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const reviewParams = {reply: 'hey'};
            const res = await Chai.request(server).put(`/api/v1/review/${restaurant.id}/${review.id}/reply`)
                .send(reviewParams);

            res.should.have.status(401);
        }
    }

    @suite class DeleteAReply {
        @test async shouldPostAReplyAsAdmin () {
            const userParams = await UserFactory.createObject({role: "ADMIN"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}/reply`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(200);
        }

        @test async shouldNotPostAReplyAsUser () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}/reply`)
                .set('access_token', GenUtil.getJWTToken(user));

            res.should.have.status(400);
        }

        @test async shouldPostAReplyToOwnRestaurantReviewAsManager () {
            const userParams = await UserFactory.createObject({role: "MANAGER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({user});
            const review = await ReviewFactory.generate({user, restaurant});
            const userParams2 = await UserFactory.createObject({role: "MANAGER"});
            const user2 = await UserFactory.generate(userParams2);
            const restaurant2 = await RestaurantFactory.generate({user2});
            const review2 = await ReviewFactory.generate({user2, restaurant2});
            const res1 = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}/reply`)
                .set('access_token', GenUtil.getJWTToken(user));
            const res2 = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review2.id}/reply`)
                .set('access_token', GenUtil.getJWTToken(user));

            res1.should.have.status(200);
            res2.should.have.status(400);
        }

        @test async shouldNotPostAReplyWithoutAuth () {
            const userParams = await UserFactory.createObject({role: "USER"});
            const user = await UserFactory.generate(userParams);
            const restaurant = await RestaurantFactory.generate({});
            const review = await ReviewFactory.generate({user, restaurant});
            const res = await Chai.request(server).delete(`/api/v1/review/${restaurant.id}/${review.id}/reply`);

            res.should.have.status(401);
        }

        @test async shouldGetAllUnrepliedReviews (){
            const user: User = await UserFactory.generate({emailAttributes: {verified: true}, role:"MANAGER"});
            const restaurant: Restaurant = await RestaurantFactory.generate({user});
            const r1: Review = await ReviewFactory.generate({user, restaurant, reply:null});
            const r2: Review = await ReviewFactory.generate({user, restaurant, reply: ""});
            await ReviewFactory.generate({user, restaurant, reply: "hello"});
            await Review.update({reply:null}, {where:{id: r1.id}});
            await Review.update({reply:""}, {where:{id: r2.id}});
            const res = await Chai.request(server).get(`/api/v1/review/unreplied`)
                .set('access_token', GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }
    }

});
