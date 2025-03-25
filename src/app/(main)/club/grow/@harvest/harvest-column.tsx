"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, Slice } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCleanDateTime } from "@/lib/functions";
import { HarvestType } from "@/types/page";

export const harvestColumns: ColumnDef<HarvestType>[] = [
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
            <Slice className="w-4 h-4" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "harvestname",
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
      const harvestID = row.original.harvestID;

      return (
        <Link
          className="overflow-hidden px-2 whitespace-nowrap text-ellipsis text-sm hover:text-customhover"
          href={`/club/grow/${harvestID}/?tab=harvest`}
        >
          {row.getValue("harvestname")}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Status</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1 px-2">
          {row.getValue("status") === "drying" && (
            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
              Trockung
            </Badge>
          )}
          {row.getValue("status") === "curing" && (
            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
              Aushärtung
            </Badge>
          )}
          {row.getValue("status") === "test_in_progress" && (
            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
              Test in Bearbeitung
            </Badge>
          )}
          {row.getValue("status") === "ready_for_issue" && (
            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
              Bereit zur Ausgabe
            </Badge>
          )}
          {row.getValue("status") === "destroyed" && (
            <Badge className="w-fit h-fit p-1.5 text-xs leading-[8px] bg-customhover rounded-md">
              Vernichtet
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "charge",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Charge</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const chargename = row.original.charge.chargename;

      return <p className="px-2">{chargename}</p>;
    },
  },
  {
    accessorKey: "member",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Mitglieder</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const member = row.original.member;

      return (
        <div className="px-2">{member ? <p>{member.username}</p> : "-"}</div>
      );
    },
  },
  {
    accessorKey: "plants",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Pflanzen</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const plants = row.original.charge.plants.length;

      return <p className="px-2">{plants} Pflanzen</p>;
    },
  },
  {
    accessorKey: "wet_weight",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Nassgewicht</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <p className="px-2">{row.getValue("wet_weight")}g</p>;
    },
  },
  {
    accessorKey: "waste",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Verschnitt</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <p className="px-2">{row.getValue("waste")}g</p>;
    },
  },
  {
    accessorKey: "dry_weight",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Trockengewicht</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <p className="px-2">{row.getValue("dry_weight")}g</p>;
    },
  },
  {
    accessorKey: "createdAt",
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
          {getCleanDateTime(row.getValue("createdAt"))}
        </p>
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
];
