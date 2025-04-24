export default async function info(req, res){
    try {
        let session = req.session;
        if(!session) return res.json({error: "You are not logged in!"});

        return res.json({state: true, status: "fetched!", userinfo: {
            id: session.userid,
            name: session.username,
            email: session.email,
            profileImage: null,
        }});
    } catch (error) {
        console.log(`ERROR (/api/user/info): ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}