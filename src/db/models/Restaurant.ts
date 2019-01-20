import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column, CreatedAt,
    ForeignKey,
    HasMany, IsDate,
    Length,
    Max,
    Min,
    Model,
    PrimaryKey,
    Scopes,
    Table, UpdatedAt,
} from "sequelize-typescript";
import Review from "./review";
import User from "./user";

// export interface RestaurantAttributes {
//     name ? : string;
//     address ? : string;
//     rating ? : number
//     city ? : string;
//
// }
//
// export interface RestaurantInstance {
//     id: number;
//     createdAt: Date;
//     updatedAt: Date;
//
//     name: string;
//     address: string;
//     rating: number
//     city: string;
//
// }

// @Scopes({
//     reviews: {
//         include: [{
//             model: () => Review,
//             through: {attributes: []},
//         }],
//     },
//     user: {
//         include: [{
//             model: () => User,
//             through: {attributes: []},
//         }],
//     },
// })

@Table({tableName: "Restaurants"})
export default class Restaurant extends Model<Restaurant> {

    @AutoIncrement @AllowNull(false) @PrimaryKey @Column
    id: number;

    @Length({min: 3, max: 50}) @Column
    name: string;

    @Length({min: 3, max: 50}) @Column
    address: string;

    @Min(1) @Max(5) @Column
    rating: number;

    @IsDate @CreatedAt @Column
    createdAt: Date;

    @IsDate @UpdatedAt @Column
    updatedAt: Date;

    @ForeignKey(() => User) @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Review)
    reviews: Review[];
}

// sequelize.addModels([Restaurant]);


