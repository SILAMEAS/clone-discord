import {
    InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";
import {currentProfileProtect} from "@/lib/current-profile";
import {Message} from "@prisma/client";
import {db} from "@/lib/db";
import {BadException} from "@/lib/exceptions/bad-exceptions/BadExceptions";
import {NextResponse} from "next/server";
import {UnauthencitationExceptions} from "@/lib/exceptions/un-authencitations/UnauthencitationExceptions";
import {MESSAGE_BATCH} from "@/app/utils/constants/constant";

export async function GET(req:Request){
    try {
        const profile=await currentProfileProtect();
        const {searchParams}=new URL(req.url);
        const cursor= searchParams.get('cursor');
        const channelId= searchParams.get('channelId');
        if(!profile){
            return UnauthencitationExceptions()
        }
        if(!channelId){
            return BadException('Channel Id is missing')
        }

        let messages:Message[]=[];
        if(cursor){
            messages=await db.message.findMany({
                take:MESSAGE_BATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                    channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:'desc'
                }
            })
        }else {
            messages=await db.message.findMany({
                take:MESSAGE_BATCH,
                where:{
                    channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:'desc'
                }
            })
        }
        let nextCursor=null;
        if(messages.length===MESSAGE_BATCH){
            nextCursor=messages[MESSAGE_BATCH-1].id
        }
        return NextResponse.json({items:messages,nextCursor})

    }catch (e){
        console.error("[MESSAGE_GET]",e);
        return InternalServerErrorExceptions()
    }
}