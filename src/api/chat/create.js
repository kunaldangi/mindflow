import { Chats, Messages } from "../../config/db.js";

export default async function create(req, res) {
    try {
        const session = req.session;
        const data = req.body;

        if (!session) return res.json({ error: "You are not logged in!" });
        if (!data.message) return res.json({ error: "Invalid message!" });

        
        let title = data.message;
        title = title.length > 16 ? title.slice(0, 16) + "..." : title; // WE MAY USE LLM TO GENERATE A TITLE FOR THE CHAT!

        let chat = await Chats.create({ userId: session.userid, title: title });
        if (!chat.dataValues) return res.json({ error: "Error while creating chat!" });
        chat = chat.dataValues;

        let message = await Messages.create({chatId: chat.id, authorType: "user", authorId: chat.userId, content: data.message});
        if (!message.dataValues) return res.json({ error: "Error while creating message!" });
        message = message.dataValues;

        return res.json({ state: true, status: "Created!", userID: chat.userId, chat_id: chat.id, chat_title: chat.title, message: message});
    } catch (error) {
        console.log(`ERROR (/api/chat/create): ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}