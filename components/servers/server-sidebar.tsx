import { iconMap, roleIconMap } from "@/app/utils/constants/constant";
import ServerChannel from "@/components/servers/server-channel";
import ServerHeader from "@/components/servers/server-header";
import ServerSearch from "@/components/servers/server-search";
import ServerSection from "@/components/servers/server-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { TypeChannel } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerMember from "./server-memeber";

interface IServerSideBar {
  serverId: string;
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
  const textChannel = server?.channel?.filter(
    (i) => i.type === TypeChannel.TEXT
  );
  const audioChannel = server?.channel?.filter(
    (i) => i.type === TypeChannel.AUDIO
  );
  const videoChannel = server?.channel?.filter(
    (i) => i.type === TypeChannel.VIDEO
  );
  const members = server?.member.filter((i) => i.profileId !== profile.id);
  const role = server?.member.find((i) => i.profileId === profile.id)?.role;
  return (
    <div
      className={
        "h-full flex flex-col text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]"
      }
    >
      <ServerHeader server={server} role={role} />
      <ScrollArea className={"flex-1 px-3"}>
        <div className={"mt-2"}>
          <ServerSearch
            Data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map(({ id, role, profile: { name } }) => ({
                  id,
                  name,
                  icon: roleIconMap[role],
                })),
              },
            ]}
          />
        </div>
        <Separator className={"bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"} />
        {/* Text Channel */}
        {!!textChannel?.length && (
          <div className={"mb-2"}>
            <ServerSection
              sectionType={"channel"}
              role={role}
              label={"Text Channels"}
              channelType={TypeChannel.TEXT}
              server={server}
            />
            <div className="space-y-[2px]">
              {textChannel?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {/* Audio Channel */}
        {!!audioChannel?.length && (
          <div className={"mb-2"}>
            <ServerSection
              sectionType={"channel"}
              role={role}
              label={"Audio Channels"}
              channelType={TypeChannel.AUDIO}
              server={server}
            />
            <div className="space-y-[2px]">
              {audioChannel?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {/* Video Channel */}
        {!!videoChannel?.length && (
          <div className={"mb-2"}>
            <ServerSection
              sectionType={"channel"}
              role={role}
              label={"Video Channels"}
              channelType={TypeChannel.VIDEO}
              server={server}
            />
            <div className="space-y-[2px]">
              {videoChannel?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {/* Members In Channel */}
        {!!members?.length && (
          <div className={"mb-2"}>
            <ServerSection
              sectionType={"members"}
              role={role}
              label={"Members in Channel"}
              channelType={TypeChannel.VIDEO}
              server={server}
            />
            <div className="space-y-[2px]">
              {members?.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
