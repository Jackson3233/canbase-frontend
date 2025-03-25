"use client";

import { MoreVertical, Send, UserPlus, UserRoundPlus } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { RequestTable } from "./request-table";
import { requestColumns } from "./request-column";
import { WaitlistTable } from "./waitlist-table";
import { waitlistColumns } from "./waitlist-column";
import { PendingTable } from "./pending-table";
import { pendingColumns } from "./pending-column";
import { MemberTable } from "./member-table";
import { memberColumns } from "./member-column";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCSV, isEmpty } from "@/lib/functions";
import Link from "next/link";

const MemberManagePage = () => {
  const { club } = useAppSelector((state) => state.club);
  const { members } = useAppSelector((state) => state.members);

  const handleExportCSV = () => {
    const csvData = members
      .filter((f) => f.status === "active")
      .map((member) => ({
        Name: member.username,
        Email: member.email,
        Birth: member.birth,
        MemberID: member.memberID,
        Role: member.role,
        Status: member.status,
      }));

    downloadCSV(csvData, "members.csv");
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
      <div className="w-full flex flex-col space-y-5 my-8">
        <div className="flex space-x-4">
          <Link href="/club/member/create">
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
            >
              <UserRoundPlus className="w-3 h-3" />
              <span className="text-xs">Mitglied anlegen</span>
            </Button>
          </Link>
          <Link href="/club/member?tab=invite">
            <Button
              className="h-auto w-fit flex space-x-2 rounded-2xl"
              variant="outline"
            >
              <UserPlus className="w-3 h-3" />
              <span className="text-xs">Mitglied einladen</span>
            </Button>
          </Link>
        </div>
        <div className="w-full flex flex-col space-y-5">
          {members.filter((f) =>
            f.clublist?.some(
              (s) => s.status === "pending" && s.club.clubID === club?.clubID
            )
          ).length !== 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Angefragt
                  </h1>
                </div>
                <RequestTable
                  columns={requestColumns}
                  data={
                    members.filter((f) =>
                      f.clublist?.some(
                        (s) =>
                          s.status === "pending" &&
                          s.club.clubID === club?.clubID
                      )
                    ) as any
                  }
                />
              </CardContent>
            </Card>
          )}
          {members.filter((f) =>
            f.clublist?.some(
              (s) => s.status === "waitlist" && s.club.clubID === club?.clubID
            )
          ).length !== 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Warteschlange
                  </h1>
                </div>
                <WaitlistTable
                  columns={waitlistColumns}
                  data={
                    members.filter((f) =>
                      f.clublist?.some(
                        (s) =>
                          s.status === "waitlist" &&
                          s.club.clubID === club?.clubID
                      )
                    ) as any
                  }
                />
              </CardContent>
            </Card>
          )}
          {members.filter((f) =>
            f.clublist?.some(
              (s) =>
                s.status === "club-accept" && s.club.clubID === club?.clubID
            )
          ).length !== 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="p-10 tablet:p-7 mobile:p-5">
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    In Bearbeitung
                  </h1>
                </div>
                <PendingTable
                  columns={pendingColumns}
                  data={
                    members.filter((f) =>
                      f.clublist?.some(
                        (s) =>
                          s.status === "club-accept" &&
                          s.club.clubID === club?.clubID
                      )
                    ) as any
                  }
                />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-0">
              <div className="p-10 tablet:p-7 mobile:p-5">
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold tablet:text-xl">
                    Alle Mitglieder
                  </h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 text-sm" align="end">
                      <DropdownMenuItem onClick={handleExportCSV}>
                        <div className="flex justify-between items-center">
                          <Send className="w-4 h-4 mr-2" />
                          Alle exportieren
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 pr-10 space-y-1.5 tablet:pr-7 mobile:pr-5">
                  <Progress
                    className="max-w-[300px] w-full"
                    value={
                      (members.filter((f) => !isEmpty(f.club)).length /
                        (club?.maxUser as number)) *
                      100
                    }
                  />
                  <p className="text-sm text-content">
                    {members.filter((f) => !isEmpty(f.club)).length}/
                    {club?.maxUser}
                  </p>
                </div>
              </div>
              <MemberTable
                columns={memberColumns}
                data={members.filter((f) => !isEmpty(f.club)) as any}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberManagePage;
