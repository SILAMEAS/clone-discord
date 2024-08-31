import {MemeberRole, TypeChannel} from "@prisma/client";
import {Hash, Mic, ShieldAlert, ShieldCheck, Video} from "lucide-react";

export const iconMap = {
  [TypeChannel.TEXT]: <Hash className={"mr-2 h-4 w-4"} />,
  [TypeChannel.AUDIO]: <Mic className={"mr-2 h-4 w-4"} />,
  [TypeChannel.VIDEO]: <Video className={"mr-2 h-4 w-4"} />,
};
export const iconMapOnlyNameTag = {
  [TypeChannel.TEXT]: Hash,
  [TypeChannel.AUDIO]: Mic,
  [TypeChannel.VIDEO]: Video,
};
export const roleIconMap = {
  [MemeberRole.GUEST]: null,
  [MemeberRole.MODERATOR]: (
    <ShieldCheck className={"h-4 w-4 text-indigo-500"} />
  ),
  [MemeberRole.ADMIN]: <ShieldAlert className={"h-4 w-4 text-rose-500"} />,
};
export const DATE_FORMAT="d MMM yyyy, HH:mm";
export const MESSAGE_BATCH=10;