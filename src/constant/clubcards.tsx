import { Home, Plus, Search } from "lucide-react";
import { ClubCardPropsInterface } from "@/types/component";

export const clubCardData: ClubCardPropsInterface[] = [
  {
    title: "Club erstellen",
    icon: <Home className="w-14 h-14 text-custom" />,
    content:
      "Erstelle deinen eigenen Cannabis Social Club in wenigen Sekunden und lade die ersten Mitglieder ein.",
    btnText: "Club erstellen",
    btnIcon: <Plus className="w-4 h-4" />,
    route: "/dashboard/create",
  },
  {
    title: "Social Club finden",
    icon: <Search className="w-14 h-14 text-custom" />,
    content:
      "Finde Social Clubs in Deutschland, stelle eine Mitgliedsanfrage und werde Mitglied.",
    btnText: "Clubs suchen",
    btnIcon: <Search className="w-4 h-4" />,
    route: "/dashboard/search",
  },
];
