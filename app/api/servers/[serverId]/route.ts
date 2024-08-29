import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {
    InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";
import {UnauthencitationExceptions} from "@/lib/exceptions/un-authencitations/UnauthencitationExceptions";

export async function PATCH(req: Request,{params}:{params:{serverId:string}}) {
    try {
        const {serverId}=params;
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        if (!profile) {
            return UnauthencitationExceptions()
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
        return InternalServerErrorExceptions();
    }
}
export async function DELETE(req: Request,{params}:{params:{serverId:string}}) {
    try {
        const {serverId}=params;
        const profile = await currentProfile();
        if (!profile) {
            return UnauthencitationExceptions()
        }
        const server = await db.server.delete({
            where:{
                id:serverId,
                profileId:profile.id
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        return InternalServerErrorExceptions();
    }
}
