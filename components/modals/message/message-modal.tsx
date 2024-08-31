"use client";
import {FileUpload} from "@/components/file-upload";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem,} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {useRouter} from "next/navigation";
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useModal} from "@/hooks/use-modal-store";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "image is required",
  }),
});
const MessageModal = () => {
  const {type,data,isOpen,onClose}=useModal();
  const {apiUrl,query}=data;
  const isModalOpen=isOpen&&type==='messageFile';
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });
  const router = useRouter();
  const loading = form.formState.isSubmitting;
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const url=qs.stringifyUrl({
      url:apiUrl??"",
      query
    })
    await axios.post(url, {...value,content:value.fileUrl});
    form.reset();
    router.refresh();
    handleClose()
  };
  const handleClose=()=>{
    onClose();
    form.reset()
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"py-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Add an attachment
          </DialogTitle>
          <DialogDescription
              className={"text-center text-zinc-500"}>
          send file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={"space-y-8 px-6"}>
              <div className={"flex items-center justify-center text-center"}>
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint={"messageFile"}
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className={"bg-gray-100 px-6 py-4 w-full"}>
              <Button disabled={loading} variant={"primary"} type={"submit"}>
                Send File
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
