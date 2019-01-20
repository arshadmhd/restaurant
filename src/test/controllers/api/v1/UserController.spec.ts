import Chai, {assert} from "chai";
import ChaiHTTP from "chai-http";
import Lodash from 'lodash';
import {suite, test} from "mocha-typescript";
import {User} from "../../../../db/models";
import server from "../../../../ExpressApp";
import GenUtil from "../../../../app/helpers/GenUtil";
import UserFactory from "../../../factories/UserFactory";
import Truncate from "../../../Truncate";

Chai.use(ChaiHTTP);
Chai.should();

describe("User Controller Tests", async () => {
    beforeEach(async () => await Truncate());

    @suite
    class Signup {
        @test
        async shouldCreateUserWithNonVerifiedEmail () {
            const userParams = UserFactory.createObject({});
            const res = await Chai.request(server)
                .post("/api/v1/user/signup")
                .send(userParams);
            const user: User = await User.findOne({where: {email: userParams.email.toLowerCase()}});
            res.should.have.status(201);
            assert(user.emailAttributes.verified !== true);
        }

        @test
        async shouldNoteCreateDuplicateEmails () {
            const usersParams = UserFactory.createObject({});
            await UserFactory.generate(usersParams);
            const res = await Chai.request(server)
                .post("/api/v1/user/signup")
                .send(usersParams);
            res.should.have.status(400);
        }
    }

    @suite
    class Login {
        @test
        async shouldNotLoginInvalidUser () {
            const userParams = UserFactory.createObject({});
            assert(await User.count({where: {}}) === 0);
            const res = await Chai.request(server)
                .post("/api/v1/user/login")
                .send(userParams);
            res.should.have.status(400);
        }

        @test
        async shouldNotLoginUnverifiedEmail () {
            const userParams = UserFactory.createObject({});
            let res = await Chai.request(server)
                .post("/api/v1/user/signup")
                .send({...userParams, password: 'pass1234'});
            res.should.have.status(201);
            res = await Chai.request(server)
                .post("/api/v1/user/login")
                .send({...userParams, password: 'pass1234'});
            res.should.have.status(400);
            const user = await User.findOne({where: {email: userParams.email.toLowerCase()}});
            user.emailAttributes = Object.assign({}, user.emailAttributes, {verified: true});
            await user.save();
            res = await Chai.request(server)
                .post("/api/v1/user/login")
                .send({...userParams, password: 'pass1234'});
            res.should.have.status(200);
        }
    }

    @suite
    class UserList{
        @test async shouldFetchAllUsers (){
            const user = await UserFactory.generate({emailAttributes: {verified: true}, role: "ADMIN"});
            await UserFactory.generate({});
            await UserFactory.generate({});
            await UserFactory.generate({});
            await UserFactory.generate({});
            const res = await Chai.request(server).get("/api/v1/user/").set("access_token", GenUtil.getJWTToken(user));
            res.should.have.status(200);
            assert(res.body.success.data.length === 5);
        }

        @test async shouldFailAuthorization (){
            const user = await UserFactory.generate({emailAttributes: {verified: true}, role: "MANAGER"});
            const res = await Chai.request(server).get("/api/v1/user/").set("access_token", GenUtil.getJWTToken(user));
            res.should.have.status(400);
        }

        @test async unauthorizedAccess (){
            const user = await UserFactory.generate({emailAttributes: {verified: true}, role: "MANAGER"});
            const res = await Chai.request(server).get("/api/v1/user/");
            res.should.have.status(401);
        }
    }

    @suite
    class UserUpdate{
        @test async shouldUpdateUserSuccess (){
            const user = await UserFactory.generate({emailAttributes: {verified: true}, role: "ADMIN"});
            const user2Params = UserFactory.createObject({});
            const user2 = await UserFactory.generate(user2Params);
            const res = await Chai.request(server).put(`/api/v1/user/${user2.id}`).set("access_token", GenUtil.getJWTToken(user))
                .send({...user2Params, name: 'newname'});
            res.should.have.status(200);
            const newUser = await User.findOne({where: {id: user2.id}});
            assert(newUser.name === "newname");
        }

        @test async shouldNotUpdateEmailToDuplicateSuccess (){
            const user = await UserFactory.generate({emailAttributes: {verified: true}, role: "ADMIN"});
            const user2Params = UserFactory.createObject({});
            const user2 = await UserFactory.generate(user2Params);
            const user3 = await UserFactory.generate({});
            const res = await Chai.request(server).put(`/api/v1/user/${user2.id}`).set("access_token", GenUtil.getJWTToken(user))
                .send({...user2Params, name: 'newname', email: user3.email});
            res.should.have.status(400);
        }
    }

    @suite class GetUser{
        @test async getOtherUser () {
            const user = await UserFactory.generate({emailAttributes: {verified: true}, role: "ADMIN"});
            const user2 = await UserFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/user/${user2.id}`).set("access_token", GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }

        @test async getSelfDetails (){
            const user = await UserFactory.generate({emailAttributes: {verified: true}, role: "ADMIN"});
            const user2 = await UserFactory.generate({});
            const res = await Chai.request(server).get(`/api/v1/user/details`).set("access_token", GenUtil.getJWTToken(user));
            res.should.have.status(200);
        }
    }
});
