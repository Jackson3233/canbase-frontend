import { Suspense } from "react";
import { BroccoliLayoutPropsInterface } from "@/types/page";

const BroccoliLayout = ({ map }: BroccoliLayoutPropsInterface) => {
  return (
    <Suspense fallback={<></>}>
      {map}
    </Suspense>
  );
};

export default BroccoliLayout;
