import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {MemeberRole} from "@prisma/client";
import {NextResponse} from "next/server";
import {v4 as uuidv4} from 'uuid'
import {
  InternalServerErrorExceptions
} from "@/lib/exceptions/internal-server-exception/Internal-server-error-exceptions";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channel: { create: [{ profileId: profile.id, name: "general" }] },
        member: {
          create: [{ profileId: profile.id, role: MemeberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return InternalServerErrorExceptions();
  }
}