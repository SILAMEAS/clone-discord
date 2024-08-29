import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    // const { memberId } = params;
    // const profile = await currentProfile();
    // const { searchParams } = new URL(req.url);
    // const { role } = await req.json();
    // const [serverId] = [searchParams.get("serverId")];
    // if (!profile) {
    //   return UnauthencitationExceptions();
    // }
    // if (!serverId) {
    //   return BadException("Server ID missing");
    // }
    // if (!memberId) {
    //   return BadException("member ID missing");
    // }
    // const server = await db.server.update({
    //   where: {
    //     id: serverId,
    //     profileId: profile.id,
    //   },
    //   data: {
    //     member: {
    //       update: {
    //         where: {
    //           id: memberId,
    //           profileId: {
    //             not: profile.id,
    //           },
    //         },
    //         data: {
    //           role,
    //         },
    //       },
    //     },
    //   },
    //   include: {
    //     member: {
    //       include: {
    //         profile: true,
    //       },
    //       orderBy: {
    //         role: "asc",
    //       },
    //     },
    //   },
    // });

    return NextResponse.json(null);
  } catch (error) {
    return new NextResponse("Internel Error", { status: 500 });
  }
}
