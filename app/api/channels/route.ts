import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {BadException} from "@/lib/exceptions/bad-exceptions/BadExceptions";
import {MemeberRole} from "@prisma/client";
import {
    InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";

export async function POST(req: Request) {
    try {
        const { nameChannel:name, typeChannel:type } = await req.json();
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const [serverId] = [searchParams.get("serverId")];
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return BadException("Server ID missing");
        }
        if(name==='general'){
            return BadException("Name cannot be 'general'")
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
                member:{
                    some:{
                        role:{in:[MemeberRole.ADMIN,MemeberRole.MODERATOR]}
                    }
                }
            },
            data: {
                channel:{
                    create:{
                        name,
                        type,
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