import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import {ToggleThem} from "@/components/menu-toggle-theme";
import {UserButton} from "@clerk/nextjs";

export const NavigationSideBar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const servers = await db.server.findMany({
    where: {
      member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div className="space-y-4 flex flex-col items-center h-full to-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className={'flex-1 w-full'}>
        {servers.map(({ id, imageUrl, name }) => (
          <div key={id} className={'mb-4'}>
            <NavigationItem id={id} imageUrl={imageUrl} name={name} />
          </div>
        ))}
      </ScrollArea>
        <div className={'pb-3 mt-auto flex items-center flex-col gap-y-4'}>
            <ToggleThem/>
            <UserButton
            // afterSignOutUrl={'/'}
            appearance={{
                elements:{
                    avatarBox:"h-[48px] w-[48px]"
                }
            }}
            />
        </div>
    </div>
  );
};
