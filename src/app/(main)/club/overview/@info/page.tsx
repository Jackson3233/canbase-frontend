"use client";

import { useAppSelector } from "@/store/hook";
import { Card, CardContent } from "@/components/ui/card";

const OverviewInfoPage = () => {
  const { club } = useAppSelector((state) => state.club);

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full overflow-hidden rounded-3xl my-8">
        <CardContent className="p-0">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Informationen für Mitglieder
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Informationen für Mitglieder
            </p>
          </div>
          <p className="w-full p-10 text-sm tablet:p-7 mobile:p-5 mobile:text-xs">
            {club?.info_members}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewInfoPage;
