import {v4 as uuidv4} from "uuid";
import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {
  InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";
import {BadException} from "@/lib/exceptions/bad-exceptions/BadExceptions";
import {UnauthencitationExceptions} from "@/lib/exceptions/un-authencitations/UnauthencitationExceptions";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return UnauthencitationExceptions();
    }
    if (!params.serverId) {
      return BadException("Server ID missing");
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    return InternalServerErrorExceptions();
  }
}
