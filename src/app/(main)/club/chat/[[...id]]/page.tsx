"use client";

import { useEffect, useRef, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import {
  LogOut,
  MoreVertical,
  Pencil,
  Ellipsis,
  Flag,
  Lock,
  Reply,
  Forward,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { channelActions } from "@/store/reducers/channelReducer";
import { IChat, chatActions } from "@/store/reducers/chatReducer";
import { getChatData, setUserAllow, setUserDelete, addRemainedUser } from "@/actions/chat";
import ProfileInput from "@/components/basic/ProfileInput";
import ChatTiptap from "@/components/basic/ChatTiptap";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { PublicChannelFormSchema } from "@/constant/formschema";
import { getAvatarLetters, getTimeDifferenceInGerman } from "@/lib/functions";
import Socket from "@/lib/socket";
import { cn } from "@/lib/utils";

const ChannelPage = ({ params }: { params: { id: any } }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { members } = useAppSelector((state) => state.members);
  const { chat } = useAppSelector((state) => state.chat);

  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const chatBox = useRef<HTMLDivElement>(null);

  const [chatData, setChatData] = useState<IChat>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [message, setMessage] = useState("");

  const [hoveredKey, setHoveredKey] = useState<{
    key: number | null;
    userId: string | null;
  }>({ key: null, userId: null });

  const form = useForm<z.infer<typeof PublicChannelFormSchema>>({
    resolver: zodResolver(PublicChannelFormSchema),
    defaultValues: {
      channelname: "",
      channeldesc: "",
    },
  });

  useEffect(() => {
    if (params.id && user) {
      Socket.emit("joinChannel", {
        channeID: params.id[0],
      });

      Socket.on("updateChannel", async (data) => {
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

          await dispatch(
            chatActions.updateChat({
              channelID: params.id[0],
              chat: data.chatData,
            })
          );
        }
      });

      Socket.on("leaveChannel", async (data) => {
        data.userID === user?._id &&
          toast({
            className:
              "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
            description: data.msg,
          });

        await dispatch(
          channelActions.removeChannel({
            channelID: data.channelID,
          })
        );

        await dispatch(
          chatActions.removeChat({
            channelID: data.channelID,
          })
        );

        params.id[0] === data.channelID && router.push("/club/chat");
      });

      Socket.on(`${params.id[0]}_message`, async (data) => {
        await dispatch(
          chatActions.updateChat({
            channelID: params.id[0],
            chat: data.chatData,
          })
        );
      });

      return () => {
        Socket.off("updateChannel");
        Socket.off("leaveChannel");
        Socket.off(`${params.id[0]}_message`);
      };
    }
  }, [params.id, user, dispatch, router]);

  useEffect(() => {
    (async () => {
      if (params.id) {
        try {
          const result = await getChatData(params.id[0]);

          if (!result || !result.success) {
            router.push("/club/chat")
            return;
          }

          if (result?.success) {
            dispatch(
              chatActions.updateChat({
                channelID: params.id[0],
                chat: result?.chatData,
              })
            );
          }
        } catch (error) {
          // redirect("/404.tsx");
          console.error(error);
        }
      }
    })();
  }, [params.id, dispatch]);

  useEffect(() => {
    if (params.id) {
      const index = chat.findIndex((item) => item.channelID === params.id[0]);

      if (index !== -1) {
        setChatData(chat[index]);
      }
    }
  }, [params.id, chat]);

  useEffect(() => {
    const chatContainer = chatBox.current;

    if (chatContainer) {
      chatContainer.scrollTop =
        chatContainer.scrollHeight - chatContainer.clientHeight;
    }
  }, [chatData?.chat]);

  useEffect(() => {
    form.reset({
      channelname: chatData?.channelname,
      channeldesc: chatData?.channeldesc,
    });
  }, [form, chatData]);

  const onLeaveChannel = () => {
    params.id &&
      Socket.emit("leaveChannel", {
        userID: user?._id,
        channelID: params.id[0],
      });
  };

  const onSubmit = async (data: z.infer<typeof PublicChannelFormSchema>) => {
    setLoading(true);

    params.id &&
      Socket.emit("updateChannel", {
        userID: user?._id,
        channelID: params.id[0],
        ...data,
      });
  };

  const onSend = async (param: string) => {
    params.id &&
      Socket.emit("message", {
        userID: user?._id,
        channelID: params.id[0],
        message: param,
      });
  };

  const handleChatReport = async (chatId: string) => {
    if (!confirm("Are you sure you want to report this message?")) return;

    const idValues = {
      channelId: chatData?._id,
      chatId: chatId,
    };

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/chat/report`, {
        method: "POST",
        body: JSON.stringify(idValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          className:
            "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
          description: data.msg,
        });

        await dispatch(
          chatActions.updateChat({
            channelID: params.id[0],
            chat: data.chatData,
          })
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onUserAllow = async (userid: string, channelid: string) => {
    const result = await setUserAllow({ user_id: userid, channel_id: channelid });

    if (result?.success) {
      await dispatch(
        chatActions.updateChat({
          channelID: params.id[0],
          chat: result.chatData,
        })
      );
    }
  }

  const onUserDelete = async (userid: string, channelid: string) => { 
    const result = await setUserDelete({ user_id: userid, channel_id: channelid });

    if (result?.success) {
      await dispatch(
        chatActions.updateChat({
          channelID: params.id[0],
          chat: result.chatData,
        })
      );
    }
  }

  // let remainedUser: string[] = [];
  const [remainedUser, setRemainedUsers] = useState<string[]>([]);

  const onRemainedGetUser = (userid: string, e: boolean) => {
    if (e) {
      // If the checkbox is checked, add the user ID if it's not already in the array
      setRemainedUsers(prevUsers => {
        if (!prevUsers.includes(userid)) {
          return [...prevUsers, userid]; // Return a new array with the added user ID
        }
        return prevUsers; // Return the previous state if the user ID is already included
      });
    } else {
      // If the checkbox is unchecked, remove the user ID
      setRemainedUsers(prevUsers => prevUsers.filter(user => user !== userid));
    }
  };

  const onRemainedAddUser = async (param: string) => {
    setLoading(true)
    const result = await addRemainedUser({ users: remainedUser, channel_id: param });
    
    if (result?.success) {
      await dispatch(
        chatActions.updateChat({
          channelID: params.id[0],
          chat: result.chatData,
        })
      );
      setRemainedUsers([])
      setLoading(false)
    }
  }

  return (
    <Card
      className={cn(
        "w-full ml-3 mobile:m-0",
        pathname === "/club/chat" && "mobile:hidden"
      )}
    >
      <CardContent className="h-full flex flex-col p-0">
        <div className="min-h-[101px] flex flex-col p-5 border-b">
          <div className="flex justify-between items-center space-x-3">
            <h1 className="font-semibold">
              {chatData?.channelname}
            </h1>
            <div className="flex justify-center items-center space-x-2">
              <Dialog open={userDialog} onOpenChange={setUserDialog}>
                {chatData?.channeltype === "private" &&
                  <div className="flex justify-center items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg" onClick={() => setUserDialog(true)}>
                    <div className="w-6 h-6 bg-gray-50 rounded-full border"></div>
                    {chatData?.user?.map((e, index) => (
                      <div key={index} className="w-6 h-6 bg-gray-50 rounded-full border"></div>
                    ))}
                    <div className="ml-2">{(chatData?.user?.length ?? 0) + 1}</div>
                  </div>
                }
                <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                  <h1 className="flex items-center space-x-1 text-sm font-semibold px-10 mt-10 tablet:px-7 tablet:mt-7 mobile:px-5 mobile:mt-5">
                    <Lock className="w-3 h-3" /><span>{chatData?.channelname}</span>
                  </h1>
                  <div className="px-10 py-6 tablet:p-7 mobile:p-5 space-y-5" key="">
                    {members
                      .filter(f => f.status === "active" && f.role !== "owner" && f._id !== user?._id)
                      .map(item => {
                        if (!(chatData && chatData.user)) return null;
                          const isUserInChat = chatData.user.filter(chatUser=> chatUser.userid === item._id).length > 0
                        return isUserInChat ? (
                          <div className="flex items-center justify-between" key={item._id}>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                              <div>{item.username}</div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Switch id="airplane-mode" checked={chatData.user.find(e => e.userid === item._id)?.allow || false} onCheckedChange={(e) => onUserAllow(item._id ?? "", chatData.channelID ?? "")} />
                                <div className="px-2 py-1 border hover:bg-gray-100 rounded-lg cursor-pointer">
                                  <Trash2 className="w-4 h-4" onClick={()=> onUserDelete(item._id ?? "", chatData.channelID ?? "")}/>
                                </div>
                            </div>
                          </div>
                        ) : null;
                      })}
                  </div>

                  <div className="px-10 mt-2">Mitglieder hinzufügen</div>
                  <div className="py-5 tablet:p-7 mobile:p-5">
                    {members
                      .filter(f => f.status === "active" && f.role !== "owner" && f._id !== user?._id)
                      .filter(item => {
                        if (!(chatData && chatData.user)) return true; // If chatData is not available, include the item
                        return !chatData.user.some(chatUser => chatUser.userid === item._id); // Check if the user does not exist in chatData.user
                      })
                      .map(item => (
                        <div className="flex items-center justify-between py-2 px-10 group has-[:checked]:bg-customforeground hover:bg-customforeground cursor-pointer" key={item._id}>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                            <div className="group-hover:text-custom">{item.username}</div>
                          </div>
                          <Checkbox onCheckedChange={e => onRemainedGetUser(item._id ?? "", e as boolean)} />
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-end space-x-3 px-10 py-6 tablet:p-7 mobile:p-5">
                    <Button className="h-10 px-4 mobile:px-2" disabled={remainedUser.length === 0}>
                      {loading ? (
                        <ClipLoader
                          aria-label="loader"
                          data-testid="loader"
                          color="white"
                          size={16}
                        />
                      ) : (
                        <span className="text-sm" onClick={() => onRemainedAddUser(chatData?.channelID ?? "")}>{remainedUser.length === 0 ? "Keine Mitglieder hinzufügen" : remainedUser.length + " Mitglieder hinzufügen"}</span>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={open} onOpenChange={setOpen}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={params.id === undefined}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 text-sm" align="end">
                    <DropdownMenuItem
                      onClick={() => setOpen(true)}
                      disabled={
                        user?.role !== "owner" &&
                        !user?.functions?.includes("club-chat-edit-channel")
                      }
                    >
                      <div className="flex justify-between items-center">
                        <Pencil className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onLeaveChannel}
                      disabled={
                        user?.role !== "owner" &&
                        !user?.functions?.includes("club-chat-delete-channel") &&
                        chatData?.owner?._id !== user?._id
                      }
                    >
                      <div className="flex justify-between items-center text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Chat verlassen
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                  <h1 className="text-sm font-semibold px-10 mt-10 tablet:px-7 tablet:mt-7 mobile:px-5 mobile:mt-5">
                    #{chatData?.channelname}
                  </h1>
                  <div className="p-10 tablet:p-7 mobile:p-5">
                    <Form {...form}>
                      <form
                        className="w-full flex flex-col"
                        onSubmit={form.handleSubmit(onSubmit)}
                      >
                        <div className="space-y-5">
                          <div className="flex flex-col space-y-3">
                            <p className="text-sm tablet:text-xs">Name *</p>
                            <ProfileInput
                              form={form.control}
                              flag="other"
                              id="channelname"
                              placeholder="z.B Allgemein"
                            />
                          </div>
                          <div className="flex flex-col space-y-3">
                            <p className="text-sm tablet:text-xs">Beschreibung</p>
                            <ProfileInput
                              form={form.control}
                              flag="other"
                              type="textarea"
                              id="channeldesc"
                              placeholder="Beschreibung des Chats"
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
                          <Button className="h-10 px-4 mobile:px-2" type="submit">
                            {loading ? (
                              <ClipLoader
                                aria-label="loader"
                                data-testid="loader"
                                color="white"
                                size={16}
                              />
                            ) : (
                              <span className="text-sm">Speichern</span>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-sm leading-7">{chatData?.channeldesc}</p>
        </div>
        <div
          className="flex flex-col justify-end p-5"
          style={{ height: "calc(100% - 101px)" }}
        >
          <div ref={chatBox} className="overflow-y-auto">
            {chatData?.chat?.map((item, index) => {
              return (
                <div
                  className={`flex p-2 hover:bg-gray-100 ${
                    item.type == 3 ? "hidden" : ""
                  }`}
                  key={index}
                  onMouseEnter={() => {
                    setHoveredKey({ key: index, userId: item.user._id });
                  }}
                  onMouseLeave={() => {
                    setHoveredKey({ key: -1, userId: "" });
                  }}
                >
                  <Avatar className="w-[44px] h-[44px] mr-2">
                    <AvatarImage
                      src={
                        (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                        item.user.avatar
                      }
                      alt="avatar"
                    />
                    <AvatarFallback className="text-white bg-custom">
                      {getAvatarLetters(item.user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-between ml-3 mobile:ml-1">
                    <div className="flex items-center space-x-2">
                      <h1 className="font-semibold leading-7 tablet:text-sm">
                        {item.user.username}
                      </h1>
                      <p className="text-xs">
                        {getTimeDifferenceInGerman(item.date)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        item.type === 1
                          ? "text-sm leading-7"
                          : "text-sm leading-7 text-[#7F7F88]"
                      )}
                      dangerouslySetInnerHTML={{ __html: item.chat }}
                    />
                  </div>
                  <div
                    className={`ml-auto ${
                      hoveredKey.key === index
                        ? hoveredKey.userId === user?._id || item.type === 2
                          ? "hidden"
                          : "block"
                        : "hidden"
                    }`}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleChatReport(item?._id ?? "")}
                    >
                      <Flag className="h-4 w-4 mr-2 text-red-600 focus:text-red-600" />
                    </Button>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Ellipsis
                            size={20}
                            className="cursor-pointer hover:text-customhover"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>

                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Flag className="h-4 w-4 mr-2" />
                            Report Message
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </div>
              );
            })}
          </div>
          <ChatTiptap
            message={message}
            disabled={params.id === undefined}
            setMessage={setMessage}
            onSend={onSend}
          />
        </div>
      </CardContent>
      </Card>
  );
};

export default ChannelPage;
