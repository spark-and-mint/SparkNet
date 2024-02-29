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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowUpDown, MoreHorizontal, PlusIcon } from "lucide-react"
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
import { IClient, IMember } from "@/types"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
// import { useGetMembers } from "@/lib/react-query/queries"

const tempClients: IClient[] = [
  {
    name: "Aave",
  },
  {
    name: "OpenAI",
  },
  {
    name: "Talent Proposal Deck",
  },
  {
    name: "Celo",
  },
]

const tempMembers: IMember[] = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@email.com",
    primaryRole: "Product Design Lead",
    assignedTo: null,
    contractSigned: false,
    applicationStatus: "form completed",
    imageUrl: "",
  },
  {
    id: "2",
    name: "Michael Johnson",
    email: "michael@email.com",
    primaryRole: "Blockchain Developer",
    assignedTo: null,
    contractSigned: false,
    applicationStatus: "form completed",
    imageUrl: "",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@email.com",
    primaryRole: "UX Designer",
    assignedTo: null,
    contractSigned: false,
    applicationStatus: "1on1 done",
    imageUrl: "",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@email.com",
    primaryRole: "Senior Product Manager",
    assignedTo: null,
    contractSigned: true,
    applicationStatus: "accepted",
    imageUrl: "",
  },
  {
    id: "3",
    name: "Renata Enriquez",
    email: "renata@sparkandmint.com",
    primaryRole: "Product Designer",
    assignedTo: "Talent Proposal Deck",
    contractSigned: true,
    applicationStatus: "accepted",
    imageUrl: "",
  },
]

const MemberTable = () => {
  // const { data: members } = useGetMembers()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [members, setMembers] = useState<IMember[]>(tempMembers)
  const [clients] = useState<IClient[]>(tempClients)

  const [memberEmail, setMemberEmail] = useState<string>("")
  const [emailClient, setEmailClient] = useState<string>("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  const handleAssignment = (value: string, email: string | undefined) => {
    setMemberEmail(email || "")
    setEmailClient(value)
    setShowEmailDialog(true)

    const memberToUpdate = members.find((member) => member.email === email)

    if (memberToUpdate) {
      memberToUpdate.assignedTo = value
      setMembers([...members])
    }
  }

  const columns: ColumnDef<IMember>[] = [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex flex-col gap-2 w-[160px]">
          <p className="text-sm font-medium leading-none">
            {row.getValue("name")}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {members.find((member) => member.id === row.original.id)?.email}
          </p>
        </div>
      ),
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
        <div className="capitalize">{row.getValue("primaryRole")}</div>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned to",
      cell: ({ row }) => {
        const email = members.find(
          (member) => member.id === row.original.id
        )?.email

        return (
          <div className="w-[200px]">
            <Select
              defaultValue={row.getValue("assignedTo") || ""}
              onValueChange={(value) => handleAssignment(value, email)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {clients.map((client: IClient) => (
                    <SelectItem key={client.name} value={client.name}>
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
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Application status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
                    className="h-24 text-center"
                  >
                    No results.
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

      <AlertDialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              This will send the following email
            </AlertDialogTitle>
            <div className="flex flex-col gap-6 py-4">
              <div className="text-sm">
                <span className="font-semibold">Recipient: </span>
                {memberEmail}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Subject: </span>New work
                opportunity: {emailClient}
              </div>

              <div className="text-sm leading-6">
                <span className="font-semibold">Body: </span>Spark + Mint has a
                new opportuniy at{" "}
                <span className="font-semibold">{emailClient}</span> and we
                think you're a great fit! Please let us know if you're
                interested and we'll get you connected as soon as possible.
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogContent></AlertDialogContent>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Send email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default MemberTable