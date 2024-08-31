"use client";
import {IMemberWithProfile} from "@/type";
import {Member} from "@prisma/client";
import {UserAvatar} from "@/components/user-avatar";
import {ActionTooltip} from "@/components/action-tooltip";
import {roleIconMap} from "@/app/utils/constants/constant";
import {$Enums} from "@/prisma/generated/client";
import Image from "next/image";
import {Edit, FileIcon, Trash} from "lucide-react";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import qs from "query-string";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import MemeberRole = $Enums.MemeberRole;

interface IChatItem{
    id:string;
    content:string;
    member:IMemberWithProfile;
    timestamp:string;
    fileUrl:string|null;
    deleted:boolean;
    currentMember:Member;
    isUpdated:boolean;
    socketUrl:string;
    socketQuery:Record<string, any>
}
const formSchema=z.object({
    content:z.string().min(1)

})
export const ChatItem=({fileUrl,timestamp,member,id,content,currentMember,deleted,isUpdated,socketUrl,socketQuery}:IChatItem)=>{
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            content: content
        }
    })
    const router= useRouter();
    const param=useParams();
    const onMemberClick=()=>{
        if(member.id===currentMember.id){
            return
        }
        return router.push(`/servers/${param?.serverId}/conversations/${member.id}`)

    }
    const fileType=fileUrl?.split(".").pop();
    const isAdmin = currentMember.role===MemeberRole.ADMIN;
    const isOwner = currentMember.id=== member.id;
    const isModerator = currentMember.role===MemeberRole.MODERATOR;
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)
    const canDeleteMessage=!deleted&&(isAdmin||isOwner||isModerator);
    const canEditMessage=!deleted&&isOwner&&!fileUrl;
    const isPDF = fileType==='pdf'&&fileUrl;
    const isImage= !isPDF&&fileUrl;
    const onSubmit=async (value:z.infer<typeof formSchema>)=>{
        const url=qs.stringifyUrl({
            url:`${socketUrl}/${id}`,
            query:socketQuery
        })
        await axios.patch(url,value)
    }
    const isLoading=form.formState.isSubmitting;
    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content]);
    useEffect(() => {
        const handleKeyDown=(event:any)=>{
            if(event.key==='Escape'|| event.keyCode===27){
                setIsEditing(false);
            }
        }
        window.addEventListener('keydown',handleKeyDown);
        return ()=>window.removeEventListener('keydown',handleKeyDown)
    }, []);
    return <div className={'relative group flex items-center hover:bg-black/5 p-4 transition w-full'}>
        <div className={'group flex gap-x-2 items-start w-full'}>
            <div className={'cursor-pointer hover:drop-shadow-md transition'} onClick={onMemberClick}>
                <UserAvatar src={member.profile.imageUrl}/>
            </div>
            <div className={cn('flex flex-col w-full')}>
                <div className={'flex items-center gap-x-2'}>
                    <div className={'flex items-center'}>
                        <p className={'font-semibold text-sm hover:underline cursor-pointer'} onClick={onMemberClick}>
                            {member.profile.name}
                        </p>
                        <ActionTooltip label={member.role}>
                            {roleIconMap[member.role]}
                        </ActionTooltip>

                    </div>
                    <span className={'text-xs text-zinc-500 dark:text-zinc-400'}>{timestamp}</span>
                </div>
                {isImage && (
                    <a href={fileUrl} target={"_blank"} rel="noopener noreferrer"
                       className={'relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'}
                    >
                        <Image fill src={fileUrl} alt={content} className={'object-cover'}/>
                    </a>
                )}
                {
                    isPDF && (
                        <div className="relative  flex items-center p-2 mt-2 rounded-md bg-background/10 mb-10">
                            <FileIcon className={'h-10 w-10 fill-indigo-200 stroke-indigo-400'}/>
                            <a href={fileUrl} target={'_blank'}
                               rel="noopener noreferrer"
                               className={'ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'}>PDF</a>
                        </div>
                    )
                }
                {!fileUrl&&!isEditing&&(
                    <p className={cn('text-sm to-zinc-600 dark:text-zinc-300', deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1')}>
                        {content}
                        {isUpdated && !deleted && (
                            <span className={'text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'}>(edited)</span>
                        )}
                    </p>
                )}
                {!fileUrl&&isEditing&&(
                    <Form {...form}>
                        <form className={'flex items-center w-full gap-x-2 pt-2'}
                              onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                name={'content'}
                                control={form.control}
                                render={({field})=>(
                                <FormItem className={'flex-1'}>
                                    <FormControl>
                                        <div className={'relative w-full'}>
                                            <Input
                                                disabled={isLoading}
                                                className={'p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'}
                                                placeholder={'Edite message'}
                                                {...field}
                                            />
                                        </div>

                                    </FormControl>
                                </FormItem>
                            )}/>
                            <Button disabled={isLoading} size={'sm'} value={'primary'}>Save</Button>

                        </form>
                        <span className={'text-[10px] mt-1 text-zinc-400'}>Press escape to cancel, enter to save </span>
                    </Form>
                )}
            </div>
        </div>
        {canDeleteMessage&&(
            <div className={'hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'}>
                {
                    canEditMessage&&(
                        <ActionTooltip label={'Edit'}>
                            <Edit onClick={()=>setIsEditing(true)} className={'cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'}/>
                        </ActionTooltip>
                    )
                }
                <ActionTooltip label={'Delete'}>
                    <Trash onClick={()=>setIsDeleting(true)} className={'cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'}/>
                </ActionTooltip>
            </div>
        )}
    </div>
}