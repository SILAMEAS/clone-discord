"use client";
import DeleteServerModal from "@/components/modals/servers/delete-server-modal";
import EditServerModal from "@/components/modals/servers/edit-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import LeaveServerModal from "@/components/modals/servers/leave-server-modal";
import {useEffect, useState} from "react";
import CreateChannelModal from "../modals/channels/create-channel-modal";
import CreateServerModal from "../modals/servers/create-server-modal";
import DeleteChannelModal from "../modals/channels/delete-channel-modal";
import MemberModal from "../modals/members-modal";
import EditChannelModal from "../modals/channels/edit-channel-modal";
import MessageModal from "@/components/modals/message/message-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MemberModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
        <MessageModal/>
    </>
  );
};
