"use client";
import "./Chats.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

function Chat({ title, path }) {
    if(title.length > 25){
        title = title.slice(0, 22);
        title = title + "...";
    }
    return (<>
        <Link href={path}>
            <div className="flex m-2 p-2 rounded-md hover:bg-slate-700" >{title}</div>
        </Link>
    </>);
}

export default function Chats() {

    const [chats, setChats] = useState(null);

    async function getChats() {
        const response = await fetch("/api/chat/get");
        const data = await response.json();
        setChats(data.chats);
    }

    useEffect(() => {
        getChats();
    }, []);

    return (<>
        <div id="id-chats" className="h-[100px] grow overflow-y-scroll">
            {
                chats ? 
                    chats.map((chat) => {
                        return <Chat key={chat.id} title={chat.title} path={`/chats/${chat.id}`} />
                    })
                :
                <div className="flex h-full justify-center items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                </div>
            }

        </div>
    </>);
}