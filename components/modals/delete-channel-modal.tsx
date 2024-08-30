"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteChannelModal = () => {
  const {
    type,
    isOpen,
    onClose,
    data: { server },
  } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const onClick = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/servers/${server?.id}/channel`);
      onClose();
      router.refresh();
    } catch (e) {
      return e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"py-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Leave Server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Are you sure you want to Delete{" "}
            <span
              className={"font-semibold text-indigo-500"}
            >{`"${server?.name}"`}</span>{" "}
            channel?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"bg-gray-100 px-6 py-4"}>
          <div className={"flex items-center justify-between w-full"}>
            <Button variant={"ghost"} disabled={loading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              disabled={loading}
              onClick={onClick}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
