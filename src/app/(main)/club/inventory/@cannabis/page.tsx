"use client";

import { useRouter } from "next/navigation";
import { Cannabis, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { isEmpty } from "@/lib/functions";

const InventoryCannnabisPage = () => {
  const dispatch = useAppDispatch();
  const { harvests } = useAppSelector((state) => state.harvests);

  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {isEmpty(harvests) ? (
          <Card className="p-10 tablet:p-7 mobile:p-5">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <Cannabis className="w-6 h-6 tablet:w-4 tablet:h-4" />
                <h1 className="text-2xl	font-semibold tablet:text-xl">
                  Cannabis hinzufügen
                </h1>
              </div>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                {`Um Cannabis Inventar zu erfassen, inventarisiere eine Ernte nachdem alle Tests abgeschlossen sind.`}
              </p>
              <Button
                className="h-10 flex items-center space-x-2 px-4 mt-8 bg-custom mobile:w-full hover:bg-customhover"
                onClick={() => router.push("/club/grow/?tab=harvest")}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Cannabis hinzufügen</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
              onClick={() => router.push("/club/grow/?tab=harvest")}
            >
              <Plus className="w-3 h-3" />
              <span className="text-xs">Cannabis hinzufügen</span>
            </Button>
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl	font-semibold tablet:text-xl">
                    Cannabis
                  </h1>
                  <p className="text-xs text-content">
                    {harvests.length} Items
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryCannnabisPage;
