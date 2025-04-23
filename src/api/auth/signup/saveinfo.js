import verifyToken from "../../../utils/verifyToken.js";
import { Users } from "../../../config/db.js";

export default async function saveinfo(req, res) {
    try {
        const data = req.body;
        const otp_token = req.cookies.otp_token;

        if(!otp_token) return res.send(JSON.stringify({ error: "OTP token not found!" }));
        if(!data.username) return res.send(JSON.stringify({ error: "Invaild username!" }));
        if(!data.lastname) return res.send(JSON.stringify({error: "Invaild lastname!"}));

        let otp_data = await verifyToken(otp_token, process.env.JWT_OTP_SECRET);

        const username = data.username + ' ' + data.lastname;
        const usernameResult = await Users.update({ username: username }, { where: { email: otp_data.email }});

        if(usernameResult[0]) {
            res.clearCookie("otp_token");
            return res.send(JSON.stringify({ state: true, status: "Username saved successfully!" }));
        }

        return res.send(JSON.stringify({ error: "Something went wrong!"}));
    } catch (error) {
        console.log(`ERROR (/api/auth/signup/saveinfo): ${error}`);
        return res.send(JSON.stringify({ error: "Something went wrong!"}));
    }
}