"use client";

import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { CheckCircle2, Dna } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { userActions } from "@/store/reducers/userReducer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { academyMedia } from "@/actions/user";
import { academyMediaData } from "@/constant/medias";
import { cn } from "@/lib/utils";

const AcademyPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState<any>();
  const [search, setSearch] = useDebounceValue("", 500);

  const handleDialog = (param: any) => {
    setTempData(param);
    setOpen((prev) => !prev);
  };

  const handleCheck = async (param: string) => {
    const result = await academyMedia({ media: param });

    if (result.success) {
      dispatch(userActions.setUser({ user: result.user }));
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <Card className="max-w-3xl w-full overflow-hidden tablet:max-w-none">
          <CardContent className="p-7 tablet:p-5">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Dna className="w-4 h-4" />
                <h1 className="text-xl font-semibold tablet:text-lg">
                  CanSult Academy
                </h1>
              </div>
              <p className="max-w-xl w-full text-sm text-content tablet:max-w-none tablet:text-xs">
                Hier findest du Videos zu unseren Features in CanSult, aber auch
                Videos die dir bei dem Management deines Clubs weiterhelfen.
                Sollte dir etwas fehlen, kannst du dich jederzeit bei unserem
                Support melden.
              </p>
            </div>
            <Input
              className="max-w-xl w-full h-10 mt-10 tablet:max-w-none tablet:mt-5"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suchen"
            />
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-3 mobile:flex-col mobile:flex-nowrap">
          {academyMediaData
            .filter((f) => {
              const titleMatch = f.title
                .toLowerCase()
                .includes(search.toLowerCase());
              const tagMatch = f.tags.some((tag) =>
                tag.toLowerCase().includes(search.toLowerCase())
              );

              return titleMatch || tagMatch;
            })
            .map((item, key) => (
              <div
                className="max-w-xs w-full overflow-hidden bg-white border rounded-2xl cursor-pointer hover:bg-[#FAFAFA] tablet:space-y-3 mobile:max-w-none"
                key={key}
                onClick={() => handleDialog(item)}
              >
                <div className="w-full">
                  <iframe
                    className="pointer-events-none"
                    width="100%"
                    height={150}
                    src={item.media}
                    allowFullScreen
                  />
                </div>
                <div className="flex flex-col space-y-3 p-7 tablet:p-5 mobile:p-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-content tablet:text-xs">
                      {item.date}
                    </p>
                    {user?.academy_media?.includes(item.media) && (
                      <CheckCircle2 className="min-w-4 h-4 text-custom" />
                    )}
                  </div>
                  <p
                    className="overflow-hidden font-semibold tablet:text-sm"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="overflow-hidden text-sm text-content tablet:text-xs"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.tags.map((m, key) => (
                      <Badge
                        className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/25 rounded-md"
                        key={key}
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl w-full flex flex-col gap-0 p-10 overflow-hidden rounded-3xl mobile:p-5">
              <div className="flex justify-between items-center space-x-2 tablet:flex-col tablet:items-start tablet:space-x-0 tablet:space-y-2">
                <p className="text-base font-semibold tablet:text-sm">
                  {tempData?.title}
                </p>
                <div
                  className={cn(
                    "flex items-center space-x-2 text-xs p-2 rounded-md cursor-pointer",
                    user?.academy_media?.includes(tempData?.media)
                      ? "bg-custom"
                      : "bg-[#FAFAFA]"
                  )}
                  onClick={() => handleCheck(tempData?.media)}
                >
                  <p
                    className={cn(
                      user?.academy_media?.includes(tempData?.media) &&
                        "text-white"
                    )}
                  >
                    Als gesehen makieren
                  </p>
                  <CheckCircle2
                    className={cn(
                      "min-w-4 h-4",
                      user?.academy_media?.includes(tempData?.media) &&
                        "text-white"
                    )}
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold mt-8 tablet:text-xl tablet:mt-4">
                {tempData?.title}
              </h1>
              <p className="text-sm font-medium text-content mt-3 tablet:text-xs">
                {tempData?.content}
              </p>
              <iframe
                className="rounded-3xl mt-8 tablet:mt-4"
                width="100%"
                height={225}
                src={tempData?.media}
                allowFullScreen
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AcademyPage;
