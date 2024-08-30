import {currentProfileProtect} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

interface IServerIdPage{
    params:{
        serverId:string
    }
}
export default async  function ServerIdPage({params:{serverId}}:IServerIdPage) {
    const profile = await currentProfileProtect();
    const server =await db.server.findFirst({
        where:{
            id:serverId,
            member:{
                some:{
                    profileId:profile.id
                }
            }
        },
        include:{
            channel:{
               where:{
                   name:'general'
               },
                orderBy:{
                   createdAt:'asc'
                }
            }
        }
    })
    const initialChannel=server?.channel[0];
    if(initialChannel?.name!=='general'){
        return null;
    }
  return redirect(`/servers/${serverId}/channels/${initialChannel.id}`)
}
