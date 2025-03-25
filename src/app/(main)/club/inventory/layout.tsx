"use client";

import { Suspense, useEffect } from "react";
import { Cannabis, MapPin, PackageSearch, Sprout } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { inventoriesActions } from "@/store/reducers/inventoriesReducer";
import { storagesActions } from "@/store/reducers/storageReducer";
import { getInventories } from "@/actions/inventory";
import { SubTabs, SubTabsContent, SubTabsList, SubTabsTrigger } from "@/components/ui/subtab";
import { InventoryLayoutPropsInterface } from "@/types/page";

const InventoryLayout = ({
  overview,
  cannabis,
  material,
  storage,
}: InventoryLayoutPropsInterface) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const result = await getInventories();

      if (result.success) {
        dispatch(
          inventoriesActions.setInventories({ inventories: result.inventories })
        );
        dispatch(storagesActions.setStorages({ storages: result.storages }));
      }
    })();
  }, [dispatch]);

  return (
    <Suspense fallback={<></>}>
      <SubTabs defaultValue="overview">
        <div className="w-full border-b border-gray-100 px-4">
          <SubTabsList>
            <SubTabsTrigger value="overview">
              <div className="flex items-center space-x-2">
                <PackageSearch className="w-3.5 h-3.5" />
                <p className="text-sm">Übersicht</p>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="cannabis">
              <div className="flex items-center space-x-2">
                <Cannabis className="w-3.5 h-3.5" />
                <p className="text-sm">Cannabis</p>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="material">
              <div className="flex items-center space-x-2">
                <Sprout className="w-3.5 h-3.5" />
                <p className="text-sm">Vermehrungsmaterial</p>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="storage">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5" />
                <p className="text-sm">Lagerorte</p>
              </div>
            </SubTabsTrigger>
          </SubTabsList>
        </div>
        <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
          <SubTabsContent value="overview">{overview}</SubTabsContent>
          <SubTabsContent value="cannabis">{cannabis}</SubTabsContent>
          <SubTabsContent value="material">{material}</SubTabsContent>
          <SubTabsContent value="storage">{storage}</SubTabsContent>
        </div>
      </SubTabs>
    </Suspense>
  );
};

export default InventoryLayout;
