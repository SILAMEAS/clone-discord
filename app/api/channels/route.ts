import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {BadException} from "@/lib/exceptions/bad-exceptions/BadExceptions";
import {
  InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";
import {MemeberRole} from "@prisma/client";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const { nameChannel: name, typeChannel: type } = await req.json();
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const [serverId] = [searchParams.get("serverId")];
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return BadException("Server ID missing");
    }
    if (name === "general") {
      return BadException("Name cannot be 'general'");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        member: {
          some: {
            role: { in: [MemeberRole.ADMIN, MemeberRole.MODERATOR] },
          },
        },
      },
      data: {
        channel: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return InternalServerErrorExceptions();
  }
}
