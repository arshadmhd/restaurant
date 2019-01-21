import Config from "../../config/Config";
import User from "../../db/models/User";

class Notifier {

    static  notifyEmailConfirmation = async (user: User) => {
         const confirmationUrl = `${Config.BASE_URL}/api/v1/user/verify_email?email=${user.email}&emailToken=${user.emailAttributes.token}`;
         console.log(`\n\nMocked Email Sending------------------------------->\nConfirmation Link: ${confirmationUrl}\n\n`);
    };

    static notifyPasswordReset = async (user: User) =>{
        console.log(`\n\nMocker Email Sending--------------------------------->\nPassword Reset token = ${user.passwordAttributes.token}\n\n`);
    }
}

export default Notifier;
