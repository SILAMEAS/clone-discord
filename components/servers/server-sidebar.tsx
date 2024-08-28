import React from 'react';
import {currentProfile} from "@/lib/current-profile";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {TypeChannel} from "@prisma/client";
import ServerHeader from "@/components/servers/server-header";

interface IServerSideBar{
    serverId:string;
}
const ServerSideBar =async (props:IServerSideBar) => {
    const {serverId}=props;
    const profile=await currentProfile();
    if(!profile){
        return redirect('/')
    }
    const server = await db.server.findUnique({
        where:{
            id:serverId
        },
        include:{
            channel:{
                orderBy:{
                    createdAt:"asc"
                }
            },
            member:{
                include:{
                    profile:true
                },
                orderBy:{
                    role:"asc"
                }
            }
        }
    })
    if(!server) return redirect('/')
    let textChannel;
    let audioChannel;
    let videoChannel;
    server?.channel?.flatMap((ch)=>{
        switch (ch.type){
            case TypeChannel.TEXT:{
                return textChannel=ch;
            }
            case TypeChannel.AUDIO:{
                return audioChannel=ch;
            }
            case TypeChannel.VIDEO:{
                return videoChannel=ch;
            }
        }
    })
    let members;
    let role;
        server?.member.flatMap((mem)=>{
            if(mem.profileId!==profile.id){
                return members=mem
            }else {
                return role=mem.role;
            }
        })
    return (
        <div className={'h-full flex flex-col text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'}>
            <ServerHeader server={server} role={role}/>
        </div>
    );
};

export default ServerSideBar;
