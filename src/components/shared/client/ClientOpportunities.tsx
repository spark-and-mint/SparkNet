import { Button } from "@/components/ui"
import { useClient } from "@/context/ClientContext"
import { Models } from "appwrite"
import { FolderX, MoreHorizontal } from "lucide-react"
import Loader from "../Loader"
import CreateNewOpportunity from "./opportunities/CreateNewOpportunity"
import { useGetClientOpportunities } from "@/lib/react-query/queries"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Fragment, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import OpportunityForm from "./opportunities/OpportunityForm"
import { toast } from "sonner"
import { useConfirm } from "../AlertDialogProvider"
import { deleteOpportunity } from "@/lib/appwrite/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ClientOpportunities = () => {
  const client = useClient()
  const confirm = useConfirm()
  const { data: opportunities, isPending } = useGetClientOpportunities(
    client.$id
  )
  const [showDialog, setShowDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-1.5 py-0.5 rounded border border-green-400">
            Accepted
          </span>
        )
      case "rejected":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-1.5 py-0.5 rounded border border-red-400">
            Rejected
          </span>
        )
      default:
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2 py-0.5 rounded border border-yellow-300">
            Awaiting response
          </span>
        )
    }
  }

  const handleDelete = async (opportunityId: string) => {
    const deleteConfirmed = confirm({
      title: `Deleting opportunity`,
      body: "Are you sure you want to do that?",
      cancelButton: "Cancel",
      actionButton: "Delete",
    })

    if (!deleteConfirmed) return

    try {
      await deleteOpportunity(opportunityId, client.$id)
      toast.success("Opportunity deleted successfully.")
    } catch (error) {
      toast.error("Could not delete opportunity.")
      console.error({ error })
    }
  }

  return (
    <div>
      {isPending && !opportunities ? (
        <Loader />
      ) : (
        <>
          {client.projects.length < 1 ? (
            <div className="flex gap-2 items-center justify-center py-16">
              <FolderX strokeWidth={1} className="h-7 w-7 text-primary" />
              <p>You need to create a project first</p>
            </div>
          ) : (
            <>
              {opportunities?.documents.map((opportunity: Models.Document) => (
                <Fragment key={opportunity.$id}>
                  <div className="mb-8 pb-5 border-b">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={opportunity.member.avatarUrl} />
                        </Avatar>
                        <div>
                          <p className="font-medium leading-none">
                            {opportunity.member.firstName}{" "}
                            {opportunity.member.lastName}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {opportunity.role}
                          </p>
                        </div>
                      </div>
                      <div>{getStatusBadge(opportunity.status)}</div>
                      <div className="flex gap-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowEmailDialog(true)}
                        >
                          Notify by email
                        </Button>
                        <Dialog open={showDialog} onOpenChange={setShowDialog}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="px-2"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <DialogTrigger>Edit opportunity</DialogTrigger>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(opportunity.$id)}
                              >
                                <span className="font-medium text-[#e40808]">
                                  Delete
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle className="py-4 px-8">
                                Update member opportunity
                              </DialogTitle>
                            </DialogHeader>

                            <OpportunityForm
                              action="Update"
                              setShowDialog={setShowDialog}
                              clientId={client.$id}
                              projects={client.projects}
                              opportunity={opportunity}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  <AlertDialog
                    open={showEmailDialog}
                    onOpenChange={setShowEmailDialog}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          This will send the following email
                        </AlertDialogTitle>
                        <div className="flex flex-col gap-6 py-4">
                          <div className="text-sm">
                            <span className="font-semibold">Recipient: </span>
                            {opportunity.member.email}
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold">Subject: </span>
                            New work opportunity: {client.name}
                          </div>

                          <div className="text-sm leading-6">
                            <span className="font-semibold">Body: </span>
                            Spark + Mint has a new opportuniy at{" "}
                            <span className="font-semibold">
                              {client.name}
                            </span>{" "}
                            and we think you're a great fit! Please let us know
                            if you're interested and we'll get you connected as
                            soon as possible.
                          </div>
                        </div>
                      </AlertDialogHeader>
                      <AlertDialogContent></AlertDialogContent>
                      <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Send email</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Fragment>
              ))}
              <div>
                <CreateNewOpportunity
                  projects={client.projects}
                  clientId={client.$id}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ClientOpportunities
