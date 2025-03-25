"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCleanDateTime, isEmpty } from "@/lib/functions";
import { InventoryType } from "@/types/page";

export const inventoryColumns: ColumnDef<InventoryType>[] = [
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
            <Package className="w-4 h-4" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "inventoryID",
    header: () => <p className="px-2">ID</p>,
    cell: ({ row }) => {
      return (
        <Link
          className="overflow-hidden px-2 whitespace-nowrap text-ellipsis text-sm hover:text-customhover"
          href={`/club/inventory/${row.getValue("inventoryID")}`}
        >
          {row.getValue("inventoryID")}
        </Link>
      );
    },
  },
  {
    accessorKey: "inventoryname",
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
      const inventoryname = row.original.inventoryname;

      return (
        <div className="px-2">
          {inventoryname ? <p>{inventoryname}</p> : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "current",
    header: () => <p className="px-2">Menge</p>,
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const unit = row.original.unit;

      return (
        <div className="flex flex-col space-y-1 px-2">
          <Progress value={100} />
          <p className="text-sm">
            {quantity}/{quantity}
            {unit === "gram" && "g"}
            {unit === "kilogram" && "kg"}
            {unit === "milliliter" && "ml"}
            {unit === "liter" && "l"}
            {unit === "piece" && "Stk."}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "storage",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Lagerort</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const storage = row.original.storage;

      return (
        <div className="px-2 break-all">
          {!isEmpty(storage) ? <p>{storage.storagename}</p> : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        className="w-full flex justify-between items-center px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <p>Typ</p>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="px-2">
          {row.getValue("type") === "grow-equipment" && (
            <p className="text-sm">Grow Equipment</p>
          )}
          {row.getValue("type") === "other" && (
            <p className="text-sm">Sonstiges</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "manufacturer",
    header: () => <p className="px-2">Hersteller</p>,
    cell: ({ row }) => {
      const manufacturer = row.original.manufacturer;

      return (
        <div className="px-2">{manufacturer ? <p>{manufacturer}</p> : "-"}</div>
      );
    },
  },
  {
    accessorKey: "serial_number",
    header: () => <p className="px-2">Seriennummer</p>,
    cell: ({ row }) => {
      const serial_number = row.original.serial_number;

      return (
        <div className="px-2">
          {serial_number ? <p>{serial_number}</p> : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: () => <p className="px-2">Tags</p>,
    cell: ({ row }) => {
      const tags = row.original.tags;

      return (
        <div className="flex flex-wrap gap-1 px-2">
          {tags.length > 0
            ? tags.map((item, key) => (
                <Badge
                  className="w-fit p-1.5 text-xs leading-[8px] border border-[#E7E7E7] rounded-md"
                  variant="secondary"
                  key={key}
                >
                  {item}
                </Badge>
              ))
            : "-"}
        </div>
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
