import Faker from 'faker';
import * as Lodash from 'lodash';
import sha256 from 'sha256';
import {User} from "../../db/models/index";

export default class UserFactory {
    static async generate ({email, name, role, status, gender, passwordAttributes, emailAttributes}: any): Promise<User>{
        const params = UserFactory.createObject({email, name, role, status, gender, passwordAttributes, emailAttributes});
        const user: User = new User(params);
        await user.save();
        return user;
    }

    static createObject ({email, name, role, status, gender, passwordAttributes, emailAttributes}: any): any{
        email = email || Faker.internet.email();
        name = name || Faker.name.findName();
        role = role || Lodash.sample(['ADMIN', 'USER', 'MANAGER']);
        gender = gender || Lodash.sample(['MALE', 'FEMALE', 'OTHER']);
        status = status || 'ACTIVE';
        passwordAttributes = passwordAttributes || {salt: 'salt', hash: sha256('pass1234'+ 'salt')};
        emailAttributes = emailAttributes || {verified: true};
        return {email, name, status, gender, passwordAttributes, emailAttributes, role};
    }
}
