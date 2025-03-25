"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ClipLoader from "react-spinners/ClipLoader";
import BarLoader from "react-spinners/BarLoader";
import {
  BadgeCheck,
  Images,
  Info,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { clubActions } from "@/store/reducers/clubReducer";
import { updateClub } from "@/actions/club";
import ProfileInput from "@/components/basic/ProfileInput";
import AddressInput from "@/components/basic/AddressInput";
import AvatarCropper from "@/components/basic/AvatarCropper";
import BannerCropper from "@/components/basic/BannerCropper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ClubProfileFormSchema } from "@/constant/formschema";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactCrop, { type Crop } from 'react-image-crop'
import "react-image-crop/dist/ReactCrop.css";

const ClubProfilePage = () => {
  const dispatch = useAppDispatch();
  const { club } = useAppSelector((state) => state.club);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [badge, setBadge] = useState<any>();
  const [tempBadge, setTempBadge] = useState<any>();
  const [realbadge, setRealBadge] = useState<any>();
  const [removeBadge, setRemoveBadge] = useState<any>(false);
  const [avatar, setAvatar] = useState<any>();
  const [tempAvatar, setTempAvatar] = useState<any>();
  const [realAvatar, setRealAvatar] = useState<any>();
  const [removeAvatar, setRemoveAvatar] = useState<any>(false);
  const [mapPosition, setMapPosition] = useState([52.52, 13.405]);
  const [maker, setMaker] = useState(false);
  const [avatarCropperOpen, setAvatarCropperOpen] = useState(false);
  const [tempAvatarFile, setTempAvatarFile] = useState<File | null>(null);
  const [bannerCropperOpen, setBannerCropperOpen] = useState(false);
  const [tempBannerFile, setTempBannerFile] = useState<File | null>(null);
  const [bannerImageSrc, setBannerImageSrc] = useState("");
  const [bannerImageRef, setBannerImageRef] = useState<any>();
  const [bannerCrop, setBannerCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });

  const form = useForm<z.infer<typeof ClubProfileFormSchema>>({
    resolver: zodResolver(ClubProfileFormSchema),
    defaultValues: {
      clubname: "",
      website: "",
      email: "",
      phone: "",
      street: "",
      address: "",
      postcode: "",
      city: "",
      country: "",
      description: "",
      prevent_info: "",
      info_members: "",
      discord: "",
      tiktok: "",
      youtube: "",
      twitch: "",
      instagram: "",
      twitter: "",
      facebook: "",
      imprint: "",
      maxUser: 500,
      minAge: 18,
    },
  });

  const handleMapInfo = async () => {
    try {
      const query = `${form.getValues("address")} ${form.getValues(
        "street"
      )}, ${form.getValues("postcode")} ${form.getValues(
        "city"
      )}, ${form.getValues("country")}`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json`
      );

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];

        form.setValue("lat", parseFloat(lat));
        form.setValue("lng", parseFloat(lon));

        setMapPosition([parseFloat(lat), parseFloat(lon)]);
        setMaker(true);
      } else {
        toast({
          className:
            "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
          description: "Keine gültige Adresse.",
        });
      }
    } catch (err) {
      toast({
        className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
        description: "Keine gültige Adresse.",
      });
    }
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/basic/ProfileMap"), {
        loading: () => (
          <div className="w-full h-52 flex justify-center items-center  ">
            <BarLoader
              aria-label="loader"
              data-testid="loader"
              color="#19A873"
            />
          </div>
        ),
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    form.reset(club as any);

    if (club?.lat && club.lng) {
      setMaker(true);
    } else {
      setMaker(false);
    }

    setMapPosition([
      club?.lat ? club.lat : 52.52,
      club?.lng ? club.lng : 13.405,
    ]);

    setRealBadge(club?.badge);
    setRealAvatar(club?.avatar);
  }, [form, club]);

  const onSubmit = async (data: z.infer<typeof ClubProfileFormSchema>) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      value !== undefined && formData.append(key, value as string);
    });

    formData.append("avatar", avatar);
    formData.append("badge", badge);
    formData.append("removeAvatar", removeAvatar);
    formData.append("removeBadge", removeBadge);

    const result = await updateClub(formData);

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(clubActions.setClub({ club: result.club }));
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full my-8">
        <CardContent className="p-0">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl">Mein Club</h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Hier kannst du Deinen Club anpassen nach Deinen Bedürfnissen
            </p>
          </div>
          <Form {...form}>
            <form
              className="w-full flex flex-col p-10 tablet:p-7 mobile:p-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-6">
                <div
                  className="w-full flex justify-between mb-20 tablet:flex-col"
                  id="banner-avatar"
                >
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Banner & Avatar</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Wähle ein Banner und ein Avatar für deinen Club aus. Das
                      optimale Format des Banners ist 16:5 (z.B. 1600x500px).
                      Der Avatar sollte quadratisch sein (z.B. 500x500px). Die
                      Bilder werden unter Anderem in der Clubsuche angezeigt.
                    </p>
                  </div>
                  <div className="w-full">
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        setTempBannerFile(acceptedFiles[0]);
                        setBannerImageSrc(URL.createObjectURL(acceptedFiles[0]));
                        setBannerCropperOpen(true);
                      }}
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className="relative w-full h-full min-h-40 flex justify-center items-center overflow-hidden rounded-2xl bg-[#F8F8F8] cursor-pointer hover:border hover:border-content hover:border-dashed"
                          {...getRootProps()}
                        >
                          {badge === undefined ? (
                            realbadge === undefined ? (
                              <div className="flex flex-col justify-center items-center p-5">
                                <Images className="w-4 h-4 text-content" />
                                <p className="text-xs	text-content text-center">
                                  Erlaubte Dateitypen: .jpg, .jpeg, .png, .webp
                                  (maximal 10MB)
                                </p>
                              </div>
                            ) : (
                              <>
                                <Image
                                  className="object-cover"
                                  src={
                                    process.env.NEXT_PUBLIC_UPLOAD_URI +
                                    realbadge
                                  }
                                  fill={true}
                                  sizes="100%"
                                  alt="badge"
                                />
                                <Trash2
                                  className="absolute top-2 right-2 w-8 h-8 p-1.5 bg-white rounded-full text-destructive cursor-pointer z-20 hover:text-custom shadow-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBadge(undefined);
                                    setRealBadge(undefined);
                                    setRemoveBadge(true);
                                  }}
                                />
                              </>
                            )
                          ) : (
                            <>
                              <Image
                                className="object-cover"
                                src={tempBadge}
                                fill={true}
                                sizes="100%"
                                alt="badge"
                              />
                              <Trash2
                                className="absolute top-2 right-2 w-8 h-8 p-1.5 bg-white rounded-full text-destructive cursor-pointer z-20 hover:text-custom shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBadge(undefined);
                                  setTempBadge(undefined);
                                  setRemoveBadge(true);
                                }}
                              />
                            </>
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
                    <div className="relative z-10">
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
                            className="absolute -top-16 left-7 w-32 h-32 flex justify-center items-center rounded-full overflow-hidden bg-[#F8F8F8] cursor-pointer border-2 border-white mobile:left-1/2 mobile:-translate-x-16"
                            {...getRootProps()}
                          >
                            {avatar === undefined ? (
                              realAvatar === undefined ? (
                                <div className="w-full h-full flex flex-col justify-center items-center rounded-full hover:border hover:border-content hover:border-dashed">
                                  <Images className="w-4 h-4 text-content" />
                                  <p className="text-[10px] text-content text-center">
                                    .jpg, .jpeg, .png, .webp
                                  </p>
                                </div>
                              ) : (
                                <div className="relative w-full h-full">
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
                                  <Trash2
                                    className="absolute top-1/2 right-0 w-8 h-8 p-1.5 bg-white rounded-full text-destructive cursor-pointer z-20 hover:text-custom shadow-md -translate-y-1/2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAvatar(undefined);
                                      setRealAvatar(undefined);
                                      setRemoveAvatar(true);
                                    }}
                                  />
                                </div>
                              )
                            ) : (
                              <div className="relative w-full h-full">
                                <Image
                                  className="object-cover"
                                  src={tempAvatar}
                                  fill={true}
                                  sizes="100%"
                                  alt="avatar"
                                />
                                <Trash2
                                  className="absolute top-1/2 right-0 w-8 h-8 p-1.5 bg-white rounded-full text-destructive cursor-pointer z-20 hover:text-custom shadow-md -translate-y-1/2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAvatar(undefined);
                                    setTempAvatar(undefined);
                                    setRemoveAvatar(true);
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
                <ProfileInput
                  form={form.control}
                  id="clubname"
                  title="Name*"
                  placeholder="CSC e.V."
                />
                <ProfileInput
                  form={form.control}
                  id="website"
                  title="Website"
                  placeholder="https://www.beispiel.de"
                />
                <ProfileInput
                  form={form.control}
                  id="email"
                  type="email"
                  title="E-Mail"
                  placeholder="info@beispiel.de"
                />
                <ProfileInput
                  form={form.control}
                  id="phone"
                  title="Telefon"
                  placeholder="0123456789"
                />
                <AddressInput form={form.control} />
                <div className="w-full flex justify-between tablet:flex-col">
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Standort</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Bestimme den Breiten- und Längengrad um deinen Club
                      perfekt auf der Karte zu positionieren.
                    </p>
                  </div>
                  <div className="w-full space-y-3">
                    <div className="flex space-x-3 tablet:flex-col tablet:space-x-0 tablet:space-y-3">
                      <FormField
                        control={form.control}
                        name="lat"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                className="h-9 hidden"
                                type="number"
                                placeholder="Breitengrad (Latitude)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-left" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lng"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                className="h-9 hidden"
                                type="number"
                                placeholder="Längengrad (Longitude)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-left" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div
                        className="text-sm cursor-pointer hover:underline hover:text-customhover"
                        onClick={handleMapInfo}
                      >
                        Koordinaten aus Adressdaten generieren
                      </div>
                      <div className="relative overflow-hidden">
                        <Map
                          latLng={mapPosition}
                          maker={maker}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ProfileInput
                  form={form.control}
                  type="textarea"
                  id="description"
                  title="Beschreibung"
                  content="Beschreibe die Besonderheit deines Clubs."
                  placeholder="Beschreibung"
                />
                <ProfileInput
                  form={form.control}
                  type="textarea"
                  id="prevent_info"
                  title="Jugendschutz & Prävention"
                  content="Dieser Abschnitt ist für dein Jugendschutz- und Päventionsteam gedacht. Füge Kontaktdaten, allgemeine Hinweise und weitere Anlaufstellen für deine Mitglieder hinzu."
                  placeholder="Jugendschutz & Prävention"
                />
                <ProfileInput
                  form={form.control}
                  type="textarea"
                  id="info_members"
                  title="Informationen für Mitglieder"
                  content="In diesem Abschnitt hinterlegst du weitere Informationen für deine Mitglieder. Beispielsweise die meist gestellten Fragen."
                  placeholder="Informationen für Mitglieder"
                />
                <ProfileInput
                  form={form.control}
                  id="discord"
                  title="Discord"
                  placeholder="https://discord.gg/"
                />
                <ProfileInput
                  form={form.control}
                  id="tiktok"
                  title="TikTok"
                  placeholder="https://tiktok.com/"
                />
                <ProfileInput
                  form={form.control}
                  id="youtube"
                  title="YouTube"
                  placeholder="https://youtube.com/"
                />
                <ProfileInput
                  form={form.control}
                  id="twitch"
                  title="Twitch"
                  placeholder="https://twitch.tv/"
                />
                <ProfileInput
                  form={form.control}
                  id="instagram"
                  title="Instagram"
                  placeholder="https://instagram.com/"
                />
                <ProfileInput
                  form={form.control}
                  id="twitter"
                  title="X"
                  placeholder="https://x.com/"
                />
                <ProfileInput
                  form={form.control}
                  id="facebook"
                  title="Facebook"
                  placeholder="https://facebook.com/"
                />
                <ProfileInput
                  form={form.control}
                  type="textarea"
                  id="imprint"
                  title="Impressum"
                  content="Hier kannst du ein offizielles Impressum für deinen Club hinterlegen."
                  placeholder={`Beispiel Club e.V.\nMusterstraße 12A\n21212 Musterstadt`}
                />
                <ProfileInput
                  form={form.control}
                  type="number"
                  id="maxUser"
                  title="Maximale Anzahl an Mitgliedern"
                  content="Nach Erreichen dieses Limits können keine weiteren Mitglieder hinzugefügt werden."
                  minValue={club?.users}
                  placeholder="500"
                  maxValue={500}
                />
                <ProfileInput
                  form={form.control}
                  type="number"
                  id="minAge"
                  title="Mindestalter"
                  content="Das Mindestalter, um Mitglied im Club zu werden."
                  minValue={18}
                  placeholder="18"
                />
                <div className="w-full flex justify-between tablet:flex-col">
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Clubkennung</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Die Kennung wird verwendet, um den Club zu identifizieren
                      und Mitgliedsnummern zu generieren.
                    </p>
                  </div>
                  <p className="w-full">{club?.clubID}</p>
                </div>
                <div className="w-full flex justify-between tablet:flex-col">
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">Clubstatus</p>
                    <p className="text-sm text-content mobile:text-xs">
                      Der Gründungsstatus des Clubs (z.B. e.V., e.G., i.G.
                      etc.). Wende dich an den Support um den Gründungsstatus zu
                      ändern.
                    </p>
                  </div>
                  <div className="w-full h-fit flex flex-wrap gap-3">
                    {club?.status === "default" && (
                      <Badge className="w-fit p-1.5 text-xs text-[#D5B100] leading-[8px] bg-[#D5B100]/25 rounded-md">
                        In Gründung
                      </Badge>
                    )}
                    {club?.status === "verify" && (
                      <>
                        <Badge className="w-fit p-1.5 text-xs text-[#D5B100] leading-[8px] bg-[#D5B100]/25 rounded-md">
                          In Gründung
                        </Badge>
                      </>
                    )}
                    {club?.status === "license" && (
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
                {(club?.status === "verify" || club?.status === "license") && (
                  <div className="flex space-x-2 p-3 bg-[#55A3FF]/10 border-l-2 border-l-[#55A3FF] rounded-lg">
                    <Info className="w-4 h-4 m-0.5 text-white" fill="#55A3FF" />
                    <div className="flex flex-col text-[#55A3FF]">
                      <p className="text-sm font-semibold text-[#55A3FF]">
                        Dein Club muss erst verifiziert werden, bevor er
                        öffentlich angezeigt werden kann!
                      </p>
                      <p className="text-xs">
                        Kontaktiere dazu einfach den Support unter
                        support@canbase.de und wir werden uns umgehend um eure
                        Verifizierung kümmern.
                      </p>
                    </div>
                  </div>
                )}
                <div className="w-full flex justify-between tablet:flex-col">
                  <div className="max-w-64 w-full flex flex-col space-y-2 mr-10 laptop:max-w-44 laptop:mr-5 tablet:max-w-none tablet:mr-0 tablet:mb-2">
                    <p className="font-medium mobile:text-sm">
                      Club öffentlich anzeigen
                    </p>
                    <p className="text-sm text-content mobile:text-xs">
                      Nutzer von Canbase können deinen Club über die Clubsuche
                      finden und eine Mitgliedsanfrage stellen.
                    </p>
                  </div>
                  <p className="w-full text-sm text-content mobile:text-xs">
                    Club öffentlich auf Canbase anzeigen
                  </p>
                </div>
              </div>
              <Button
                className="h-10 self-end px-4 mt-40 bg-custom tablet:mt-20 mobile:w-full mobile:mt-10 hover:bg-customhover"
                type="submit"
                disabled={
                  user?.role !== "owner" &&
                  !user?.functions?.includes("club-settings-profile-manage")
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
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={bannerCropperOpen} onOpenChange={() => {
        setBannerCropperOpen(false);
        setTempBannerFile(null);
      }}>
        <DialogContent className="max-w-[90vw] w-[1000px] rounded-xl">
          <DialogHeader className="text-left">
            <DialogTitle>Banner zuschneiden</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex items-center justify-center">
            {tempBannerFile && (
              <div className="relative w-full">
                <ReactCrop
                  crop={bannerCrop}
                  onChange={(c) => {
                    setBannerCrop(c);
                  }}
                  aspect={3}
                >
                  <Image
                    ref={(ref) => setBannerImageRef(ref)}
                    src={bannerImageSrc}
                    width="0"
                    height="0"
                    alt="Crop me"
                    style={{
                      maxWidth: '100%',
                      width: 'auto'
                    }}
                  />
                </ReactCrop>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setBannerCropperOpen(false);
              setTempBannerFile(null);
            }}>
              Abbrechen
            </Button>
            <Button onClick={() => {
              if (!bannerImageRef) return;

              const canvas = document.createElement('canvas');
              const scaleX = bannerImageRef.naturalWidth / bannerImageRef.width;
              const scaleY = bannerImageRef.naturalHeight / bannerImageRef.height;
              
              canvas.width = bannerCrop.width;
              canvas.height = bannerCrop.height;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) return;

              ctx.drawImage(
                bannerImageRef,
                bannerCrop.x * scaleX,
                bannerCrop.y * scaleY,
                bannerCrop.width * scaleX,
                bannerCrop.height * scaleY,
                0,
                0,
                bannerCrop.width,
                bannerCrop.height
              );

              canvas.toBlob((blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.addEventListener("load", () => {
                    setTempBadge(reader.result);
                  });
                  reader.readAsDataURL(blob);
                  setBadge(blob);
                  setBannerCropperOpen(false);
                  setTempBannerFile(null);
                }
              }, 'image/jpeg', 1);
            }}>
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
    </div>
  );
};

export default ClubProfilePage;
