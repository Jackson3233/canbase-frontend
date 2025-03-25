"use client";

import { Suspense, useEffect } from "react";
import { Package2, ShoppingCart, TableOfContents } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { SubTabs, SubTabsContent, SubTabsList, SubTabsTrigger } from "@/components/ui/subtab";
import { DeliveryLayoutPropsInterface } from "@/types/page";

const DeliveryLayout = ({
  overview,
  tax,
  product,
}: DeliveryLayoutPropsInterface) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {})();
  }, [dispatch]);

  return (
    <Suspense fallback={<></>}>
      <SubTabs defaultValue="overview">
        <div className="w-full border-b border-gray-100 px-4">
          <SubTabsList>
            <SubTabsTrigger value="overview">
              <div className="flex items-center space-x-2">
                <TableOfContents className="w-3.5 h-3.5" />
                <span className="text-sm">Übersicht</span>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="tax">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="text-sm">Abgaben</span>
              </div>
            </SubTabsTrigger>
            <SubTabsTrigger value="product">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="text-sm">Produkte</span>
              </div>
            </SubTabsTrigger>
          </SubTabsList>
        </div>
        <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
          <SubTabsContent value="overview">{overview}</SubTabsContent>
          <SubTabsContent value="tax">{tax}</SubTabsContent>
          <SubTabsContent value="product">{product}</SubTabsContent>
        </div>
      </SubTabs>
    </Suspense>
  );
};

export default DeliveryLayout;
