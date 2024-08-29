"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { IServerWithMembersWithProfiles } from "@/type";
import { MemeberRole } from "@prisma/client";
import axios from "axios";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className={"h-4 w-4 ml-2 text-indigo-500"} />,
  ADMIN: <ShieldAlert className={"h-4 w-4 text-rose-500"} />,
};
const MemberModal = () => {
  const { type, isOpen, onClose, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const { server } = data as { server: IServerWithMembersWithProfiles };
  const isModalOpen = isOpen && type === "members";
  const router = useRouter();
  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const res = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  const onRoleChange = async (memberId: string, role: MemeberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          memberId,
        },
      });
      const res = await axios.patch(url, {
        role,
      });
      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"py-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Management Member
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            {server?.member?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className={"mt-8 max-h-[420px] px-6"}>
          {server?.member?.map(({ id, profile, role, profileId }) => (
            <div key={id} className={"flex items-center gap-x-2 mb-6"}>
              <UserAvatar src={profile.imageUrl} />
              <div
                className={"text-xs font-semibold flex items-center gap-x-1"}
              >
                {profile.name}
                {roleIconMap[role]}
              </div>
              <div className={"text-xs text-zinc-500"}>{profile.email}</div>
              {server.profileId !== profileId && loadingId !== id && (
                <div className={"ml-auto"}>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className={"h-4 w-4 text-zinc-500"} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side={"left"}>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className={"flex items-center"}>
                          <ShieldQuestion className={"h-4 w-4 mr-2"} />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => {
                                onRoleChange(id, "GUEST");
                              }}
                            >
                              <Shield className={"h-4 w-4 mr-2"} />
                              Guest
                              {role === "GUEST" && (
                                <Check className={"h-4 w-4 ml-auto"} />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                onRoleChange(id, "MODERATOR");
                              }}
                            >
                              <ShieldCheck className={"h-4 w-4 mr-2"} />
                              Moderator
                              {role === "MODERATOR" && (
                                <Check className={"h-4 w-4 ml-auto"} />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          onKick(id);
                        }}
                      >
                        <Gavel className={"h-4 w-4 mr-2"} />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === id && (
                <Loader2
                  className={"animate-spin text-zinc-500 ml-auto w-4 h-4"}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
