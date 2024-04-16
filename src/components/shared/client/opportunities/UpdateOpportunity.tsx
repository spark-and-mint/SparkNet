import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import OpportunityForm from "./OpportunityForm"

const UpdateOpportunity = ({ clientId }) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <span>Edit</span>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="py-4 px-8">
            Update member opportunity
          </DialogTitle>
        </DialogHeader>

        <OpportunityForm
          action="Update"
          setShowDialog={setShowDialog}
          clientId={clientId}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UpdateOpportunity
