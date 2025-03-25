"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { userActions } from "@/store/reducers/userReducer";
import { clubActions } from "@/store/reducers/clubReducer";
import { membersActions } from "@/store/reducers/membersReducer";
import { getData } from "@/actions/user";
import { BreadCrumb, Sidebar } from "@/layout";
import Feedback from "./feedback";
import Updates from "./updates";
import { cn } from "@/lib/utils";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { club } = useAppSelector((state) => state.club);

  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isToggle, setIsToggle] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openUpdates, setOpenUpdates] = useState(false);

  useEffect(() => {
    const token: any = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", club?.color as string);
  }, [club]);

  useEffect(() => {
    (async () => {
      const result = await getData();

      if (result.success) {
        dispatch(userActions.setUser({ user: result.user }));
        dispatch(clubActions.setClub({ club: result.club }));
        dispatch(membersActions.setMembers({ members: result.members }));
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    setIsToggle(false);
  }, [isMobile]);

  return (
    <div className="relative bg-white flex">
      <Sidebar
        isMobile={isMobile}
        isToggle={isToggle}
        setIsToggle={setIsToggle}
        setOpenFeedback={setOpenFeedback}
        setOpenUpdates={setOpenUpdates}
      />
      <div className="flex-1 ml-[275px] tablet:ml-0">
        <div className="relative max-w-[1440px] w-full h-full min-h-screen flex flex-col bg-white">
          <BreadCrumb setIsToggle={setIsToggle} />
          {children}
        </div>
      </div>
      <Feedback openFeedback={openFeedback} setOpenFeedback={setOpenFeedback} />
      <Updates openUpdates={openUpdates} setOpenUpdates={setOpenUpdates} />
    </div>
  );
};

export default MainLayout;
