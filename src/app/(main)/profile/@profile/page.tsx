"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft, Home, Images, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { userActions } from "@/store/reducers/userReducer";
import { updateUser } from "@/actions/user";
import ProfileInput from "@/components/basic/ProfileInput";
import DateOTPInput from "@/components/basic/DateOTPInput";
import AddressInput from "@/components/basic/AddressInput";
import TextGroup from "@/components/basic/TextGroup";
import AvatarCropper from "@/components/basic/AvatarCropper";
import SafeHTML from "@/components/basic/SafeHTML";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { MyProfileFormSchema } from "@/constant/formschema";
import {
  cardBGColorData,
  cardTextColorData,
  colorData,
} from "@/constant/colors";
import { getCleanDate, isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { resolve } from "node:dns";

const MineProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { club } = useAppSelector((state) => state.club);

  const { Canvas } = useQRCode();
  const { toast } = useToast();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<any>();
  const [tempAvatar, setTempAvatar] = useState<any>();
  const [realAvatar, setRealAvatar] = useState<any>();
  const [removeAvatar, setRemoveAvatar] = useState<any>(false);
  const [avatarCropperOpen, setAvatarCropperOpen] = useState(false);
  const [tempAvatarFile, setTempAvatarFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof MyProfileFormSchema>>({
    resolver: zodResolver(MyProfileFormSchema),
    defaultValues: {
      username: "",
      birth: new Date(),
      email: "",
      phone: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      bio: "",
    },
  });
  
  useEffect(() => {
    form.reset(user as any);

    setRealAvatar(user?.avatar);
  }, [form, user]);

  const onSubmit = async (data: z.infer<typeof MyProfileFormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      value !== undefined && formData.append(key, value as string);
    });

    formData.append("avatar", avatar);
    formData.append("removeAvatar", removeAvatar);

    const result = await updateUser(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(userActions.setUser({ user: result.user }));

      setIsEdit(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        {isEdit && (
          <Button
            className="h-auto w-fit flex space-x-2 rounded-2xl"
            variant="outline"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="text-xs">Zurück</span>
          </Button>
        )}
        <Card>
          <CardContent className="p-0">
            <div className="p-6 pb-5 border-b tablet:p-5 tablet:pb-3 mobile:p-4 mobile:pb-3">
              <h1 className="text-xl font-semibold tablet:text-xl">Profil</h1>
              <p className="pt-1.5 text-sm text-content mobile:text-xs">
                Dein Club kann diese Daten einsehen, um dich zu verifizieren und
                um deine Mitgliedschaft zu verwalten.
              </p>
            </div>
            <div className="p-6 tablet:p-5 mobile:p-4">
              {!isEdit ? (
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <TextGroup title="Name" value={user?.username ?? ""} />
                    
                    <TextGroup title="E-Mail" value={user?.email ?? ""} />
                    <TextGroup title="Telefon" value={user?.phone ?? ""} />
                    <TextGroup
                      title="Adresse"
                      value={`${user?.street ?? ""} ${user?.address ?? ""} ${
                        user?.postcode ?? ""
                      } ${user?.city ?? ""} ${user?.country ?? ""}`}
                    />
                    <TextGroup
                      title="Geburtsdatum"
                      value={user?.birth ? getCleanDate(user?.birth, 1) : ""}
                    />
                    <TextGroup
                      type="last"
                      title="Biografie"
                      html={<SafeHTML html={user?.bio || ""} />}
                    />
                  </div>
                  <Button
                    className="h-10 self-end px-4 mt-14 text-sm bg-custom mobile:w-full mobile:mt-7 hover:bg-customhover"
                    onClick={() => setIsEdit((prev) => !prev)}
                  >
                    Bearbeiten
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="relative h-36 mb-16 tablet:mb-8">
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        setTempAvatarFile(acceptedFiles[0]);
                        setAvatarCropperOpen(true);
                      }}
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className="relative w-36 h-36 flex justify-center items-center overflow-hidden rounded-full bg-[#F8F8F8] cursor-pointer mobile:self-center"
                          {...getRootProps()}
                        >
                          {avatar === undefined ? (
                            realAvatar === undefined ? (
                              <div className="w-full h-full flex flex-col justify-center rounded-full items-center hover:border hover:border-content hover:border-dashed">
                                <Images className="w-4 h-4 text-content" />
                                <p className="text-xs text-content text-center">
                                  .jpg, .jpeg, .png, .webp
                                </p>
                              </div>
                            ) : (
                              <>
                                <Image
                                  className="object-cover"
                                  src={
                                    process.env.NEXT_PUBLIC_UPLOAD_URI +
                                    realAvatar
                                  }
                                  fill={true}
                                  sizes="100%"
                                  alt="avatar"
                                />
                              </>
                            )
                          ) : (
                            <>
                              <Image
                                className="object-cover"
                                src={tempAvatar}
                                fill={true}
                                sizes="100%"
                                alt="avatar"
                              />
                            </>
                          )}
                        </div>
                      )}
                    </Dropzone>
                    {(realAvatar !== undefined || avatar !== undefined) && (
                      <div className="absolute left-0 top-0 w-36 mobile:self-center">
                        <Trash2
                          className="absolute left-0 top-4 w-8 h-8 p-1.5 bg-white rounded-full text-destructive cursor-pointer hover:text-custom shadow-md -translate-x-1/3"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAvatar(undefined);
                            setRealAvatar(undefined);
                            setRemoveAvatar(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <Form {...form}>
                    <form
                      className="w-full flex flex-col"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <div className="space-y-6">
                        <ProfileInput
                          form={form.control}
                          id="username"
                          title="Name*"
                          placeholder="Max Mustermann"
                        />
                        
                        <div className="w-full flex justify-between tablet:flex-col">
                          <div className="w-full max-w-64 flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                            <p className="font-medium mobile:text-sm">Geburtsdatum*</p>
                          </div>
                          <div className="w-full">
                            <DateOTPInput
                              form={form.control}
                              id="birth"
                            />
                          </div>
                        </div>
                        <ProfileInput
                          form={form.control}
                          id="email"
                          type="email"
                          title="E-Mail"
                          content="Um Accountdiebstahl vorzubeugen wende Dich bitte zum ändern Deiner E-Mail Adresse an: support@canbase.de."
                          placeholder="info@beispiel.de"
                          disabled
                        />
                        <ProfileInput
                          form={form.control}
                          id="phone"
                          title="Telefon"
                          placeholder="0123456789"
                        />
                        <AddressInput form={form.control} />
                        <ProfileInput
                          form={form.control}
                          type="textarea"
                          id="bio"
                          title="Biografie"
                          content="Bitte beachte, dass deine Bio eventuell für andere Mitglieder sichtbar ist. Teile nur Infos, die du auch öffentlich machen möchtest."
                          placeholder="Biografie"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-16 tablet:mt-8 mobile:justify-evenly">
                        <Button
                          className="h-10 px-4 mobile:px-2"
                          type="button"
                          variant="outline"
                          onClick={() => setIsEdit((prev) => !prev)}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          className="h-10 px-4 bg-custom mobile:px-2 hover:bg-customhover"
                          type="submit"
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
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <AvatarCropper
          imageFile={tempAvatarFile}
          onCropComplete={(croppedImage) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setTempAvatar(reader.result);
            });
            reader.readAsDataURL(croppedImage);
            setAvatar(croppedImage);
            setAvatarCropperOpen(false);
            setTempAvatarFile(null);
          }}
          onCancel={() => {
            setAvatarCropperOpen(false);
            setTempAvatarFile(null);
          }}
          open={avatarCropperOpen}
        />
        <AvatarCropper
          imageFile={tempAvatarFile}
          onCropComplete={(croppedImage) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setTempAvatar(reader.result);
            });
            reader.readAsDataURL(croppedImage);
            setAvatar(croppedImage);
            setAvatarCropperOpen(false);
            setTempAvatarFile(null);
          }}
          onCancel={() => {
            setAvatarCropperOpen(false);
            setTempAvatarFile(null);
          }}
          open={avatarCropperOpen}
        />
        {!isEmpty(user?.club) && !isEdit && (
          <Card>
            <CardContent className="p-0">
              <div className="p-6 pb-4 border-b tablet:p-5 tablet:pb-3 mobile:p-4 mobile:pb-3">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Mitgliedsausweis
                </h1>
                <p className="pt-1.5 text-sm text-content mobile:text-xs">
                  Verwende deinen QR-Code zur Identifikation gegenüber dem Club.
                </p>
              </div>
              <div className="w-full flex flex-col p-6 tablet:p-5 mobile:w-full mobile:p-4">
                <div className="group max-w-sm w-full [perspective:1000px]">
                  <AspectRatio
                    className="cursor-pointer transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                    ratio={16 / 9}
                  >
                    <div
                      className={cn(
                        "absolute w-full h-full border rounded-2xl overflow-hidden [backface-visibility:hidden]",
                        club?.card?.cardColor &&
                          cardBGColorData.filter(
                            (f: any) => f.name === club.card?.cardColor
                          )[0].bgColor,
                        club?.card?.cardColor &&
                          cardBGColorData.filter(
                            (f: any) => f.name === club.card?.cardColor
                          )[0].borderColor
                      )}
                    >
                      {club?.card?.frontBadge && (
                        <div className="absolute w-full h-full">
                          <Image
                            className="object-cover rounded-2xl"
                            src={
                              process.env.NEXT_PUBLIC_UPLOAD_URI +
                              club.card.frontBadge
                            }
                            fill={true}
                            sizes="100%"
                            alt="frontBadge"
                          />
                        </div>
                      )}
                      {club?.card?.clubShown && (
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
                            club?.card?.textColor &&
                              cardTextColorData.filter(
                                (f: any) => f.name === club.card?.textColor
                              )[0].textColor
                          )}
                        >
                          {user?.username && user.username}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            club?.card?.textColor &&
                              cardTextColorData.filter(
                                (f: any) => f.name === club.card?.textColor
                              )[0].textColor
                          )}
                        >
                          {club?.clubname && club.clubname}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            club?.card?.textColor &&
                              cardTextColorData.filter(
                                (f: any) => f.name === club.card?.textColor
                              )[0].textColor
                          )}
                        >
                          {user?.memberID &&
                            club?.clubID &&
                            `${club.clubID}-${user.memberID}`}
                        </p>
                      </div>
                      {club?.card?.logoShown && (
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
                        club?.card?.cardColor &&
                          cardBGColorData.filter(
                            (f: any) => f.name === club.card?.cardColor
                          )[0].bgColor,
                        club?.card?.cardColor &&
                          cardBGColorData.filter(
                            (f: any) => f.name === club.card?.cardColor
                          )[0].borderColor
                      )}
                    >
                      {club?.card?.backBadge && (
                        <div className="absolute w-full h-full">
                          <Image
                            className="object-cover rounded-2xl"
                            src={
                              process.env.NEXT_PUBLIC_UPLOAD_URI +
                              club.card.backBadge
                            }
                            fill={true}
                            sizes="100%"
                            alt="backBadge"
                          />
                        </div>
                      )}
                      <div
                        className={cn(
                          "absolute w-full h-full flex items-center px-5",
                          club?.card?.position === "left" && "justify-start",
                          club?.card?.position === "middle" && "justify-center",
                          club?.card?.position === "right" && "justify-end"
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
                              club?.card?.textColor &&
                                cardTextColorData.filter(
                                  (f: any) => f.name === club?.card?.textColor
                                )[0].textColor
                            )}
                          >
                            {user?.memberID &&
                              club?.clubID &&
                              `${club.clubID}-${user.memberID}`}
                          </p>
                        </div>
                      </div>
                      {club?.card?.logoShown && (
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
            </CardContent>
          </Card>
        )}
        {!isEmpty(user?.club) && !isEdit && (
          <Card>
            <CardContent className="p-0">
              <div className="p-6 pb-4 border-b tablet:p-5 tablet:pb-3 mobile:p-4 mobile:pb-3">
                <h1 className="text-2xl font-semibold tablet:text-xl">
                  Meine Mitgliedschaft
                </h1>
                <p className="pt-1.5 text-sm text-content mobile:text-xs">
                  {user?.club?.clubname} / {user?.club?.clubID}-{user?.memberID}
                </p>
              </div>
              <div className="flex flex-col p-6 tablet:p-5 mobile:p-4">
                <div className="grid grid-cols-2 mobile:grid-cols-1 mobile:gap-5">
                  <div className="flex flex-col space-y-3">
                    <p className="text-sm text-content mobile:text-xs">
                      Status
                    </p>
                    <div className="flex flex-col space-y-2 mobile:flex-row mobile:space-x-2 mobile:space-y-0">
                      {user?.status === "active" && (
                        <Badge className="w-fit h-fit p-1.5 bg-[#F9FFE8] text-xs text-[#627838] leading-[8px] border border-[#E8ECDD]">
                          Aktiv
                        </Badge>
                      )}
                      {user?.status === "inactive" && (
                        <Badge className="w-fit h-fit p-1.5 bg-[#FEF0F2] text-xs text-[#BD4C4D] leading-[8px] border border-[#F5DFE2]">
                          Inaktiv
                        </Badge>
                      )}
                      {user?.status === "pending" && (
                        <Badge className="w-fit h-fit p-1.5 bg-[#0094FF]/25 text-xs text-[#1C73B2] leading-[8px]">
                          Angefragt
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <p className="text-sm text-content mobile:text-xs">
                      Rollen
                    </p>
                    <div className="flex flex-wrap gap-2 max-w-[250px] w-full mobile:max-w-none">
                      {user?.clubrole?.map((item, key) => (
                        <Badge
                          className="w-fit flex space-x-1 p-2 border border-[#E7E7E7]"
                          key={key}
                          variant="secondary"
                        >
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              colorData.filter(
                                (f) => f.name === item.rolecolor
                              )[0].bgColor
                            )}
                          />
                          <p className="text-xs leading-[8px]">
                            {item.rolename}
                          </p>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MineProfilePage;
