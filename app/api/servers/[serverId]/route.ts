import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(req: Request,{params}:{params:{serverId:string}}) {
    try {
        const {serverId}=params;
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const server = await db.server.update({
           where:{
               id:serverId
           },
            data:{
               name,
                imageUrl
            }
        });
        return NextResponse.json(server);
    } catch (error) {
        return new NextResponse("Internel Error", { status: 500 });
    }
}
