"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { membersActions } from "@/store/reducers/membersReducer";
import { clubActions } from "@/store/reducers/clubReducer";
import { updateStatus } from "@/actions/member";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAvatarLetters, getCleanDate } from "@/lib/functions";
import { WaitlistType } from "@/types/page";

const WaitlistDialog = ({ row }: { row: Row<WaitlistType> }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { club } = useAppSelector((state) => state.club);
  const { question } = useAppSelector((state) => state.question);

  const member = row.original;

  const clublist = row.original.clublist;
  const tempClub = clublist.find(
    (item: any) => item.club.clubID === club?.clubID
  );

  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [ageVerify, setAgeVerify] = useState(false);
  const [status, setStatus] = useState("accept");

  const handleStatus = async () => {
    const result = await updateStatus({
      memberID: member.memberID,
      status: status,
      ageVerify: ageVerify,
    });

    setOpen(false);
  
    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });
  
    if (result.success) {
      dispatch(membersActions.updateMemberStatus(result.member));
      dispatch(clubActions.setClub({ club: result.club }));
    }
  };
  
  return (
    <div className="flex flex-col break-all px-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="overflow-hidden whitespace-nowrap text-ellipsis text-sm hover:text-customhover cursor-pointer">
            {member.username}
          </p>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full gap-0 overflow-hidden p-0 rounded-3xl">
          <div className="p-10 pb-5 border-b tablet:p-7 tablet:pb-5 mobile:p-5">
            <h1 className="text-2xl font-semibold tablet:text-xl">
              Mitgliedsanfrage von {member.username}
            </h1>
            <p className="pt-2 text-sm text-content mobile:text-xs">
              Überprüfe die Anfrage und bestätige oder lehne sie ab.
            </p>
          </div>
          <div className="max-h-[700px] flex flex-col space-y-10 p-10 overflow-y-auto tablet:space-y-7 tablet:p-7 mobile:space-y-5 mobile:p-5">
            <Avatar className="w-36 h-36 tablet:w-24 tablet:h-24">
              <AvatarImage
                src={
                  (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                  row.getValue("avatar")
                }
                alt="avatar"
              />
              <AvatarFallback className="tablet:text-sm mobile:text-xs">
                {getAvatarLetters(member.username)}
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
              <div className="flex py-3 text-sm border-b">
                <p className="max-w-64 w-full mr-8 text-content font-medium tablet:mr-4">
                  Name
                </p>
                <p className="w-full font-medium">{member.username}</p>
              </div>
              <div className="flex py-3 text-sm border-b">
                <p className="max-w-64 w-full mr-8 text-content font-medium tablet:mr-4">
                  Alter
                </p>
                <p className="w-full font-medium">
                  {getCleanDate(member.birth, 2)}
                </p>
              </div>
              <div className="flex py-3 text-sm border-b">
                <p className="max-w-64 w-full mr-8 text-content font-medium tablet:mr-4">
                  Mail
                </p>
                <p className="w-full font-medium break-all">{member.email}</p>
              </div>
              {tempClub.question?.map((item: any, key: number) => {
                return (
                  <div className="flex py-3 text-sm border-b" key={key}>
                    <p className="max-w-64 w-full mr-8 text-content font-medium tablet:mr-4">
                      {
                        question.filter((f) => f._id === item.questionID)[0]
                          ?.questiontitle
                      }
                    </p>
                    <p className="w-full font-medium break-all">
                      {item.answer.join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col space-y-5">
              <div className="flex">
                <p className="max-w-64 w-full mr-8 text-sm font-medium tablet:mr-4">
                  Aktueller Status
                </p>
                <Badge className="w-fit p-1.5 text-xs text-[#1C73B2] leading-[8px] bg-[#0094FF]/25 rounded-md">
                  Angefragt
                </Badge>
              </div>
              <div className="flex space-x-6 mobile:flex-col mobile:space-x-0 mobile:space-y-3">
                <div className="max-w-64 w-full mobile:max-w-none">
                  <p className="text-sm font-medium">Aktueller Status</p>
                  <p className="text-xs">
                    Das Mitglied wird über die Änderung per E-Mail oder
                    Push-Nachricht informiert.
                  </p>
                </div>
                <RadioGroup
                  className="flex flex-col space-y-1 gap-0"
                  defaultValue="accept"
                  onValueChange={(e) => setStatus(e)}
                >
                  <Label
                    className="group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer"
                    htmlFor="accept"
                  >
                    <RadioGroupItem value="accept" id="accept" />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Aktiv</p>
                      <p className="text-xs text-content group-hover:text-custom">
                        Aktives Mitglied des Clubs. Bei erstmaliger Aktivierung
                        wird das Eintrittsdatum gesetzt.
                      </p>
                    </div>
                  </Label>
                  <Label
                    className="group has-[:checked]:bg-customforeground flex items-center space-x-2 p-3 rounded-lg hover:bg-customforeground cursor-pointer"
                    htmlFor="refuse"
                  >
                    <RadioGroupItem value="refuse" id="refuse" />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Abgelehnt</p>
                      <p className="text-xs text-content group-hover:text-custom">
                        Mitgliedschaft wurde abgelehnt.
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
              <div className="flex space-x-6 mobile:flex-col mobile:space-x-0 mobile:space-y-3">
                <p className="max-w-64 w-full text-sm font-medium mobile:max-w-none">
                  Aktueller Status
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="w-3 h-3 flex justify-center items-center"
                    id="age_verify"
                    checked={ageVerify}
                    onCheckedChange={() => setAgeVerify((prev) => !prev)}
                  />
                  <Label className="text-xs" htmlFor="age_verify">
                    Das Mitglied ist über 18 Jahre alt und ich habe den Ausweis
                    geprüft
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-end space-x-2 mobile:justify-evenly">
              <Button
                className="min-w-32 h-10 px-4 mobile:w-full mobile:min-w-0 mobile:px-2"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Abbrechen
              </Button>
              <Button
                className="min-w-32 h-10 px-4 mobile:w-full mobile:min-w-0 mobile:px-2"
                onClick={handleStatus}
                disabled={
                  (user?.role !== "owner" &&
                    !user?.functions?.includes(
                      "club-members-members-assign"
                    )) ||
                  (club?.maxUser as number) <= (club?.users as number)
                }
              >
                Speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-content">
        {member.email}
      </p>
    </div>
  );
};

export default WaitlistDialog;
