import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/type";
import {currentProfilePages} from "@/lib/current-profile-pages";
import {db} from "@/lib/db";
import {MemeberRole} from "@prisma/client";


export default async function handler(req:NextApiRequest,res:NextApiResponseServerIo){
    if(req.method!=="DELETE"&&req.method!=='PATCH'){
        return res.status(405).json({error:"Method not allowed"})
    }
    try {
        const profile=await currentProfilePages(req);
        const {directMessageId,conversationId}=req.query;
        const {content}=req.body;
        if(!profile){
            return res.status(401).json({error:"Unauthorized"})
        }
        if(!directMessageId){
            return res.status(404).json({error:"directMessageId is missing"})
        }
        if(!conversationId){
            return res.status(404).json({error:"conversationId is missing"})
        }

        const conversation=await  db.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR:[
                    {
                        memberOne:{
                            profileId:profile.id
                        }
                    },
                    {
                        memberTwo:{
                            profileId:profile.id
                        }
                    }
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        if(!conversation){
            return res.status(404).json({error:"conversation not found"})
        }
        const members= conversation.memberOne.profileId===profile.id?conversation.memberOne:conversation.memberTwo;
        if(!members){
            return res.status(404).json({error:"members not found"})
        }
        let directMessage =await  db.direcMessage.findUnique({
            where:{
                id:directMessageId as string,
                conversationId:conversationId as string,
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        if(!directMessage || directMessage.delete){
            return res.status(404).json({error:"members not found"})
        }
        const isMessageOwner=directMessage.memberid===members.id;
        const isAdmin=members.role=== MemeberRole.ADMIN;
        const isModerator=members.role=== MemeberRole.MODERATOR;
        const canModify= isAdmin||isModerator||isMessageOwner;
        if(!canModify){
            return res.status(401).json({error:"Unauthorized"})
        }
        if(req.method==="DELETE"){
            directMessage= await  db.direcMessage.update({
                where:{
                    id:directMessageId as string,
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
            directMessage= await  db.direcMessage.update({
                where:{
                    id:directMessageId as string
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
        const updateKey=`chat:${directMessageId}:message:update`
        res?.socket?.server?.io?.emit(updateKey,directMessage);
        return res.status(200).json(directMessage)
    }catch (e){
        console.log("[MESSAGE_PATCH_DELETE]",e)
        return res.status(500).json({message:"Internal Server Error",e})
    }

}