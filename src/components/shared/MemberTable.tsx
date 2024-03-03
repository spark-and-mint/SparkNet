import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowUpDown, MoreHorizontal, PlusIcon, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  useAssignMemberToClient,
  useGetClients,
  useGetMembers,
} from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Link } from "react-router-dom"

const MemberTable = () => {
  const { data: memberData, isError } = useGetMembers()
  const { data: clients, isPending: isLoadingClients } = useGetClients()
  const { mutate: assignMemberToClient, isPending: IsLoadingAssignment } =
    useAssignMemberToClient()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [members, setMembers] = useState<Models.Document[]>([])

  const handleAssignment = async (
    clientId: string,
    member: Models.Document
  ) => {
    if (clientId === "unassigned") {
      const prevAssignedClientId = member.clients[0].$id
      const memberArray = clients?.documents.find(
        (client: Models.Document) => client.$id === prevAssignedClientId
      )?.members
      const newMemberArray = memberArray.filter(
        (currentMember: Models.Document) => currentMember.$id !== member.$id
      )
      assignMemberToClient({
        clientId: prevAssignedClientId,
        memberArray: newMemberArray,
      })
      return
    }
    const memberArray = clients?.documents.find(
      (client: Models.Document) => client.$id === clientId
    )?.members

    const newMemberArray = [...memberArray, member]

    assignMemberToClient({ clientId, memberArray: newMemberArray })
  }

  useEffect(() => {
    if (memberData) {
      setMembers(memberData.documents)
    }
  }, [memberData])

  const columns: ColumnDef<Models.Document>[] = [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => {
        const member = members.find((member) => member.id === row.original.id)
        return (
          <div className="flex items-center gap-2 w-[200px]">
            <img
              src={member?.avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium leading-none">{member?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {member?.email}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "primaryRole",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Primary role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-[180px] capitalize">
          {row.getValue("primaryRole")}
        </div>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned to",
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="w-[200px]">
            <Select
              defaultValue={
                member.clients &&
                member.clients.length > 0 &&
                member.clients[0].$id
                  ? member.clients[0].$id
                  : "unassigned"
              }
              onValueChange={(value) => handleAssignment(value, member)}
              disabled={isLoadingClients || IsLoadingAssignment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {clients &&
                    clients?.documents.map((client: Models.Document) => (
                      <SelectItem key={client.$id} value={client.$id}>
                        {client.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )
      },
    },
    {
      accessorKey: "applicationStatus",
      header: ({ column }) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4"
            >
              Application status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const status: string = row.getValue("applicationStatus")
        const bgColor: { [key: string]: string } = {
          "form completed": "#feb919",
          "1on1 done": "#2cccff",
          accepted: "#23c05c",
          rejected: "#e02523",
        }

        return (
          <div className="flex justify-center">
            <Badge
              className="capitalize"
              style={{ background: bgColor[status] }}
            >
              {status}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "contractSigned",
      header: "Contract signed",
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
        // const member = row.original
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
  ]

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-96 text-center border">
        <p>Error getting members.</p>
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
          <Input
            placeholder="Search roles..."
            value={
              (table.getColumn("primaryRole")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("primaryRole")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add member
          </Button>
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
                    className="h-48 text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Loading members...
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination className="mt-12">
          <PaginationContent className="flex w-full justify-between">
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <div className="flex gap-2">
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
            </div>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}

export default MemberTable
