import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPropsInterface } from "@/types/component";

const Color = ({
  colorName,
  bgColor,
  borderColor,
  active,
  setColor,
}: ColorPropsInterface) => {
  return (
    <div
      className={cn(
        "relative w-5 h-5 flex justify-center items-center overflow-hidden rounded-full cursor-pointer",
        active && `border-2 ${borderColor}`,
        !active && colorName === "white" && `border ${borderColor}`
      )}
      onClick={() => setColor(colorName)}
    >
      {active && <Check className="absolute w-3 h-3 text-content" />}
      <div className={cn("w-full h-full", bgColor)} />
    </div>
  );
};

export default Color;
