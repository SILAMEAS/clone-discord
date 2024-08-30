import {auth} from "@clerk/nextjs/server";
import {db} from "./db";

export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  return db.profile.findUnique({ where: { userId } });
};
export const currentProfileProtect = async () => {
  const profile=await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn()
  }
  return profile;
};
