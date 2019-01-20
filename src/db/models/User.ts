import {
    AllowNull,
    AutoIncrement, BeforeBulkCreate, BeforeCreate, BeforeSave, BeforeUpdate,
    Column,
    CreatedAt,
    DataType,
    Default,
    HasMany,
    Is,
    IsDate,
    IsEmail,
    Length,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from "sequelize-typescript";
import config from "../../config/Config";
import Restaurant from "./restaurant";
import Review from "./review";

export type roleType = "MANAGER" | "ADMIN" | "USER";

export type statusType = "ACTIVE" | "INACTIVE";

export type genderType = "MALE" | "FEMALE" | "OTHER";

export const ROLES = ["MANAGER", "ADMIN", "USER"];

export const STATUSES = ["ACTIVE", "INACTIVE"];

export const GENDERS = ["MALE", "FEMALE", "OTHER"];


@Table({tableName: "Users"})
class User extends Model<User> {

    @AutoIncrement
    @AllowNull(false)
    @PrimaryKey
    @Column
    id: number;

    @IsEmail
    @Column
    email: string;

    @Is("Status Validator", (value: string) => {
        if (!STATUSES.includes(value)) {
            throw new Error("The status must be " + STATUSES);
        }
    })
    @Default("ACTIVE")
    @Column(DataType.ENUM("ACTIVE", "INACTIVE"))
    status: statusType;

    @Is("Role Validator", (value: string) => {
        if (!ROLES.includes(value)) {
            throw new Error("The roles must be " + ROLES);
        }
    })
    @Default("USER")
    @Column(DataType.ENUM("MANAGER", "ADMIN", "USER"))
    role: roleType;

    @Length({min: 3, max: 50})
    @AllowNull(false)
    @Column
    name: string;

    @Is("Gender Validator", (value: string) => {
        if (!GENDERS.includes(value)) {
            throw new Error("Gender must be " + GENDERS);
        }
    })
    @Column(DataType.ENUM("MALE", "FEMALE", "OTHER"))
    gender: genderType;

    @Default({})
    @Column(DataType.JSON)
    emailAttributes: any;

    @Default({})
    @Column(DataType.JSON)
    passwordAttributes: any;

    @IsDate
    @CreatedAt
    @Column
    createdAt: Date;

    @IsDate
    @UpdatedAt
    @Column
    updatedAt: Date;

    @HasMany(() => Restaurant)
    restaurants: Restaurant[];

    @HasMany(() => Review)
    reviews: Review[];

    @BeforeBulkCreate
    @BeforeCreate
    @BeforeSave
    @BeforeUpdate
    static async makeEmailLowerCase (user: User) {
        user.email = user.email.toLowerCase();
        const u: User = await User.findOne({where: {email: user.email}});
        const count: number = await User.count({where: {email: user.email}});
        if (user.id) {
            if (u && ((u.id !== user.id) || count > 1)) {
                throw new Error(config.MESSAGES.EMAIL_ALREADY_EXISTS);
            }
        } else {
            if (u) {
                throw new Error(config.MESSAGES.EMAIL_ALREADY_EXISTS);
            }
        }

    }

}

// sequelize.addModels([User]);
export default User;
