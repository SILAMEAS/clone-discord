import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./db";

export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  return db.profile.findUnique({ where: { userId } });
};
