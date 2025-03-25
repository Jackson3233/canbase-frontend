"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, Paperclip, Scale } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatEuro, getCleanDateTime } from "@/lib/functions";
import { TransactionType } from "@/types/page";

export const transactionColumns: ColumnDef<TransactionType>[] = [
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
    cell: () => {
      return (
        <div className="flex justify-center items-center px-2">
          <div className="w-8 h-8 flex justify-center items-center bg-[#EFEFEF] rounded-full">
            <Scale className="w-4 h-4" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "recipient",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Name</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const transactionID = row.original.transactionID;

      return (
        <Link
          className="overflow-hidden px-2 whitespace-nowrap text-ellipsis text-sm hover:text-customhover"
          href={`/club/finance/${transactionID}/?tab=transaction`}
        >
          {row.getValue("recipient")}
        </Link>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <p className="px-2">Betrag</p>,
    cell: ({ row }) => {
      return (
        <p className="px-2">
          {row.original.amount >= 0 ? (
            <span className="text-[#00C978]">
              {formatEuro(row.getValue("amount"))}
            </span>
          ) : (
            <span className="text-[#EF4444]">
              {formatEuro(row.getValue("amount"))}
            </span>
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "method",
    header: () => <p className="px-2">Zahlungsmethode</p>,
    cell: ({ row }) => {
      return (
        <p className="px-2">
          {row.getValue("method") === "cash" && <>Bar</>}
          {row.getValue("method") === "instant" && <>Sofortüberweisung</>}
          {row.getValue("method") === "card" && <>Karte</>}
          {row.getValue("method") === "paypal" && <>PayPal</>}
          {row.getValue("method") === "credit" && <>Guthaben</>}
          {row.getValue("method") === "harvest" && <>Ernte</>}
          {row.getValue("method") === "transfer" && <>Überweisung</>}
          {row.getValue("method") === "other" && <>Sonstiges</>}
        </p>
      );
    },
  },
  {
    accessorKey: "purpose",
    header: () => <p className="px-2">Verwendungszweck</p>,
    cell: ({ row }) => {
      return (
        <p className="px-2">
          {row.original.purpose ? row.getValue("purpose") : "-"}
        </p>
      );
    },
  },
  {
    accessorKey: "attachments",
    header: () => <p className="px-2">Anhänge</p>,
    cell: ({ row }) => {
      const attachments = row.original.attachments;

      return (
        <div className="w-fit px-2">
          {attachments ? (
            <Link
              className="hover:text-customhover"
              href={
                (process.env.NEXT_PUBLIC_UPLOAD_URI as string) + attachments[0]
              }
              target="_blank"
            >
              <Paperclip className="w-3 h-3" />
            </Link>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Letztes Update</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <p className="px-2 text-xs break-all">
          {getCleanDateTime(row.getValue("updatedAt"))}
        </p>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Erstellt</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <p className="px-2 text-xs break-all">
          {getCleanDateTime(row.getValue("createdDate"))}
        </p>
      );
    },
  },
];
