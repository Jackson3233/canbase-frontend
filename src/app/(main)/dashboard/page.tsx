"use client";

import OwnerDashboard from "./owner";
import MemberDashboard from "./member";
import { useAppSelector } from "@/store/hook";
import ClubCard from "@/components/basic/ClubCard";
import { clubCardData } from "@/constant/clubcards";
import { isEmpty } from "@/lib/functions";
import SuperAdminDashboard from "@/components/features/SuperAdminDashboard";

const DashbaordLayout = () => {
  const { user } = useAppSelector((state) => state.user);

  return (
    <>
      {!isEmpty(user?.club) || !isEmpty(user?.clublist) ? (
        user?.role === "owner" ||
        user?.functions?.includes("dashboard-club-status") ||
        user?.functions?.includes("dashboard-club-latest") ||
        user?.functions?.includes("dashboard-club-steps") ? (
          <>
          <OwnerDashboard />
          {/* <SuperAdminDashboard/> */}
          </>
        ) : (
          <MemberDashboard />
        )
      ) : (
        <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
          <div className="w-full grid grid-cols-2 gap-4 tablet:grid-cols-1 my-8">
            {clubCardData.map((item, key) => (
              <ClubCard
                key={key}
                title={item.title}
                icon={item.icon}
                content={item.content}
                btnIcon={item.btnIcon}
                btnText={item.btnText}
                route={item.route}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DashbaordLayout;
