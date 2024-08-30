import {db} from "@/lib/db";

export const  findConversation=async ({memberOneId,memberTwoId}:{memberOneId:string,memberTwoId:string})=>{
    const conversation=await db.conversation.findFirst({

    })

}