"use client";

import { Suspense, useEffect } from "react";
import { Dna, Focus, PackageOpen, Slice, Sprout } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { strainsActions } from "@/store/reducers/strainsReducer";
import { plantsActions } from "@/store/reducers/plantsReducer";
import { chargesActions } from "@/store/reducers/chargesReducer";
import { zonesActions } from "@/store/reducers/zonesReducer";
import { harvestsActions } from "@/store/reducers/harvestReducer";
import { getGrowControl } from "@/actions/strain";
import { SubTabs, SubTabsContent, SubTabsList, SubTabsTrigger } from "@/components/ui/subtab";
import { GrowLayoutPropsInterface } from "@/types/page";

const GrowLayout = ({
  strain,
  zone,
  charge,
  plant,
  harvest,
}: GrowLayoutPropsInterface) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const result = await getGrowControl();

      if (result.success) {
        dispatch(strainsActions.setStrains({ strains: result.strains }));
        dispatch(plantsActions.setPlants({ plants: result.plants }));
        dispatch(chargesActions.setCharges({ charges: result.charges }));
        dispatch(zonesActions.setZones({ zones: result.zones }));
        dispatch(harvestsActions.setHarvests({ harvests: result.harvests }));
      }
    })();
  }, [dispatch]);

  return (
    <Suspense fallback={<></>}>
      <SubTabs defaultValue="strain">
        <div className="w-full border-b border-gray-100 px-4">
          <SubTabsList>
            <SubTabsTrigger value="strain">
              <div className="flex items-center space-x-2">
                <Dna className="w-3.5 h-3.5" />
                <p className="text-sm">Strains</p>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="zone">
              <div className="flex items-center space-x-2">
                <Focus className="w-3.5 h-3.5" />
                <p className="text-sm">Zone</p>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="charge">
              <div className="flex items-center space-x-2">
                <PackageOpen className="w-3.5 h-3.5" />
                <p className="text-sm">Chargen</p>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="plant">
              <div className="flex items-center space-x-2">
                <Sprout className="w-3.5 h-3.5" />
                <p className="text-sm">Pflanzen</p>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="harvest">
              <div className="flex items-center space-x-2">
                <Slice className="w-3.5 h-3.5" />
                <p className="text-sm">Ernten</p>
              </div>
            </SubTabsTrigger>
          </SubTabsList>
        </div>
        <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
          <SubTabsContent value="strain">{strain}</SubTabsContent>
          <SubTabsContent value="zone">{zone}</SubTabsContent>
          <SubTabsContent value="charge">{charge}</SubTabsContent>
          <SubTabsContent value="plant">{plant}</SubTabsContent>
          <SubTabsContent value="harvest">{harvest}</SubTabsContent>
        </div>
      </SubTabs>
    </Suspense>
  );
};

export default GrowLayout;
