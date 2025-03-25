"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { CheckCircle, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { userActions } from "@/store/reducers/userReducer";
import { acceptRequest, cancelRequest } from "@/actions/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getCleanDate, isEmpty } from "@/lib/functions";

const MemberDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();

  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState<any>();

  const handleDialog = (param: any) => {
    setTempData(param);
    setOpen(true);
  };

  const handleAcceptRequest = async () => {
    setLoading(true);

    const result = await acceptRequest({ clubID: tempData.club._id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(userActions.setUser({ user: result.user }));

      setOpen(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);

    const result = await cancelRequest({ clubID: tempData.club._id });

    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });

    setLoading(false);

    if (result.success) {
      dispatch(userActions.setUser({ user: result.user }));

      setOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      {!isEmpty(user?.clublist) ? (
        <div className="w-full grid grid-cols-2 gap-3 laptop:grid-cols-1 my-8">
          {user?.clublist?.map((item, key) => {
            return (
              <Card key={key}>
                <CardContent className="p-0">
                  <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
                    <h1 className="text-2xl font-semibold tablet:text-xl">
                      {item.club.clubname}
                    </h1>
                    <p className="pt-2 text-sm text-content mobile:text-xs">
                      {item.club.clubID} / {user?.memberID}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-8 px-10 py-5 border-b tablet:space-y-5 tablet:px-7 mobile:p-5">
                    {item.status === "club-accept" && (
                      <div className="flex space-x-2 p-3 bg-[#00C978]/15 border border-[#00C978] rounded-xl">
                        <Info className="min-w-4 h-4 text-[#00C978] mt-1" />
                        <div className="flex flex-col space-y-1.5">
                          <p className="font-semibold text-[#00C978] tablet:text-sm">
                            Genehmigt
                          </p>
                          <p className="text-xs text-[#00C978]">
                            Deine Mitgliedschaftsanfrage wurde von Club
                            akzeptiert. Du kannst dich nun entscheiden, ob du
                            wartest oder die Mitgliedschaft akzeptierst. Sobald
                            du akzeptierst, werden alle anderen Anfragen
                            automatisch abgelehnt.
                          </p>
                        </div>
                      </div>
                    )}
                    {item.status === "pending" && (
                      <div className="flex space-x-2 p-3 bg-[#55A3FF]/15 border border-[#55A3FF] rounded-xl">
                        <Info className="min-w-4 h-4 text-[#55A3FF] mt-1" />
                        <div className="flex flex-col space-y-1.5">
                          <p className="font-semibold text-[#55A3FF] tablet:text-sm">
                            Mitgliedsanfrage gestellt
                          </p>
                          <p className="text-xs text-[#55A3FF]">
                            Deine Mitgliedsanfrage ist beim Club eingegangen und
                            wird aktuell geprüft. Wir informieren dich, sobald
                            über deine Mitgliedschaft entschieden wurde.
                          </p>
                        </div>
                      </div>
                    )}
                    {item.status === "waitlist" && (
                      <div className="flex flex-col space-y-3">
                        <div className="flex space-x-2 p-3 bg-[#FBCB15]/15 border border-[#FBCB15] rounded-xl">
                          <Info className="min-w-4 h-4 text-[#FBCB15] mt-1" />
                          <div className="flex flex-col space-y-1.5">
                            <p className="font-semibold text-[#FBCB15] tablet:text-sm">
                              Mitgliedsanfrage gestellt
                            </p>
                            <p className="text-xs text-[#FBCB15]">
                              Du wurdest auf die Warteliste des Clubs gepackt.
                              Aber deine Mitgliedsanfrage ist eingegangen und
                              wird zeitnah geprüft. Wir informieren dich, sobald
                              über deine Mitgliedschaft entschieden wurde.
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 p-3 bg-[#00C978]/15 border border-[#00C978] rounded-xl">
                          <Info className="min-w-4 h-4 text-[#00C978] mt-1" />
                          <div className="flex flex-col space-y-1.5">
                            <p className="font-semibold text-[#00C978] tablet:text-sm">
                              Empfehlung
                            </p>
                            <p className="text-xs text-[#00C978]">
                              Bewirb dich auch bei anderen Club in deiner
                              Umgebung, um die Chance in einem Club angenommen
                              zu werden zu erhöhen.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-content">Status</p>
                      {item.status === "club-accept" && (
                        <Badge className="w-fit p-1.5 text-xs text-[#00C978] leading-[8px] bg-[#00C978]/25 rounded-md">
                          Genehmigt
                        </Badge>
                      )}
                      {item.status === "pending" && (
                        <Badge className="w-fit p-1.5 text-xs text-[#55A3FF] leading-[8px] bg-[#55A3FF]/25 rounded-md">
                          Angefragt
                        </Badge>
                      )}
                      {item.status === "waitlist" && (
                        <Badge className="w-fit p-1.5 text-xs text-[#FBCB15] leading-[8px] bg-[#FBCB15]/15 rounded-md">
                          Warteliste
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-content">Angefragt am</p>
                      <p className="text-lg font-semibold tablet:text-base">
                        {getCleanDate(String(item.memberdate), 2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end px-10 py-5 tablet:px-7 mobile:p-5">
                    {item.status === "club-accept" && (
                      <Button
                        className="h-10 px-4 text-sm bg-[#00C978] mobile:w-full hover:bg-[#00C978]/75"
                        onClick={() => handleDialog(item)}
                      >
                        Mitgliedschaft akzeptieren
                      </Button>
                    )}
                    {item.status === "pending" && (
                      <Button
                        className="h-10 px-4 text-sm mobile:w-full"
                        variant="destructive"
                        onClick={() => handleDialog(item)}
                      >
                        Anfrage zurückziehen
                      </Button>
                    )}
                    {item.status === "waitlist" && (
                      <div className="w-full flex justify-end gap-3 mobile:flex-col">
                        <Button
                          className="h-10 px-4 text-sm mobile:w-full"
                          variant="outline"
                          onClick={() => router.push("/dashboard/search")}
                        >
                          Nach weiteren Clubs suchen
                        </Button>
                        <Button
                          className="h-10 px-4 text-sm mobile:w-full"
                          variant="destructive"
                          onClick={() => handleDialog(item)}
                        >
                          Anfrage zurückziehen
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center space-y-5 pt-20">
          <CheckCircle className="w-10 h-10" />
          <div className="max-w-80 w-full flex flex-col justify-center items-center space-y-2 text-center">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Alles erledigt.
            </h1>
            <p className="text-lg tablet:text-base">
              Neuigkeiten für dich erscheinen hier, sobald es etwas zu berichten
              gibt.
            </p>
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
          <div className="p-8 mobile:p-5">
            {tempData?.status === "club-accept" && (
              <>
                <h1 className="text-xl font-semibold tablet:text-base">
                  Mitgliedschaft akzeptieren
                </h1>
                <p className="mt-8 text-sm text-content mobile:mt-5 mobile:text-xs">
                  Bist du sicher das du die Mitgliedschaft final akzeptieren
                  möchtest? Alle anderen Anfragen werden automatisch
                  zurückgezogen.
                </p>
              </>
            )}
            {(tempData?.status === "pending" ||
              tempData?.status === "waitlist") && (
              <>
                <h1 className="text-xl font-semibold tablet:text-base">
                  Anfrage zurückziehen?
                </h1>
                <p className="mt-8 text-sm text-content mobile:mt-5 mobile:text-xs">
                  Das Zurückziehen deiner Anfrage ist endgültig und kann nicht
                  rückgängig gemacht werden. Möchtest du fortfahren?
                </p>
              </>
            )}
            <div className="flex flex-row justify-end space-x-2 mt-12 tablet:mt-6 mobile:justify-evenly mobile:mt-3">
              <Button
                className="h-10 px-4 text-sm mobile:px-2"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Abbrechen
              </Button>
              {tempData?.status === "club-accept" && (
                <Button
                  className="h-10 px-4 bg-[#00C978] mobile:w-full mobile:px-2 hover:bg-[#00C978]/75"
                  onClick={handleAcceptRequest}
                >
                  {loading ? (
                    <ClipLoader
                      aria-label="loader"
                      data-testid="loader"
                      color="white"
                      size={16}
                    />
                  ) : (
                    <span className="text-sm">Mitgliedschaft akzeptieren</span>
                  )}
                </Button>
              )}
              {(tempData?.status === "pending" ||
                tempData?.status === "waitlist") && (
                <Button
                  className="h-10 px-4 mobile:px-2"
                  variant="destructive"
                  onClick={handleCancelRequest}
                >
                  {loading ? (
                    <ClipLoader
                      aria-label="loader"
                      data-testid="loader"
                      color="white"
                      size={16}
                    />
                  ) : (
                    <span className="text-sm">Anfrage zurückziehen</span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberDashboard;
