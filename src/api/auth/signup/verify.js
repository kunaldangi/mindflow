// import { config } from 'dotenv'; config();
import bcrypt from "bcryptjs";

import verifyToken from "../../../utils/verifyToken.js";
import { Users, Otps } from "../../../config/db.js";

export default async function verify(req, res) {
    try {
        const data = req.body;
        const otp_token = req.cookies.otp_token;

        if(!otp_token) return res.send(JSON.stringify({ error: "OTP token not found!" }));
        if(!data.code) return res.send(JSON.stringify({ error: "Invaild OTP!" }));
        
        let otp_data = await verifyToken(otp_token, process.env.JWT_OTP_SECRET);
        if(!otp_data) return res.send(JSON.stringify({ error: "Invaild OTP!" }));
        
        let current_timestamp = Date.now() / 1000;
        if((otp_data.exp - current_timestamp) < 0) return res.send(JSON.stringify({ error: "OTP expired!" }));

        let otpResult = await Otps.destroy({ where: { email: otp_data.email, code: data.code }});

        if (!otpResult){ // means OTP is not valid
            return res.send(JSON.stringify({ error: "Invaild OTP!" }));
        }

        let saltPass = bcrypt.genSaltSync(10);
        let hashPass = bcrypt.hashSync(otp_data.password, saltPass);

        const user = await Users.create({ email: otp_data.email, password: hashPass });
        if (user.dataValues){
            return res.send(JSON.stringify({ state: true, status: "Account created successfully!" }));
        } 
        
        return res.send(JSON.stringify({ error: "Something went wrong!" }));
    } catch (error) {
        console.log(error);
        console.log(`ERROR (/api/auth/signup/verify): ${error}`);
        return res.send(JSON.stringify({ error: "Something went wrong!"}));
    }
}