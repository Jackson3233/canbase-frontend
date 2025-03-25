'use client';

import { useState } from 'react';
import { useMediaQuery } from "usehooks-ts";
import { BreadCrumb, Sidebar } from '@/layout';

export default function Loading() {
  const [isToggle, setIsToggle] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openUpdates, setOpenUpdates] = useState(false);

  const loadingContent = (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4 bg-white">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
          {loadingContent}
        </div>
      </div>
    </div>
  );
}