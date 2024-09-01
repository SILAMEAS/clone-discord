"use client";
import {Member} from "@prisma/client";
import {IMassageWithMemberWithProfile, typeOptionChat, typeParamkey} from "@/type";
import {ChatWelcome} from "@/components/chat/chat-welcome";
import {userChatQuery} from "@/hooks/query/use-chat-query";
import {ServerCrash} from "lucide-react";
import {ElementRef, Fragment, useRef} from "react";
import {ChatItem} from "@/components/chat/chat-item";
import {format} from "date-fns";
import {DATE_FORMAT} from "@/app/utils/constants/constant";
import {useChatSocket} from "@/hooks/query/use-chat-socket";
import {useSocket} from "@/components/providers/socket-provider";
import {useChatScroll} from "@/hooks/query/user-chat-scroll";


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
    const [queryKey,addKey,updateKey]=[`chat:${chatId}`,`chat:${chatId}:messages`,`chat:${chatId}:messages:update`];
    const {isConnected}=useSocket();
    const query=userChatQuery({queryKey,paramKey,paramValue,apiUrl,isConnected});
    const chatRef=useRef<ElementRef<'div'>>(null);
    const bottomRef=useRef<ElementRef<'div'>>(null);
    useChatSocket({queryKey,updateKey,addKey});
    useChatScroll({
        count:query.data?.pages?.[0]?.items?.length??0,
        chatRef,
        bottomRef,
        loadMore:query.fetchNextPage,
        shouldLoadMore:!query.isFetchingNextPage&&!!query.hasNextPage
    });
    if(query.status==='error'){
        return <div className={'flex flex-col flex-1 justify-center items-center'}>
            <ServerCrash className={'h-7 w-7 text-zinc-500 my-4'}/>
            <p className={'text-xs text-zinc-500 dark:text-zinc-400'}>
                Something went wrong!
            </p>
        </div>
    }
    return <div className={'flex-1 flex flex-col py-4 overflow-y-auto'} ref={chatRef}>
        {
            !query.hasNextPage && <div className={"flex-1"}/>
        }
        {
            !query.hasNextPage &&  <ChatWelcome type={type} name={name}/>
        }
        {
            query.hasNextPage&&(
                <div className={'flex justify-center'}>
                    <button
                        onClick={() => query.fetchNextPage()}
                        className={'text-zinc-500 hover:to-zinc-600 dark:text-zinc-400 text-xs dark:hover:text-zinc-300 transition'}>
                        Load previous messages 10 more
                    </button>
                </div>
            )
        }
        <div className={'flex flex-col-reverse mt-auto'}>
            {
                query?.data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {
                            group?.items?.map((message: IMassageWithMemberWithProfile) => (
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
        <div ref={bottomRef}/>
    </div>
}