import React from 'react';
import {ILayout} from "@/type";
import {currentProfile} from "@/lib/current-profile";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import ServerSideBar from "@/components/servers/server-sidebar";

const ServerIdLayout = async ({children,params}:ILayout&{params:{serverId:string}}) => {
    const profile=await currentProfile();
    if(!profile){
        return auth().redirectToSignIn()
    }
    const server= await  db.server.findUnique({where:{id:params.serverId,member:{
        some:{
            profileId:profile.id
        }
            }}})
    if(!server){
        return redirect('/')
    }

    return (
        <div className={'h-full'}>
            <div className={'hidden md:flex h-full w-60 z-20 flex-col fixed insert-y-0'}><ServerSideBar serverId={params.serverId}/></div>
           <main className={'h-full md:pl-60'}> {children}</main>
        </div>
    );
};

export default ServerIdLayout;
