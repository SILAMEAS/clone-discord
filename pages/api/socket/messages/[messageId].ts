import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/type";
import {currentProfilePages} from "@/lib/current-profile-pages";
import {db} from "@/lib/db";
import {$Enums} from "@/prisma/generated/client";
import MemeberRole = $Enums.MemeberRole;


export default async function handler(req:NextApiRequest,res:NextApiResponseServerIo){
    if(req.method!=="DELETE"&&req.method!=='PATCH'){
        return res.status(405).json({error:"Method not allowed"})
    }
    try {
        const profile=await currentProfilePages(req);
        const {serverId,channelId,messageId}=req.query;
        const {content}=req.body;
        if(!profile){
            return res.status(401).json({error:"Unauthorized"})
        }
        if(!serverId){
            return res.status(404).json({error:"server id is missing"})
        }
        if(!channelId){
            return res.status(404).json({error:"channel id is missing"})
        }
        const server= await db.server.findFirst({
            where:{
                id:serverId as string,
                member:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            include:{
                member:true
            }
        });
        if(!server){
            return res.status(404).json({error:"Sever not found"})
        }
        const channel= await db.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string,
            }
        });
        if(!channel){
            return res.status(404).json({error:"channel not found"})
        }
        const members= server.member.find((me)=>me.profileId===profile.id);
        if(!members){
            return res.status(404).json({error:"members not found"})
        }
        let message =await  db.message.findUnique({
            where:{
                id:messageId as string,
                channelId: channelId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        if(!message || message.delete){
            return res.status(404).json({error:"members not found"})
        }
        const isMessageOwner=message.memberId===members.id;
        const isAdmin=members.role=== MemeberRole.ADMIN;
        const isModerator=members.role=== MemeberRole.MODERATOR;
        const canModify= isAdmin||isModerator||isMessageOwner;
        if(!canModify){
            return res.status(401).json({error:"Unauthorized"})
        }
        if(req.method==="DELETE"){
            message= await  db.message.update({
                where:{
                    id:messageId as string
                },
                data:{
                    fileUrl:null,
                    content:"This message has been deleted",
                    delete:true
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }else {
            message= await  db.message.update({
                where:{
                    id:messageId as string
                },
                data:{
                    content,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })

        }
        const updateKey=`chat:${channelId}:message:update`
        res?.socket?.server?.io?.emit(updateKey,message);
        return res.status(200).json(message)
    }catch (e){
        console.log("[MESSAGE_PATCH_DELETE]",e)
        return res.status(500).json({message:"Internal Server Error",e})
    }

}