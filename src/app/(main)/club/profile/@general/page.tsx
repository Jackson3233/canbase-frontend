"use client";

import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { clubActions } from "@/store/reducers/clubReducer";
import { updateGeneral } from "@/actions/club";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ClubGeneralPage = () => {
  const dispatch = useAppDispatch();
  const { club } = useAppSelector((state) => state.club);
  const { user } = useAppSelector((state) => state.user);

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [allowRequest, setAllowRequest] = useState<boolean | undefined>(true);
  const [autoAccept, setAutoAccept] = useState<boolean | undefined>(false);

  useEffect(() => {
    setAllowRequest(club?.allow_request);
    setAutoAccept(club?.auto_accpet);
  }, [club]);

  const handleSubmit = async () => {
    setLoading(true);

    const result = await updateGeneral({
      allow_request: allowRequest,
      auto_accpet: autoAccept,
    });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(clubActions.setClub({ club: result.club }));
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full space-y-5 my-8">
        <Card>
          <CardContent className="flex flex-col p-0">
            <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
              <h1 className="text-2xl font-semibold tablet:text-xl">
                Allgemein
              </h1>
              <p className="max-w-[500px] pt-2 text-sm text-content mobile:text-xs">
                Lege allgemeine Einstellungen für Deinen Club fest. Nach dem
                Speichern sind sie für alle neuen Mitglieder aktiviert.
              </p>
            </div>
            <div className="flex flex-col space-y-3 p-10 tablet:p-7 mobile:p-5">
              <div className="max-w-5xl w-full flex justify-between items-center">
                <div className="mr-5">
                  <p className="text-sm font-medium">
                    Mitgliedsanfragen erlauben
                  </p>
                  <p className="text-xs font-normal text-content">
                    Hiermit erlaubst du Nutzern deinem Club Anfragen zu senden.
                  </p>
                </div>
                <div>
                  <Switch
                    checked={allowRequest}
                    onCheckedChange={() => setAllowRequest((prev) => !prev)}
                  />
                </div>
              </div>
              <div className="max-w-5xl w-full flex justify-between items-center">
                <div className="mr-5">
                  <p className="text-sm font-medium">
                    Mitgliedsanfragen automatisch akzeptieren
                  </p>
                  <p className="text-xs font-normal text-content">
                    Hiermit werden automatisch alle Mitgliedsanfragen die deinem
                    Club gestellt werden akzeptiert.
                  </p>
                </div>
                <div>
                  <Switch
                    checked={autoAccept}
                    onCheckedChange={() => setAutoAccept((prev) => !prev)}
                  />
                </div>
              </div>
              <Button
                className="h-10 self-end px-4 mt-8 bg-custom mobile:w-full mobile:mt-5 hover:bg-customhover"
                onClick={handleSubmit}
                disabled={
                  user?.role !== "owner" &&
                  !user?.functions?.includes("club-settings-general-manage")
                }
              >
                {loading ? (
                  <ClipLoader
                    aria-label="loader"
                    data-testid="loader"
                    color="white"
                    size={16}
                  />
                ) : (
                  <span className="text-sm">Speichern</span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubGeneralPage;
