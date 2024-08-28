import {ReactNode} from "react";
import {Member, Profile, Server} from "@prisma/client";

export interface ILayout { children: ReactNode }
export type IServerWithMembersWithProfiles=Server&{
    members:(Member&{profile:Profile})[]
}