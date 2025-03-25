"use client";

import { Suspense } from "react";
import { CircleUser, Settings, Ticket } from "lucide-react";
import { SubTabs, SubTabsContent, SubTabsList, SubTabsTrigger } from "@/components/ui/subtab";
import { MineLayoutPropsInterface } from "@/types/page";

const MineLayout = ({
  profile,
  bookings,
  account,
}: MineLayoutPropsInterface) => {
  return (
    <Suspense fallback={<></>}>
      <SubTabs defaultValue="profile">
        <div className="w-full border-b border-gray-100 px-4">
          <SubTabsList>
            <SubTabsTrigger value="profile">
              <div className="flex items-center space-x-2">
                <CircleUser className="w-3.5 h-3.5" />
                <span className="text-sm">Profil</span>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="bookings">
              <div className="flex items-center space-x-2">
                <Ticket className="w-3.5 h-3.5" />
                <span className="text-sm">Buchungen</span>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="account">
              <div className="flex items-center space-x-2">
                <Settings className="w-3.5 h-3.5" />
                <span className="text-sm">Account</span>
              </div>
            </SubTabsTrigger>
          </SubTabsList>
        </div>
        <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
          <SubTabsContent value="profile">{profile}</SubTabsContent>
          <SubTabsContent value="bookings">{bookings}</SubTabsContent>
          <SubTabsContent value="account">{account}</SubTabsContent>
        </div>
      </SubTabs>
    </Suspense>
  );
};

export default MineLayout;
