import * as React from "react"
import {
  ColumnDef,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useGetStakeholders } from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { RankingInfo } from "@tanstack/match-sorter-utils"
import { fuzzyFilter } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const StakeholderTable = () => {
  const {
    data: stakeholderData,
    isError: isErrorStakeholders,
    isPending: isLoadingStakeholders,
  } = useGetStakeholders()

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [stakeholders, setStakeholders] = useState<Models.Document[]>([])

  useEffect(() => {
    if (stakeholderData) {
      setStakeholders(stakeholderData.documents)
    }
  }, [stakeholderData])

  const columns = React.useMemo<ColumnDef<Models.Document>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="w-5 h-5 mt-1"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="w-5 h-5 mt-1"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "From",
        cell: ({ row }) => {
          const stakeholder = row.original
          return (
            <div className="flex items-center gap-2 w-[12rem]">
              <img
                src={stakeholder?.avatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col w-[10rem]">
                <p className="py-1 text-sm font-medium leading-none truncate">
                  {stakeholder?.firstName} {stakeholder?.lastName}
                </p>
                <p className=" py-1 text-xs leading-none text-muted-foreground truncate">
                  {stakeholder?.email}
                </p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => {
          return (
            <div className="capitalize text-sm">{row.getValue("company")}</div>
          )
        },
      },
      {
        accessorKey: "$createdAt",
        header: "Sign Up Date",
        cell: ({ row }) => {
          const date = row.getValue("$createdAt") as Date
          const dateString = new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          return <div className="capitalize text-sm">{dateString}</div>
        },
      },
      {
        accessorKey: "clientId",
        header: ({ column }) => {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Active
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        sortingFn: "alphanumeric",
        cell: ({ row }) => {
          const active = row.getValue("clientId")

          return (
            <div className="flex justify-center text-center">
              <Badge
                variant={active ? "default" : "destructive"}
                style={{ background: active ? "#23c05c" : "" }}
                className="flex justify-center w-11 py-1"
              >
                {!active ? "No" : "Yes"}
              </Badge>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: stakeholders,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
  })

  if (isErrorStakeholders) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-96 text-center border rounded-lg">
        <p>Error getting data.</p>
        <Button asChild>
          <Link target="_blank" to="https://status.appwrite.online/">
            Check API status
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="w-full mt-4">
        <div className="flex items-center justify-between pb-4">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search..."
            disabled
          />
          {stakeholders.length > 0 && (
            <p>Total stakeholders: {stakeholders.length}</p>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-56 text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isLoadingStakeholders ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Loading stakeholders...
                        </>
                      ) : (
                        "No stakeholders found."
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="max-w-sm"
    />
  )
}

export default StakeholderTable
