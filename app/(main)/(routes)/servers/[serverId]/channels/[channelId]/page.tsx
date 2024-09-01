import React, {Fragment} from 'react';
import {currentProfileProtect} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatInput} from "@/components/chat/chat-input";
import {ChatMessages} from "@/components/chat/chat-message";
import {TypeChannel} from "@prisma/client";
import Room from "@/components/room";

interface IChannelIdPage{
    params:{
        serverId:string;
        channelId:string;
    }
}
const ChannelIdPage =async ({params:{channelId,serverId}}:IChannelIdPage) => {
    const profile=await currentProfileProtect();
    const channel=await db.channel.findUnique({
        where:{
            id:channelId,
            serverId
        }
    })
    const member=await db.member.findFirst({
        where:{
            profileId:profile.id,
            serverId
        }
    })
    if(!member || !channel){
        redirect("/")
    }
    return (
        <div className={'bg-white dark:bg-[#313338] flex flex-col h-full'}>
            <ChatHeader name={channel.name} type={'channel'} serverId={serverId}/>
            {
                channel.type===TypeChannel.TEXT&&(
                    <Fragment>
                        <ChatMessages
                            name={channel.name}
                            type={'channel'}
                            chatId={channel.id}
                            apiUrl={'/api/messages'}
                            member={member}
                            paramKey={'channelId'}
                            paramValue={channel.id}
                            socketUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/messages`}
                            socketQuery={{
                                channelId:channel.id,
                                serverId:channel.serverId
                            }}
                        />
                        <ChatInput
                            type={'channel'}
                            name={channel.name}
                            apiUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/messages`}
                            query={{
                                channelId:channel.id,
                                serverId:channel.serverId,
                            }}
                        />
                    </Fragment>

                )
            }
            {
                channel.type===TypeChannel.VIDEO&&(
                    <Room chatId={channel.id} video={true} audio={true}/>
                )
            }
            {
                channel.type===TypeChannel.AUDIO&&(
                    <Room chatId={channel.id} video={false} audio={true}/>
                )
            }
        </div>
    );
};

export default ChannelIdPage;
