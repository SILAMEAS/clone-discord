"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useModal} from "@/hooks/store/use-modal-store";
import {IServerWithMembersWithProfiles} from "@/type";
import {MemeberRole} from "@prisma/client";
import {ChevronDown, LogOut, PlusCircle, Settings, Trash, User, UserPlus,} from "lucide-react";

interface IServerHeader {
  server: IServerWithMembersWithProfiles;
  role?: MemeberRole;
}

const ServerHeader = (props: IServerHeader) => {
  const { role, server } = props;
  const { onOpen } = useModal();
  const isAdmin = role === MemeberRole.ADMIN;
  const isModerator = isAdmin || role === MemeberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={"focus:outline-none"} asChild>
        <button
          className={
            "w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
          }
        >
          {server.name}
          <ChevronDown className={"h-5 w-5 ml-auto"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          "w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
        }
      >
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className={
              "text-indigo-500 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            }
          >
            Invite people
            <UserPlus className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className={" px-3 py-2 text-sm cursor-pointer"}
            onClick={() => onOpen("editServer", { server })}
          >
            Server Setting
            <Settings className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className={" px-3 py-2 text-sm cursor-pointer"}
            onClick={() => onOpen("members", { server })}
          >
            Manage Members
            <User className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className={" px-3 py-2 text-sm cursor-pointer"}
            onClick={() => onOpen("createChannel", { server })}
          >
            Create Channel
            <PlusCircle className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className={" px-3 py-2 text-sm cursor-pointer text-rose-500"}
            onClick={()=>onOpen('deleteServer',{server})}
          >
            Delete Server
            <Trash className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className={" px-3 py-2 text-sm cursor-pointer text-rose-500"}
            onClick={()=>onOpen('leaveServer',{server})}
          >
            Leave Server
            <LogOut className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
