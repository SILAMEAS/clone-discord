import {Member, Message, Profile, Server} from "@prisma/client";
import {ReactNode} from "react";
import {NextApiResponse} from "next";
// import {Socket} from "node:net";
import {Server as NetServer, Socket} from 'net'
import {Server as SocketIOServer} from 'socket.io'

export interface ILayout {
  children: ReactNode;
}
export type IServerWithMembersWithProfiles = Server & {
  member: (Member & { profile: Profile })[];
};
export type IPrismaMember = Member & { profile: Profile };
export type NextApiResponseServerIo=NextApiResponse&{socket:Socket&{server:NetServer&{io:SocketIOServer}}}

export type typeOptionChat='channel'|'conversation';

export type typeParamkey='channelId'|'conversationId';
export type IMassageWithMemberWithProfile = Message & {
  member: (Member & { profile: Profile });
};
export type IMemberWithProfile = Member&{profile:Profile}