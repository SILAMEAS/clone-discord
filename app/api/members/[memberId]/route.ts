import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {BadException} from "@/lib/exceptions/bad-exceptions/BadExceptions";
import {UnauthencitationExceptions} from "@/lib/exceptions/un-authencitations/UnauthencitationExceptions";
import {NextResponse} from "next/server";
import {
  InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params;
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const [serverId] = [searchParams.get("serverId")];
    if (!profile) {
      return UnauthencitationExceptions();
    }
    if (!serverId) {
      return BadException("Server ID missing");
    }
    if (!memberId) {
      return BadException("member ID missing");
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        member: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        member: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("Internel Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params;
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const [serverId] = [searchParams.get("serverId")];
    if (!profile) {
      return UnauthencitationExceptions();
    }
    if (!serverId) {
      return BadException("Server ID missing");
    }
    if (!memberId) {
      return BadException("member ID missing");
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        member: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        member: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    return InternalServerErrorExceptions();
  }
}
