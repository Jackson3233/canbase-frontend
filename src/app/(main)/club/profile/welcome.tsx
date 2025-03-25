"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Welcome = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("welcome");

    status !== "shown" && setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) {
      localStorage.setItem("welcome", "shown");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden max-w-xl w-full flex flex-col space-y-4 gap-0 p-10 bg-contain rounded-3xl tablet:p-7 bg-[url('/assets/images/welcome.gif')]">
        <h1 className="text-2xl font-semibold	tablet:text-xl mobile:text-lg">
          Willkommen zur Beta
        </h1>
        <div className="space-y-2 mt-8 mobile:mt-5">
          <h1 className="text-lg font-semibold tablet:text-base mobile:text-sm">
            Herzlichen Glückwunsch zum Start eures neuen Clubs!
          </h1>
          <p className="text-sm text-content tablet:text-xs">
            jetzt habt ihr Zugang zu allen grundlegenden Funktionen und könnt
            damit beginnen, euren Club zu gestalten und Mitglieder einzuladen.
            Doch das ist erst der Anfang! Wir haben noch einige versteckte
            Features für euch bereit.
          </p>
        </div>
        <Button
          className="h-10 self-end px-4 text-sm mobile:w-full"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          Let&apos;s go!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Welcome;
