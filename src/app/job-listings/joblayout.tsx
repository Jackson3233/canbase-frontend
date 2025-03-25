'use client';

import { useState } from 'react';
import { useMediaQuery } from "usehooks-ts";
import { BreadCrumb, Sidebar } from '@/layout';

interface JobLayoutProps {
  children: React.ReactNode;
}

const JobLayout = ({ children }: JobLayoutProps) => {
  const [isToggle, setIsToggle] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openUpdates, setOpenUpdates] = useState(false);

  return (
    <div className="relative bg-[#F5F5F5]">
      <Sidebar
        isMobile={isMobile}
        isToggle={isToggle}
        setIsToggle={setIsToggle}
        setOpenFeedback={setOpenFeedback}
        setOpenUpdates={setOpenUpdates}
      />
      <div className="relative max-w-[1440px] w-full h-full min-h-screen flex flex-col pl-28 pr-5 pt-8 tablet:pl-5 tablet:pt-5 mobile:pt-3">
        <BreadCrumb setIsToggle={setIsToggle} />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default JobLayout;