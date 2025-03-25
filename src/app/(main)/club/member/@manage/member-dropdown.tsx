"use client";

import Link from "next/link";
import { Row } from "@tanstack/react-table";
import { LogOut, MoreVertical, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { membersActions } from "@/store/reducers/membersReducer";
import { clubActions } from "@/store/reducers/clubReducer";
import { roleActions } from "@/store/reducers/roleReducer";
import { removeMember } from "@/actions/member";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberType } from "@/types/page";

const MemerbDropDown = ({ row }: { row: Row<MemberType> }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const member = row.original;

  const { toast } = useToast();

  const handleRemoveMember = async () => {
    const result = await removeMember({
      memberID: member.memberID,
    });
  
    toast({
      className: "fixed top-4 right-4 w-[350px] mobile:right-0 mobile:w-full",
      description: result.msg,
    });
  
    if (result.success) {
      dispatch(membersActions.removeMember(member.memberID));
      dispatch(clubActions.setClub({ club: result.club }));
      dispatch(roleActions.setRole({ role: result.role }));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 mx-2">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-sm" align="end">
        <Link href={`/club/member/${member.memberID}`}>
          <DropdownMenuItem>
            <div className="flex justify-between items-center">
              <Users className="w-4 h-4 mr-2" />
              Bearbeiten
            </div>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={handleRemoveMember}
          disabled={
            user?.role !== "owner" &&
            !user?.functions?.includes("club-members-members-delete")
          }
        >
          <div className="flex justify-between items-center text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Löschen
          </div>
          <DropdownMenuShortcut>⌘⇧R</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemerbDropDown;
