import {IServerWithMembersWithProfiles} from "@/type";
import {Channel, Server, TypeChannel} from "@prisma/client";
import {create} from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
    | "messageFile";
interface ModalData {
  server?: Server | IServerWithMembersWithProfiles;
  channelType?: TypeChannel;
  channel?: Channel;
  apiUrl?:string;
  query?:Record<string, any>
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
