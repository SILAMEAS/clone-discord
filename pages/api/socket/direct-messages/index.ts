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
        const {conversationId}=req.query;
        if(!profile){
            return res.status(401).json({message:"Unauthorized"})
        }
        if(!conversationId){
            return res.status(400).json({postMessage:"conversationId id is missing"})
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
                  },
                  memberTwo:{
                      include:{
                          profile:true
                      }
                  }
              }
          })
        if(!conversation){
            return res.status(400).json({postMessage:"conversation not found"})
        }
        const member= conversation.memberOne.profileId===profile.id?conversation.memberOne:conversation.memberTwo;
        if(!member){
            return res.status(404).json({postMessage:"member not found"})
        }
        const message=await db.direcMessage.create({
            data:{
                conversationId:conversationId as string,
                content,
                fileUrl,
                memberid:member.id,
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });
        const channelKey=`chat:${conversationId}:message`;
        res?.socket?.server?.io?.emit(channelKey,message);
        return res.status(200).json({message})
    }catch (e){
        console.log("[DIRECT_MESSAGE_POST]",e)
        return res.status(500).json({message:"Internal Server Error",e})
    }

}