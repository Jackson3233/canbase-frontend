"use client";

import { Expand, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeliveryOverviewPage = () => {
  return (
    <div className="w-full flex flex-col space-y-5 my-8">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className="h-auto w-fit flex space-x-2 rounded-2xl"
          variant="outline"
          onClick={() => {}}
        >
          <ShoppingCart className="w-3 h-3" />
          <span className="text-xs">Kasse</span>
        </Button>
        <Button
          className="h-auto w-fit flex space-x-2 rounded-2xl"
          variant="outline"
          onClick={() => {}}
        >
          <Expand className="w-3 h-3" />
          <span className="text-xs">Display</span>
        </Button>
      </div>
    </div>
  );
};

export default DeliveryOverviewPage;
