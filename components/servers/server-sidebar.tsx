import ServerHeader from "@/components/servers/server-header";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {MemeberRole, TypeChannel} from "@prisma/client";
import {redirect} from "next/navigation";
import {ScrollArea} from "@/components/ui/scroll-area";
import ServerSearch from "@/components/servers/server-search";
import {Hash, Mic, ShieldAlert, ShieldCheck, Video} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import ServerSection from "@/components/servers/server-section";
import {channel} from "node:diagnostics_channel";
import ServerChannel from "@/components/servers/server-channel";

interface IServerSideBar {
  serverId: string;
}
const iconMap={
  [TypeChannel.TEXT]:<Hash className={'mr-2 h-4 w-4'}/>,
  [TypeChannel.AUDIO]:<Mic className={'mr-2 h-4 w-4'}/>,
  [TypeChannel.VIDEO]:<Video className={'mr-2 h-4 w-4'}/>
}
const roleIconMap={
  [MemeberRole.GUEST]:null,
  [MemeberRole.MODERATOR]:<ShieldCheck className={'h-4 w-4 text-indigo-500'}/>,
  [MemeberRole.ADMIN]:<ShieldAlert className={'h-4 w-4 text-rose-500'}/>,
}
const ServerSideBar = async (props: IServerSideBar) => {
  const { serverId } = props;
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channel: {
        orderBy: {
          createdAt: "asc",
        },
      },
      member: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) return redirect("/");
  const textChannel=server?.channel?.filter((i)=>i.type===TypeChannel.TEXT);
  const audioChannel=server?.channel?.filter((i)=>i.type===TypeChannel.AUDIO);
  const videoChannel=server?.channel?.filter((i)=>i.type===TypeChannel.VIDEO);
  const members=server?.member.filter(i=>i.profileId!==profile.id)
  const role=server?.member.find(i=>i.profileId===profile.id)?.role;
  return (
    <div
      className={
        "h-full flex flex-col text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]"
      }
    >
      <ServerHeader server={server} role={role} />
      <ScrollArea className={'flex-1 px-3'}>
       <div className={'mt-2'}>
         <ServerSearch
         Data={[
           {
             label:"Text Channels",
             type:"channel",
             data:textChannel?.map((channel)=>({
               id:channel.id,
               name:channel.name,
               icon:iconMap[channel.type]
             }))
           },
           {
             label:"Voice Channels",
             type:"channel",
             data:audioChannel?.map((channel)=>({
               id:channel.id,
               name:channel.name,
               icon:iconMap[channel.type]
             }))
           },
           {
             label:"Video Channels",
             type:"channel",
             data:videoChannel?.map((channel)=>({
               id:channel.id,
               name:channel.name,
               icon:iconMap[channel.type]
             }))
           },
           {
             label:"Members",
             type:"member",
             data:members?.map(({id,role,profile:{name}})=>({
               id,
               name,
               icon:roleIconMap[role]
             }))
           }
         ]}
         />
       </div>
        <Separator className={'bg-zinc-200 dark:bg-zinc-700 rounded-md my-2'}/>
        {!!textChannel?.length&&(
            <div className={'mb-2'}>
              <ServerSection
                  sectionType={'channel'}
                  role={role}
                  label={'Text Channels'}
                  channelType={TypeChannel.TEXT}
              />
              {textChannel?.map((channel)=>(
                  <ServerChannel
                      channel={channel}
                      server={server}
                      role={role}
                  />
              ))}
            </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
