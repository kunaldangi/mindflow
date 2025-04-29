import verifyToken from "../utils/verifyToken.js";

let secured_routes = [
    "/api/user",
    "/api/chat",
    "/api/ai",
];

export default async function checkSession(req, res, next){
    for(let i = 0; i < secured_routes.length; i++){
        let route = secured_routes[i];

        if(req.path.startsWith(route)){
            let session_token = req.cookies.session;
            if(!session_token) return res.send(JSON.stringify({ error: "Invalid Session Token!" }));
            
            let session_data = await verifyToken(session_token, process.env.JWT_SESSION_SECRET);
            if(!session_data) return res.send(JSON.stringify({ error: "Invalid Session!" }));
            req.session = session_data;
        }
    }
    next();
}

export { secured_routes };