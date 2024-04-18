import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import MilestoneForm from "./MilestoneForm"

const CreateMilestone = ({ projectId }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new milestone</DialogTitle>
        </DialogHeader>
        <MilestoneForm
          projectId={projectId}
          action="create"
          setOpen={setShowCreateDialog}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateMilestone
