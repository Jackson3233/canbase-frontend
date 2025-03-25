"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarItemPropsInterface } from "@/types/component";

const SidebarItem = ({
  route,
  children,
  comingsoon = false,
  isMobile,
  setIsToggle,
}: SidebarItemPropsInterface) => {
  const pathname = usePathname();
  const isActive = route === pathname;

  return (
    <Link
      data-navigable-list-item-active={isActive}
      tabIndex={isActive ? 0 : -1}
      data-attio-item-state={isActive ? "active" : "inactive"}
      data-state="closed"
      className={cn(
        "flex items-center w-full px-2 py-1.5 text-sm transition-colors",
        "hover:bg-gray-100 rounded-[10px]",
        isActive ? "bg-gray-200 rounded-[10px]" : "",
        comingsoon ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      href={route}
      onClick={() => isMobile && setIsToggle?.((prev) => !prev)}
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-gray-500">
        {children && children[0]}
      </div>
      
      {/* Text */}
      <div className="ml-2 flex-1 truncate">
        <div 
          className="text-sm truncate text-gray-900"
          data-truncate="true"
          data-numeric="false"
          data-uppercase="false"
        >
          {children && children[1]}
        </div>
      </div>

      {/* Coming Soon Badge */}
      {comingsoon && (
        <span className="ml-2 px-1.5 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
          Kommt bald
        </span>
      )}
    </Link>
  );
};

export default SidebarItem;
