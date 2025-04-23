import jwt from "jsonwebtoken";

import { Users, Otps } from "../../../config/db.js";
import { send_mail } from "../../../config/email.js";

export default async function signup(req, res) {
    try {
        let data = req.body;

        const check = await checkUserSendedData(data);
        if(!check.state) return res.send(JSON.stringify({ error: check.status }));
        
        let otp_code = generate_otp_code();
        let otp_payload = {
            type: 1, // 1 - signup, 2 - forgot password
            email: data.email,
            password: data.password
        };
        
        if(await Otps.destroy({ where: { email: data.email }})) console.log("[/api/auth/signup] OTP deleted successfully!");

        let otpResult = await Otps.create({
            type: otp_payload.type,
            email: data.email,
            code: otp_code
        });

        if(!otpResult.dataValues) return res.send(JSON.stringify({ error: "Something went wrong!" }));

        let mail_option = {
            from: process.env.GMAIL_ID,
            to: data.email,
            subject: "Verfication code",
            text: `Your one time password for registering your account is ${otp_code}. This code will expire in 1 hour.`
        };
        let email_status = await send_mail(mail_option);

        
        if(email_status.accepted == data.email){
            const otp_token = jwt.sign(otp_payload, process.env.JWT_OTP_SECRET, { expiresIn: '1h' });
            
            const oneHour = 60 * 60 * 1000;
            res.cookie('otp_token', otp_token, { maxAge: oneHour });
            return res.send(JSON.stringify({state: true, status: "OTP sent to your email"}));
        }

        return res.send(JSON.stringify({ error: "Something went wrong!" }));
    } catch (error) {
        console.log(`ERROR (/api/auth/signup): ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}

async function checkUserSendedData(data) {
    let check = {
        state: false,
        status: "Something went wrong!"
    };

    try {
        if (data.password.length < 8) {
            check.state = false;
            check.status = "Invalid password length";
        }
        else {
            let users = await Users.findAll({ where: { email: data.email } });

            if (users.length > 0){
                check.state = false;
                check.status = "Email already registered!";
                return check;
            }

            check.state = true;
            check.status = "Success";
        }
        return check;
    } catch (error) {
        check.state = false;
        check.status = "Bad request";
        console.log(`ERROR (/api/auth/signup): ${error}`);
        return check;
    }
}

function generate_otp_code() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}