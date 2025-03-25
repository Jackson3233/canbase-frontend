import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FeedbackPropsInterface } from "@/types/component";

const Feedback = ({
  openFeedback,
  setOpenFeedback,
}: FeedbackPropsInterface) => {
  return (
    <Dialog open={openFeedback} onOpenChange={setOpenFeedback}>
      <DialogContent className="max-w-xl flex flex-col w-full gap-0 overflow-hidden p-8 rounded-3xl mobile:p-5">
        <h1 className="text-lg font-bold tablet:text-base">Canbase Support</h1>
        <div className="flex flex-col space-y-8 mt-6 tablet:space-y-5 tablet:mt-3">
          <div className="flex flex-col space-y-4 tablet:space-y-2">
            <p className="font-semibold tablet:text-sm">
              Wir sind immer offen für Dein Feedback zu Canbase
            </p>
            <p className="text-sm text-content">
              Schreib uns gerne deine Gedanken zur App. Wir werden uns bemühen,
              deine Wünsche zu erfüllen. Sag uns, welche Funktionen dir fehlen,
              was dir gefällt oder was wir verbessern können.
            </p>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <Link href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_INFO}`}>
              <Mail className="w-12 h-12" />
            </Link>
            <div className="flex flex-col space-y-4 tablet:space-y-2">
              <p className="font-semibold tablet:text-sm">E-Mail Support</p>
              <p className="text-sm text-content">
                Kontaktiere unser Support Team direkt persönlich per E-Mail
                unter {process.env.NEXT_PUBLIC_EMAIL_INFO}. Wir freuen uns Deine
                Nachricht und werden uns umgehend um Dein Anliegen kümmern.
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center space-x-8">
            <Link
              href={process.env.NEXT_PUBLIC_DISCORD_URI as string}
              target="_blank"
            >
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/images/discord.svg"
                  fill={true}
                  sizes="100%"
                  alt="discord"
                />
              </div>
            </Link>
            <div className="flex flex-col space-y-4 tablet:space-y-2">
              <p className="font-semibold tablet:text-sm">Discord Support</p>
              <p className="text-sm text-content">
                Tritt unserem Discord bei und stelle alle deine Fragen, sei
                immer auf dem neusten Stand, nehme an exklusiven Webinaren teil
                und tausche Dich mit anderen Club Gründern aus.
              </p>
            </div>
          </div>
        </div>
        <Button
          className="self-end w-fit h-10 mt-10 px-4 text-sm tablet:mt-5 mobile:w-full mobile:self-auto"
          onClick={() => setOpenFeedback(false)}
        >
          Schließen
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Feedback;
