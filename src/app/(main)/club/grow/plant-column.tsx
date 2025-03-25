"use client";

import Image from "next/image";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Check, ChevronsUpDown, Sprout } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getCleanDateTime } from "@/lib/functions";
import { PlantType } from "@/types/page";

export const plantColumns: ColumnDef<PlantType>[] = [
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
      return (
        <div className="flex justify-center items-center px-2">
          {row.getValue("avatar") ? (
            <div className="relative w-8 h-8">
              <Image
                className="object-cover rounded-full"
                src={
                  (process.env.NEXT_PUBLIC_UPLOAD_URI as string) +
                  row.getValue("avatar")
                }
                fill={true}
                sizes="100%"
                alt="plant"
              />
            </div>
          ) : (
            <div className="w-8 h-8 flex justify-center items-center bg-[#EFEFEF] rounded-full">
              <Sprout className="w-4 h-4" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "plantname",
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
      const plantID = row.original.plantID;
      const isHarvested = row.original.isHarvested;

      return (
        <>
          {isHarvested ? (
            <p className="overflow-hidden px-2 whitespace-nowrap text-ellipsis text-sm">
              {row.getValue("plantname")}
            </p>
          ) : (
            <Link
              className="overflow-hidden px-2 whitespace-nowrap text-ellipsis text-sm hover:text-customhover"
              href={`/club/grow/${plantID}/?tab=plant`}
            >
              {row.getValue("plantname")}
            </Link>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "strain",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Strain</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const strain = row.original.strain;

      return <p className="px-2 break-all">{strain.strainname}</p>;
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
      const charge = row.original.charge;

      return (
        <div className="px-2">{charge ? <p>{charge.chargename}</p> : "-"}</div>
      );
    },
  },
  {
    accessorKey: "parent",
    header: () => <p className="px-2">Elternpflanze</p>,
    cell: ({ row }) => {
      const isParent = row.original.isParent;

      return (
        <p className="px-2">{isParent ? <Check className="w-3 h-3" /> : "-"}</p>
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
          {row.getValue("status") === "seeds" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#00E98B] rounded-sm" />
              <span className="text-xs">Samen</span>
            </div>
          )}
          {row.getValue("status") === "germination" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#00D37E] rounded-sm" />
              <span className="text-xs">Keimung</span>
            </div>
          )}
          {row.getValue("status") === "cutting" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#00C173] rounded-sm" />
              <span className="text-xs">Steckling</span>
            </div>
          )}
          {row.getValue("status") === "vegetative" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#009659] rounded-sm" />
              <span className="text-xs">Vegetative Phase</span>
            </div>
          )}
          {row.getValue("status") === "flowering" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#007043] rounded-sm" />
              <span className="text-xs">Blütephase</span>
            </div>
          )}
          {row.getValue("status") === "harvest" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#002114] rounded-sm" />
              <span className="text-xs">Ernte</span>
            </div>
          )}
          {row.getValue("status") === "quarantine" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#FBCB15] rounded-sm" />
              <span className="text-xs">Quarantäne</span>
            </div>
          )}
          {row.getValue("status") === "destroyed" && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[#EF4444] rounded-sm" />
              <span className="text-xs">Vernichtet</span>
            </div>
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
];
