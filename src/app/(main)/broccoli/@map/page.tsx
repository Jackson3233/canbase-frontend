"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import BarLoader from "react-spinners/BarLoader";
import { Card, CardContent } from "@/components/ui/card";
import { ReportError } from "@/components/core/report-error";
import { CreateRealEstate } from "@/components/core/real-estate";

const BroccoliMapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/features/broccoli-map"), {
        loading: () => (
          <div className="w-full h-full flex justify-center items-center">
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
        <div className="flex space-x-3">
          <ReportError tags={{ feature: "broccoli-map" }} />
          <CreateRealEstate selectedLocation={selectedLocation} />
        </div>
        <Card className="rounded-3xl">
          <CardContent className="h-full flex flex-col p-0 mobile:space-y-3">
            <div className="flex flex-col space-y-3 p-10 tablet:p-7 mobile:p-5">
              <h1 className="text-2xl	font-semibold tablet:text-xl">
                Brokkolikarte
              </h1>
              <p className="text-xs text-zinc-400">
                {`Entscheidend für ein Konsumverbot ist eine Sichtweite zu
                bestimmten Einrichtungen innerhalb von 100m. Die Bubatzkarte
                visualisiert in welchen Zonen verstärkt auf die Sichtweite
                geachtet werden sollte. Die Bubatzkarte basiert auf den
                öffentlichen Daten von `}
                <Link
                  className="underline"
                  href="https://www.openstreetmap.de/"
                  target="_blank"
                >
                  OpenStreetMap
                </Link>
                {`, und kann unvollständig sein; jeder ist für sein Handeln
                selbst verantwortlich. Der Besitz von Cannabis ist seit dem
                01.04.2024 legalisiert. Geocodierungsdienst bereitgestellt von `}
                <Link
                  className="underline"
                  href="https://nominatim.org/"
                  target="_blank"
                >
                  Nominatim
                </Link>
              </p>
            </div>
            <div className="relative h-[90svh] overflow-hidden border rounded-3xl">
              <Map setSelectedLocation={setSelectedLocation} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BroccoliMapPage;
