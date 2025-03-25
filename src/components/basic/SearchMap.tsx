"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { BadgeCheck, Globe, Home, Mail, Phone } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { joinClub } from "@/actions/club";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AspectRatio } from "../ui/aspect-ratio";
import { useToast } from "../ui/use-toast";
import { Dialog, DialogContent } from "../ui/dialog";
import { isEmpty } from "@/lib/functions";

const ICON = icon({
  iconUrl: "/assets/images/maker.svg",
  iconSize: [32, 32],
});

const LOCATION_ICON = icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iNiIgZmlsbD0iIzM0OTVmZiIvPjwvc3ZnPg==",
  iconSize: [12, 12],
  className: "location-marker"
});


const SearchMap = ({
  clubData,
  latLng,
  height,
  markers = [],
}: {
  clubData: any;
  latLng: any;
  height: any;
  markers?: [number, number][];
}) => {
  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { toast } = useToast();

  const [key, setKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [mapType, setMapType] = useState<'default' | 'satellite'>('default');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [latLng, height, clubData]);

  const handleJoinClub = async (clubID: string) => {
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

  const toggleMapType = () => {
    setMapType(prev => prev === 'default' ? 'satellite' : 'default');
  };

  const handleLocationClick = () => {
    if ("geolocation" in navigator) {
      setIsLocationActive(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      });
    }
  };

  return (
    <MapContainer
      key={key}
      className="w-full h-full"
      center={latLng}
      zoom={12}
      scrollWheelZoom={true}
      attributionControl={false}
      ref={mapRef}
    >
              <TileLayer
                url={mapType === 'default' 
                  ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                }
                attribution={mapType === 'default'
                  ? '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                  : '© <a href="https://www.esri.com">Esri</a>'
                }
              />
              {markers.map((position, index) => (
                <Marker 
                  key={`marker-${index}`} 
                  position={position} 
                  icon={ICON}
                >
                  <div className="relative flex size-[28px] items-center justify-center rounded-full bg-white shadow-xl">
                    <div className="bg-primary-500 relative size-[22px] overflow-hidden rounded-full">
                      <Image alt="Image" className="absolute bottom-0 right-[2px] mx-auto size-[18px] opacity-30" src="/assets/logo_bg-CfEdIvDv.svg" />
                    </div>
                  </div>
                </Marker>
              ))}
              {userLocation && (
                <Marker 
                  position={userLocation}
                  icon={LOCATION_ICON}
                />
              )}
          <div className="absolute right-4 top-4 z-[10000] flex flex-col gap-2">
            <button 
              className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100" 
              title="Kartentyp wechseln" 
              type="button"
              onClick={toggleMapType}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" className="text-color-secondary size-4">
                <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z"></path>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div className="absolute right-4 bottom-4 z-[10000]">
            <button
              onClick={handleLocationClick}
              className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100"
              title="Aktuelle Position verwenden"
              type="button"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className={`size-4 ${isLocationActive ? 'text-blue-500' : 'text-color-secondary'}`} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"></path>
              </svg>
            </button>
          </div>
       {clubData.map((item: any, tempkey: number) => {
        if (item?.lat && item?.lng) {
          return (
            <Marker key={tempkey} position={[item.lat, item.lng]} icon={ICON}>
              <Popup className="p-0 m-0">
                <div className="w-[220px] flex flex-col space-y-3">
                  <div className="w-full flex items-center space-x-1.5">
                    <div className="max-w-6 min-w-6 w-6 h-6 flex items-center justify-center bg-[#D9D9D9] rounded-full">
                      <Home className="w-3 h-3 z-10 text-content" />
                    </div>
                    <div className="flex flex-col">
                      <div className="max-w-[180px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                        {item?.clubname}
                      </div>
                      <Badge
                        className="w-fit px-1.5 py-1 bg-[#5B5B5B] text-[10px] leading-[8px] text-white"
                        variant="secondary"
                      >
                        {item?.users}/{item?.maxUser} Mitglieder
                      </Badge>
                    </div>
                  </div>
                  {item?.website && (
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1.5">
                        <Globe className="max-w-4 min-w-4 w-4 h-4 text-content" />
                        <Link
                          className="max-w-[180px]"
                          href={item.website}
                          target="_blank"
                        >
                          <p
                            className="overflow-hidden whitespace-nowrap text-ellipsis font-semibold text-content"
                            style={{ margin: 0 }}
                          >
                            {item.website}
                          </p>
                        </Link>
                      </div>
                    </div>
                  )}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <div
                      className="h-auto self-center px-8 py-1.5 text-xs font-semibold border rounded-xl cursor-pointer hover:text-customhover hover:border-customhover"
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      Mehr Infos
                    </div>
                    <DialogContent className="max-w-3xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
                      <p className="mx-8 my-5 text-lg font-semibold tablet:text-base mobile:mx-5 mobile:my-3 mobile:text-sm">
                        {item?.clubname} beitreten?
                      </p>
                      <AspectRatio
                        className="border-b border-[#D9D9D9]"
                        ratio={18 / (isMobile ? 5 : 3)}
                      >
                        {item?.badge === undefined ? (
                          <div className="w-full h-full flex justify-center items-center bg-[#F8F8F8]">
                            <Home className="w-5 h-5 text-content" />
                          </div>
                        ) : (
                          <Image
                            className="object-cover"
                            src={
                              process.env.NEXT_PUBLIC_UPLOAD_URI + item.badge
                            }
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
                            src={
                              (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                              item?.avatar
                            }
                            alt="avatar"
                          />
                          <AvatarFallback className="border-4 border-white rounded-full bg-[#F8F8F8] text-content">
                            <Home className="w-4 h-4 text-content" />
                          </AvatarFallback>
                        </Avatar>
                        {item?.status === "license" && (
                          <BadgeCheck
                            className="absolute w-5 h-5 top-3 left-[90px] text-white z-20 mobile:w-4 mobile:h-4 mobile:top-2 mobile:left-[60px]"
                            fill="#00C978"
                          />
                        )}
                      </div>
                      <div className="max-h-[500px] flex flex-col space-y-3 p-8 pt-12 overflow-y-auto mobile:p-5 mobile:pt-7">
                        <h1 className="text-lg font-bold break-all mobile:text-base">
                          {item?.clubname}
                        </h1>
                        <div className="flex justify-between gap-5 mobile:flex-col">
                          <div className="flex flex-col space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge
                                className="w-fit p-1.5 text-xs leading-[8px] whitespace-nowrap rounded-md"
                                variant="secondary"
                              >
                                {item?.users}/{item?.maxUser} Mitglieder
                              </Badge>
                              <div className="flex items-center space-x-3">
                                {item?.email && (
                                  <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                      window.open(`mailto:${item.email}`);
                                    }}
                                  >
                                    <Mail className="w-3 h-3 text-content" />
                                  </div>
                                )}
                                {item?.phone && (
                                  <Link href={`tel:${item.phone}`}>
                                    <Phone className="w-3 h-3 text-content" />
                                  </Link>
                                )}
                                {item?.website && (
                                  <Link href={item.website}>
                                    <Globe className="w-3 h-3 text-content" />
                                  </Link>
                                )}
                                {item?.instagram && (
                                  <Link href={item.instagram}>
                                    <Image
                                      src="/assets/images/instagram.svg"
                                      width={10}
                                      height={10}
                                      alt="instagram"
                                    />
                                  </Link>
                                )}
                                {item?.discord && (
                                  <Link href={item.discord}>
                                    <Image
                                      src="/assets/images/discord.svg"
                                      width={13}
                                      height={9}
                                      alt="discord"
                                    />
                                  </Link>
                                )}
                                {item?.facebook && (
                                  <Link href={item.facebook}>
                                    <Image
                                      src="/assets/images/facebook.svg"
                                      width={10}
                                      height={10}
                                      alt="facebook"
                                    />
                                  </Link>
                                )}
                                {item?.youtube && (
                                  <Link href={item.youtube}>
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
                              {item?.status === "verify" && (
                                <>
                                  <Badge className="w-fit p-1.5 text-xs text-[#D5B100] leading-[8px] bg-[#D5B100]/25 rounded-md">
                                    In Gründung
                                  </Badge>
                                </>
                              )}
                              {item?.status === "license" && (
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
                            {item?.maxUser > item?.users ? (
                              <>
                                <p className="text-sm text-center text-content mobile:text-xs">
                                  Dieser Club ist bereits voll. Du kannst dich
                                  auf die Warteschlange setzen lassen. Und wirst
                                  informiert sobald ein Platz für dich frei ist.
                                </p>
                                <Button
                                  className="h-10 px-4 text-sm text-[#FBCB15] bg-[#FBCB15]/25 hover:bg-[#FBCB15]/35 mobile:px-2"
                                  onClick={() => handleJoinClub(item?.clubID)}
                                  disabled={
                                    !isEmpty(user?.club) ||
                                    !isEmpty(
                                      user?.clublist?.filter(
                                        (f) => f.club.clubID === item?.clubID
                                      ).length
                                    ) ||
                                    !item?.allowRequest
                                  }
                                >
                                  Auf die Warteschlange
                                </Button>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-center text-content mobile:text-xs">
                                  Du kannst keine Anfragen stellen, da du
                                  bereits eine Mitgliedschaft oder eine
                                  Mitgliedschaftsanfrage in einem Club hast.
                                </p>
                                <Button
                                  className="h-10 px-4 text-sm mobile:px-2"
                                  variant="outline"
                                  onClick={() => handleJoinClub(item?.clubID)}
                                  disabled={
                                    !isEmpty(user?.club) ||
                                    !isEmpty(
                                      user?.clublist?.filter(
                                        (f) => f.club.clubID === item?.clubID
                                      ).length
                                    ) ||
                                    !item?.allowRequest
                                  }
                                >
                                  Mitglied werden
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          {item?.description && (
                            <>
                              <p className="text-xs text-content">
                                Beschreibung
                              </p>
                              <p className="text-sm tablet:text-xs">
                                {item.description}
                              </p>
                            </>
                          )}
                          {item?.prevent_info && (
                            <>
                              <p className="text-xs text-content">
                                Jugendschutz & Prävention
                              </p>
                              <p className="text-sm tablet:text-xs">
                                {item.prevent_info}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Popup>
            </Marker>
          );
        }
      })}
    </MapContainer>
  );
};

export default SearchMap;
