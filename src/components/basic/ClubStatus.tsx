"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Circle } from "lucide-react";
import { ClubStatusPropsInterface } from "@/types/component";

const ClubStatus = ({
  done,
  title,
  content,
  link,
}: ClubStatusPropsInterface) => {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-2">
      {done ? (
        <CheckCircle className="min-w-6 h-6 text-custom tablet:min-w-4 tablet:h-4" />
      ) : (
        <Circle className="min-w-6 h-6 text-custom tablet:min-w-4 tablet:h-4" />
      )}
      <div className="flex flex-col space-y-1">
        <p
          className="text-sm font-medium cursor-pointer hover:text-customhover"
          onClick={() => router.push(link)}
        >
          {title}
        </p>
        <p className="text-xs text-content">{content}</p>
      </div>
    </div>
  );
};

export default ClubStatus;
