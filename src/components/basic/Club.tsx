"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { BadgeCheck, Globe, Home, Mail, Phone } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { joinClub } from "@/actions/club";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { isEmpty } from "@/lib/functions";
import { ClubPropsInterface } from "@/types/component";

const Club = ({
  clubname,
  badge,
  avatar,
  users,
  maxUser,
  description,
  prevent_info,
  email,
  phone,
  website,
  instagram,
  discord,
  facebook,
  youtube,
  clubStatus,
  clubID,
  allowRequest,
  handleClubInfo,
}: ClubPropsInterface) => {
  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const handleJoinClub = async () => {
    const result = await joinClub({ clubID: clubID });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setOpen(false);

    if (result.success) {
      router.push("/dashboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden rounded-3xl" onClick={handleClubInfo}>
        <AspectRatio className="border-b border-[#D9D9D9]" ratio={18 / 5}>
          {badge === undefined ? (
            <div className="w-full h-full flex justify-center items-center bg-[#F8F8F8]">
              <Home className="w-8 h-8 text-content mobile:w-5 mobile:h-5" />
            </div>
          ) : (
            <Image
              className="object-cover"
              src={process.env.NEXT_PUBLIC_UPLOAD_URI + badge}
              fill={true}
              sizes="100%"
              alt="badge"
            />
          )}
        </AspectRatio>
        <CardContent className="relative h-full p-8 mobile:p-5">
          <Avatar className="absolute -top-10 w-20 h-20 z-10 mobile:-top-7 mobile:w-14 mobile:h-14">
            <AvatarImage
              className="border-4 border-white rounded-full"
              src={(process.env.NEXT_PUBLIC_UPLOAD_URI as string) + avatar}
              alt="avatar"
            />
            <AvatarFallback className="border-4 border-white rounded-full bg-[#F8F8F8]">
              <Home className="w-4 h-4 text-content" />
            </AvatarFallback>
          </Avatar>
          {clubStatus === "license" && (
            <BadgeCheck
              className="absolute w-5 h-5 top-3 left-[90px] text-white z-20 mobile:w-4 mobile:h-4 mobile:top-2 mobile:left-[60px]"
              fill="#00C978"
            />
          )}
          <div>
            <DialogTrigger asChild>
              <h1 className="w-fit mt-3 text-lg font-bold cursor-pointer transition-colors mobile:text-base hover:text-customhover">
                {clubname}
              </h1>
            </DialogTrigger>
            <div className="flex items-center space-x-2.5 mt-2 mb-3.5">
              <Badge
                className="w-fit px-2 py-1.5 text-xs leading-[8px]"
                variant="secondary"
              >
                {users}/{maxUser} Mitglieder
              </Badge>
              <div className="flex flex-wrap gap-2.5 items-center">
                {email && (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      window.open(`mailto:${email}`);
                    }}
                  >
                    <Mail className="w-3 h-3 text-content" />
                  </div>
                )}
                {phone && (
                  <Link href={`tel:${phone}`}>
                    <Phone className="w-3 h-3 text-content" />
                  </Link>
                )}
                {website && (
                  <Link href={website} target="_blank">
                    <Globe className="w-3 h-3 text-content" />
                  </Link>
                )}
                {instagram && (
                  <Link href={instagram} target="_blank">
                    <Image
                      src="/assets/images/instagram.svg"
                      width={10}
                      height={10}
                      alt="instagram"
                    />
                  </Link>
                )}
                {discord && (
                  <Link href={discord} target="_blank">
                    <Image
                      src="/assets/images/discord.svg"
                      width={13}
                      height={9}
                      alt="discord"
                    />
                  </Link>
                )}
                {facebook && (
                  <Link href={facebook} target="_blank">
                    <Image
                      src="/assets/images/facebook.svg"
                      width={10}
                      height={10}
                      alt="facebook"
                    />
                  </Link>
                )}
                {youtube && (
                  <Link href={youtube} target="_blank">
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
            <p
              className="overflow-hidden text-sm text-content text-ellipsis break-all tablet:text-xs"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
              }}
            >
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
      <DialogContent className="max-w-3xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
        <p className="mx-8 my-5 text-lg font-semibold tablet:text-base mobile:mx-5 mobile:my-3 mobile:text-sm">
          {clubname} beitreten?
        </p>
        <AspectRatio
          className="border-b border-[#D9D9D9]"
          ratio={18 / (isMobile ? 5 : 3)}
        >
          {badge === undefined ? (
            <div className="w-full h-full flex justify-center items-center bg-[#F8F8F8]">
              <Home className="w-5 h-5 text-content" />
            </div>
          ) : (
            <Image
              className="object-cover"
              src={process.env.NEXT_PUBLIC_UPLOAD_URI + badge}
              fill={true}
              sizes="100%"
              alt="badge"
            />
          )}
        </AspectRatio>
        <div className="relative px-8 mobile:px-5">
          <Avatar className="absolute -top-10 w-20 h-20 z-10 mobile:-top-7 mobile:w-14 mobile:h-14">
            <AvatarImage
              className="border-4 border-white rounded-full"
              src={(process.env.NEXT_PUBLIC_UPLOAD_URI as string) + avatar}
              alt="avatar"
            />
            <AvatarFallback className="border-4 border-white rounded-full bg-[#F8F8F8] text-content">
              <Home className="w-4 h-4 text-content" />
            </AvatarFallback>
          </Avatar>
          {clubStatus === "license" && (
            <BadgeCheck
              className="absolute w-5 h-5 top-3 left-[90px] text-white z-20 mobile:w-4 mobile:h-4 mobile:top-2 mobile:left-[60px]"
              fill="#00C978"
            />
          )}
        </div>
        <div className="max-h-[500px] flex flex-col space-y-3 p-8 pt-12 overflow-y-auto mobile:p-5 mobile:pt-7">
          <h1 className="text-lg font-bold break-all mobile:text-base">
            {clubname}
          </h1>
          <div className="flex justify-between gap-5 mobile:flex-col">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className="w-fit p-1.5 text-xs leading-[8px] whitespace-nowrap rounded-md"
                  variant="secondary"
                >
                  {users}/{maxUser} Mitglieder
                </Badge>
                <div className="flex items-center space-x-3">
                  {email && (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        window.open(`mailto:${email}`);
                      }}
                    >
                      <Mail className="w-3 h-3 text-content" />
                    </div>
                  )}
                  {phone && (
                    <Link href={`tel:${phone}`}>
                      <Phone className="w-3 h-3 text-content" />
                    </Link>
                  )}
                  {website && (
                    <Link href={website} target="_blank">
                      <Globe className="w-3 h-3 text-content" />
                    </Link>
                  )}
                  {instagram && (
                    <Link href={instagram} target="_blank">
                      <Image
                        src="/assets/images/instagram.svg"
                        width={10}
                        height={10}
                        alt="instagram"
                      />
                    </Link>
                  )}
                  {discord && (
                    <Link href={discord} target="_blank">
                      <Image
                        src="/assets/images/discord.svg"
                        width={13}
                        height={9}
                        alt="discord"
                      />
                    </Link>
                  )}
                  {facebook && (
                    <Link href={facebook} target="_blank">
                      <Image
                        src="/assets/images/facebook.svg"
                        width={10}
                        height={10}
                        alt="facebook"
                      />
                    </Link>
                  )}
                  {youtube && (
                    <Link href={youtube} target="_blank">
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
              <div className="flex flex-wrap gap-3">
                {clubStatus === "verify" && (
                  <>
                    <Badge className="w-fit p-1.5 text-xs text-[#D5B100] leading-[8px] bg-[#D5B100]/25 rounded-md">
                      In Gründung
                    </Badge>
                  </>
                )}
                {clubStatus === "license" && (
                  <>
                    <Badge className="w-fit flex items-center space-x-1 p-1.5 leading-[8px] bg-[#00C978]/25 rounded-md">
                      <BadgeCheck
                        className="w-3 h-3 text-white"
                        fill="#00C978"
                      />
                      <p className="text-xs text-[#19A873]">
                        Lizensierter Verein
                      </p>
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <div className="max-w-72 w-full flex flex-col items-center space-y-3 p-5 bg-[#F8F8F8] rounded-md tablet:max-w-56 mobile:self-center">
              {maxUser > users ? (
                <>
                  <Button
                    className="h-10 px-4 text-sm mobile:px-2 bg-black text-white border-black hover:bg-gray-400"
                    variant="outline"
                    onClick={handleJoinClub}
                    disabled={
                      !isEmpty(user?.club) ||
                      !isEmpty(
                        user?.clublist?.filter((f) => f.club.clubID === clubID)
                          .length
                      ) ||
                      !allowRequest
                    }
                  >
                    Mitglied werden
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-center text-content mobile:text-xs">
                    Dieser Club ist bereits voll. Du kannst dich auf die
                    Warteschlange setzen lassen. Und wirst informiert sobald ein
                    Platz für dich frei ist.
                  </p>
                  <Button
                    className="h-10 px-4 text-sm text-[#FBCB15] bg-[#FBCB15]/25 hover:bg-[#FBCB15]/35 mobile:px-2"
                    onClick={handleJoinClub}
                    disabled={
                      !isEmpty(user?.club) ||
                      !isEmpty(
                        user?.clublist?.filter((f) => f.club.clubID === clubID)
                          .length
                      ) ||
                      !allowRequest
                    }
                  >
                    Auf die Warteschlange
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {description && (
              <>
                <p className="text-xs text-content">Beschreibung</p>
                <p className="text-sm tablet:text-xs">{description}</p>
              </>
            )}
            {prevent_info && (
              <>
                <p className="text-xs text-content">
                  Jugendschutz & Prävention
                </p>
                <p className="text-sm tablet:text-xs">{prevent_info}</p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Club;
