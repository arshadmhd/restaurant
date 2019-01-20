import {Restaurant, Review, User} from "../db/models";

const Truncate = async () => {
    await Review.destroy({where:{}});
    await Restaurant.destroy({where:{}});
    await User.destroy({where:{}});
};

export default Truncate;
