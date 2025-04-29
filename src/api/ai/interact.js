import { config } from 'dotenv'; config();
import OpenAI from 'openai';

import { Messages } from "../../config/db.js";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY, // THIS is enough
    defaultHeaders: {
        "HTTP-Referer": "https://mindflow.kunaldangi.me", // Optional
        "X-Title": "MindFlow", // Optional
    },
});

export default async function interact(req, res) {
    try {
        let session = req.session;
        if (!session) return res.json({ error: "You are not logged in!" });

        let data = req.body;
        if (!data.chatId || !data.model || !data.message) return res.json({ error: "Missing data!" });

        if(!data.isFirstMsg) {
            let userMsgResult = await Messages.create({
                chatId: data.chatId,
                authorType: "user",
                authorId: session.userid,
                content: data.message,
            });
            if (!userMsgResult.dataValues) return res.json({ error: "Failed to create user message!" });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await openai.chat.completions.create({
            model: 'microsoft/mai-ds-r1:free',
            messages: [
                { role: "user", content: data?.message },
            ],
            stream: true,
        });

        let aiMessage = {
            reasoning: "",
            content: "",
        }

        for await (const chunk of stream) {
            let reasoning = chunk.choices[0]?.delta?.reasoning;
            if (reasoning) {
                res.write(`data: ${JSON.stringify({ reasoning: escapeString(reasoning) })}\n\n`);
                aiMessage.reasoning += reasoning;
                continue;
            }
            let content = chunk.choices[0]?.delta?.content;
            if (content) {
                res.write(`data: ${JSON.stringify({ content: escapeString(content) })}\n\n`);
                aiMessage.content += content;
                continue;
            }
        }

        req.on('close', async () => {

            let msgResult = await Messages.create({
                chatId: data.chatId,
                authorType: "ai",
                authorId: session.userid,
                reasoning: aiMessage.reasoning,
                content: aiMessage.content,
            });

            if(!msgResult.dataValues) console.log("Failed to save AI message in db!");

            res.end();
        });

        let msgResult = await Messages.create({
            chatId: data.chatId,
            authorType: "ai",
            authorId: session.userid,
            reasoning: aiMessage.reasoning,
            content: aiMessage.content,
        });

        if(!msgResult.dataValues) console.log("Failed to save AI message in db!");
        res.end();
    } catch (error) {
        console.log(error);
        console.log(`ERROR (POST:/api/ai/) interact: ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}

function escapeString(str) {
    return str.replace(/["'\\]/g, match => '\\' + match);
}
