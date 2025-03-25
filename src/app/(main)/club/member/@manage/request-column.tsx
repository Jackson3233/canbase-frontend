"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import RequestDialog from "./request-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAvatarLetters, getCleanDate } from "@/lib/functions";
import { RequestType } from "@/types/page";

export const requestColumns: ColumnDef<RequestType>[] = [
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
          <Avatar className="w-8 h-8">
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
      return <RequestDialog row={row} />;
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <p className="px-2">Mitgliedsstatus</p>;
    },
    cell: ({ row }) => {
      return (
        <div className="px-2">
          {row.getValue("status") === "pending" && (
            <Badge className="w-fit h-fit p-1.5 text-xs text-[#1C73B2] leading-[8px] bg-[#0094FF]/25 rounded-md">
              Angefragt
            </Badge>
          )}
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
        <p>Angefragt am</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <p className="px-2 text-sm">{getCleanDate(row.getValue("birth"), 2)}</p>
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
        <p className="px-2 text-sm break-all">{row.getValue("memberID")}</p>
      );
    },
  },
];
