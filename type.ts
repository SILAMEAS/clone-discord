import { Member, Profile, Server } from "@prisma/client";
import { ReactNode } from "react";

export interface ILayout {
  children: ReactNode;
}
export type IServerWithMembersWithProfiles = Server & {
  member: (Member & { profile: Profile })[];
};
export type IPrismaMember = Member & { profile: Profile };
