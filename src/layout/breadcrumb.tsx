"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutGrid, Menu, HelpCircle } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { cn } from "@/lib/utils";
import { BreadCrumbPropsInterface } from "@/types/layout";
import { useEffect, useState } from "react";
import SearchModal from "@/components/basic/SearchModal";
import InputQRModal from "@/components/basic/PDFQRScanner"; 

const BreadCrumb = ({ setIsToggle }: BreadCrumbPropsInterface) => {
  const { user } = useAppSelector((state) => state.user);
  const { chat } = useAppSelector((state) => state.chat);

  const pathname = usePathname();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false); // State to track button active state

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    setIsActive(true); // Set active state when modal opens
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setIsActive(false); // Reset active state when modal closes
  };

  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  const getClubName = () => {
    const temp = chat.find(
      (obj) => obj.channelID === pathname.replace("/club/chat/", "")
    );

    return temp?.channelname;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 w-full flex justify-between items-center bg-white border-b border-gray-100 z-[2000]",
        (pathname === "/dashboard" ||
          pathname === "/dashboard/create" ||
          pathname === "/dashboard/search" ||
          pathname === "/academy" ||
          pathname === "/broccoli" ||
          pathname === "/club/chat" ||
          pathname === "/club/community" ||
          pathname === "/club/event")
      )}
    >
      <nav
        className="overflow-auto flex w-full py-6 px-2"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-2 tablet:space-x-1">
          <li className="inline-flex items-center">
            <Link
              className="inline-flex items-center space-x-2 tablet:space-x-1"
              href="/dashboard"
            >
              <LayoutGrid className="w-3 h-3 text-[#DBDBDB] hover:text-customhover" />
            </Link>
          </li>
          {pathname === "/dashboard" && (
            <li className="inline-flex items-center space-x-2 tablet:space-x-1">
              <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
              <span className="text-custom tablet:text-sm">Dashboard</span>
            </li>
          )}
          {pathname === "/dashboard/create" && (
            <>
              <li>
                <span className="text-sm text-[#DBDBDB]">{">"}</span>
              </li>
              <li>
                <span className="text-sm text-content">Erstellen</span>
              </li>
            </>
          )}
          {pathname === "/dashboard/search" && (
            <li className="inline-flex items-center space-x-2 tablet:space-x-1">
              <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
              <span className="text-custom tablet:text-sm">Clubsuche</span>
            </li>
          )}
          {pathname === "/profile" && (
            <li className="inline-flex items-center space-x-2 tablet:space-x-1">
              <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
              <span className="text-custom tablet:text-sm">Mein Profil</span>
            </li>
          )}
          {pathname === "/academy" && (
            <li className="inline-flex items-center space-x-2 tablet:space-x-1">
              <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
              <span className="text-custom tablet:text-sm">
                CanSult Academy
              </span>
            </li>
          )}
          {pathname === "/broccoli" && (
            <li className="inline-flex items-center space-x-2 tablet:space-x-1">
              <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
              <span className="text-custom tablet:text-sm">Brokkolikarte</span>
            </li>
          )}
          {pathname.includes("/club/") && (
            <>
              <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                <Link
                  className="text-content whitespace-nowrap hover:text-customhover tablet:text-sm"
                  href="/club/overview"
                >
                  {user?.club?.clubname}
                </Link>
              </li>
              {pathname.includes("/club/member") && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">Mitglieder</span>
                </li>
              )}
              {pathname.includes("/club/profile") && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">
                    Einstellungen
                  </span>
                </li>
              )}
              {pathname === "/club/event" && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">Ereignisse</span>
                </li>
              )}
              {pathname === "/club/chat" && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">Chat</span>
                </li>
              )}
              {pathname.includes("/club/chat/") && (
                <>
                  <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                    <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                    <Link
                      className="text-content whitespace-nowrap hover:text-customhover tablet:text-sm"
                      href="/club/chat"
                    >
                      Chat
                    </Link>
                  </li>
                  <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                    <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                    <span className="text-custom tablet:text-sm">
                      {getClubName()}
                    </span>
                  </li>
                </>
              )}
              {pathname.includes("/club/community") && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">Community</span>
                </li>
              )}
              {pathname.includes("/club/grow") && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">
                    Grow-Control
                  </span>
                </li>
              )}
              {pathname.includes("/club/inventory") && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">Inventar</span>
                </li>
              )}
              {pathname.includes("/club/delivery") && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">Abgabe</span>
                </li>
              )}
              {pathname === "/club/event" && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">Ereignisse</span>
                </li>
              )}
              {pathname === "/club/profile" && (
                <li className="inline-flex items-center space-x-2 tablet:space-x-1">
                  <ChevronRight className="w-3 h-3 text-[#DBDBDB]" />
                  <span className="text-custom tablet:text-sm">
                    Einstellungen
                  </span>
                </li>
              )}
            </>
          )}
        </ol>
      </nav>
      <div
        className="hidden py-1.5 px-2 tablet:flex tablet:justify-center tablet:items-center"
        onClick={() => setIsToggle((prev) => !prev)}
      >
        <Menu className="w-3.5 h-3.5 text-content hover:text-customhover" />
      </div>
      <button
        type="button"
        className="flex items-center space-x-1 px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span className="text-sm">Hilfe</span>
      </button>
    </div>
  );
};

export default BreadCrumb;
