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
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {useRouter} from "next/navigation";
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useModal} from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server is required",
  }),
  imageUrl: z.string().min(1, {
    message: "image is required",
  }),
});
const EditServerModal = () => {
  const {type,isOpen,onClose,data:{server}}=useModal();
  const isModalOpen=isOpen&&type==='editServer';
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const router = useRouter();
  const loading = form.formState.isSubmitting;
  const handleClose=()=>{
    form.reset();
    onClose()
  }
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    await axios.patch(`/api/servers/${server?.id}`, value);
    form.reset();
    router.refresh();
    handleClose();
  };
  React.useEffect(()=>{
    if(server){
      form.setValue('name',server.name);
      form.setValue('imageUrl',server.imageUrl);
    }

  },[server])
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"py-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Edit server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={"space-y-8 px-6"}>
              <div className={"flex items-center justify-center text-center"}>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint={"imageUploader"}
                          onChange={field.onChange}
                          value={field.value}
                        />
                        {/* <InputUploadThing<z.infer<typeof formSchema>>
                          buttonName={"change image"}
                          register={form.register}
                          setValue={form.setValue}
                          watch={form.watch}
                          id={"images"}
                        /> */}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/700"
                      }
                    >
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className={
                          "bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        }
                        placeholder={"Enter your server name"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name={"name"}
              />
            </div>
            <DialogFooter className={"bg-gray-100 px-6 py-4"}>
              <Button disabled={loading} variant={"primary"} type={"submit"}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
