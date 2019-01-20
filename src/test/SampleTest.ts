process.env.NODE_ENV = 'test';
import {assert, expect} from "chai";
import {User} from "../db/models";
import Truncate from "./Truncate";
import {suite, test} from 'mocha-typescript';
// describe("Restaurant model", async () => {
//
//     beforeEach(async () =>{
//         await Truncate();
//     });
//
//     it("should do something", async () => {
//         console.log("Starting test");
//         await expect(12).to.equal(12);
//         console.log("Starting test");
//         const count: number = await User.count({where: {}});
//         assert.equal(count, 0, "Expected one to equal two.");
//     });
// });

@suite class SampleTest {


    @test async shouldPass () {
        await Truncate();
        const count: number = await User.count({where: {}});
        assert.equal(count, 0, "Expected one to equal two.");
    }
}
