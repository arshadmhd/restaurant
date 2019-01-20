import Config from "../../config/Config";
import User from "../../db/models/User";

class Notifier {

    static  notifyEmailConfirmation = async (user: User) => {
         const confirmationUrl = `${Config.BASE_URL}/api/v1/user/verify_email?email=${user.email}&emailToken=${user.emailAttributes.token}`;
         console.log(`Mocked Email Sending, Confirmation Link: ${confirmationUrl}`);
    };

    static notifyPasswordReset = async (user: User) =>{
        console.log(`Mocker Email. Password Reset token = ${user.passwordAttributes.token}`);
    }
}

export default Notifier;
