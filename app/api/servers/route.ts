import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemeberRole } from "@prisma/client";
import { NextResponse } from "next/server";

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
        inviteCode: "12345",
        channel: { create: [{ profileId: profile.id, name: "general" }] },
        member: {
          create: [{ profileId: profile.id, role: MemeberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_POST]", error);
    return new NextResponse("Internel Error", { status: 500 });
  }
}
