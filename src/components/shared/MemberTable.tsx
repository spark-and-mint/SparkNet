import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useGetMembers, useGetProfiles } from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Link } from "react-router-dom"

import { RankingInfo } from "@tanstack/match-sorter-utils"
import { fuzzyFilter, fuzzySort } from "@/lib/utils"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const MemberTable = () => {
  const {
    data: memberData,
    isError: isErrorMembers,
    isPending: isLoadingMembers,
  } = useGetMembers()
  const {
    data: profileData,
    isError: isErrorProfiles,
    isPending: isLoadingProfiles,
  } = useGetProfiles()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [members, setMembers] = useState<Models.Document[]>([])

  useEffect(() => {
    if (memberData && profileData) {
      const acceptedMembers = memberData.documents.filter(
        (member) => member.status === "accepted"
      )
      const mergedMemberData = acceptedMembers.map((member) => {
        const profile = profileData.documents.find(
          (profile) => profile.memberId === member.accountId
        )
        return {
          ...member,
          ...profile,
        }
      })

      setMembers(mergedMemberData)
    }
  }, [memberData, profileData])

  const columns = React.useMemo<ColumnDef<Models.Document>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Member",
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="flex items-center gap-2 w-[12rem]">
              <img
                src={member?.avatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col gap-2 w-[10rem]">
                <p className="text-sm font-medium leading-none truncate">
                  {member?.firstName} {member?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {member?.email}
                </p>
              </div>
            </div>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "roles",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Roles
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="max-w-[12rem]">
              <p className="text-xs truncate text-wrap">
                {(row.getValue("roles") as string[]).join(", ")}
              </p>
            </div>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "skills",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Skills
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="max-w-[12rem]">
              <p className="text-xs text-wrap">
                {(row.getValue("skills") as string[]).join(", ")}
              </p>
            </div>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "domains",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Industries
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="max-w-[12rem]">
              <p className="text-xs text-wrap">
                {(row.getValue("domains") as string[]).join(", ")}
              </p>
            </div>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "seniority",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Seniority
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="capitalize text-sm">
              {row.getValue("seniority")}
            </div>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "contractSigned",
        header: () => (
          <div className="text-center text-nowrap">Contract signed</div>
        ),
        cell: ({ row }) => {
          const signed = row.getValue("contractSigned")
          return (
            <div className="flex justify-center">
              <Badge
                variant={signed ? "default" : "secondary"}
                style={{ background: signed ? "#23c05c" : "#f4f4f5" }}
              >
                {!signed ? "Not signed" : "Signed"}
              </Badge>
            </div>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: () => {
          return (
            <div className="flex justify-end mr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit member</DropdownMenuItem>
                  <DropdownMenuItem>View application</DropdownMenuItem>
                  <DropdownMenuItem>View contract</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="font-medium text-[#e40808]">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: members,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  if (isErrorMembers || isErrorProfiles) {
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
          />
          {members.length > 0 && <p>Total members: {members.length}</p>}
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
                table.getRowModel().rows.map((row) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-56 text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isLoadingMembers || isLoadingProfiles ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Loading members...
                        </>
                      ) : (
                        "No members found."
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

export default MemberTable
