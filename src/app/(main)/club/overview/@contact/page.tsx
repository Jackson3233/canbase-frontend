"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import BarLoader from "react-spinners/BarLoader";
import { useAppSelector } from "@/store/hook";
import TextGroup from "@/components/basic/TextGroup";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const OverviewContactPage = () => {
  const { club } = useAppSelector((state) => state.club);

  const [mapPosition, setMapPosition] = useState([52.52, 13.405]);
  const [maker, setMaker] = useState(false);

  useEffect(() => {
    if (club?.lat && club.lng) {
      setMaker(true);
    } else {
      setMaker(false);
    }

    setMapPosition([
      club?.lat ? club.lat : 52.52,
      club?.lng ? club.lng : 13.405,
    ]);
  }, [club]);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/basic/ProfileMap"), {
        loading: () => (
          <div className="w-full h-52 flex justify-center items-center">
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

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <Card className="w-full rounded-3xl">
          <CardContent className="p-0">
            <div className="p-10 pb-5 tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Standort
              </h1>
              <p className="pt-2 text-sm text-content mobile:text-xs">
                {club?.street +
                  " " +
                  club?.address +
                  " " +
                  club?.postcode +
                  " " +
                  club?.city}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-b-xl h-74">
              <div className="relative h-[400px] w-full">
                <Map
                  latLng={mapPosition}
                  maker={maker}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full rounded-3xl">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Kontaktinformationen
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Alle nötigen Informationen zu deinem Club
            </p>
          </div>
          <div className="p-10 tablet:p-7 mobile:p-5">
            <TextGroup title="Name" value={club?.clubname ?? ""} />
            <TextGroup
              title="Adresse"
              value={`${club?.street ?? ""} ${club?.address ?? ""} ${
                club?.postcode ?? ""
              } ${club?.city ?? ""} ${club?.country ?? ""}`}
            />
            <TextGroup title="Telefon" value={club?.phone ?? ""} />
            <TextGroup
              title="Impressum"
              value={club?.imprint ?? ""}
              type="last"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewContactPage;
