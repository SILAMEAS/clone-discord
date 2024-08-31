"use client";
import {Member} from "@prisma/client";
import {typeOptionChat} from "@/type";
import {ChatWelcome} from "@/components/chat/chat-welcome";

interface IChatMessage{
    name:string;
    member:Member;
    chatId:string;
    apiUrl:string;
    socketUrl:string;
    socketQuery:Record<string, any>;
    paramKey:'channelId'|'conversationId';
    paramValue:string;
    type:typeOptionChat
}
export const ChatMessages=({chatId,paramKey,paramValue,type,socketUrl,socketQuery
,name,member,apiUrl}:IChatMessage)=>{

    return <div className={'flex-1 flex flex-col py-4 overflow-y-auto'}>
    <div className={"flex-1"}/>
        <ChatWelcome type={type} name={name}/>
    </div>
}