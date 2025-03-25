"use client";

import { useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ImagePlus, LineChart, PlusCircle, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { CommunityToolbarPropsInterface } from "@/types/component";

const ChatToolbar = ({
  editor,
  message,
  setMessage,
  documents,
  setDocuments,
  handleImages,
  votes,
  setVotes,
  imgsCount,
  docsCount,
  voteAvailable,
}: CommunityToolbarPropsInterface) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [showPicker, setShowPicker] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const uploadDocument = () => {
    const docInput = docInputRef.current;
    if (docInput) docInputRef.current.click();
  };

  const uploadImage = () => {
    const imgInput = imageInputRef.current;
    if (imgInput) imageInputRef.current.click();
  };

  const handleEmoji = (emoji: any) => {
    setMessage(message + emoji.native);
    editor.commands.insertContent(emoji.native);
    setShowPicker(false);
  };

  const handleVote = () => {
    setVotes([...votes, { id: Date.now(), value: "" }]);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Input
                className="hidden"
                ref={docInputRef}
                type="file"
                onChange={(e) => {
                  setDocuments([
                    ...documents,
                    e.target.files && e.target.files[0],
                  ]);
                }}
              />
              <Button
                className="h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent"
                onClick={uploadDocument}
                disabled={docsCount >= 5}
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Document</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Input
                className="hidden"
                ref={imageInputRef}
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                onChange={handleImages}
              />
              <Button
                className="h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent"
                onClick={uploadImage}
                disabled={imgsCount >= 10}
              >
                <ImagePlus className="w-4 h-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Image</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                showPicker
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent"
              )}
              onClick={() => setShowPicker((prev) => !prev)}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          {showPicker && (
            <div className="absolute -bottom-[425px] z-50">
              <Picker
                locale="de"
                emojiSize={isMobile ? 16 : 20}
                emojiButtonSize={isMobile ? 24 : 32}
                previewPosition="none"
                data={data}
                onEmojiSelect={(emoij: any) => handleEmoji(emoij)}
              />
            </div>
          )}
          <TooltipContent>
            <p>Emoji</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("bold")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent"
              )}
              onClick={handleVote}
              disabled={!voteAvailable}
            >
              <LineChart className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vote</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ChatToolbar;
