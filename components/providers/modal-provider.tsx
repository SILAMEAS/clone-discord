"use client";
import DeleteServerModal from "@/components/modals/delete-server-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import LeaveServerModal from "@/components/modals/leave-server-modal";
import { useEffect, useState } from "react";
import CreateChannelModal from "../modals/create-channel-modal";
import CreateServerModal from "../modals/create-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import MemberModal from "../modals/members-modal";

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
    </>
  );
};
