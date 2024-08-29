"use client"
import React from 'react';
import {Channel, MemeberRole, Server, TypeChannel} from "@prisma/client";
import {Edit, Hash, Mic, Trash, Video} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {ActionTooltip} from "@/components/action-tooltip";

const iconMap={
    [TypeChannel.TEXT]:Hash,
    [TypeChannel.AUDIO]:Mic,
    [TypeChannel.VIDEO]:Video
}
// const roleIconMap={
//     [MemeberRole.GUEST]:null,
//     [MemeberRole.MODERATOR]:<ShieldCheck className={'h-4 w-4 text-indigo-500'}/>,
//     [MemeberRole.ADMIN]:<ShieldAlert className={'h-4 w-4 text-rose-500'}/>,
// }
interface IServerChannel{
    channel:Channel;
    server:Server;
    role?:MemeberRole
}
const ServerChannel = ({server,channel,role}:IServerChannel) => {
    const params=useParams();
    const router=useRouter();
    const Icon=iconMap[channel.type];
    return (
        <div>
            <button onClick={()=>{}} className={cn('group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700 dark:hover:bg-zinc-700/50 transition mb-1',
                params?.channelId===channel.id&&"bg-zinc-700/20 dark:bg-zinc-700")}>
                <Icon className={'flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400'}/>
                <p className={cn('line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:to-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
                    params?.channelId===channel.id&&"text-primary dark:text-zinc-200 dark:group-hover:text-white")}>{channel.name}
                </p>
                {channel.name!=='generate'&&role!==MemeberRole.GUEST&&(
                    <div className={'ml-auto flex items-center gap-x-2'}>
                        <ActionTooltip label={'Edit'}>
                            <Edit className={'hidden group-hover:block w-4 h-4 text-zinc-500 hover:to-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'}/>

                        </ActionTooltip>
                        <ActionTooltip label={'Delete'}>
                            <Trash className={'hidden group-hover:block w-4 h-4 text-zinc-500 hover:to-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'}/>

                        </ActionTooltip>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ServerChannel;
