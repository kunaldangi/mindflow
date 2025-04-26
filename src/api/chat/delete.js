import { Chats } from "../../config/db.js";

export default async function deleteChat(req, res) {
    try {
        const session = req.session;
        if (!session) return res.json({ error: "You are not logged in!" });

        const data = req.body;
        console.log("data: ", data);
        if (!data.chatId) return res.json({ error: "Invalid chat id!" });

        let deleteResult = await Chats.destroy({ where: { id: data.chatId, userId: session.userid, }});
        if (!deleteResult) return res.json({ error: "Error while deleting chat!" });

        return res.json({ state: true, status: "Deleted!" });
    } catch (error) {
        console.log(`ERROR (/api/chat/) deleteChat: ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}