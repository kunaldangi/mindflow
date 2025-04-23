import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import sequelize, { Users } from "../../config/db.js";

export default async function login(req, res) {
    try {
        const data = req.body;
        console.log(data);

        if(!data.email || !data.password) return res.send(JSON.stringify({ error: "Please provide email and password!" }));
        
        let userResult = await Users.findOne({ where: { email: data.email }});

        if (!userResult?.dataValues) return res.send(JSON.stringify({error: "Invalid email!"}));

        let user = userResult.dataValues;
        let passwordHash = user.password; // Direct `users[0].password` pass to compareSync won't work
        let isValidPassword = bcrypt.compareSync(data.password, passwordHash);

        if(!isValidPassword) return res.send(JSON.stringify({error: "Invalid password!"}));
        
        let session_payload = {
            userid: user.id,
            username: user.username,
            email: user.email
        };

        const session_token = jwt.sign(session_payload, process.env.JWT_SESSION_SECRET, { expiresIn: '7d' }); // Session valid for 7 days        
        const period = 7 * 24 * 60 * 60 * 1000;
        res.cookie('session', session_token, { maxAge: period });

        res.send(JSON.stringify({ success: "Logged In!" }));
    } catch (error) {
        console.log(`ERROR (/api/auth/login): ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}