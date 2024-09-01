import React from 'react';
import {currentProfileProtect} from "@/lib/current-profile";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {getOrCreateConversations} from "@/lib/conversation";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatInput} from "@/components/chat/chat-input";
import {ChatMessages} from "@/components/chat/chat-message";

interface IConversationIdPage{
   params:{
       memberId:string,
       serverId:string
   }
}
const ConversationIdPage =async ({params:{memberId,serverId}}:IConversationIdPage) => {
    const profile = await currentProfileProtect();
    const currentMember = await db.member.findFirst({
        where:{
            serverId,
            profileId:profile.id
        },
        include:{
          profile:true
        }
    })
    if(!currentMember){
        return redirect('/')
    }
    const conversation = await getOrCreateConversations({memberOneId:currentMember.id,memberTwoId:memberId});
    if(!conversation){
        redirect(`/servers/${serverId}`)
    }
    const {memberOne,memberTwo} = conversation;
    const otherMember = memberOne.profileId===profile.id?memberTwo:memberOne
    return (
        <div className={'bg-white dark:bg-[#313338] flex flex-col h-full'}>
            <ChatHeader serverId={serverId} name={otherMember.profile.name} type={'conversation'} imageUrl={otherMember.profile.imageUrl}/>
            <ChatMessages
                apiUrl={'/api/direct-messages'}
                chatId={conversation.id}
                name={otherMember.profile.name}
                type={'conversation'}
                member={currentMember}
                socketUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/direct-messages`}
                socketQuery={{conversationId:conversation.id}}
                paramKey={"conversationId"}
                paramValue={conversation.id}/>
            <ChatInput
                type={'conversation'}
                name={otherMember.profile.name}
                apiUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/direct-messages`}
                query={{
                    conversationId:conversation.id,
                    serverId,
                }}
            />
        </div>
    );
};

export default ConversationIdPage;
