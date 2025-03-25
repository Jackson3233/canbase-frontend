"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import { getEvent } from "@/actions/event";
import { Input } from "@/components/ui/input";
import { getTimeDifferenceInGerman } from "@/lib/functions";

const EventPage = () => {
  const [evnetData, setEventData] = useState<any>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getEvent();

      if (result.success) {
        setEventData(result.event);
      }
    })();
  }, []);

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full p-10 tablet:p-7 mobile:p-5 my-8">
        <CardContent className="p-0">
          <h1 className="text-2xl font-semibold tablet:text-xl">Ereignisse</h1>
          <Input
            className="max-w-sm w-full mt-5"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen"
          />
          <div className="w-full flex flex-col mt-10 tablet:mt-5">
            {evnetData
              .filter((f: any) => f.content.includes(search))
              .map((item: any, key: number) => (
                <div className="flex" key={key}>
                  <div className="flex flex-col">
                    <div className="min-w-8 min-h-8 flex justify-center items-center rounded-full bg-[#EFEFEF]">
                      <UserRound className="w-4 h-4" color="white" />
                    </div>
                    <div className="w-0.5 min-h-5 h-full self-center bg-[#EFEFEF]"></div>
                  </div>
                  <div className="w-full flex justify-between gap-2 mt-2 ml-4 tablet:flex-col tablet:justify-start mobile:ml-2 mobile:mt-0">
                    <p className="text-sm">{item.content}</p>
                    <p className="text-xs text-content">
                      {item.date && getTimeDifferenceInGerman(item.date)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventPage;
