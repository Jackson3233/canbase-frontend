"use client";

import Link from "next/link";
import { ChevronsUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAvatarLetters, getCleanDate } from "@/lib/functions";
import { PendingType } from "@/types/page";

export const pendingColumns: ColumnDef<PendingType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-5"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-5"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatar",
    header: () => <p className="px-2" />,
    cell: ({ row }) => {
      const username = row.original.username;

      return (
        <div className="flex justify-center items-center px-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={
                (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                row.getValue("avatar")
              }
              alt="avatar"
            />
            <AvatarFallback className="text-sm">
              {getAvatarLetters(username)}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: () => <p className="hidden">Search</p>,
    cell: ({ row }) => {
      return <p className="hidden">{row.getValue("username")}</p>;
    },
  },
  {
    accessorKey: "info",
    header: () => <p className="px-2">Name/E-Mail</p>,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex flex-col break-all px-2">
          <Link
            className="overflow-hidden whitespace-nowrap text-ellipsis text-sm hover:text-customhover"
            href={`/club/member/${member.memberID}`}
          >
            {member.username}
          </Link>
          <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-content">
            {member.email}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "birth",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Geburtsdatum</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-sm px-2">{getCleanDate(row.getValue("birth"), 2)}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <p className="px-2">Mitgliedsstatus</p>,
    cell: () => {
      return (
        <div className="px-2">
          <Badge className="w-fit p-1.5 text-xs whitespace-nowrap text-[#19A873] leading-[8px] bg-[#00C978]/25 rounded-md">
            Anfrage genehmigt aber ausstehend
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "memberID",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Mitgliedsnummer</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="break-all px-2">
          <Link
            className="text-sm hover:text-customhover"
            href={`/club/member/${row.getValue("memberID")}`}
          >
            {row.getValue("memberID")}
          </Link>
        </div>
      );
    },
  },
];
