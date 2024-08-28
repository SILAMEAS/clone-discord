import React from 'react';
import {currentProfile} from "@/lib/current-profile";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {MemeberRole} from "@prisma/client";

interface IInviteCode{
    params:{
        inviteCode:string
    }
}
const InviteCodePage = async (props:IInviteCode) => {
    const {params:{inviteCode}}=props;
    const profile = await currentProfile();
    if(!profile){
        return auth().redirectToSignIn()
    }
    if(!inviteCode){
        return redirect('/')
    }
    const serverExiting=await db.server.findFirst({
        where:{
            inviteCode,
            member:{
                some:{
                    profileId:profile.id
                }
            }
        },
    })
    if(serverExiting) redirect('/servers/'+serverExiting.id);
    const joinToServer=await db.server.update({
        where:{
            inviteCode
        },
        data:{
            member:{
                create:{profileId:profile.id,role:MemeberRole.GUEST}
            }
        }
    })

    return (
        <div>
            Hello Invite
        </div>
    );
};

export default InviteCodePage;
