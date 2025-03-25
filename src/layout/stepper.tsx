"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Check, LifeBuoy } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { Separator } from "@/components/ui/separator";
import { steps } from "@/constant/steps";
import { cn } from "@/lib/utils";
import { StepperPropsInterface } from "@/types/layout";

const Stepper = ({ activeStep }: StepperPropsInterface) => {
  const { club } = useAppSelector((state) => state.club);

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {!isMobile ? (
        <div className="max-w-sm w-full h-full flex flex-col justify-around px-8 border-l">
          <div className="flex flex-col space-y-10">
            <div className="text-xl	font-semibold">
              <p>Anmeldeformular</p>
              <p>{club?.clubname}</p>
            </div>
            <div className="flex flex-col">
              {steps.map((item) => (
                <Fragment key={item.step}>
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "max-w-10 min-w-10 h-10 flex justify-center items-center my-2 border-[2px] rounded-full",
                        item.step < activeStep && "bg-custom text-white",
                        item.step === activeStep && "border-custom text-custom"
                      )}
                    >
                      {item.step >= activeStep ? (
                        item.step
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm text-content font-semibold",
                          item.step === activeStep && "text-black"
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="text-sm text-content">{item.desc}</p>
                    </div>
                  </div>
                  {item.step !== 5 && (
                    <Separator
                      className={cn(
                        "w-0.5 h-12 mx-5",
                        item.step <= activeStep - 1 && "bg-custom"
                      )}
                      orientation="vertical"
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <LifeBuoy className="w-5 h-5" />
            <p className="text-sm font-medium">Du hast Probleme?</p>
            <p className="text-sm text-content">
              Fühl dich frei uns zu kontaktieren, wir stehen dir bei allen
              Fragen zur verfügung.
            </p>
            <div className="max-w-40 w-full flex justify-center items-center border rounded-md py-1">
              <Link
                href={process.env.NEXT_PUBLIC_DISCORD_URI as string}
                target="_blank"
              >
                Kontaktiere uns
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center space-y-3 p-8">
          <div className="text-lg text-center	font-semibold mobile:text-base">
            <p>Anmeldeformular</p>
            <p>{club?.clubname}</p>
          </div>
          <div className="flex items-center space-x-3">
            {steps.map((item) => (
              <Fragment key={item.step}>
                <div
                  className={cn(
                    "max-w-8 min-w-8 h-8 flex justify-center items-center my-2 border-[2px] rounded-full",
                    item.step < activeStep && "bg-custom text-white",
                    item.step === activeStep && "border-custom text-custom"
                  )}
                >
                  {item.step >= activeStep ? (
                    item.step
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                {item.step !== 5 && (
                  <Separator
                    className={cn(
                      "w-5 h-0.5",
                      item.step <= activeStep - 1 && "bg-custom"
                    )}
                    orientation="vertical"
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Stepper;
