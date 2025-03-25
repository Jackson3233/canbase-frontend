"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Lock, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { channelActions } from "@/store/reducers/channelReducer";
import { getAllChannels } from "@/actions/chat";
import ProfileInput from "@/components/basic/ProfileInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PublicChannelFormSchema,
  PrivateChannelFormSchema,
} from "@/constant/formschema";
import Socket from "@/lib/socket";
import { cn } from "@/lib/utils";
import Loading from "@/components/basic/Loading";

const ChatLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { channel } = useAppSelector((state) => state.channel);
  const { members } = useAppSelector((state) => state.members);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [channeltype, setChannelType] = useState("public");

  const publicForm = useForm<z.infer<typeof PublicChannelFormSchema>>({
    resolver: zodResolver(PublicChannelFormSchema),
    defaultValues: {
      channelname: "",
      channeldesc: "",
    },
  });
  const privateForm = useForm<z.infer<typeof PrivateChannelFormSchema>>({
    resolver: zodResolver(PrivateChannelFormSchema),
    defaultValues: {
      channelname: "",
      channeldesc: "",
      user: [],
    },
  });

  useEffect(() => {
    if (user) {
      Socket.on("createChannel", async (data) => {
        data.userID === user?._id &&
          toast({
            className:
              "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
            description: data.msg,
          });

        data.userID === user?._id && setLoading(false);

        if (data.success) {
          data.userID === user?._id && setOpen(false);

          await dispatch(channelActions.setChannel({ channel: data.channel }));

          data.userID === user?._id &&
            router.push("/club/chat/" + data.channelID);
        }
      });
    }

    return () => {
      Socket.off("createChannel");
    };
  }, [user, dispatch, router]);

  useEffect(() => {
    (async () => {
      const result = await getAllChannels();

      if (result.success) {
        setLoading(true);
        dispatch(channelActions.setChannel({ channel: result.channel }));
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      publicForm.reset({ channelname: "", channeldesc: "" });
      privateForm.reset({
        channelname: "",
        channeldesc: "",
        user: [],
      });

      if (user?.functions && !user?.functions.includes("club-chat-create-channel")) {
        setChannelType("private");
      }
      else {
        setChannelType("public");
      }
      setMemberOpen(false);
    }
  }, [open, publicForm, privateForm]);

  const onPublicSubmit = async (
    data: z.infer<typeof PublicChannelFormSchema>
  ) => {
    setLoading(true);

    Socket.emit("createPublicChannel", {
      userID: user?._id,
      ...data,
    });
  };

  const onPrivateSubmit = async (
    data: z.infer<typeof PrivateChannelFormSchema>
  ) => {
    setLoading(true);

    Socket.emit("createPrivateChannel", {
      userID: user?._id,
      ...data,
    });
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      {loading ? 
        <div
          className="w-full flex flex-row my-8"
          style={{ height: "calc(100vh - 104px)" }}
        >
          <Card
            className={cn(
              "max-w-[300px] w-full p-5 mobile:max-w-none",
              pathname.includes("/club/chat/") && "mobile:hidden"
            )}
          >
            <CardContent className="h-full p-0">
              <Dialog open={open} onOpenChange={setOpen}>
                <div className="flex justify-between items-center mb-5">
                  <h1 className="font-semibold">Chats</h1>
                  <Plus
                    className="w-4 h-4 cursor-pointer hover:text-customhover"
                    onClick={() => {
                      if (
                        user?.role === "owner" ||
                        user?.functions?.includes("club-chat-create-channel") ||
                        user?.functions?.includes("club-chat-create-private-channel")
                      ) {
                        setOpen(true);
                      } else {
                        toast({
                          className:
                            "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
                          description:
                            "Nur Besitzer können Chat-Kanäle erstellen.",
                        });
                      }
                    }}
                  />
                </div>
                <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                  <h1 className="text-sm font-semibold p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                    Chat erstellen
                  </h1>
                  <div className="max-h-[700px] overflow-y-auto p-10 tablet:p-7 mobile:p-5">
                    {channeltype === "public" && (
                      <Form {...publicForm}>
                        <form
                          className="w-full flex flex-col"
                          onSubmit={publicForm.handleSubmit(onPublicSubmit)}
                        >
                          <div className="space-y-5">
                            <div className="flex space-x-3">
                              <p className="max-w-28 w-full font-semibold text-sm tablet:text-xs">
                                Name *
                              </p>
                              <ProfileInput
                                form={publicForm.control}
                                flag="other"
                                id="channelname"
                                placeholder="z.B Allgemein"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <p className="max-w-28 w-full font-semibold text-sm tablet:text-xs">
                                Beschreibung
                              </p>
                              <ProfileInput
                                form={publicForm.control}
                                flag="other"
                                type="textarea"
                                id="channeldesc"
                                placeholder="Beschreibung des Chats"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <div className="max-w-28 w-full">
                                <p className="text-sm font-semibold tablet:text-xs">
                                  Neuer Status
                                </p>
                                <p className="text-xs">
                                  Das Mitglied wird über die Änderung per E-Mail
                                  oder Push-Nachricht informiert.
                                </p>
                              </div>
                              <RadioGroup
                                className="w-full flex flex-col space-y-1 gap-0"
                                defaultValue={channeltype}
                                onValueChange={(e) => setChannelType(e)}
                              >
                                {(user?.role === "owner" || user?.functions?.includes("club-chat-create-channel")) && (
                                  <Label className="w-full group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer" htmlFor="public">
                                    <RadioGroupItem value="public" id="public" />
                                    <div className="flex flex-col">
                                      <p className="text-sm font-medium">
                                        Öffentlich
                                      </p>
                                      <p className="text-xs text-content group-hover:text-custom">
                                        Jeder kann den Chat sehen und <br />
                                        beitreten.
                                      </p>
                                    </div>
                                  </Label>
                                )}
                                  { (user?.role === "owner" || user?.functions?.includes("club-chat-create-private-channel")) && (
                                    <Label className="w-full group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer" htmlFor="private">
                                    <RadioGroupItem value="private" id="private" />
                                    <div className="flex flex-col">
                                      <p className="text-sm font-medium">Privat</p>
                                      <p className="text-xs text-content group-hover:text-custom">
                                        Mitglieder müssen von einem anderen <br />
                                        Mitglied eingeladen werden.
                                      </p>
                                    </div>
                                  </Label>
                                )}
                              </RadioGroup>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 mt-14 tablet:mt-7 mobile:flex-col mobile:space-x-0 mobile:space-y-3 mobile:mt-5">
                            <Button
                              className="h-10 px-4 text-sm mobile:px-2"
                              type="button"
                              variant="outline"
                              onClick={() => setOpen(false)}
                            >
                              Abbrechen
                            </Button>
                            <Button
                              className="h-10 px-4 mobile:px-2"
                              type="submit"
                              disabled={
                                loading ||
                                (channeltype === "public" 
                                  ? !publicForm.watch("channelname")?.trim() 
                                  : (() => {
                                      const channelname = privateForm.watch("channelname")?.trim();
                                      const user = privateForm.watch("user");
                                      console.log('Debug - Private Form:', { channelname, user });
                                      return !channelname || !user;
                                    })())
                              }                       >
                              {loading ? (
                                <ClipLoader
                                  aria-label="loader"
                                  data-testid="loader"
                                  color="white"
                                  size={16}
                                />
                              ) : (
                                <span className="text-sm">Channel erstellen</span>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                    {channeltype === "private" && (
                      <Form {...privateForm}>
                        <form
                          className="w-full flex flex-col"
                          onSubmit={privateForm.handleSubmit(onPrivateSubmit)}
                        >
                          <div className="space-y-5">
                            <div className="flex space-x-3">
                              <p className="max-w-28 w-full font-semibold text-sm tablet:text-xs">
                                Name *
                              </p>
                              <ProfileInput
                                form={privateForm.control}
                                flag="other"
                                id="channelname"
                                placeholder="z.B Allgemein"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <p className="max-w-28 w-full font-semibold text-sm tablet:text-xs">
                                Beschreibung
                              </p>
                              <ProfileInput
                                form={privateForm.control}
                                flag="other"
                                type="textarea"
                                id="channeldesc"
                                placeholder="Beschreibung des Chats"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <div className="max-w-28 w-full">
                                <p className="text-sm font-semibold tablet:text-xs">
                                  Neuer Status
                                </p>
                                <p className="text-xs">
                                  Das Mitglied wird über die Änderung per E-Mail
                                  oder Push-Nachricht informiert.
                                </p>
                              </div>
                              <RadioGroup
                                className="w-full flex flex-col space-y-1 gap-0"
                                defaultValue={channeltype}
                                onValueChange={(e) => setChannelType(e)}
                              >
                                { (user?.role === "owner" || user?.functions?.includes("club-chat-create-channel")) && (
                                <Label className="w-full group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer" htmlFor="public">
                                    <RadioGroupItem value="public" id="public" />
                                    <div className="flex flex-col">
                                      <p className="text-sm font-medium">
                                        Öffentlich
                                      </p>
                                      <p className="text-xs text-content group-hover:text-custom">
                                        Jeder kann den Chat sehen und <br />
                                        beitreten.
                                      </p>
                                    </div>
                                  </Label>
                                )}
                                { (user?.role === "owner" || user?.functions?.includes("club-chat-create-private-channel")) && (
                                  <Label className="w-full group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer" htmlFor="private">
                                  <RadioGroupItem value="private" id="private" />
                                  <div className="flex flex-col">
                                    <p className="text-sm font-medium">Privat</p>
                                      <p className="text-xs text-content group-hover:text-custom">
                                        Mitglieder müssen von einem anderen <br />
                                        Mitglied eingeladen werden.
                                      </p>
                                    </div>
                                  </Label>
                                )}
                              </RadioGroup>
                            </div>
                            <div className="flex space-x-3">
                              <p className="max-w-28 w-full text-sm font-semibold tablet:text-xs">
                                Mitglieder
                              </p>
                              <FormField
                                control={privateForm.control}
                                name="user"
                                render={() => (
                                  <FormItem className="w-full">
                                    <Command>
                                      <CommandInput placeholder="Suche nach einem Mitglied" />
                                      <CommandEmpty className="text-sm px-3 py-1.5">
                                        Keine Mitglied gefunden.
                                      </CommandEmpty>
                                      <CommandList>
                                        <CommandGroup>
                                          {members
                                            .filter(
                                              (f) =>
                                                f.status === "active" &&
                                                f.role !== "owner" &&
                                                f._id !== user?._id
                                            )
                                            .map((item) => ({
                                              id: item._id,
                                              label: item.username,
                                            }))
                                            .map((item) => (
                                              <FormField
                                                key={item.id}
                                                control={privateForm.control}
                                                name="user"
                                                render={({
                                                  field: { value, onChange },
                                                }) => {
                                                  return (
                                                    <CommandItem
                                                      onSelect={() => {
                                                        onChange(selectedUsers);
                                                      }}
                                                    >
                                                      <FormItem
                                                        key={item.id}
                                                        className="flex w-full items-center space-x-3 space-y-0 justify-between py-1 px-3 group has-[:checked]:bg-customforeground hover:bg-customforeground rounded-md"
                                                      >
                                                        <FormLabel className="flex items-center space-x-3 w-full cursor-pointer">
                                                          <FormLabel className="w-8 h-8 bg-gray-100 rounded-full"></FormLabel>
                                                          <FormLabel className="text-sm font-normal group-hover:text-custom cursor-pointer">
                                                            {item.label}
                                                          </FormLabel>
                                                        </FormLabel>
                                                        <FormControl>
                                                          <Checkbox
                                                            checked={selectedUsers.includes(
                                                              item.id ?? ""
                                                            )}
                                                            onCheckedChange={(
                                                              checked
                                                            ) => {
                                                              if (checked) {
                                                                setSelectedUsers(
                                                                  (prevState) => {
                                                                    return [
                                                                      ...prevState,
                                                                      item.id ??
                                                                        "",
                                                                    ];
                                                                  }
                                                                );
                                                              } else
                                                                [
                                                                  setSelectedUsers(
                                                                    (
                                                                      prevState
                                                                    ) => {
                                                                      return [
                                                                        ...prevState.filter(
                                                                          (i) =>
                                                                            i !==
                                                                            item.id
                                                                        ),
                                                                      ];
                                                                    }
                                                                  ),
                                                                ];
                                                            }}
                                                          />
                                                        </FormControl>
                                                      </FormItem>
                                                    </CommandItem>
                                                  );
                                                }}
                                              />
                                            ))}
                                          <FormMessage />
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 mt-14 tablet:mt-7 mobile:flex-col mobile:space-x-0 mobile:space-y-3 mobile:mt-5">
                            <Button
                              className="h-10 px-4 text-sm mobile:px-2"
                              type="button"
                              variant="outline"
                              onClick={() => setOpen(false)}
                            >
                              Abbrechen
                            </Button>
                            <Button
                              className="h-10 px-4 mobile:px-2"
                              type="submit"
                              disabled={
                                loading ||
                                ((channeltype as string) === "public"
                                ? !publicForm.watch("channelname")?.trim() 
                                  : (() => {
                                      const channelname = privateForm.watch("channelname")?.trim();
                                      const user = privateForm.watch("user");
                                      console.log('Debug - Private Form:', { channelname, user });
                                      return !channelname || !user;
                                    })())
                              }>
                              {loading ? (
                                <ClipLoader
                                  aria-label="loader"
                                  data-testid="loader"
                                  color="white"
                                  size={16}
                                />
                              ) : (
                                <span className="text-sm">Channel erstellen</span>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex flex-col space-y-2 overflow-y-auto">
                {channel
                  ?.filter(
                    (f) =>
                      f.channeltype === "public" ||
                      (f.channeltype === "private" &&
                        (f.user?.some(u => u.userid === user?._id) || f.owner?._id === user?._id))
                  )
                  .map((item, key) => {
                    return (
                      <Link
                        className={cn(
                          "flex px-3 py-2 text-sm font-medium leading-5 rounded-md hover:text-custom hover:bg-customforeground",
                          "/club/chat/" + item.channelID === pathname &&
                            "text-custom bg-customforeground"
                        )}
                        key={key}
                        href={"/club/chat/" + item.channelID}
                      >
                        {item.channeltype === "public" ? (
                          <span>
                            {`# `}
                            {item.channelname}
                          </span>
                        ) : (
                          <p className="flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>
                              {item.user === user?._id
                                ? item.owner?.username
                                : item.channelname}
                            </span>
                          </p>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
          {children}
        </div> : <Loading />
      }
    </div>
  );
};

export default ChatLayout;
