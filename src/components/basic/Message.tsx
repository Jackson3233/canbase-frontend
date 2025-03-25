import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessagePropsInterface } from "@/types/component";

const Message = ({ user, text, time, type }: MessagePropsInterface) => {
  return (
    <div className="flex space-x-5 tablet:space-x-3">
      <div className="min-w-10 h-10 flex justify-center items-center rounded-full bg-[#EFEFEF]">
        <UserRound className="w-4 h-4" color="white" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <p className="font-semibold tablet:text-sm">{user}</p>
          <p className="text-sm tablet:text-xs">{time}</p>
        </div>
        <p
          className={cn(
            type === "user"
              ? "tablet:text-sm"
              : "text-content text-sm tablet:text-xs"
          )}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default Message;
