"use client";
import "./IntractionInput.css";
import {  useState } from "react";

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

export default function CreateChatInput() {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState(""); // input message to be sent to the server

    async function createNewChat() {
        setLoading(true);

        let response = await fetch('/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ message: input })
        });

        let data = await response.json();

        if (data.error) {
            setLoading(false);
            console.log(data.error);
        }

        if (data.state) {
            setLoading(false);
            window.location.href = `/chats/${data.chat_id}`; // nextjs router not work here cuz need a hard reload
        }
    }

    let holdKey = null;
    function onKeyPress(e) {
        if (holdKey != "Shift" && e.key == "Enter" && !loading) { createNewChat(e); }
        if (!holdKey) holdKey = e.key;
    }
    function onKeyRelease(e) {
        if (holdKey == e.key) holdKey = null;
    }

    return (
        <div>
            <div className="flex flex-row items-start p-4 space-x-4">
                <Textarea id="id-inp-intraction" value={input} onKeyDown={onKeyPress} onKeyUp={onKeyRelease} onChange={(e) => setInput(e.target.value)} className="h-[25px] max-h-[100px] px-5 py-4 text-[16px] font-[425] bg-transparent border-gray-400 rounded-[23px] text-white resize-none" placeholder="Message mindflow..." disabled={loading} />
                <Button onClick={createNewChat} className="self-center" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}