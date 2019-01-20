import {Res} from "routing-controllers";
import {
    AfterCreate, AfterSave, AfterUpdate,
    AllowNull, AutoIncrement, BeforeCreate, BeforeSave, BeforeUpdate,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey,
    IsDate,
    Model,
    PrimaryKey,
    Table, UpdatedAt,
} from "sequelize-typescript";
import Restaurant from "./restaurant";
import User from "./user";
import Lodash from 'lodash';
// export interface ReviewAttributes {
//     rating ? : number
//     comment ? : string;
//     dateOfVisit ? : Date;
//
// }
//
// export interface ReviewInstance {
//     id: number;
//     createdAt: Date;
//     updatedAt: Date;
//
//     rating: number
//     comment: string;
//     dateOfVisit: Date;
//
// }
//
// @Scopes({
//     restaurant: {
//         include: [{
//             model: () => Restaurant,
//             through: {attributes: []},
//         }],
//     },
//     users: {
//         include: [{
//             model: () => User,
//             through: {attributes: []},
//         }],
//     },
// })
@Table({tableName: "Reviews"})
class Review extends Model<Review> {

    @AllowNull(false) @AutoIncrement @PrimaryKey @Column
    id: number;

    @Column
    comment: string;

    @Column
    rating: number;

    @Column
    dateOfVisit: Date;

    @IsDate @CreatedAt @Column
    createdAt: Date;

    @IsDate @UpdatedAt @Column
    updatedAt: Date;

    @AllowNull(true) @Column
    reply: string;

    @ForeignKey(() => Restaurant) @Column
    restaurantId: number;

    @ForeignKey(() => User) @Column
    userId: number;

    @BelongsTo(() => Restaurant)
    restaurant: Restaurant;

    @BelongsTo(() => User)
    user: User;

    @AfterCreate @AfterUpdate @AfterSave
    static async updateOverallRating (review: Review) {
        if(review.restaurantId){
            const restaurant: Restaurant = await Restaurant.findOne({where: {id: review.restaurantId}});
            const reviews: Review[] = await Review.findAll({where:{restaurantId: review.restaurantId}});
            const totalRating = Lodash.sumBy(reviews, (review) => review.rating);
            let r: number = reviews.length > 0 ? totalRating / reviews.length : 1;
            r = Number(Number(r).toFixed(2));
            restaurant.rating = r;
            await restaurant.save();
        }
    }
}

// sequelize.addModels([Review]);
export default Review;
// export = (sequelize: Sequelize, DataTypes: DataTypes) => {
//     var Review = sequelize.define('Review', {
//         rating: DataTypes.NUMBER,
//         comment: DataTypes.STRING,
//         dateOfVisit: DataTypes.DATE
//     });
//
//     Review.associate = function(models) {
//         // associations can be defined here
//     };
//
//     return Review;
// };
