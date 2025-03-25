import Link from "next/link";
import { Badge } from "../ui/badge";
import { isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { GrowCardPropsInterface } from "@/types/component";

const GrowCard = ({ type, title, status = "" }: GrowCardPropsInterface) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col space-y-3 p-5 border border-input rounded-md tablet:p-3",
        type === "plant" && "max-w-44"
      )}
    >
      <p className="text-sm tablet:text-xs">{title}</p>
      {!isEmpty(status) && (
        <Badge className="w-fit h-fit p-1.5 text-xs text-custom font-medium whitespace-nowrap bg-customforeground rounded-md">
          {status}
        </Badge>
      )}
    </div>
  );
};

export default GrowCard;
