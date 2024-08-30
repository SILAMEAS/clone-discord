import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { BadException } from "@/lib/exceptions/bad-exceptions/BadExceptions";
import { InternalServerErrorExceptions } from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";
import { UnauthencitationExceptions } from "@/lib/exceptions/un-authencitations/UnauthencitationExceptions";
import { MemeberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const [serverId] = [searchParams.get("serverId")];
    if (!profile) {
      return UnauthencitationExceptions();
    }
    if (!serverId) {
      return BadException("Server ID missing");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        member: {
          some: {
            role: { in: [MemeberRole.ADMIN, MemeberRole.MODERATOR] },
          },
        },
      },
      data: {
        channel: {
          delete: {
            id: params?.channelId,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return InternalServerErrorExceptions();
  }
}
