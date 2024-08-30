import {db} from "@/lib/db";

export const  getOrCreateConversations = async ({memberOneId,memberTwoId}:{memberOneId:string,memberTwoId:string})=>{
    let conversation= await findConversation({memberOneId,memberTwoId}) || await findConversation({memberTwoId,memberOneId});
    if(!conversation){
        return  await createConversation({memberOneId,memberTwoId})
    }
    return conversation;
}
export const  findConversation = async ({memberOneId,memberTwoId}:{memberOneId:string,memberTwoId:string})=>{
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    {memberOneId: memberOneId},
                    {memberTwoId: memberTwoId}
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        });
    }catch (e){
        return null;
    }

}

export const  createConversation = async ({memberOneId,memberTwoId}:{memberOneId:string,memberTwoId:string})=>{
    try {
        return await db.conversation.create({
            data: {
              memberOneId, memberTwoId
            },
            include:{
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        });

    }catch (e){
        return console.error("createConversation",e)
    }
}
