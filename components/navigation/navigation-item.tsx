"use client";

import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";

interface INavationItem {
  id: string;
  imageUrl: string;
  name: string;
}
export const NavigationItem = (props: Readonly<INavationItem>) => {
  const { id, imageUrl, name } = props;
  const params = useParams();
  console.log("params", params, id);
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={() => {}} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId != id && "group-hover:h-[20px]",
            params?.serverId == id ? "h-[36px]" : "h-[8px]"
          )}
        >
          server
        </div>
      </button>
    </ActionTooltip>
  );
};
