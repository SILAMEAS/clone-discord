import {ReactNode} from "react";
import {Member, Profile, Server} from "@prisma/client";

export interface ILayout { children: ReactNode }
export type IServerWithMembersWithProfiles=Server&{
    member:(Member&{profile:Profile})[]
}