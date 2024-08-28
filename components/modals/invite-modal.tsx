"use client";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import React, {useState} from "react";
import {useModal} from "@/hooks/use-modal-store";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, Copy, RefreshCw} from "lucide-react";
import {useOrigin} from "@/hooks/use-origin";
import axios from "axios";

const InviteModal = () => {
  const {type,isOpen,onClose,data:{server},onOpen}=useModal();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false)

  const origin=useOrigin();
  const isModalOpen=isOpen&&type==='invite';
  const inviteUrl=`${origin}/invite/${server?.inviteCode}`;
  const onCopy=()=>{
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(()=>{
            setCopied(false)
      },1000)

    }
  const generateNew=async ()=>{
      try {
          setLoading(true)
          const res=await axios.patch(`/api/servers/${server?.id}/invite-code`);
          if(res)
          onOpen('invite',{server:res.data})
      }catch (e){
          return e;
      }finally {
          setLoading(false)
      }
  }

    return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"py-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Invite Friends
          </DialogTitle>
         <div className={'p-6'}>
           <Label>Server invite link</Label>
           <div className={'flex items-center mt-2 gap-x-2'}>
             <Input
             className={'bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'}
             value={inviteUrl}
             />
               <Button size={'icon'} onClick={onCopy}>
                   {
                       copied?<Check className={'w-4 h-4'}/>:   <Copy className={'w-4 h-4'}/>
                   }
               </Button>
           </div>
             <Button variant={'link'} size={'sm'} className={'text-xs text-zinc-500 mt-4'} onClick={generateNew}>
                 Generate a new link
                 <RefreshCw className={'w-4 h-4 ml-2'}/>
             </Button>
         </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
