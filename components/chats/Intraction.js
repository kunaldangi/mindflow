"use client";
import { useState, useEffect } from "react";

import IntractionInput from "@/components/home/IntractionInput";
import Messages from "@/components/chats/Messages";

export default function Intraction({chatId}){

    const [messages, setMessages] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    async function getUserDetails(){
        let response = await fetch('/api/user/info');
        let data = await response.json();
        setUserInfo(data.userinfo);
    }

    async function getMessages(){
        let res = await fetch('/api/chat/messages/get', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId
            })
        });

        let data = await res.json();

        if(data.error) return console.log(data.error);
        if(data.messages){
            setMessages(data.messages);
        }
    }

    useEffect(() => {
        getUserDetails();
        getMessages();
    }, []);

    return (<>
        <div className="h-screen flex flex-col">
            <div className="flex flex-col grow">
                <Messages chatId={chatId} userInfo={userInfo} messages={messages} />
            </div>

            <div className="mt-auto">
                <IntractionInput chatId={chatId} userInfo={userInfo} messages={messages} setMessages={setMessages} />
            </div>
        </div>
    </>);
}