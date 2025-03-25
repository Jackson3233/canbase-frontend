"use client";

import { useRouter } from "next/navigation";
import { Plus, Slice } from "lucide-react";
import { HarvestTable } from "./harvest-table";
import { harvestColumns } from "./harvest-column";
import { useAppSelector } from "@/store/hook";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isEmpty } from "@/lib/functions";

const HarvestPage = () => {
  const { harvests } = useAppSelector((state) => state.harvests);

  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full my-8">
        {isEmpty(harvests) ? (
          <Card className="p-10 tablet:p-7 mobile:p-5">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <Slice className="w-6 h-6 tablet:w-4 tablet:h-4" />
                <h1 className="text-2xl	font-semibold tablet:text-xl">Ernten</h1>
              </div>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                {`Beginne mit deiner ersten Ernte und inventarisiere sie.`}
              </p>
              <Button
                className="h-10 flex items-center space-x-2 px-4 mt-8 bg-custom mobile:w-full hover:bg-customhover"
                onClick={() => router.push("/club/grow/?tab=charge")}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Ernte erstellen</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col space-y-5">
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => router.push("/club/grow/?tab=charge")}
            >
              <Plus className="w-3 h-3" />
              <span className="text-xs">Ernte erstellen</span>
            </Button>
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Ernten
                  </h1>
                  <p className="text-xs text-content">
                    {harvests.length} Ernten
                  </p>
                </div>
                <HarvestTable columns={harvestColumns} data={harvests as any} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarvestPage;
