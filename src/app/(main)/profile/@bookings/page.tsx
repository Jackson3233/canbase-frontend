import { Card, CardContent } from "@/components/ui/card";
import { Ticket } from "lucide-react";

const MineBookingsPage = () => {
  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <Card className="w-full max-w-xl p-10 tablet:p-7 mobile:p-5 my-8">
        <CardContent className="p-0">
          <div className="flex items-center space-x-3">
            <Ticket className="w-6 h-6 tablet:w-5 tablet:h-5 mobile:w-4 mobile:h-4" />
            <h1 className="text-xl font-semibold tablet:text-lg mobile:text-base">
              Noch keine Buchungen
            </h1>
          </div>
          <p
            className="text-base text-content hyphens-auto tablet:text-sm mobile:text-xs"
            lang="de"
          >
            Hier findest du alle Buchungen, die dein Club für dich erstellt hat.
            Buchungen können z.B. für Aufnahmegebühren oder Mitgliedsbeiträge
            anfallen. Canbase informiert dich automatisch, sobald eine neue
            Buchung erstellt wird.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MineBookingsPage;
