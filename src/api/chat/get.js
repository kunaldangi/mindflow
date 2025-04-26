import { Chats } from "../../config/db.js";

export default async function getChats(req, res){
    try {
        const session = req.session;
        if (!session) return res.json({ error: "You are not logged in!" });

        let chatResult = await Chats.findAll({ where: { userId: session.userid }, order: [['createdAt', 'DESC']] });
        if (!chatResult || chatResult.length < 0) return res.json({ error: "Error while fetching chats!" });

        return res.json({state: true, status: "fetched!", chats: chatResult});
    } catch (error) {
        console.log(`ERROR (/api/chat/) getChats: ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}