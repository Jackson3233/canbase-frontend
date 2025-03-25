"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveDown, MoveUp, UsersRound } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import ClubStatus from "@/components/basic/ClubStatus";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { checkRegisterDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";

const OwnerDashboard = () => {
  const { members } = useAppSelector((state) => state.members);
  const { club } = useAppSelector((state) => state.club);
  const { user } = useAppSelector((state) => state.user);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let count = 0;

    !isEmpty(club?.document) && count++;

    !isEmpty(club?.street) &&
      !isEmpty(club?.address) &&
      !isEmpty(club?.postcode) &&
      !isEmpty(club?.city) &&
      !isEmpty(club?.country) &&
      count++;

    (!isEmpty(club?.discord) ||
      !isEmpty(club?.tiktok) ||
      !isEmpty(club?.youtube) ||
      !isEmpty(club?.twitch) ||
      !isEmpty(club?.facebook)) &&
      count++;

    !isEmpty(club?.badge) && !isEmpty(club?.avatar) && count++;

    (club?.users as number) >= 2 && count++;

    setProgress(count * 20);
  }, [club]);

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-3 my-8">
        {(user?.role === "owner" ||
          user?.functions?.includes("dashboard-club-status")) && (
          <Card>
            <CardContent className="grid grid-cols-3 divide-x p-0 tablet:grid-cols-1 tablet:divide-x-0 tablet:divide-y">
              <div className="flex p-7 tablet:justify-center tablet:p-5">
                <div className="flex flex-col space-y-2 tablet:items-center">
                  <div className="flex items-center space-x-5">
                    <p className="text-sm font-semibold mobile:text-xs">
                      Aktuelle Mitglieder
                    </p>
                    <Badge className="flex items-center space-x-1 w-fit h-fit bg-[#EAEAEA] rounded-md">
                      <UsersRound className="w-3 h-3 text-content" />
                      <span className="text-xs text-content font-medium whitespace-nowrap">
                        {
                          members?.filter((f) =>
                            f.clublist?.some(
                              (s) => s.club.clubID === club?.clubID
                            )
                          ).length
                        }
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 tablet:flex-col tablet:space-x-0">
                    <h2 className="text-2xl font-semibold laptop:text-xl tablet:text-base">
                      {club?.users}
                    </h2>
                    <div className="flex items-center gap-2 tablet:flex-row tablet:items-center tablet:gap-2">
                      <p className="text-sm text-content">
                        {`davor ${
                          members?.filter(
                            (f) =>
                              !isEmpty(f.club) &&
                              checkRegisterDate(
                                f.registerDate as string,
                                "last"
                              )
                          ).length
                        }`}
                      </p>
                      <Badge
                        className={cn(
                          "w-fit h-fit flex items-center space-x-1 p-1 rounded-xl",
                          members?.filter(
                            (f) =>
                              !isEmpty(f.club) &&
                              checkRegisterDate(
                                f.registerDate as string,
                                "current"
                              )
                          ).length -
                            members?.filter(
                              (f) =>
                                !isEmpty(f.club) &&
                                checkRegisterDate(
                                  f.registerDate as string,
                                  "last"
                                )
                            ).length >=
                            0
                            ? "text-[#19A873] bg-[#19A873]/25"
                            : "text-[#C90024] bg-[#C90024]/25"
                        )}
                      >
                        {members?.filter(
                          (f) =>
                            !isEmpty(f.club) &&
                            checkRegisterDate(
                              f.registerDate as string,
                              "current"
                            )
                        ).length -
                          members?.filter(
                            (f) =>
                              !isEmpty(f.club) &&
                              checkRegisterDate(
                                f.registerDate as string,
                                "last"
                              )
                          ).length >
                        0 ? (
                          <MoveUp size={12} />
                        ) : (
                          <MoveDown size={12} />
                        )}
                        <p className="text-xs leading-[8px] whitespace-nowrap">
                          {`${Math.abs(
                            members?.filter(
                              (f) =>
                                !isEmpty(f.club) &&
                                checkRegisterDate(
                                  f.registerDate as string,
                                  "last"
                                )
                            ).length === 0
                              ? members?.filter(
                                  (f) =>
                                    !isEmpty(f.club) &&
                                    checkRegisterDate(
                                      f.registerDate as string,
                                      "current"
                                    )
                                ).length > 0
                                ? 100
                                : 0
                              : ((members?.filter(
                                  (f) =>
                                    !isEmpty(f.club) &&
                                    checkRegisterDate(
                                      f.registerDate as string,
                                      "current"
                                    )
                                ).length -
                                  members?.filter(
                                    (f) =>
                                      !isEmpty(f.club) &&
                                      checkRegisterDate(
                                        f.registerDate as string,
                                        "last"
                                      )
                                  ).length) /
                                  members?.filter(
                                    (f) =>
                                      !isEmpty(f.club) &&
                                      checkRegisterDate(
                                        f.registerDate as string,
                                        "last"
                                      )
                                  ).length) *
                                  100
                          )}%`}
                        </p>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex p-7 tablet:justify-center tablet:p-5">
                <div className="flex flex-col space-y-2 tablet:items-center">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Gewinn / Verlust im aktuellen Monat
                  </p>
                  <Badge className="w-fit h-fit p-1 mt-4 text-xs text-custom font-medium whitespace-nowrap bg-customforeground rounded-md">
                    Kommt bald
                  </Badge>
                </div>
              </div>
              <div className="flex p-7 tablet:justify-center tablet:p-5">
                <div className="flex flex-col space-y-2 tablet:items-center">
                  <p className="text-sm font-semibold mobile:text-xs">
                    Grow-Status
                  </p>
                  <Badge className="w-fit h-fit p-1 mt-4 text-xs text-custom font-medium whitespace-nowrap bg-customforeground rounded-md">
                    Kommt bald
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex gap-3 laptop:flex-col">
          {(user?.role === "owner" ||
            user?.functions?.includes("dashboard-club-latest")) && (
            <div className="w-full overflow-hidden bg-white border rounded-2xl hover:bg-[#FAFAFA] tablet:space-y-3">
              <div className="w-full">
                <iframe
                  className="pointer-events-none"
                  width="100%"
                  height={225}
                  src="https://www.youtube.com/embed/JRFpxrn12Qg?rel=0"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col space-y-3 p-7 tablet:p-5 mobile:p-3">
                <p className="text-sm text-content tablet:text-xs">
                  01. August 2024
                </p>
                <p className="overflow-hidden font-semibold tablet:text-sm">
                  {`{newest video}`}
                </p>
                <p
                  className="overflow-hidden text-sm text-content tablet:text-xs"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  Hier findest du Videos zu unseren Features in Canbase, aber
                  auch Videos die dir bei dem Management deines Clubs
                  weiterhelfen. Sollte dir etwas fehlen, kannst du dich
                  jederzeit bei unserem Support melden.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/25 rounded-md">
                    Grow
                  </Badge>
                  <Badge className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/25 rounded-md">
                    Einstellungen
                  </Badge>
                  <Badge className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/25 rounded-md">
                    Management
                  </Badge>
                  <Badge className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/25 rounded-md">
                    IoT-Sensoren
                  </Badge>
                  <Badge className="w-fit p-1.5 text-xs text-black leading-[8px] bg-[#989898]/25 rounded-md">
                    Automation
                  </Badge>
                </div>
              </div>
            </div>
          )}
          {(user?.role === "owner" ||
            user?.functions?.includes("dashboard-club-steps")) && (
            <Card className="w-full p-7 tablet:p-5">
              <CardContent className="flex flex-col space-y-5 p-0 tablet:space-y-3">
                <div className="flex flex-col space-y-3">
                  <p className="text-lg font-semibold tablet:text-base">
                    Erste Schritte für Clubs
                  </p>
                  <p className="text-sm text-content mobile:text-xs">
                    Erledige alle offenen Aufgaben, um Deinen Club weiter nach
                    vorne zu bringen.
                  </p>
                </div>
                <div className="space-y-1">
                  <Progress value={progress} />
                  <p className="text-sm text-content">{`${progress}%`}</p>
                </div>
                <div className="flex flex-col space-y-3">
                  <ClubStatus
                    done={!isEmpty(club?.document)}
                    title="Satzung erstellen & hochladen"
                    content="Erstelle und lade die Vereinssatzung deines Clubs in Canbase, um sie zentral zu verwalten."
                    link="/club/profile?tab=document"
                  />
                  <ClubStatus
                    done={
                      !isEmpty(club?.street) &&
                      !isEmpty(club?.address) &&
                      !isEmpty(club?.postcode) &&
                      !isEmpty(club?.city) &&
                      !isEmpty(club?.country)
                    }
                    title="Vereinssitz bestimmen"
                    content="Lege den offiziellen Club-Sitz fest für rechtliche Klarheit."
                    link="/club/profile#address"
                  />
                  <ClubStatus
                    done={
                      !isEmpty(club?.discord) ||
                      !isEmpty(club?.tiktok) ||
                      !isEmpty(club?.youtube) ||
                      !isEmpty(club?.twitch) ||
                      !isEmpty(club?.facebook)
                    }
                    title="Social Media verbinden"
                    content="Verknüpfe deine Social-Media-Kanäle für direkte Kommunikation."
                    link="/club/profile#discord"
                  />
                  <ClubStatus
                    done={!isEmpty(club?.badge) && !isEmpty(club?.avatar)}
                    title="Clublogo und Banner hinzufügen"
                    content="Füge ein Logo und Banner hinzu, um die Club-Identität zu stärken."
                    link="/club/profile#banner-avatar"
                  />
                  <ClubStatus
                    done={(club?.users as number) >= 2}
                    title="Lade dein erstes Mitglied ein"
                    content="Lade dein erstes Mitglied ein und starte den Aufbau deiner Community."
                    link="/club/member?tab=invite"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="relative rounded-md shadow overflow-hidden">
          <div className="absolute inset-0 size-full rounded-md">
            <Image
              className="rounded-md blur-[1px]"
              src="/assets/images/cansult-bg.png"
              fill={true}
              sizes="100%"
              priority
              alt="cansult-bg"
            />
          </div>
          <div className="relative flex justify-between items-center gap-5 px-24 py-8 bg-gradient-to-b from-transparent to-black/45 laptop:px-18 tablet:flex-col tablet:px-12 tablet:py-5">
            <div className="flex flex-col space-y-4 tablet:space-y-2">
              <div className="relative w-24 h-6">
                <Image
                  src="/assets/images/cansult.svg"
                  fill={true}
                  sizes="100%"
                  alt="cansult"
                />
              </div>
              <Button
                className="h-10 w-fit px-4 mobile:w-full"
                type="button"
                variant="outline"
                asChild
              >
                <Link href="https://discord.gg/gRmgvG7eue" target="_blank">
                  Kontaktiere uns
                </Link>
              </Button>
            </div>
            <div className="flex flex-col space-y-4 tablet:space-y-2">
              <h3 className="text-2xl font-bold text-white tablet:text-xl">
                Durch Cansult zur Anbaulizenz
              </h3>
              <div className="text-sm text-white tablet:text-xs">
                Wir helfen euch über alle Hürden, durch ganzheitliche 1:1
                Betreuung eures Cannabis Social Clubs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
