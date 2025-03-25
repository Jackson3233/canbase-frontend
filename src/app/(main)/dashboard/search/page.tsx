"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import BarLoader from "react-spinners/BarLoader";
import { Maximize, Minimize } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { getAllClubs } from "@/actions/club";
import Club from "@/components/basic/Club";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { compareStrings } from "@/lib/functions";
import { cn } from "@/lib/utils";

const ClubSearchPage = () => {
  const [clubData, setClubData] = useState<any>([]);
  const [tempClubData, setTempClubData] = useState<any>([]);
  const [search, setSearch] = useDebounceValue("", 500);
  const [tempSearch, setTempSearch] = useState("");
  const [mapPosition, setMapPosition] = useState<[number, number]>([52.52, 13.405]);
  const [height, setHeight] = useState("h-72");

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/basic/SearchMap"), {
        loading: () => (
          <div className="w-full h-72 flex justify-center items-center  ">
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
    (async () => {
      const result = await getAllClubs();

      setClubData(result.club);
      setTempClubData(result.club);
    })();
  }, []);

  useEffect(() => {
    if (tempSearch === "") {
      setTempClubData(clubData);
    }
  }, [tempSearch, clubData]);

  const handleSearch = async (param: string) => {
    if (param === "postcode") {
      setTempClubData(
        clubData.filter(
          (f: any) =>
            f.postcode &&
            String(f.postcode)
              .toLowerCase()
              .includes(String(search).toLowerCase())
        )
      );
    } else if (param === "city") {
      const result = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: tempSearch + ", Germany",
            format: "json",
          },
        }
      );

      result.data.length > 0 &&
        setMapPosition([result.data[0].lat, result.data[0].lon]);

      setTempClubData(
        clubData.filter(
          (f: any) =>
            f.city &&
            String(f.city).toLowerCase().includes(String(search).toLowerCase())
        )
      );
    } else {
      setTempClubData(
        clubData.filter((f: any) =>
          String(f.clubname)
            .toLowerCase()
            .includes(String(search).toLowerCase())
        )
      );
    }

    setSearch("");
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <div
          className={cn("relative overflow-hidden border rounded-xl", height)}
        >
          <Map clubData={tempClubData} latLng={mapPosition} height={height} />
          {height === "h-52" ? (
            <Maximize
              className="absolute bottom-4 right-4 w-6 h-6 text-white z-[500] cursor-pointer hover:text-customhover"
              strokeWidth={3}
              onClick={() => setHeight("h-96")}
            />
          ) : (
            <Minimize
              className="absolute bottom-4 right-4 w-6 h-6 text-white z-[500] cursor-pointer hover:text-customhover"
              strokeWidth={3}
              onClick={() => setHeight("h-52")}
            />
          )}
        </div>
        <div className="flex flex-col space-y-1 mb-5">
          <Input
            className="w-full h-10 bg-white"
            onChange={(e) => {
              setSearch(e.target.value);
              setTempSearch(e.target.value);
            }}
            placeholder="Suchen"
          />
          {search.length > 0 && (
            <Card>
              <CardContent className="p-1">
                <div
                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-customforeground hover:text-custom"
                  onClick={() => handleSearch("postcode")}
                >
                  {`Suchen nach PLZ für: ${search}`}
                </div>
                <div
                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-customforeground hover:text-custom"
                  onClick={() => handleSearch("city")}
                >
                  {`Suchen nach Ort für: ${search}`}
                </div>
                <div
                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-customforeground hover:text-custom"
                  onClick={() => handleSearch("clubname")}
                >
                  {`Suchen nach Clubname für: ${search}`}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {tempClubData.length === 0 ? (
          tempSearch !== "" && (
            <p>
              {`Unter deiner Suchanfrage konnten wir leider keine Ergebnisse
            finden. Bitte stelle eine andere Suchanfrage.`}
            </p>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3 tablet:grid-cols-1">
            {tempClubData
              .sort((a: any, b: any) => {
                if (b.users !== a.users) {
                  return b.users - a.users;
                } else if (b.city !== a.city) {
                  return compareStrings(b.city, a.city);
                } else {
                  return compareStrings(b.clubname, a.clubname);
                }
              })
              .map((item: any, key: number) => (
                <Club
                  key={key}
                  clubname={item.clubname}
                  badge={item.badge}
                  avatar={item.avatar}
                  users={item.users}
                  maxUser={item.maxUser}
                  description={item.description}
                  prevent_info={item.prevent_info}
                  email={item.email}
                  phone={item.phone}
                  website={item.website}
                  instagram={item.instagram}
                  discord={item.discord}
                  facebook={item.facebook}
                  youtube={item.youtube}
                  clubStatus={item.status}
                  clubID={item.clubID}
                  allowRequest={item.allow_request}
                  handleClubInfo={() => {
                    setMapPosition([
                      item?.lat ? item.lat : 52.52,
                      item?.lng ? item.lng : 13.405,
                    ]);
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubSearchPage;
