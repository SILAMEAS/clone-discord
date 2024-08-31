import {db} from "./db";
import {NextApiRequest} from "next";
import {getAuth} from "@clerk/nextjs/server";

export const currentProfilePages = async (req:NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }

  return db.profile.findUnique({ where: { userId } });
};