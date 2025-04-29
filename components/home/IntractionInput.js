"use client";
import "./IntractionInput.css";
import { useEffect, useState, useRef } from "react";

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

let isFirstMsgSent = false; // used because nextjs renders the component twice in dev mode

export default function IntractionInput({ chatId, messages, setMessages }) {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (messages?.length == 1 && messages[0]?.authorType == "user") {
            if (isFirstMsgSent) return;
            isFirstMsgSent = true;
            console.log("Messages: ", messages);
            console.log("First message from user: ", messages[0]?.content);
            sendFirstMessage(messages[0]?.content);
        }
    }, [messages]);

    const lastMessageRef = useRef(null);

    async function sendFirstMessage() {
        if (messages?.length == 1 && messages[0]?.authorType == "user") {
            setLoading(true);

            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ chatId, model: "meta-llama/llama-4-scout:free", message: messages[0]?.content, isFirstMsg: true })
            });

            if (response.ok) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
    
                const message = {
                    id: Date.now(),
                    chatId: chatId,
                    authorType: "ai",
                    authorId: 2,
                    reasoning: "",
                    content: "",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
    
                setMessages(prev => {
                    const updated = [...prev, message];
                    lastMessageRef.current = message; // store reference
                    return updated;
                });
    
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n\n'); // Split at double newline
    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonString = line.slice(6); // Remove 'data: '
                            const aiMessage = JSON.parse(jsonString);
    
                            if (lastMessageRef.current) {
                                aiMessage.reasoning ? lastMessageRef.current.reasoning += aiMessage.reasoning : null;
                                aiMessage.content ? lastMessageRef.current.content += aiMessage.content : null;
                                lastMessageRef.current.updatedAt = new Date().toISOString();
                            }
    
                            setMessages(prev => {
                                const updated = [...prev];
                                updated[updated.length - 1] = { ...lastMessageRef.current };
                                return updated;
                            });
                        }
                    }
                }
            }

            setLoading(false);
            setInput("");
        }
    }

    async function sendMessage(e) {
        setLoading(true);

        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ chatId, model: "meta-llama/llama-4-scout:free", message: input, isFirstMsg: false })
        });

        if (response.ok) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const userMessage = {
                id: Date.now(),
                chatId: chatId,
                authorType: "user",
                authorId: 1,
                reasoning: "",
                content: input,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            setMessages([...messages, userMessage]);

            const message = {
                id: Date.now(),
                chatId: chatId,
                authorType: "ai",
                authorId: 2,
                reasoning: "",
                content: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setMessages(prev => {
                const updated = [...prev, message];
                lastMessageRef.current = message; // store reference
                return updated;
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n'); // Split at double newline

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonString = line.slice(6); // Remove 'data: '
                        const aiMessage = JSON.parse(jsonString);

                        if (lastMessageRef.current) {
                            aiMessage.reasoning ? lastMessageRef.current.reasoning += aiMessage.reasoning : null;
                            aiMessage.content ? lastMessageRef.current.content += aiMessage.content : null;
                            lastMessageRef.current.updatedAt = new Date().toISOString();
                        }

                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1] = { ...lastMessageRef.current };
                            return updated;
                        });
                    }
                }
            }
        }

        setLoading(false);
        setInput("");
    }

    let holdKey = null;
    function onKeyPress(e) {
        if (holdKey != "Shift" && e.key == "Enter" && !loading) { sendMessage(e); }
        if (!holdKey) holdKey = e.key;
    }
    function onKeyRelease(e) {
        if (holdKey == e.key) holdKey = null;
    }

    return (
        <div>
            <div className="flex flex-row items-start p-4 space-x-4">
                <Textarea id="id-inp-intraction" value={input} onKeyDown={onKeyPress} onKeyUp={onKeyRelease} onChange={(e) => setInput(e.target.value)} className="h-[25px] max-h-[100px] px-5 py-4 text-[16px] font-[425] bg-transparent border-gray-400 rounded-[23px] text-white resize-none" placeholder="Message mindflow..." disabled={loading} />
                <Button onClick={sendMessage} className="self-center" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}