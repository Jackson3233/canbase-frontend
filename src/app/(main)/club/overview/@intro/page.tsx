"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BadgeCheck, Globe, Home, Mail, Pen, Phone, Plus } from "lucide-react";

import { useAppSelector } from "@/store/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OverviewIntroPage = () => {
  const { club } = useAppSelector((state) => state.club);
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();

  const handleEditClick = async () => {
    try {
      await router.push("/club/profile");
    } finally {
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {user?.role === "owner" && (
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={handleEditClick}
          >
            <Pen className="w-3 h-3" />
            <span className="text-xs">Ändern</span>
          </Button>
        )}
        <Card className="max-w-[1440px] w-full overflow-hidden rounded-3xl">
          <AspectRatio className="border-b border-[#D9D9D9]" ratio={4 / 1}>
            {club?.badge === undefined ? (
              <div className="w-full h-full flex justify-center items-center bg-[#F8F8F8]">
                <Home className="w-10 h-10 text-content mobile:w-6 mobile:h-6" />
              </div>
            ) : (
              <Image
                className="object-cover"
                src={process.env.NEXT_PUBLIC_UPLOAD_URI + club.badge}
                fill={true}
                sizes="100%"
                alt="badge"
              />
            )}
          </AspectRatio>
          <CardContent className="relative h-full p-8 mobile:p-5">
            <Avatar className="absolute -top-20 w-52 h-52 ml-16 z-10 laptop:w-40 laptop:h-40 laptop:ml-0 tablet:w-20 tablet:h-20 tablet:-top-10 ">
              <AvatarImage
                className="border-4 border-white rounded-full"
                src={
                  (process.env.NEXT_PUBLIC_UPLOAD_URI as string) + club?.avatar
                }
              />
              <AvatarFallback className="border-4 border-white rounded-full bg-[#F8F8F8]">
                <Home className="w-6 h-6 text-content mobile:w-4 mobile:h-4" />
              </AvatarFallback>
            </Avatar>
            {club?.status === "license" && (
              <BadgeCheck
                className="absolute w-10 h-10 top-16 left-64 text-white z-20 laptop:w-8 laptop:h-8 laptop:top-8 laptop:left-[150px] tablet:w-5 tablet:h-5 tablet:top-4 tablet:left-[85px] mobile:left-[75px]"
                fill="#00C978"
              />
            )}
            <div className="w-full">
              <h1 className="w-full mt-36 text-6xl font-bold overflow-hidden whitespace-nowrap text-ellipsis laptop:mt-20 tablet:mt-10 tablet:text-3xl mobile:text-xl">
                {club?.clubname}
              </h1>
              <div className="flex items-center space-x-2.5 mt-2 mb-3.5">
                <Badge
                  className="w-fit px-2 py-1.5 text-sm leading-[8px]"
                  variant="secondary"
                >
                  {club?.users}/{club?.maxUser} Mitglieder
                </Badge>
                <div className="flex flex-wrap items-center gap-2.5">
                  {club?.email && (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        window.open(`mailto:${club.email}`);
                      }}
                    >
                      <Mail className="w-3 h-3 text-content" />
                    </div>
                  )}
                  {club?.phone && (
                    <Link href={`tel:${club.phone}`}>
                      <Phone className="w-3 h-3 text-content" />
                    </Link>
                  )}
                  {club?.website && (
                    <Link href={club.website} target="_blank">
                      <Globe className="w-3 h-3 text-content" />
                    </Link>
                  )}
                  {club?.instagram && (
                    <Link href={club.instagram} target="_blank">
                      <Image
                        src="/assets/images/instagram.svg"
                        width={10}
                        height={10}
                        alt="instagram"
                      />
                    </Link>
                  )}
                  {club?.discord && (
                    <Link href={club.discord} target="_blank">
                      <Image
                        src="/assets/images/discord.svg"
                        width={13}
                        height={9}
                        alt="discord"
                      />
                    </Link>
                  )}
                  {club?.facebook && (
                    <Link href={club.facebook} target="_blank">
                      <Image
                        src="/assets/images/facebook.svg"
                        width={10}
                        height={10}
                        alt="facebook"
                      />
                    </Link>
                  )}
                  {club?.youtube && (
                    <Link href={club.youtube} target="_blank">
                      <Image
                        src="/assets/images/youtube.svg"
                        width={14}
                        height={9}
                        alt="youtube"
                      />
                    </Link>
                  )}
                </div>
              </div>
              <div 
                className="text-lg text-content tablet:text-base mobile:text-sm prose prose-stone max-w-none"
                dangerouslySetInnerHTML={{ __html: club?.description || '' }}
              />
            </div>
          </CardContent>
        </Card>
        </div>
    </div>
  );
};

export default OverviewIntroPage;
