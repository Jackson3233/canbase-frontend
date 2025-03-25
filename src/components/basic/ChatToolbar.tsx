"use client";

import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
  Smile,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { ChatToolbarPropsInterface } from "@/types/component";

const ChatToolbar = ({
  editor,
  message,
  setMessage,
  disabled,
}: ChatToolbarPropsInterface) => {
  const [showPicker, setShowPicker] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!editor) {
    return null;
  }

  const handleEmoji = (emoji: any) => {
    setMessage(message + emoji.native);
    editor.commands.insertContent(emoji.native);
    setShowPicker(false);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center space-x-3 p-1.5 mobile:justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("bold")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBold().run();
              }}
            >
              <Bold className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("italic")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
              }}
            >
              <Italic className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("underline")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleUnderline().run();
              }}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("strike")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleStrike().run();
              }}
            >
              <Strikethrough className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("bulletList")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBulletList().run();
              }}
            >
              <List className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("orderedList")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleOrderedList().run();
              }}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ordered List</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("blockquote")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBlockquote().run();
              }}
            >
              <Quote className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Blockquote</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("code")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setCode().run();
              }}
            >
              <Code className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Code</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("undo")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().undo().run();
              }}
            >
              <Undo className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                editor.isActive("redo")
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().redo().run();
              }}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                showPicker
                  ? "h-auto p-1 text-sm text-white bg-custom shadow-none rounded-sm hover:bg-custom"
                  : "h-auto p-1 text-sm text-custom bg-transparent shadow-none hover:bg-transparent",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              onClick={() => setShowPicker((prev) => !prev)}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          {showPicker && (
            <div className="absolute right-0 bottom-24 z-50">
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
      </div>
    </TooltipProvider>
  );
};

export default ChatToolbar;
