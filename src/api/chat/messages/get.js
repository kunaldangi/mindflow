import { Messages } from "../../../config/db.js";

export default async function getMessages(req, res) {
    try {
        const session = req.session;
        if (!session) return res.json({ error: "You are not logged in!" });
        const data = req.query;

        if (!data.chatId) return res.json({ error: "Invalid chat id!" });

        let msgResult = await Messages.findAll({ where: { chatId: data.chatId }});
        if (!msgResult.length < 0) return res.json({ error: "Unable to fetch data!" });

        return res.json({ state: true, status: "fetched!", messages: msgResult });
    } catch (error) {
        console.log(`ERROR (/api/chat/messages/) getMessages: ${error}`);
        return res.status(500).json({ error: "Internal server error!" });
    }
}