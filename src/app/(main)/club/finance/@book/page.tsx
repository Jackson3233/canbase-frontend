import { Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FinanceBookPage = () => {
  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <Card className="p-10 tablet:p-7 mobile:p-5">
          <CardContent className="p-0">
            <div className="flex items-center space-x-2">
              <Ticket className="w-6 h-6 tablet:w-4 tablet:h-4" />
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Erstelle die erste Buchung
              </h1>
              <Badge className="w-fit h-fit ml-2 px-1 py-0.5 text-xs text-custom leading-[8px] bg-customforeground rounded-md">
                <p className="text-xs text-custom whitespace-nowrap">
                  Kommt bald
                </p>
              </Badge>
            </div>
            <p className="max-w-2xl w-full pt-2 text-sm text-content tablet:max-w-none mobile:text-xs">
              {`Wähle ein Mitglied aus und füge beliebige Mitgliedsbeiträge hinzu.
              Vergiss nicht, vorher die Zahlungsmethoden und Zahlungshinweise
              des Clubs zu hinterlegen, damit Mitglieder wissen, wie sie
              bezahlen sollen.`}
            </p>
            <Button className="h-10 flex items-center space-x-2 px-4 mt-8 bg-custom mobile:w-full mobile:mt-4 hover:bg-customhover cursor-not-allowed">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Neue Buchung</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceBookPage;
