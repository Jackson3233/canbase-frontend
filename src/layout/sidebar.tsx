"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Code2,
  Search,
  Server,
  Settings,
  Ticket,
  LogOut,
  UserRound,
  Users,
  User,
  LayoutGrid,
  GraduationCap,
  Factory,
  MessageCircleMore,
  Newspaper,
  Landmark,
  Sprout,
  History,
  Map,
  Package,
  MousePointerClick,
  ShoppingCart,
  X,
  Home,
  Command,
} from "lucide-react";
import { useAppSelector } from "@/store/hook";
import SidebarItem from "@/components/basic/SidebarItem";
import CollapsibleItem from "@/components/basic/CollapsibleItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarLetters } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { SidebarPropsInterface } from "@/types/layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCommandDialog } from "@/components/providers/command-dialog-provider";
import "@/styles/quickactions.css";

const SideBar = ({
  isMobile,
  isToggle,
  setIsToggle,
  setOpenFeedback,
  setOpenUpdates,
}: SidebarPropsInterface) => {
  const { user } = useAppSelector((state) => state.user);
  const { club } = useAppSelector((state) => state.club);

  const router = useRouter();
  const [isClubMember, setIsClubMember] = useState(false);

  useEffect(() => {
    if (user?.status !== "active") {
      setIsClubMember(false);
    } else {
      setIsClubMember(true);
    }
  }, [user]);

  const handleLogOut = () => {
    localStorage.removeItem("token");

    router.replace("/login");
  };

  const { setOpen } = useCommandDialog();

  return (
    <>
      <div
        className={cn(
          "fixed w-[275px] h-screen flex flex-col bg-gray-50 border-r border-gray-100 z-[3000]",
          !isToggle && "tablet:hidden"
        )}
      >
        {/* Header Section */}
        <DropdownMenu>
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                  {club?.avatar ? (
                    <Image
                      src={process.env.NEXT_PUBLIC_UPLOAD_URI + club.avatar}
                      alt="Club Logo"
                      width={24}
                      height={24}
                      className="rounded-lg"
                    />
                  ) : (
                    <Home className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{club?.clubname || "Club"}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <button
              onClick={() => setIsToggle((prev) => !prev)}
              className="mobile:block hidden"
            >
              <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <DropdownMenuContent 
            className="w-[280px] rounded-lg border border-gray-100 bg-white p-1 shadow-lg z-[5000] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" 
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <div role="group" className="mb-1">
              <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-sm font-medium">
                  {club?.clubname?.[0]}
                </div>
                <div className="flex-1 text-sm">{club?.clubname}</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <UserRound className="w-3.5 h-3.5 text-gray-500" />
              <span className="flex-1 text-sm">Mein Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push("/club/profile")}
            >
              <Settings className="w-3.5 h-3.5 text-gray-500" />
              <span className="flex-1 text-sm">Einstellungen</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer text-red-500"
              onClick={handleLogOut}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="flex-1 text-sm">Ausloggen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Actions */}
        <div className="p-2">
          <div className="sc-djlGpv bEpYbV">
            <button
              data-full-width="true"
              className="sc-iWxYvc sc-gyceGJ hzwDMM cXDbXU"
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center">
                <Command className="w-3.5 h-3.5 text-gray-700 mr-2" />
                <div className="sc-gLLuof evGDWe sc-qZrbh dKrMQx" data-truncate="true" data-numeric="false" data-uppercase="false" style={{ color: "rgb(35, 37, 41)" }}>Schnellaktion</div>
              </div>
              <div className="sc-fZfMHt fKHVrg">
                <kbd data-size="20" data-multi="true" data-variant="default" className="sc-bCvmQg kGZyNY">⌘K</kbd>
              </div>
            </button>
            <button className="sc-iWxYvc hzwDMM">
              <Search className="w-3.5 h-3.5 text-gray-500 mr-1" />
              <kbd data-size="20" data-multi="false" data-variant="default" className="sc-bCvmQg kGZyNY">/</kbd>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-0.5">
            <SidebarItem
              route="/dashboard"
              isMobile={isMobile}
              setIsToggle={setIsToggle}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-gray-500" />
              <span>Dashboard</span>
            </SidebarItem>

            {isClubMember && (
              <>
                <CollapsibleItem
                  title="Mein Club"
                  icon={<Server className="w-3.5 h-3.5" />}
                  route="/club/overview"
                  isMobile={isMobile}
                  setIsToggle={setIsToggle}
                >
                  {user?.role === "owner" && (
                    <SidebarItem
                      route="/club/member"
                      isMobile={isMobile}
                      setIsToggle={setIsToggle}
                    >
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      <span>Mitglieder</span>
                    </SidebarItem>
                  )}

                  {user?.role === "owner" && (
                    <SidebarItem
                      route="/club/finance"
                      isMobile={isMobile}
                      setIsToggle={setIsToggle}
                    >
                      <Landmark className="w-3.5 h-3.5 text-gray-500" />
                      <span>Finanzen</span>
                    </SidebarItem>
                  )}

                  {user?.role === "owner" && (
                    <SidebarItem
                      route="/club/grow"
                      isMobile={isMobile}
                      setIsToggle={setIsToggle}
                    >
                      <Sprout className="w-3.5 h-3.5 text-gray-500" />
                      <span>Grow-Control</span>
                    </SidebarItem>
                  )}

                  <SidebarItem
                    route="/club/inventory"
                    isMobile={isMobile}
                    setIsToggle={setIsToggle}
                  >
                    <Package className="w-3.5 h-3.5 text-gray-500" />
                    <span>Inventar</span>
                  </SidebarItem>

                  <SidebarItem
                    route="/club/delivery"
                    isMobile={isMobile}
                    setIsToggle={setIsToggle}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-gray-500" />
                    <span>Abgabe</span>
                  </SidebarItem>

                  {user?.role === "owner" && (
                    <SidebarItem
                      route="/club/event"
                      isMobile={isMobile}
                      setIsToggle={setIsToggle}
                    >
                      <History className="w-3.5 h-3.5 text-gray-500" />
                      <span>Ereignisse</span>
                    </SidebarItem>
                  )}

                  {(user?.role === "owner" ||
                    user?.functions?.includes("club-settings-menu")) && (
                    <SidebarItem
                      route="/club/profile"
                      isMobile={isMobile}
                      setIsToggle={setIsToggle}
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-500" />
                      <span>Einstellungen</span>
                    </SidebarItem>
                  )}
                </CollapsibleItem>

                <SidebarItem
                  route="/club/chat"
                  isMobile={isMobile}
                  setIsToggle={setIsToggle}
                >
                  <MessageCircleMore className="w-3.5 h-3.5 text-gray-500" />
                  <span>Chat</span>
                </SidebarItem>

                {user?.role === "owner" && (
                  <SidebarItem
                    route="/club/community"
                    isMobile={isMobile}
                    setIsToggle={setIsToggle}
                  >
                    <Newspaper className="w-3.5 h-3.5 text-gray-500" />
                    <span>News</span>
                  </SidebarItem>
                )}
              </>
            )}

            <div className="py-1.5">
              <div className="border-t border-gray-100"></div>
            </div>

            <SidebarItem
              route="/profile"
              isMobile={isMobile}
              setIsToggle={setIsToggle}
            >
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>Mein Profil</span>
            </SidebarItem>
            <SidebarItem
              route="/dashboard/search"
              isMobile={isMobile}
              setIsToggle={setIsToggle}
            >
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <span>Clubsuche</span>
            </SidebarItem>
            {(user?.role === "owner" ||
              user?.functions?.includes("club-academy")) && (
              <SidebarItem
                route="/academy"
                isMobile={isMobile}
                setIsToggle={setIsToggle}
              >
                <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                <span>CanSult Academy</span>
              </SidebarItem>
            )}
            <SidebarItem
              route="/broccoli/"
              isMobile={isMobile}
              setIsToggle={setIsToggle}
            >
              <Map className="w-3.5 h-3.5 text-gray-500" />
              <span>Brokkolikarte</span>
            </SidebarItem>
          </div>
        </div>

        {/* Logo Section */}
        <div className="mt-auto p-4 flex justify-center">
          <Image
            src="/images/logo-full.svg"
            alt="CanGroup Logo"
            width={120}
            height={24}
          />
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-[2500]",
          isToggle ? "mobile:block" : "hidden"
        )}
        onClick={() => setIsToggle((prev) => !prev)}
      />
    </>
  );
};

export default SideBar;