import { NextResponse } from "next/server";

export const UnauthencitationExceptions = (message?: string) => {
  return new NextResponse(message ?? "Unauthorized", { status: 401 });
};
