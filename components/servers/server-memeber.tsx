"use client";
import {roleIconMap} from "@/app/utils/constants/constant";
import {cn} from "@/lib/utils";
import {IPrismaMember} from "@/type";
import {Server} from "@prisma/client";
import {useParams, useRouter} from "next/navigation";
import {UserAvatar} from "../user-avatar";

interface IServerMember {
  member: IPrismaMember;
  server: Server;
}
const ServerMember = (props: IServerMember) => {
  const { member, server } = props;
  const router = useRouter();
  const params = useParams();
  const icon = roleIconMap[member.role];
  const onClick = () => {
    return router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <button
        onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberid === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className="font-semibold text-sm stroke-zinc-500 group-hover:tz600
       dark:to-zinc-400 dark:group-hover:to-zinc-300 transition"
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
export default ServerMember;
