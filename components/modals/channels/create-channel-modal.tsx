"use client";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useModal} from "@/hooks/store/use-modal-store";
import {zodResolver} from "@hookform/resolvers/zod";
import {TypeChannel} from "@prisma/client";
import axios from "axios";
import {useRouter} from "next/navigation";
import qs from "query-string";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const formSchema = z.object({
  nameChannel: z
    .string()
    .min(1, {
      message: "Channel is required",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  typeChannel: z.nativeEnum(TypeChannel),
});
const CreateChannelModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const { channelType } = data;
  const isModalOpen = isOpen && type === "createChannel";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameChannel: "",
      typeChannel: channelType ?? TypeChannel.TEXT,
    },
  });
  const router = useRouter();
  const loading = form.formState.isSubmitting;
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const url = qs.stringifyUrl({
      url: `/api/channels`,
      query: {
        serverId: data?.server?.id,
      },
    });
    await axios.post(url, value);
    router.refresh();
    handleClose();
    form.reset();
  };
  useEffect(() => {
    if (channelType) form.setValue("typeChannel", channelType);
    else form.setValue("typeChannel", TypeChannel.TEXT);
  }, [channelType]);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"py-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={"space-y-8 px-6"}>
              <FormField
                name={"nameChannel"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/700"
                      }
                    >
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className={
                          "bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        }
                        placeholder={"Enter your channel name"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={"typeChannel"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/700"
                      }
                    >
                      Channel Type
                    </FormLabel>

                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            "bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                          }
                        >
                          <SelectValue placeholder={"Select a channel type"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TypeChannel).map((type) => (
                          <SelectItem
                            value={type}
                            key={type}
                            className={"capitalize"}
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className={"bg-gray-100 px-6 py-4"}>
              <Button disabled={loading} variant={"primary"} type={"submit"}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
