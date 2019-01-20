import app from "./ExpressApp";

const test = async () => {

    app.listen(3000, async () => {
        console.log("Listening on port 3000");
    }); // run your express server
};

test().then();
