"use client";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/store/use-modal-store";
import axios from "axios";
import {Loader2} from "lucide-react";
import {useRouter} from "next/navigation";
import qs from "query-string";
import {useState} from "react";

const DeleteMessageModal = () => {
  const {
    type,
    isOpen,
    onClose,
    data: { apiUrl,query},
  } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteMessage";
  const onClick = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl+"",
        query
      });
      await axios.delete(url);
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
            Delete Message
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Are you sure you want to delete this message ?
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
              {loading ? (
                <Loader2
                  className={"animate-spin text-zinc-500 ml-auto w-4 h-4"}
                />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
