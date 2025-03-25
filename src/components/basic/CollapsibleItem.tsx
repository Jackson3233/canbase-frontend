"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleItemProps {
  title: string;
  icon: React.ReactNode;
  route: string;
  children?: React.ReactNode;
  isMobile?: boolean;
  setIsToggle?: (value: React.SetStateAction<boolean>) => void;
}

const CollapsibleItem = ({
  title,
  icon,
  route,
  children,
  isMobile,
  setIsToggle,
}: CollapsibleItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div data-state={isOpen ? "open" : "closed"}>
      <div className="flex items-center justify-between">
        <Link
          href={route}
          className={cn(
            "flex items-center flex-1 px-2 py-1.5 text-sm transition-colors",
            "hover:bg-gray-100 rounded-[10px]",
            "cursor-pointer"
          )}
          onClick={() => isMobile && setIsToggle?.((prev) => !prev)}
        >
          <div className="flex-shrink-0 text-gray-500">{icon}</div>
          <div className="ml-2 flex-1">
            <div className="text-sm text-gray-900">{title}</div>
          </div>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded-md"
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-500 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </button>
      </div>
      {isOpen && (
        <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleItem;
