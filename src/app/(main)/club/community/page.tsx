"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Copy,
  Heart,
  LogOut,
  MessageCircle,
  MinusCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  ThumbsUp,
  Trash2,
  UserRound,
  Flag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { IFeed, feedActions } from "@/store/reducers/feedReducer";
import {
  createFeed,
  getFeeds,
  likesFeed,
  removeFeed,
  replyFeed,
  udpateFeed,
  voteFeed,
  reportFeed,
  reportFeedDetail,
} from "@/actions/feed";
import CommunityTiptap from "@/components/basic/CommunityTiptap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getAvatarLetters, getTimeDifferenceInGerman } from "@/lib/functions";
import { isEmpty } from "lodash";
import Loading from "@/components/basic/Loading";

interface ReportDetails {
  feedId: string;
  detailId: string;
}

const CommunityFeedPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { feed } = useAppSelector((state) => state.feed);

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState<Record<string, boolean>>({});

  const [message, setMessage] = useState("");
  const [images, setImages] = useState<any>([]);
  const [documents, setDocuments] = useState<any>([]);
  const [previewImages, setPreviewImages] = useState<any>([]);
  const [votes, setVotes] = useState<any>([]);

  const [replyMessage, setReplyMessage] = useState("");
  const [replyImages, setReplyImages] = useState<any>([]);
  const [replyDocuments, setReplyDocuments] = useState<any>([]);
  const [replyPreviewImages, setReplyPreviewImages] = useState<any>([]);

  const [updateMessage, setUpdateMessage] = useState("");
  const [existImages, setExistImages] = useState<any>([]);
  const [updateImages, setUpdateImages] = useState<any>([]);
  const [existDocuments, setExistDocuments] = useState<any>([]);
  const [updateDocuments, setUpdateDocuments] = useState<any>([]);
  const [updatePreviewImages, setUpdatePreviewImages] = useState<any>([]);
  const [updateVotes, setUpdateVotes] = useState<any>([]);

  const [tempEditData, setTempEditData] = useState<IFeed>();
  const [tempData, setTempData] = useState<IFeed>();

  useEffect(() => {
    (async () => {
      const result = await getFeeds();

      if (result.success) {
        dispatch(feedActions.setFeed({ feed: result.feed }));
        setLoading(true);
      }
    })();
  }, [dispatch, loading]);

  const handleImages = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setImages([...images, e.target.files && e.target.files[0]]);

      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreviewImages([
          ...previewImages,
          { name: file.name, src: reader.result },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplyImages = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setReplyImages([...replyImages, e.target.files && e.target.files[0]]);

      const reader: any = new FileReader();
      reader.onloadend = () => {
        setReplyPreviewImages([
          ...replyPreviewImages,
          { name: file.name, src: reader.result },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImages = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setUpdateImages([...updateMessage, e.target.files && e.target.files[0]]);

      const reader: any = new FileReader();
      reader.onloadend = () => {
        setUpdatePreviewImages([
          ...updatePreviewImages,
          { name: file.name, src: reader.result },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImg = (param: string) => {
    setImages(images.filter((item: any) => item.name !== param));
    setPreviewImages(previewImages.filter((item: any) => item.name !== param));
  };

  const handleReplyRemoveImg = (param: string) => {
    setReplyImages(replyImages.filter((item: any) => item.name !== param));
    setReplyPreviewImages(
      replyPreviewImages.filter((item: any) => item.name !== param)
    );
  };

  const handleExistRemoveImg = (param: string) => {
    setExistImages(existImages.filter((item: any) => item !== param));
  };

  const handleUpdateRemoveImg = (param: string) => {
    setUpdateImages(updateImages.filter((item: any) => item.name !== param));
    setUpdatePreviewImages(
      updatePreviewImages.filter((item: any) => item.name !== param)
    );
  };

  const handleRemoveDoc = (param: string) => {
    setDocuments(documents.filter((item: any) => item.name !== param));
  };

  const handleReplyRemoveDoc = (param: string) => {
    setReplyDocuments(
      replyDocuments.filter((item: any) => item.name !== param)
    );
  };

  const handleExistRemoveDoc = (param: string) => {
    setExistDocuments(
      existDocuments.filter((item: any) => item.source !== param)
    );
  };

  const handleUpdateRemoveDoc = (param: string) => {
    setUpdateDocuments(
      updateDocuments.filter((item: any) => item.name !== param)
    );
  };

  const handleVoteChange = (id: string, e: any) => {
    const newVote = votes.map((vote: any) =>
      vote.id === id ? { ...vote, value: e.target.value } : vote
    );

    setVotes(newVote);
  };

  const handleUpdateVoteChange = (id: string, e: any) => {
    const newVote = updateVotes.map((vote: any) =>
      vote.id === id ? { ...vote, value: e.target.value } : vote
    );

    setUpdateVotes(newVote);
  };

  const handleCollapsible = (param: string) => {
    setCommentsOpen((prevState) => ({
      ...prevState,
      [param]: !prevState[param],
    }));
  };

  const handleClipboard = async (param: string) => {
    await navigator.clipboard.writeText(param);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: "Link in die Zwischenablage kopiert.",
    });
  };

  const handleEditFeed = async (param: IFeed) => {
    setEditOpen(true);
    setTempEditData(param);

    setUpdateMessage(param.content as string);
    setExistImages(param.images);
    setExistDocuments(param.documents);
    setUpdateVotes(param.votes);
  };

  const handleReply = (param: IFeed) => {
    setReplyOpen(true);
    setTempData(param);
  };

  const handleRemoveFeed = async (param: string) => {
    const result = await removeFeed({ feedID: param });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(feedActions.setFeed({ feed: result.feed }));
    }
  };

  const handleLikesFeed = async (param: string) => {
    const result = await likesFeed({ feedID: param });

    if (result.success) {
      dispatch(
        feedActions.updateFeed({
          feedID: param,
          feed: result.feed,
        })
      );
    }
  };

  const handleVoteFeed = async (feedID: string, voteID: string) => {
    const result = await voteFeed({ feedID: feedID, voteID: voteID });

    if (result.success) {
      dispatch(
        feedActions.updateFeed({
          feedID: feedID,
          feed: result.feed,
        })
      );
    }
  };

  const onSend = async (param: string) => {
    const formData = new FormData();

    formData.append("content", param);
    formData.append("votes", JSON.stringify(votes));
    images.map((item: any) => formData.append("images", item));
    documents.map((item: any) => formData.append("documents", item));

    const result = await createFeed(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(feedActions.setFeed({ feed: result.feed }));

      setImages([]);
      setPreviewImages([]);
      setDocuments([]);
      setVotes([]);
    }
  };

  const onReply = async (param: string) => {
    const feedID = tempData?._id as string;

    const formData = new FormData();

    formData.append("content", param);
    formData.append("feedID", feedID);
    replyImages.map((item: any) => formData.append("images", item));
    replyDocuments.map((item: any) => formData.append("documents", item));

    const result = await replyFeed(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(
        feedActions.updateFeed({
          feedID: feedID,
          feed: result.feed,
        })
      );

      setReplyOpen(false);
      setTempData(undefined);
      setReplyImages([]);
      setReplyPreviewImages([]);
      setReplyDocuments([]);
    }
  };

  const onUpdate = async (param: string) => {
    const feedID = tempEditData?._id as string;

    const formData = new FormData();

    formData.append("content", param);
    formData.append("feedID", feedID);
    formData.append("votes", JSON.stringify(updateVotes));
    formData.append("existImgs", JSON.stringify(existImages));
    formData.append("existDocs", JSON.stringify(existDocuments));

    updateImages.map((item: any) => formData.append("images", item));
    updateDocuments.map((item: any) => formData.append("documents", item));

    const result = await udpateFeed(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    if (result.success) {
      dispatch(
        feedActions.updateFeed({
          feedID: feedID,
          feed: result.feed,
        })
      );

      setEditOpen(false);
      setTempEditData(undefined);
      setUpdateImages([]);
      setExistImages([]);
      setExistDocuments([]);
      setUpdatePreviewImages([]);
      setUpdateDocuments([]);
    }
  };

  const handleFeedReport = async (param: any) => {
    // if (param?.user._id !== user?._id) {
    if (!confirm("Are you sure you want to report this message?")) return;

    const result = await reportFeed({ feedID: param._id });
    if (result.success) {
      toast({
        title: "Success",
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });

      dispatch(feedActions.setFeed({ feed: result.feed }));
    }
    // }
  };

  const handleFeedDetailReport = async ({
    feedId,
    detailId,
  }: ReportDetails): Promise<void> => {
    if (!confirm("Are you sure you want to report this detail of feed?"))
      return;

    const result = await reportFeedDetail({
      feedID: feedId,
      detailID: detailId,
    });
    if (result.success) {
      toast({
        title: "Success",
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: result.msg,
      });

      dispatch(feedActions.setFeed({ feed: result.feed }));
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      {loading ? (
        !isEmpty(feed) || isEdit ? (
          <Card className="w-full p-10 tablet:p-7 mobile:p-5 my-8">
            <CardContent className="flex flex-col p-0">
              <div className="max-w-3xl w-full">
                <div className="flex flex-col space-y-3">
                  <CommunityTiptap
                    message={message}
                    setMessage={setMessage}
                    disabled={
                      user?.role !== "owner" &&
                      !user?.functions?.includes("club-community-feed-create")
                    }
                    documents={documents}
                    setDocuments={setDocuments}
                    handleImages={handleImages}
                    votes={votes}
                    setVotes={setVotes}
                    onSend={onSend}
                    imgsCount={images.length}
                    docsCount={documents.length}
                  />
                  {votes.length > 0 && (
                    <div className="flex flex-col space-y-3">
                      {votes.map((item: any, key: string) => {
                        return (
                          <div className="flex items-center space-x-3" key={key}>
                            <Input
                              className="max-w-md w-full"
                              type="text"
                              value={item.value}
                              placeholder={`Antwort ${key + 1}`}
                              onChange={(e) => handleVoteChange(item.id, e)}
                            />
                            <MinusCircle
                              className="text-custom cursor-pointer"
                              size={16}
                              onClick={() =>
                                setVotes(
                                  votes.filter((vote: any) => vote.id !== item.id)
                                )
                              }
                            />
                          </div>
                        );
                      })}
                      <p
                        className="w-fit text-custom text-sm cursor-pointer hover:text-customhover"
                        onClick={() =>
                          setVotes([...votes, { id: Date.now(), value: "" }])
                        }
                      >
                        Abstimmung hinzufügen
                      </p>
                    </div>
                  )}
                  {previewImages.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {previewImages.map((item: any, key: string) => {
                        return (
                          <div
                            className="relative w-44 h-32 mobile:w-full"
                            key={key}
                          >
                            <Image
                              className="object-cover rounded-xl"
                              src={item.src}
                              fill={true}
                              sizes="100%"
                              alt="preview"
                            />
                            <div
                              className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                              onClick={() => handleRemoveImg(item.name)}
                            >
                              <Trash2 className="text-destructive" size={16} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {documents.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {documents.map((item: any, key: string) => {
                        return (
                          <div
                            className="relative w-44 h-16 mobile:w-full"
                            key={key}
                          >
                            <div className="w-full h-full flex justify-center items-center space-x-3 px-3 bg-[#F7F7F7] rounded-xl">
                              <Image
                                src="/assets/images/document.png"
                                width={24}
                                height={40}
                                alt="document"
                              />
                              <p
                                className="overflow-hidden text-sm text-content break-all mobile:text-xs"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {item?.name}
                              </p>
                            </div>
                            <div
                              className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                              onClick={() => handleRemoveDoc(item?.name)}
                            >
                              <Trash2 className="text-destructive" size={16} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {feed.length > 0 && (
                  <div className="flex flex-col space-y-5 mt-10 tablet:space-y-3 tablet:mt-5">
                    {feed.map((item, key) => {
                      return (
                        <div
                          className={`flex flex-col space-y-1.5 ${
                            item.status === 2 ? "hidden" : ""
                          }`}
                          key={key}
                        >
                          <div className="flex space-x-5 tablet:space-x-3">
                            <div className="flex flex-col items-center space-y-1.5">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={
                                    (process.env
                                      .NEXT_PUBLIC_UPLOAD_URI as string) +
                                    item.user?.avatar
                                  }
                                  alt="avatar"
                                />
                                <AvatarFallback className="text-white bg-custom">
                                  {getAvatarLetters(item.user?.username)}
                                </AvatarFallback>
                              </Avatar>
                              {item.detail && item.detail.length > 0 && (
                                <div className="w-[1px] h-full bg-[#ECECEC]" />
                              )}
                            </div>
                            <div className="w-full flex flex-col space-y-4 tablet:space-y-2">
                              <div className="flex space-x-3 tablet:flex-col tablet:space-x-0">
                                <p className="font-bold">{item.user?.username}</p>
                                <div className="flex items-center space-x-2 mobile:space-x-1">
                                  <p className="text-sm text-content">
                                    {item.user?.alias
                                      ? item.user.alias
                                      : "@username"}
                                  </p>
                                  <div className="w-[3px] h-[3px] bg-content rounded-full" />
                                  <p className="text-xs text-content">
                                    {getTimeDifferenceInGerman(
                                      item.date as string
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div
                                className="text-sm mobile:text-xs"
                                dangerouslySetInnerHTML={{
                                  __html: item.content as string,
                                }}
                              />
                              {item.votes && item.votes?.length > 0 && (
                                <div className="max-w-lg w-full flex flex-col space-y-3">
                                  {item.votes.map((vote, key) => {
                                    return (
                                      <div
                                        className="overflow-hidden relative h-full flex items-center justify-between pl-10 pr-2 py-2 border rounded-md cursor-pointer tablet:pl-5 mobile:p-2"
                                        key={key}
                                        onClick={() =>
                                          handleVoteFeed(
                                            item._id as string,
                                            vote.id
                                          )
                                        }
                                      >
                                        <div
                                          className="absolute bg-custom h-full left-0"
                                          style={{
                                            width:
                                              item.votes &&
                                              vote.voters &&
                                              vote.voters.length > 0
                                                ? `${Math.trunc(
                                                    (vote.voters.length /
                                                      item.votes.reduce(
                                                        (total, vote) =>
                                                          vote.voters
                                                            ? total +
                                                              vote.voters.length
                                                            : total,
                                                        0
                                                      )) *
                                                      100
                                                  )}%`
                                                : 0,
                                          }}
                                        />
                                        <p className="text-sm z-10">
                                          {vote.value}
                                        </p>
                                        <p className="text-sm z-10">
                                          {item.votes &&
                                          vote.voters &&
                                          vote.voters.length > 0
                                            ? `${Math.trunc(
                                                (vote.voters.length /
                                                  item.votes.reduce(
                                                    (total, vote) =>
                                                      vote.voters
                                                        ? total +
                                                          vote.voters.length
                                                        : total,
                                                    0
                                                  )) *
                                                  100
                                              )}%`
                                            : "0%"}
                                        </p>
                                      </div>
                                    );
                                  })}
                                  <p className="text-xs text-content">
                                    {item.votes.reduce(
                                      (total, vote) =>
                                        vote.voters
                                          ? total + vote.voters.length
                                          : total,
                                      0
                                    )}
                                    {` Stimmen insgesamt`}
                                  </p>
                                </div>
                              )}
                              {item.images && item.images.length > 0 && (
                                <div className="flex flex-col space-y-3">
                                  {item.images.map((img, key) => {
                                    return (
                                      <div
                                        className="relative w-full h-32"
                                        key={key}
                                      >
                                        <Image
                                          className="object-cover border border-[#F7F7F7] rounded-xl"
                                          src={
                                            process.env.NEXT_PUBLIC_UPLOAD_URI +
                                            img
                                          }
                                          fill={true}
                                          sizes="100%"
                                          alt="post"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {item.documents && item.documents.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                  {item.documents.map((doc, key) => {
                                    return (
                                      <div
                                        className="relative w-44 h-16 mobile:w-full"
                                        key={key}
                                      >
                                        <div className="w-full h-full flex justify-center items-center space-x-3 px-3 bg-[#F7F7F7] rounded-xl">
                                          <Image
                                            src="/assets/images/document.png"
                                            width={24}
                                            height={40}
                                            alt="document"
                                          />
                                          <Link
                                            className="overflow-hidden text-sm text-content break-all mobile:text-xs hover:text-customhover"
                                            href={
                                              process.env.NEXT_PUBLIC_UPLOAD_URI +
                                              doc.source
                                            }
                                            target="_blank"
                                            style={{
                                              display: "-webkit-box",
                                              WebkitLineClamp: 1,
                                              WebkitBoxOrient: "vertical",
                                            }}
                                          >
                                            {doc.docname}
                                          </Link>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-5 tablet:space-x-3">
                                  <div className="flex items-center space-x-1">
                                    <Heart
                                      className="cursor-pointer hover:text-destructive"
                                      fill={
                                        item.likes &&
                                        item.likes.filter(
                                          (like) => like === user?._id
                                        ).length > 0
                                          ? "red"
                                          : "white"
                                      }
                                      strokeWidth={
                                        item.likes &&
                                        item.likes.filter(
                                          (like) => like === user?._id
                                        ).length > 0
                                          ? 0
                                          : 2
                                      }
                                      size={16}
                                      onClick={() =>
                                        handleLikesFeed(item._id as string)
                                      }
                                    />
                                    <p>{item.likes?.length}</p>
                                  </div>

                                  <MessageCircle
                                    className="cursor-pointer hover:text-custom"
                                    size={16}
                                    onClick={() => handleReply(item)}
                                  />
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className="w-56 text-sm"
                                    align="end"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => {
                                        handleClipboard(
                                          process.env.NEXT_PUBLIC_CLIENT_URI +
                                            "club/community"
                                        );
                                      }}
                                    >
                                      <div className="flex justify-between items-center">
                                        <Copy className="w-4 h-4 mr-2" />
                                        Link kopieren
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        handleEditFeed(item);
                                      }}
                                      disabled={
                                        user?.role !== "owner" &&
                                        !user?.functions?.includes(
                                          "club-community-feed-edit"
                                        )
                                      }
                                    >
                                      <div className="flex justify-between items-center">
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Bearbeiten
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {}}>
                                      <div className="flex justify-between items-center text-destructive">
                                        <Bell className="w-4 h-4 mr-2" />
                                        Beitrag melden
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRemoveFeed(item._id as string)
                                      }
                                      disabled={
                                        user?.role !== "owner" &&
                                        !user?.functions?.includes(
                                          "club-community-feed-delete"
                                        )
                                      }
                                    >
                                      <div className="flex justify-between items-center text-destructive">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Löschen
                                      </div>
                                    </DropdownMenuItem>
                                    {item.user?._id !== user?._id ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleFeedReport(item as string)
                                        }
                                      >
                                        <div className="flex justify-between items-center text-destructive">
                                          <Flag className="w-4 h-4 mr-2" />
                                          Report Community
                                        </div>
                                      </DropdownMenuItem>
                                    ) : (
                                      ""
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          {item.detail && item.detail.length > 0 && (
                            <div className="flex space-x-5 tablet:space-x-3">
                              <div className="w-10 flex justify-center">
                                <div className="w-8 h-8 flex justify-center items-center bg-[#EFEFEF] rounded-full">
                                  <UserRound className="text-content" size={16} />
                                </div>
                              </div>
                              <Collapsible
                                className="w-full flex flex-col space-y-5 tablet:space-y-3"
                                open={commentsOpen[item._id as string]}
                              >
                                <CollapsibleTrigger
                                  className="h-8 flex items-center cursor-pointer"
                                  asChild
                                  onClick={() =>
                                    handleCollapsible(item._id as string)
                                  }
                                >
                                  <p className="text-sm text-[#00A3FF] mobile:text-xs">
                                    {commentsOpen[item._id as string]
                                      ? `Kommentare ausblenden (${item.detail.length})`
                                      : `Zeige alle Kommentare (${item.detail.length})`}
                                  </p>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col space-y-3">
                                  {item.detail.map((deatil, key) => {
                                    return (
                                      <div
                                        className={`flex space-x-5 tablet:space-x-3 ${
                                          deatil.status === 2 ? "hidden" : ""
                                        }`}
                                        key={key}
                                      >
                                        <Avatar className="w-10 h-10">
                                          <AvatarImage
                                            src={
                                              (process.env
                                                .NEXT_PUBLIC_UPLOAD_URI as string) +
                                              deatil.user?.avatar
                                            }
                                            alt="avatar"
                                          />
                                          <AvatarFallback className="text-white bg-custom">
                                            {getAvatarLetters(
                                              deatil.user?.username
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="w-full flex flex-col space-y-3">
                                          <div className="flex space-x-3 tablet:flex-col tablet:space-x-0">
                                            <p className="font-bold">
                                              {deatil.user?.username}
                                            </p>
                                            <div className="flex items-center space-x-2 mobile:space-x-1">
                                              <p className="text-sm text-content">
                                                {deatil.user?.alias
                                                  ? deatil.user.alias
                                                  : "@username"}
                                              </p>
                                              <div className="w-[3px] h-[3px] bg-content rounded-full" />
                                              <p className="text-xs text-content">
                                                {getTimeDifferenceInGerman(
                                                  deatil.date as string
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className="text-sm mobile:text-xs"
                                            dangerouslySetInnerHTML={{
                                              __html: deatil.content as string,
                                            }}
                                          />
                                          {deatil.images &&
                                            deatil.images.length > 0 && (
                                              <div className="flex flex-col space-y-3">
                                                {deatil.images.map((img, key) => {
                                                  return (
                                                    <div
                                                      className="relative w-full h-32"
                                                      key={key}
                                                    >
                                                      <Image
                                                        className="object-cover border border-[#F7F7F7] rounded-xl"
                                                        src={
                                                          process.env
                                                            .NEXT_PUBLIC_UPLOAD_URI +
                                                          img
                                                        }
                                                        fill={true}
                                                        sizes="100%"
                                                        alt="post"
                                                      />
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            )}
                                          {deatil.documents &&
                                            deatil.documents.length > 0 && (
                                              <div className="flex flex-wrap gap-3">
                                                {deatil.documents.map(
                                                  (doc, key) => {
                                                    return (
                                                      <div
                                                        className="relative w-44 h-16 mobile:w-full"
                                                        key={key}
                                                      >
                                                        <div className="w-full h-full flex justify-center items-center space-x-3 px-3 bg-[#F7F7F7] rounded-xl">
                                                          <Image
                                                            src="/assets/images/document.png"
                                                            width={24}
                                                            height={40}
                                                            alt="document"
                                                          />
                                                          <Link
                                                            className="overflow-hidden text-sm text-content break-all mobile:text-xs hover:text-customhover"
                                                            href={
                                                              process.env
                                                                .NEXT_PUBLIC_UPLOAD_URI +
                                                              doc.source
                                                            }
                                                            target="_blank"
                                                            style={{
                                                              display:
                                                                "-webkit-box",
                                                              WebkitLineClamp: 1,
                                                              WebkitBoxOrient:
                                                                "vertical",
                                                            }}
                                                          >
                                                            {doc.docname}
                                                          </Link>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            )}
                                        </div>
                                        <div className="ml-auto">
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              handleFeedDetailReport({
                                                feedId: item?._id || "",
                                                detailId: deatil?._id || "",
                                              })
                                            }
                                          >
                                            <Flag className="h-4 w-4 text-red-600 focus:text-red-600" />
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
                      <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                        <h1 className="text-sm font-semibold px-8 py-6 border-b tablet:px-4 tablet:py-3">
                          Kommentar schreiben
                        </h1>
                        <div className="max-h-[700px] overflow-y-auto flex flex-col space-y-3 p-8 tablet:p-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex space-x-3">
                              <div className="flex flex-col items-center space-y-1">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={
                                      (process.env
                                        .NEXT_PUBLIC_UPLOAD_URI as string) +
                                      tempData?.user?.avatar
                                    }
                                    alt="avatar"
                                  />
                                  <AvatarFallback className="text-sm text-white bg-custom">
                                    {getAvatarLetters(tempData?.user?.username)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="w-[1px] h-full bg-[#ECECEC]" />
                              </div>
                              <div className="w-full flex flex-col space-y-2">
                                <div className="flex space-x-3 tablet:flex-col tablet:space-x-0">
                                  <p className="text-sm font-bold">
                                    {tempData?.user?.username}
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <p className="text-sm text-content">
                                      {tempData?.user?.alias
                                        ? tempData.user.alias
                                        : "@username"}
                                    </p>
                                    <div className="w-[3px] h-[3px] bg-content rounded-full" />
                                    <p className="text-xs text-content">
                                      {getTimeDifferenceInGerman(
                                        tempData?.date as string
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="overflow-hidden text-sm break-all mobile:text-xs"
                                  dangerouslySetInnerHTML={{
                                    __html: tempData?.content as string,
                                  }}
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 5,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                />
                                <div className="flex items-center space-x-1 py-5 text-sm">
                                  <p className="text-content">Antworten auf</p>
                                  <p className="text-[#00A3FF]">
                                    {tempData?.user?.alias
                                      ? tempData.user.alias
                                      : "@username"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 flex justify-center items-center bg-[#EFEFEF] rounded-full">
                                <UserRound className="text-content" size={16} />
                              </div>
                              <p className="text-sm text-content mobile:text-xs">
                                Schreib deinen Kommentar
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-3">
                            <CommunityTiptap
                              message={replyMessage}
                              setMessage={setReplyMessage}
                              documents={replyDocuments}
                              setDocuments={setReplyDocuments}
                              handleImages={handleReplyImages}
                              onSend={onReply}
                              imgsCount={replyImages.length}
                              docsCount={replyDocuments.length}
                              voteAvailable={false}
                            />
                            {replyPreviewImages.length > 0 && (
                              <div className="flex flex-wrap gap-3">
                                {replyPreviewImages.map(
                                  (item: any, key: string) => {
                                    return (
                                      <div
                                        className="relative w-36 h-24 mobile:w-full"
                                        key={key}
                                      >
                                        <Image
                                          className="object-cover rounded-xl"
                                          src={item.src}
                                          fill={true}
                                          sizes="100%"
                                          alt="preview"
                                        />
                                        <div
                                          className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                                          onClick={() =>
                                            handleReplyRemoveImg(item.name)
                                          }
                                        >
                                          <Trash2
                                            className="text-destructive"
                                            size={16}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                            {replyDocuments.length > 0 && (
                              <div className="flex flex-wrap gap-3">
                                {replyDocuments.map((item: any, key: string) => {
                                  return (
                                    <div
                                      className="relative w-36 h-14 mobile:w-full"
                                      key={key}
                                    >
                                      <div className="w-full h-full flex justify-center items-center space-x-3 px-3 bg-[#F7F7F7] rounded-xl">
                                        <Image
                                          src="/assets/images/document.png"
                                          width={24}
                                          height={40}
                                          alt="document"
                                        />
                                        <p
                                          className="overflow-hidden text-sm text-content break-all mobile:text-xs"
                                          style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: "vertical",
                                          }}
                                        >
                                          {item?.name}
                                        </p>
                                      </div>
                                      <div
                                        className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                                        onClick={() =>
                                          handleReplyRemoveDoc(item?.name)
                                        }
                                      >
                                        <Trash2
                                          className="text-destructive"
                                          size={16}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                      <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                        <h1 className="text-sm font-semibold px-8 py-6 border-b tablet:px-4 tablet:py-3">
                          Feed bearbeiten
                        </h1>
                        <div className="max-h-[700px] overflow-y-auto flex flex-col space-y-3 p-8 tablet:p-4">
                          <div className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={
                                  (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                                  tempEditData?.user?.avatar
                                }
                                alt="avatar"
                              />
                              <AvatarFallback className="text-sm text-white bg-custom">
                                {getAvatarLetters(tempEditData?.user?.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="w-full flex flex-col space-y-3">
                              <div className="flex space-x-3 tablet:flex-col tablet:space-x-0">
                                <p className="text-sm font-bold">
                                  {tempEditData?.user?.username}
                                </p>
                                <div className="flex items-center space-x-1">
                                  <p className="text-sm text-content">
                                    {tempEditData?.user?.alias
                                      ? tempEditData.user.alias
                                      : "@username"}
                                  </p>
                                  <div className="w-[3px] h-[3px] bg-content rounded-full" />
                                  <p className="text-xs text-content">
                                    {getTimeDifferenceInGerman(
                                      tempEditData?.date as string
                                    )}
                                  </p>
                                </div>
                              </div>
                              <CommunityTiptap
                                message={updateMessage}
                                setMessage={setUpdateMessage}
                                documents={updateDocuments}
                                setDocuments={setUpdateDocuments}
                                handleImages={handleUpdateImages}
                                votes={updateVotes}
                                setVotes={setUpdateVotes}
                                onSend={onUpdate}
                                imgsCount={
                                  updateImages.length + existImages.length
                                }
                                docsCount={
                                  updateDocuments.length + existDocuments.length
                                }
                              />
                              {updateVotes.length > 0 && (
                                <div className="flex flex-col space-y-3">
                                  {updateVotes.map((item: any, key: string) => {
                                    return (
                                      <div
                                        className="flex items-center space-x-3"
                                        key={key}
                                      >
                                        <Input
                                          className="max-w-md w-full"
                                          type="text"
                                          value={item.value}
                                          placeholder={`Antwort ${key + 1}`}
                                          onChange={(e) =>
                                            handleUpdateVoteChange(item.id, e)
                                          }
                                          disabled={
                                            item.voters && item.voters.length > 0
                                          }
                                        />
                                        {!(
                                          item.voters && item.voters.length > 0
                                        ) && (
                                          <MinusCircle
                                            className="text-custom cursor-pointer"
                                            size={16}
                                            onClick={() =>
                                              setUpdateVotes(
                                                updateVotes.filter(
                                                  (vote: any) =>
                                                    vote.id !== item.id
                                                )
                                              )
                                            }
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                  <p
                                    className="w-fit text-custom text-sm cursor-pointer hover:text-customhover"
                                    onClick={() =>
                                      setUpdateVotes([
                                        ...updateVotes,
                                        { id: Date.now(), value: "" },
                                      ])
                                    }
                                  >
                                    Abstimmung hinzufügen
                                  </p>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-3">
                                {existImages.length > 0 &&
                                  existImages.map((item: any, key: string) => {
                                    return (
                                      <div
                                        className="relative w-36 h-24 mobile:w-full"
                                        key={key}
                                      >
                                        <Image
                                          className="object-cover rounded-xl"
                                          src={
                                            (process.env
                                              .NEXT_PUBLIC_UPLOAD_URI as string) +
                                            item
                                          }
                                          fill={true}
                                          sizes="100%"
                                          alt="preview"
                                        />
                                        <div
                                          className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                                          onClick={() =>
                                            handleExistRemoveImg(item)
                                          }
                                        >
                                          <Trash2
                                            className="text-destructive"
                                            size={16}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                {updatePreviewImages.length > 0 &&
                                  updatePreviewImages.map(
                                    (item: any, key: string) => {
                                      return (
                                        <div
                                          className="relative w-36 h-24 mobile:w-full"
                                          key={key}
                                        >
                                          <Image
                                            className="object-cover rounded-xl"
                                            src={item.src}
                                            fill={true}
                                            sizes="100%"
                                            alt="preview"
                                          />
                                          <div
                                            className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                                            onClick={() =>
                                              handleUpdateRemoveImg(item.name)
                                            }
                                          >
                                            <Trash2
                                              className="text-destructive"
                                              size={16}
                                            />
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {existDocuments.map((item: any, key: string) => {
                                  return (
                                    <div
                                      className="relative w-36 h-14 mobile:w-full"
                                      key={key}
                                    >
                                      <div className="w-full h-full flex justify-center items-center space-x-3 px-3 bg-[#F7F7F7] rounded-xl">
                                        <Image
                                          src="/assets/images/document.png"
                                          width={24}
                                          height={40}
                                          alt="document"
                                        />
                                        <p
                                          className="overflow-hidden text-sm text-content break-all mobile:text-xs"
                                          style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: "vertical",
                                          }}
                                        >
                                          {item.docname}
                                        </p>
                                      </div>
                                      <div
                                        className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                                        onClick={() =>
                                          handleExistRemoveDoc(item.source)
                                        }
                                      >
                                        <Trash2
                                          className="text-destructive"
                                          size={16}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                                {updateDocuments.length > 0 &&
                                  updateDocuments.map(
                                    (item: any, key: string) => {
                                      return (
                                        <div
                                          className="relative w-36 h-14 mobile:w-full"
                                          key={key}
                                        >
                                          <div className="w-full h-full flex justify-center items-center space-x-3 px-3 bg-[#F7F7F7] rounded-xl">
                                            <Image
                                              src="/assets/images/document.png"
                                              width={24}
                                              height={40}
                                              alt="document"
                                            />
                                            <p
                                              className="overflow-hidden text-sm text-content break-all mobile:text-xs"
                                              style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: "vertical",
                                              }}
                                            >
                                              {item?.name}
                                            </p>
                                          </div>
                                          <div
                                            className="absolute -top-2 -right-2 p-1 rounded-full z-10 cursor-pointer hover:bg-content"
                                            onClick={() =>
                                              handleUpdateRemoveDoc(item?.name)
                                            }
                                          >
                                            <Trash2
                                              className="text-destructive"
                                              size={16}
                                            />
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full p-10 tablet:p-7 mobile:p-5 my-8">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="w-6 h-6 tablet:w-4 tablet:h-4" />
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Erstelle deinen ersten Beitrag
                </h1>
              </div>
              <p className="max-w-2xl w-full pt-2 text-sm text-content tablet:max-w-none mobile:text-xs">
                {`Verfasse Beiträge, um deine Mitglieder zu informieren, zu begeistern oder wertvolles Feedback einzuholen. Wichtiges kannst du als Ankündigung oben anpinnen.`}
              </p>
              <Button
                className="h-10 flex items-center space-x-2 px-4 mt-8 bg-custom mobile:w-full mobile:mt-4 hover:bg-customhover"
                onClick={() => setIsEdit(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Neuer Beitrag</span>
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default CommunityFeedPage;
