import { NextResponse } from "next/server";

export const BadException = (message?: string) => {
  return new NextResponse(message ?? "Bad Request", { status: 400 });
};
