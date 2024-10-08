"use client";
import {ActionTooltip} from "@/components/action-tooltip";
import {useModal} from "@/hooks/store/use-modal-store";
import {IServerWithMembersWithProfiles} from "@/type";
import {MemeberRole, TypeChannel} from "@prisma/client";
import {Plus, Settings} from "lucide-react";

interface IServerSection {
  label?: string;
  role?: MemeberRole;
  sectionType: "channel" | "members";
  channelType?: TypeChannel;
  server?: IServerWithMembersWithProfiles;
}
const ServerSection = ({
  sectionType,
  channelType,
  server,
  role,
  label,
}: IServerSection) => {
  const { onOpen } = useModal();
  return (
    <div className={"flex items-center justify-between py-2"}>
      <p
        className={
          "text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400"
        }
      >
        {label}
      </p>
      {role !== MemeberRole.GUEST && sectionType === "channel" && (
        <ActionTooltip label={"Create Channel"} side={"top"}>
          <button
            onClick={() => onOpen("createChannel", { server, channelType })}
            className={
              "text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            }
          >
            <Plus className={"h-4 w-4 mr-2"} />
          </button>
        </ActionTooltip>
      )}
      {role === MemeberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label={"Manage members"} side={"top"}>
          <button
            onClick={() => onOpen("members", { server })}
            className={
              "text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            }
          >
            <Settings className={"h-4 w-4 mr-2"} />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
