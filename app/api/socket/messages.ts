import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/type";
import {db} from "@/lib/db";
import {currentProfilePages} from "@/lib/current-profile-pages";


export default async function handler(req:NextApiRequest,res:NextApiResponseServerIo){
    if(req.method!=="POST"){
        return res.status(405).json({error:"Method not allowed"})
    }
    try {
        const profile=await currentProfilePages(req);
        const {content,fileUrl}=req.body;
        const {serverId,channelId}=req.query;
        if(!profile){
            return res.status(401).json({message:"Unauthorized"})
        }
        if(!serverId){
            return res.status(400).json({postMessage:"server id is missing"})
        }
        if(!channelId){
            return res.status(400).json({postMessage:"channel id is missing"})
        }
        const server = await db.server.findFirst({
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
            return res.status(404).json({postMessage:"server not found"})
        }
        const channel = await db.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string
            }
        })
        if(!channel){
            return res.status(404).json({postMessage:"channel not found"})
        }
        const member= server.member.find((mem)=>mem.profileId===profile.id);
        if(!member){
            return res.status(404).json({postMessage:"member not found"})
        }
        const message=await db.message.create({
            data:{
                channelId:channelId as string,
                content,
                fileUrl,
                memberId:member.id,
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });
        console.log("message",message)
        const channelKey=`chat:${channelId}:message`;
        if(channelKey&&message) {
            res?.socket?.server?.io?.emit(channelKey,message);
        }
        return res.status(200).json({message})
    }catch (e){
        console.log("[MESSAGE_POST]",e)
        return res.status(500).json({message:"Internal Server Error",e})
    }

}