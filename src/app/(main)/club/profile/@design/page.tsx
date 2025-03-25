"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import Dropzone from "react-dropzone";
import ClipLoader from "react-spinners/ClipLoader";
import { Home, Images, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { clubActions } from "@/store/reducers/clubReducer";
import { updateCard, updateColor } from "@/actions/club";
import Color from "@/components/basic/Color";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  cardBGColorData,
  cardTextColorData,
  colorData,
} from "@/constant/colors";
import { cn } from "@/lib/utils";

const ClubDesignPage = () => {
  const dispatch = useAppDispatch();
  const { club } = useAppSelector((state) => state.club);
  const { user } = useAppSelector((state) => state.user);

  const { Canvas } = useQRCode();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [color, setColor] = useState<string>("light");
  const [cardColor, setCardColor] = useState<string>("black");
  const [textColor, setTextColor] = useState<string>("white");
  const [logoColor, setLogoColor] = useState<string>("white");
  const [frontBadge, setFrontBadge] = useState<any>();
  const [frontTempBadge, setFrontTempBadge] = useState<any>();
  const [frontRealBadge, setFrontRealBadge] = useState<any>();
  const [frontRemoveBadge, setFrontRemoveBadge] = useState(false);
  const [backBadge, setBackBadge] = useState<any>();
  const [backTempBadge, setBackTempBadge] = useState<any>();
  const [backRealBadge, setBackRealBadge] = useState<any>();
  const [backRemoveBadge, setBackRemoveBadge] = useState(false);
  const [position, setPosition] = useState("middle");
  const [logoShown, setLogoShown] = useState(true);
  const [clubShown, setClubShown] = useState(false);

  useEffect(() => {
    setColor(club?.color as string);
    setCardColor(club?.card?.cardColor as string);
    setTextColor(club?.card?.textColor as string);
    setLogoColor(club?.card?.logoColor as string);
    setFrontRealBadge(club?.card?.frontBadge);
    setBackRealBadge(club?.card?.backBadge);
    setPosition(club?.card?.position as string);
    setLogoShown(club?.card?.logoShown as boolean);
    setClubShown(club?.card?.clubShown as boolean);
  }, [club]);

  const handleSubmit = async () => {
    setLoading(true);

    const result = await updateColor({ color: color });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(clubActions.setClub({ club: result.club }));
    }
  };

  const handleCardSubmit = async () => {
    setCardLoading(true);

    const formData = new FormData();

    formData.append("cardColor", cardColor);
    formData.append("textColor", textColor);
    formData.append("logoColor", logoColor);
    formData.append("frontBadge", frontBadge);
    formData.append("frontRemoveBadge", String(frontRemoveBadge));
    formData.append("backBadge", backBadge);
    formData.append("backRemoveBadge", String(backRemoveBadge));
    formData.append("position", position);
    formData.append("logoShown", String(logoShown));
    formData.append("clubShown", String(clubShown));

    const result = await updateCard(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setCardLoading(false);

    if (result.success) {
      dispatch(clubActions.setClub({ club: result.club }));
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full space-y-5 my-8">
        <Card>
          <CardContent className="flex flex-col p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Club Farben
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                Hier kannst du die Farben deines Clubs anpassen.
              </p>
            </div>
            <div className="flex flex-col p-10 tablet:p-7 mobile:p-5">
              <div className="w-full flex justify-between tablet:flex-col">
                <div className="max-w-xs w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                  <p className="font-medium mobile:text-sm">Akzentfarbe</p>
                  <p className="text-sm text-content mobile:text-xs">
                    Diese Farbe wird verwendet, um bestimmte Elemente in Canbase
                    hervorzuheben.
                  </p>
                </div>
                <div className="w-full flex flex-wrap gap-1 mobile:justify-center">
                  {colorData.map((item, key) => (
                    <Color
                      key={key}
                      colorName={item.name}
                      bgColor={item.bgColor}
                      borderColor={item.borderColor}
                      active={item.name === color}
                      setColor={setColor}
                    />
                  ))}
                </div>
              </div>
              <Button
                className="h-10 self-end px-4 mt-8 bg-custom mobile:w-full mobile:mt-5 hover:bg-customhover"
                onClick={handleSubmit}
                disabled={
                  user?.role !== "owner" &&
                  !user?.functions?.includes("club-settings-design-manage")
                }
              >
                {loading ? (
                  <ClipLoader
                    aria-label="loader"
                    data-testid="loader"
                    color="white"
                    size={16}
                  />
                ) : (
                  <span className="text-sm">Speichern</span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Mitgliedsausweis
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                Hier kannst du das Aussehen des Mitgliedsausweises anpassen.
              </p>
            </div>
            <div className="w-full flex justify-between p-10 border-b tablet:flex-col tablet:p-7 mobile:p-5">
              <div className="max-w-xs w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                <p className="font-medium mobile:text-sm">Hintergrundfarbe</p>
                <p className="text-sm text-content mobile:text-xs">
                  Der Hintergrund des Ausweises
                </p>
              </div>
              <div className="w-full flex flex-wrap gap-1 mobile:justify-center">
                {cardBGColorData.map((item, key) => (
                  <Color
                    key={key}
                    colorName={item.name}
                    bgColor={item.bgColor}
                    borderColor={item.borderColor}
                    active={item.name === cardColor}
                    setColor={setCardColor}
                  />
                ))}
              </div>
            </div>
            <div className="w-full flex justify-between p-10 border-b tablet:flex-col tablet:p-7 mobile:p-5">
              <p className="max-w-xs w-full mr-10 font-medium laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2 mobile:text-sm">
                Hintergrundbilder
              </p>
              <div className="w-full flex flex-wrap gap-3 mobile:justify-center">
                <div className="flex flex-col space-y-2">
                  <p className="font-medium mobile:text-sm">Vorderseite</p>
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      setFrontBadge(acceptedFiles[0]);
                      setFrontTempBadge(URL.createObjectURL(acceptedFiles[0]));
                    }}
                    accept={{
                      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        className="w-64 h-48 flex justify-center items-center overflow-hidden rounded-2xl bg-[#F8F8F8] cursor-pointer laptop:w-56 laptop:h-40 mobile:self-center"
                        {...getRootProps()}
                      >
                        {frontBadge === undefined ? (
                          frontRealBadge === undefined ? (
                            <div className="w-full h-full flex flex-col justify-center items-center rounded-2xl p-2 hover:border hover:border-content hover:border-dashed">
                              <Images className="w-4 h-4 text-content" />
                              <p className="text-xs text-content text-center">
                                Erlaubte Dateitypen: .jpg, .jpeg, .png, . webp
                                (maximal 10MB)
                              </p>
                            </div>
                          ) : (
                            <div className="relative w-full h-full">
                              <Image
                                className="object-cover"
                                src={
                                  process.env.NEXT_PUBLIC_UPLOAD_URI +
                                  frontRealBadge
                                }
                                fill={true}
                                sizes="100%"
                                alt="frontBadge"
                              />
                              <Trash2
                                className="absolute top-2 right-1 w-4 h-4 text-destructive cursor-pointer z-20 hover:text-custom"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFrontBadge(undefined);
                                  setFrontRealBadge(undefined);
                                  setFrontRemoveBadge(true);
                                }}
                              />
                            </div>
                          )
                        ) : (
                          <div className="relative w-full h-full">
                            <Image
                              className="object-cover"
                              src={frontTempBadge}
                              fill={true}
                              sizes="100%"
                              alt="frontBadge"
                            />
                            <Trash2
                              className="absolute top-2 right-1 w-4 h-4 text-destructive cursor-pointer z-20 hover:text-custom"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFrontBadge(undefined);
                                setFrontRealBadge(undefined);
                                setFrontRemoveBadge(true);
                              }}
                            />
                          </div>
                        )}
                        <Input
                          {...getInputProps()}
                          className="hidden"
                          type="file"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </Dropzone>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="font-medium mobile:text-sm">Rückseite</p>
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      setBackBadge(acceptedFiles[0]);
                      setBackTempBadge(URL.createObjectURL(acceptedFiles[0]));
                    }}
                    accept={{
                      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        className="w-64 h-48 flex justify-center items-center overflow-hidden rounded-2xl bg-[#F8F8F8] cursor-pointer laptop:w-56 laptop:h-40 mobile:self-center"
                        {...getRootProps()}
                      >
                        {backBadge === undefined ? (
                          backRealBadge === undefined ? (
                            <div className="w-full h-full flex flex-col justify-center items-center rounded-2xl p-2 hover:border hover:border-content hover:border-dashed">
                              <Images className="w-4 h-4 text-content" />
                              <p className="text-xs text-content text-center">
                                Erlaubte Dateitypen: .jpg, .jpeg, .png, . webp
                                (maximal 10MB)
                              </p>
                            </div>
                          ) : (
                            <div className="relative w-full h-full">
                              <Image
                                className="object-cover"
                                src={
                                  process.env.NEXT_PUBLIC_UPLOAD_URI +
                                  backRealBadge
                                }
                                fill={true}
                                sizes="100%"
                                alt="backBadge"
                              />
                              <Trash2
                                className="absolute top-2 right-1 w-4 h-4 text-destructive cursor-pointer z-20 hover:text-custom"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBackBadge(undefined);
                                  setBackRealBadge(undefined);
                                  setBackRemoveBadge(true);
                                }}
                              />
                            </div>
                          )
                        ) : (
                          <div className="relative w-full h-full">
                            <Image
                              className="object-cover"
                              src={backTempBadge}
                              fill={true}
                              sizes="100%"
                              alt="backBadge"
                            />
                            <Trash2
                              className="absolute top-2 right-1 w-4 h-4 text-destructive cursor-pointer z-20 hover:text-custom"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBackBadge(undefined);
                                setBackRealBadge(undefined);
                                setBackRemoveBadge(true);
                              }}
                            />
                          </div>
                        )}
                        <Input
                          {...getInputProps()}
                          className="hidden"
                          type="file"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </Dropzone>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-5 p-10 border-b tablet:p-7 mobile:p-5">
              <div className="w-full flex justify-between tablet:flex-col">
                <div className="max-w-xs w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                  <p className="font-medium mobile:text-sm">Textfarbe</p>
                  <p className="text-sm text-content mobile:text-xs">
                    Wähle die Farbe des Textes auf deinem Ausweis
                  </p>
                </div>
                <div className="w-full flex flex-wrap gap-1 mobile:justify-center">
                  {cardTextColorData.map((item, key) => (
                    <Color
                      key={key}
                      colorName={item.name}
                      bgColor={item.bgColor}
                      borderColor={item.borderColor}
                      active={item.name === textColor}
                      setColor={setTextColor}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full flex justify-between tablet:flex-col">
                <div className="max-w-xs w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                  <p className="font-medium mobile:text-sm">Canbase Logofarbe</p>
                  <p className="text-sm text-content mobile:text-xs">
                    Wähle die Farbe des Canbase Logos
                  </p>
                </div>
                <div className="w-full flex flex-wrap gap-1 mobile:justify-center">
                  {cardTextColorData.map((item, key) => (
                    <Color
                      key={key}
                      colorName={item.name}
                      bgColor={item.bgColor}
                      borderColor={item.borderColor}
                      active={item.name === logoColor}
                      setColor={setLogoColor}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between p-10 border-b tablet:flex-col tablet:p-7 mobile:p-5">
              <div className="max-w-xs w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                <p className="font-medium mobile:text-sm">QR-Code Position</p>
                <p className="text-sm text-content mobile:text-xs">
                  Wähle wo der QR Code auf dem Ausweis platziert sein soll.
                </p>
              </div>
              <div className="w-full flex flex-col space-y-2 mobile:justify-center">
                <RadioGroup
                  className="flex flex-col space-y-1 gap-0"
                  defaultValue={position}
                  onValueChange={(e) => setPosition(e)}
                >
                  <Label
                    className="max-w-xl w-full group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer"
                    htmlFor="left"
                  >
                    <RadioGroupItem value="left" id="left" />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Links</p>
                      <p className="text-xs text-content group-hover:text-custom">
                        Platziere den QR Code Links auf dem Ausweis
                      </p>
                    </div>
                  </Label>
                  <Label
                    className="max-w-xl w-full group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer"
                    htmlFor="middle"
                  >
                    <RadioGroupItem value="middle" id="middle" />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Mittig</p>
                      <p className="text-xs text-content group-hover:text-custom">
                        Platziere den QR Code mittig auf dem Ausweis
                      </p>
                    </div>
                  </Label>
                  <Label
                    className="max-w-xl w-full group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer"
                    htmlFor="right"
                  >
                    <RadioGroupItem value="right" id="right" />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Rechts</p>
                      <p className="text-xs text-content group-hover:text-custom">
                        Platziere den QR Code Rechts auf dem Ausweis
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
            </div>
            <div className="flex flex-col space-y-5 p-10 border-b tablet:p-7 mobile:p-5">
              <div className="w-full flex justify-between items-center">
                <div className="max-w-xs w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-2">
                  <p className="font-medium mobile:text-sm">
                    Canbase Hintergrundlogo
                  </p>
                  <p className="text-sm text-content mobile:text-xs">
                    Wähle ob das Canbase Logo im Hintergrund angezeigt wird.
                  </p>
                </div>
                <div className="w-full flex justify-end tablet:w-fit">
                  <Switch
                    checked={logoShown}
                    onCheckedChange={() => setLogoShown((prev) => !prev)}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="max-w-xs w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-2">
                  <p className="font-medium mobile:text-sm">Club Avatar</p>
                  <p className="text-sm text-content mobile:text-xs">
                    Wähle ob der Club Avatar angezeigt wird.
                  </p>
                </div>
                <div className="w-full flex justify-end tablet:w-fit">
                  <Switch
                    checked={clubShown}
                    onCheckedChange={() => setClubShown((prev) => !prev)}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center items-center space-y-4 p-10 border-b tablet:p-7 mobile:p-5">
              <div className="group max-w-sm w-full [perspective:1000px]">
                <AspectRatio
                  className="cursor-pointer transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                  ratio={16 / 9}
                >
                  <div
                    className={cn(
                      "absolute w-full h-full border rounded-2xl overflow-hidden [backface-visibility:hidden]",
                      cardColor &&
                        cardBGColorData.filter(
                          (f: any) => f.name === cardColor
                        )[0].bgColor,
                      cardColor &&
                        cardBGColorData.filter(
                          (f: any) => f.name === cardColor
                        )[0].borderColor
                    )}
                  >
                    {frontRealBadge && (
                      <div className="absolute w-full h-full">
                        <Image
                          className="object-cover rounded-2xl"
                          src={
                            process.env.NEXT_PUBLIC_UPLOAD_URI + frontRealBadge
                          }
                          fill={true}
                          sizes="100%"
                          alt="frontBadge"
                        />
                      </div>
                    )}
                    {frontTempBadge && (
                      <div className="absolute w-full h-full">
                        <Image
                          className="object-cover rounded-2xl"
                          src={frontTempBadge}
                          fill={true}
                          sizes="100%"
                          alt="backBadge"
                        />
                      </div>
                    )}
                    {clubShown && (
                      <Avatar className="absolute top-4 left-4 w-12 h-12 mobile:w-8 mobile:h-8">
                        <AvatarImage
                          className="rounded-full"
                          src={
                            (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                            club?.avatar
                          }
                          alt="avatar"
                        />
                        <AvatarFallback className="border-white rounded-full bg-[#F8F8F8]">
                          <Home className="w-4 h-4 text-content mobile:w-3 mobile:h-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="absolute flex items-center top-4 right-4">
                      <Image
                        src="/assets/images/logo-white.svg"
                        width={16}
                        height={16}
                        alt="logo"
                      />
                    </div>
                    <div className="absolute flex flex-col space-y-1 bottom-4 left-4 mobile:space-y-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          textColor &&
                            cardTextColorData.filter(
                              (f: any) => f.name === textColor
                            )[0].textColor
                        )}
                      >
                        {user?.username && user.username}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          textColor &&
                            cardTextColorData.filter(
                              (f: any) => f.name === textColor
                            )[0].textColor
                        )}
                      >
                        {club?.clubname && club.clubname}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          textColor &&
                            cardTextColorData.filter(
                              (f: any) => f.name === textColor
                            )[0].textColor
                        )}
                      >
                        {user?.memberID &&
                          club?.clubID &&
                          `${club.clubID}-${user.memberID}`}
                      </p>
                    </div>
                    {logoShown && (
                      <div className="absolute w-full h-full top-1/4 -right-1/4">
                        <Image
                          src="/assets/images/card-logo.svg"
                          fill={true}
                          sizes="100%"
                          alt="card-logo"
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "absolute w-full h-full border rounded-2xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]",
                      cardColor &&
                        cardBGColorData.filter(
                          (f: any) => f.name === cardColor
                        )[0].bgColor,
                      cardColor &&
                        cardBGColorData.filter(
                          (f: any) => f.name === cardColor
                        )[0].borderColor
                    )}
                  >
                    {backRealBadge && (
                      <div className="absolute w-full h-full">
                        <Image
                          className="object-cover rounded-2xl"
                          src={
                            process.env.NEXT_PUBLIC_UPLOAD_URI + backRealBadge
                          }
                          fill={true}
                          sizes="100%"
                          alt="backBadge"
                        />
                      </div>
                    )}
                    {backTempBadge && (
                      <div className="absolute w-full h-full">
                        <Image
                          className="object-cover rounded-2xl"
                          src={backTempBadge}
                          fill={true}
                          sizes="100%"
                          alt="backBadge"
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        "absolute w-full h-full flex items-center px-5",
                        position === "left" && "justify-start",
                        position === "middle" && "justify-center",
                        position === "right" && "justify-end"
                      )}
                    >
                      <div className="flex flex-col justify-center items-center space-y-1">
                        <div className="border border-white z-50">
                          {user?.memberID && club?.clubID && (
                            <Canvas
                              text={`${club.clubID}-${user.memberID}`}
                              options={{
                                width: 100,
                                margin: 0,
                              }}
                            />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs",
                            textColor &&
                              cardTextColorData.filter(
                                (f: any) => f.name === textColor
                              )[0].textColor
                          )}
                        >
                          {user?.memberID &&
                            club?.clubID &&
                            `${club.clubID}-${user.memberID}`}
                        </p>
                      </div>
                    </div>
                    {logoShown && (
                      <div className="absolute w-full h-full top-1/4 -right-1/4">
                        <Image
                          src="/assets/images/card-logo.svg"
                          fill={true}
                          sizes="100%"
                          alt="card-logo"
                        />
                      </div>
                    )}
                  </div>
                </AspectRatio>
              </div>
            </div>
            <div className="flex justify-end p-10 tablet:p-7 mobile:p-5">
              <Button
                className="h-10 px-4 bg-custom mobile:w-full hover:bg-customhover"
                onClick={handleCardSubmit}
                disabled={
                  user?.role !== "owner" &&
                  !user?.functions?.includes("club-settings-design-manage")
                }
              >
                {cardLoading ? (
                  <ClipLoader
                    aria-label="loader"
                    data-testid="loader"
                    color="white"
                    size={16}
                  />
                ) : (
                  <span className="text-sm">Speichern</span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubDesignPage;
