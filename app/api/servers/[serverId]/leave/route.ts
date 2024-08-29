import {currentProfile} from "@/lib/current-profile";
import {UnauthencitationExceptions} from "@/lib/exceptions/un-authencitations/UnauthencitationExceptions";
import {BadException} from "@/lib/exceptions/bad-exceptions/BadExceptions";
import {NextResponse} from "next/server";
import {
    InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";
import {db} from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return UnauthencitationExceptions();
        }
        if (!params?.serverId) {
            return BadException("Server ID missing");
        }

        const server = await db.server.update({
            where: {
                id: params?.serverId,
                profileId: {not:profile.id,},
                member:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            data: {
                member:{
                    deleteMany:{
                        profileId:profile.id
                    }
                }
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        return InternalServerErrorExceptions();
    }
}
