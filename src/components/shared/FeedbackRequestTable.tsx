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
import {
  useGetFeedbackRequests,
  useGetStakeholders,
} from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Link } from "react-router-dom"

import { RankingInfo } from "@tanstack/match-sorter-utils"
import { fuzzyFilter, fuzzySort } from "@/lib/utils"
import RequestStatusSelect from "./RequestStatusSelect"
import FeedbackRequestDialog from "@/_root/pages/FeedbackRequestDialog"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const FeedbackRequestTable = () => {
  const {
    data: stakeholderData,
    isError: isErrorStakeholders,
    isPending: isLoadingStakeholders,
  } = useGetStakeholders()
  const {
    data: feedbackRequestData,
    isError: isErrorRequests,
    isPending: isLoadingRequests,
  } = useGetFeedbackRequests()

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [feedbackRequests, setFeedbackRequests] = useState<Models.Document[]>(
    []
  )
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] =
    useState<null | Models.Document>(null)

  useEffect(() => {
    console.log(feedbackRequestData)
    if (stakeholderData && feedbackRequestData) {
      const mergedFeedbackRequestData = feedbackRequestData.documents.map(
        (feedbackRequest) => {
          const stakeholder = stakeholderData.documents.find(
            (stakeholder) => stakeholder.$id === feedbackRequest.stakeholderId
          )
          return {
            ...stakeholder,
            ...feedbackRequest,
          }
        }
      )

      setFeedbackRequests(mergedFeedbackRequestData)
    }
  }, [stakeholderData, feedbackRequestData])

  const columns = React.useMemo<ColumnDef<Models.Document>[]>(
    () => [
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
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
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
        accessorKey: "industry",
        header: "Industry",
        cell: ({ row }) => {
          return (
            <div className="capitalize text-sm">{row.getValue("industry")}</div>
          )
        },
      },
      {
        accessorKey: "expertise",
        header: "Expertise",
        cell: ({ row }) => {
          return (
            <div className="capitalize text-sm">
              {row.getValue("expertise")}
            </div>
          )
        },
      },
      {
        accessorKey: "timeFrame",
        header: "Time Frame",
        cell: ({ row }) => {
          return (
            <div className="capitalize text-sm">
              {row.getValue("timeFrame")}
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const request = row.original
          return (
            <div className="flex justify-center">
              <RequestStatusSelect request={request} className="w-[8.35rem]" />
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: feedbackRequests,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter,
    },
  })

  if (isErrorRequests || isErrorStakeholders) {
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
          {feedbackRequests.length > 0 && (
            <p>Total requests: {feedbackRequests.length}</p>
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
                  const request = row.original
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        setShowRequestDialog(true), setSelectedRequest(request)
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
                      {isLoadingStakeholders || isLoadingRequests ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Loading requests...
                        </>
                      ) : (
                        "No requests found."
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <FeedbackRequestDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        request={selectedRequest}
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

export default FeedbackRequestTable
