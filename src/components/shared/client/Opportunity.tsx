import { Button } from "@/components/ui"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useState, Fragment } from "react"
import { toast } from "sonner"
import OpportunityForm from "./opportunities/OpportunityForm"
import { useConfirm } from "../AlertDialogProvider"
import {
  useDeleteOpportunity,
  useGetMemberById,
} from "@/lib/react-query/queries"

const Opportunity = ({ client, opportunity }) => {
  const [showDialog, setShowDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const confirm = useConfirm()
  const { mutateAsync: deleteOpportunity } = useDeleteOpportunity()
  const { data: member } = useGetMemberById(opportunity.memberId)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-1.5 py-0.5 rounded border border-green-400">
            Accepted
          </span>
        )
      case "declined":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-1.5 py-0.5 rounded border border-red-400">
            Declined
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
    const deleteConfirmed = await confirm({
      title: `Removing member from team`,
      body: "Are you sure you want to do that?",
      cancelButton: "Cancel",
      actionButton: "Remove",
    })

    if (!deleteConfirmed) return

    try {
      await deleteOpportunity({ opportunityId, clientId: client.$id })
      toast.success("Member removed successfully.")
    } catch (error) {
      toast.error("Could not remove member. Please try again.")
      console.error({ error })
    }
  }

  return (
    <Fragment key={opportunity.$id}>
      <div className="mb-8 pb-5 border-b">
        <div className="relative mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={member?.avatarUrl} />
            </Avatar>
            <div>
              <p className="font-medium leading-none">
                {member?.firstName} {member?.lastName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {opportunity.role}
              </p>
            </div>
          </div>
          <div className="absolute ml-6 left-1/2 -translate-x-1/2">
            {getStatusBadge(opportunity.status)}
          </div>
          <div className="flex gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEmailDialog(true)}
              disabled={opportunity.status !== "awaiting response"}
            >
              Notify by email
            </Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
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
                      Remove from team
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
                  opportunity={opportunity}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
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
                {member?.email}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Subject: </span>
                New work opportunity: {client.name}
              </div>

              <div className="text-sm leading-6">
                <span className="font-semibold">Body: </span>
                Spark + Mint has a new opportuniy at{" "}
                <span className="font-semibold">{client.name}</span> and we
                think you're a great fit! Please let us know if you're
                interested and we'll get you connected as soon as possible.
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
  )
}

export default Opportunity
