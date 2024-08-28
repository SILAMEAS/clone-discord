"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import {Button} from "@/components/ui/button";

export const NavigationAction = () => {
  return (
    <div>
      <ActionTooltip side="right" label="Add a server" align="center">
        <button className="group flex ice">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-500 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition to-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
