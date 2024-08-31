"use client";
import {Member} from "@prisma/client";
import {IMassageWithMemberWithProfile, typeOptionChat, typeParamkey} from "@/type";
import {ChatWelcome} from "@/components/chat/chat-welcome";
import {userChatQuery} from "@/hooks/query/use-chat-query";
import {ServerCrash} from "lucide-react";
import {Fragment} from "react";
import {ChatItem} from "@/components/chat/chat-item";
import {format} from "date-fns";
import {DATE_FORMAT} from "@/app/utils/constants/constant";


interface IChatMessage{
    name:string;
    member:Member;
    chatId:string;
    apiUrl:string;
    socketUrl:string;
    socketQuery:Record<string, any>;
    paramKey:typeParamkey;
    paramValue:string;
    type:typeOptionChat
}
export const ChatMessages=({chatId,paramKey,paramValue,type,socketUrl,socketQuery
,name,member,apiUrl}:IChatMessage)=>{
    const queryKey=`chat:${chatId}`
    const query=userChatQuery({queryKey,paramKey,paramValue,apiUrl});
    if(query.status==='error'){
        return <div className={'flex flex-col flex-1 justify-center items-center'}>
            <ServerCrash className={'h-7 w-7 text-zinc-500 my-4'}/>
            <p className={'text-xs text-zinc-500 dark:text-zinc-400'}>
                Something went wrong!
            </p>
        </div>
    }

    return <div className={'flex-1 flex flex-col py-4 overflow-y-auto'}>
    <div className={"flex-1"}/>
        <ChatWelcome type={type} name={name}/>
        <div className={'flex flex-col-reverse mt-auto'}>
            {
                query?.data?.pages?.map((group,i)=>(
                    <Fragment key={i}>
                        {
                            group?.items?.map((message:IMassageWithMemberWithProfile)=>(
                                <ChatItem
                                    key={message.id}
                                    id={message.id}
                                    currentMember={member}
                                    member={message.member}
                                    content={message.content}
                                    fileUrl={message.fileUrl}
                                    deleted={message.delete}
                                    timestamp={format(new Date(message.createdAt),DATE_FORMAT)}
                                    isUpdated={message.updatedAt!==message.createdAt}
                                    socketQuery={socketQuery}
                                    socketUrl={socketUrl}

                                />
                            ))
                        }

                    </Fragment>
                ))

            }
        </div>
    </div>
}