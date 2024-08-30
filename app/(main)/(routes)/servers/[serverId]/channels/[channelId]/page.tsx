import React from 'react';
import {currentProfileProtect} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {ChatHeader} from "@/components/chat/chat-header";

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
            id:channelId
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
            <ChatHeader name={channel.name} type={'channel'} serverId={serverId} imageUrl={""}/>
        </div>
    );
};

export default ChannelIdPage;
