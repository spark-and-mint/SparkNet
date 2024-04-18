import {
  CircleSlash,
  MoreHorizontal,
  Pickaxe,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Models } from "appwrite"
import Update from "./Update"
import {
  useDeleteMilestone,
  useGetMilestoneUpdates,
} from "@/lib/react-query/queries"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useConfirm } from "../AlertDialogProvider"
import MilestoneForm from "./project/MilestoneForm"
import { toast } from "sonner"

const getMilestoneStatus = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <span className="flex items-center  px-1.5 py-1 text-green-500 font-medium text-sm bg-green-400/20 border border-green-400/20 rounded-md">
          Approved <ThumbsUp className="w-4 h-4 ml-1.5 pb-0.25" />
        </span>
      )
    case "in progress":
      return (
        <span className="flex items-center  px-1.5 py-1 text-yellow-500 font-medium text-sm bg-amber-400/20 border border-amber-400/20 rounded-md">
          In progress <Pickaxe className="w-4 h-4 ml-1.5 pb-0.25" />
        </span>
      )
    case "approval requested":
      return (
        <span className="flex items-center  px-1.5 py-1 text-cyan-400 font-medium text-sm bg-muted border border-cyan-400/30 rounded-md">
          Approval requested <TriangleAlert className="w-4 h-4 ml-1.5" />
        </span>
      )
    case "approval rejected":
      return (
        <span className="flex items-center  px-1.5 py-1 text-red-500 font-medium text-sm bg-red-400/20 border border-red-400/20 rounded-md">
          Approval rejected <CircleSlash className="w-4 h-4 ml-1.5 pb-0.25" />
        </span>
      )
    default:
      return (
        <span className="flex items-center  px-1.5 py-1 text-gray-400 font-medium text-sm bg-muted border border-gray-400/20 rounded-md">
          Not started
        </span>
      )
  }
}

const Milestone = ({ milestone }: { milestone: Models.Document }) => {
  const { data: updates, isPending: isPendingUpdates } = useGetMilestoneUpdates(
    milestone.$id
  )
  const { mutateAsync: deleteMilestone } = useDeleteMilestone()
  const confirm = useConfirm()
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleDelete = async (milestoneId: string) => {
    const declineConfirmed = await confirm({
      title: `Are you sure you want to delete the "${milestone?.title}" milestone and all its updates?`,
      cancelButton: "Cancel",
      actionButton: "Delete",
    })

    if (!declineConfirmed) return

    try {
      await deleteMilestone({ milestoneId })
      toast.success("Milestone deleted successfully.")
    } catch (error) {
      toast.error("Could not delete milestone. Please try again.")
      console.error(error)
    }
  }

  return (
    <Card className="p-2">
      <CardHeader>
        <div className="flex flex-col gap-4 justify-between lg:flex-row lg:items-center mb-4">
          <div className="flex items-center">
            <h5 className="font-medium">{milestone.title}</h5>
            <div className="ml-4">{getMilestoneStatus(milestone.status)}</div>
          </div>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit milestone</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDelete(milestone.$id)}>
                  <span className="font-medium text-[#e40808]">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit milestone</DialogTitle>
              </DialogHeader>

              <MilestoneForm
                action="update"
                setOpen={setShowEditDialog}
                milestone={milestone}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {!updates || isPendingUpdates ? (
          <div>loading</div>
        ) : (
          <>
            {updates && updates.length === 0 ? (
              <Card className="flex flex-col items-center justify-center h-full pt-12 pb-14">
                <h4 className="text-[1.25rem] mt-3 text-center">
                  There are no updates added yet
                </h4>
                <p className="mt-2 text-muted-foreground text-center">
                  When updates are added by the team, they will be listed here.
                </p>
              </Card>
            ) : (
              <div className="space-y-8">
                {updates &&
                  updates.length > 0 &&
                  updates?.map((update: Models.Document) => (
                    <Update key={update.$id} update={update} />
                  ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default Milestone
