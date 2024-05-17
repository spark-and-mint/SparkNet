import * as React from "react"
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { RotateCw } from "lucide-react"
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
import { useGetMembers, useGetProfiles } from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Link } from "react-router-dom"

import { RankingInfo } from "@tanstack/match-sorter-utils"
import { fuzzyFilter, fuzzySort } from "@/lib/utils"
import MemberStatusSelect from "./MemberStatusSelect"
import MemberDialog from "@/_root/pages/MemberDialog"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const ApplicantTable = () => {
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

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [members, setMembers] = useState<Models.Document[]>([])
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<null | Models.Document>(
    null
  )

  useEffect(() => {
    if (memberData && profileData) {
      const acceptedMembers = memberData.documents.filter(
        (member) => member.status !== "accepted"
      )
      const mergedMemberData = acceptedMembers.map((member) => {
        const profile = profileData.documents.find(
          (profile) => profile.memberId === member.accountId
        )
        return {
          ...profile,
          ...member,
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
              <div className="flex flex-col w-[10rem]">
                <p className="py-1 text-sm font-medium leading-none truncate">
                  {member?.firstName} {member?.lastName}
                </p>
                <p className=" py-1 text-xs leading-none text-muted-foreground truncate">
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
        header: "Roles",
        cell: ({ row }) => {
          const roles = row.getValue("roles") as string[]
          return (
            <p className="text-xs text-wrap line-clamp-6">
              {roles && roles.length > 0 && roles.join(", ")}
            </p>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "skills",
        header: "Skills",
        cell: ({ row }) => {
          const skills = row.getValue("skills") as string[]
          return (
            <p className="text-xs text-wrap line-clamp-6">
              {skills && skills.length > 0 && skills.join(", ")}
            </p>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "domains",
        header: "Industries",
        cell: ({ row }) => {
          const domains = row.getValue("domains") as string[]
          return (
            <p className="text-xs text-wrap line-clamp-6">
              {domains && domains.length > 0 && domains.join(", ")}
            </p>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "seniority",
        header: "Seniortiy",
        // header: ({ column }) => {
        //   return (
        //     <Button
        //       variant="ghost"
        //       onClick={() =>
        //         column.toggleSorting(column.getIsSorted() === "asc")
        //       }
        //       className="-ml-4"
        //     >
        //       Seniority
        //       <ArrowUpDown className="ml-2 h-4 w-4" />
        //     </Button>
        //   )
        // },
        cell: ({ row }) => {
          return (
            <div className="text-center capitalize text-sm">
              {row.getValue("seniority")}
            </div>
          )
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const member = row.original

          return (
            <div className="flex justify-center">
              <MemberStatusSelect member={member} className="w-[10rem]" />
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
    getCoreRowModel: getCoreRowModel(),
    state: {
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
            disabled
          />
          {members.length > 0 && <p>Total applicants: {members.length}</p>}
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
                  const member = row.original
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        setShowMemberDialog(true), setSelectedMember(member)
                      }}
                      className="cursor-pointer"
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
      <MemberDialog
        open={showMemberDialog}
        onOpenChange={setShowMemberDialog}
        member={selectedMember}
      />
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

export default ApplicantTable
