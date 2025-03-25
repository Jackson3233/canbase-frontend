"use client";

import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useLocalStorage } from "usehooks-ts";
import ColumnResizer from "@/components/basic/ColumnResizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mergeObjectArrays, mergeObjects } from "@/lib/functions";
import { DataTableProps } from "@/types/page";

const initialColumnSizing = {
  select: 75,
  avatar: 75,
  inventoryID: 100,
  inventoryname: 150,
  storage: 150,
  type: 150,
  manufacturer: 200,
  serial_number: 200,
  tags: 200,
  createdAt: 150,
};

export function InventoryTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [inventoryTableSort, setInventoryTableSort] = useLocalStorage(
    "inventory-table-sort",
    []
  );
  const [inventoryTableShow, setInventoryTableShow] = useLocalStorage(
    "inventory-table-show",
    {}
  );
  const [inventoryTableSize, setInventoryTableSize] = useLocalStorage(
    "inventory-table-size",
    initialColumnSizing
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    inventoryTableSize || initialColumnSizing
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnSizingChange: setColumnSizing,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting: inventoryTableSort,
      columnFilters,
      columnVisibility: inventoryTableShow,
      rowSelection,
      columnSizing: inventoryTableSize,
    },
  });

  useEffect(() => {
    setInventoryTableSort(
      mergeObjectArrays(inventoryTableSort, sorting) as any
    );
  }, [sorting]);

  useEffect(() => {
    setInventoryTableShow(mergeObjects(inventoryTableShow, columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    setInventoryTableSize(mergeObjects(inventoryTableSize, columnSizing));
  }, [columnSizing]);

  return (
    <div>
      <div className="flex justify-between items-center space-x-2 mx-10 mb-5 tablet:mx-7 mobile:mx-5">
        <Input
          className="max-w-[420px] w-full"
          placeholder="Suchen..."
          value={
            (table.getColumn("inventoryname")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("inventoryname")?.setFilterValue(event.target.value)
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Ansicht
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    className="capitalize"
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "avatar" && "Inventarbild"}
                    {column.id === "inventoryID" && "ID"}
                    {column.id === "inventoryname" && "Name"}
                    {column.id === "storage" && "Lagerort"}
                    {column.id === "type" && "Typ"}
                    {column.id === "manufacturer" && "Hersteller"}
                    {column.id === "serial_number" && "Seriennummer"}
                    {column.id === "tags" && "Tags"}
                    {column.id === "createdAt" && "Erstellt"}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mx-10 border rounded-lg overflow-hidden tablet:mx-7 mobile:mx-5">
        <Table
          className="tablet:text-xs"
          style={{ width: table.getTotalSize() }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="relative"
                      key={header.id}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <ColumnResizer header={header} />
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="w-full h-24 text-center"
                  colSpan={columns.length}
                >
                  Keine Ergebnisse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mx-10 py-5 tablet:mx-7 mobile:mx-5 mobile:flex-col">
        <div className="flex-1 text-sm text-content mobile:self-start">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex justify-between items-center space-x-2 ml-2 mobile:self-end mobile:m-0 mobile:mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Vorherige
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Nächste
          </Button>
        </div>
      </div>
    </div>
  );
}
