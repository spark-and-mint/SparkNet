import { UserPlus } from "lucide-react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import OpportunityForm from "./OpportunityForm"

const CreateNewOpportunity = ({ projects, clientId }) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Card className="flex flex-col items-center justify-center p-16 group hover:bg-gray-50 cursor-pointer transition-colors">
          <UserPlus
            strokeWidth={1.2}
            className="w-9 h-9 text-gray-400 group-hover:text-black transition-colors"
          />
          <p className="mt-3 text-gray-600 group-hover:text-black">
            Assign a new member
          </p>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="py-4 px-8">
            Create new member opportunity
          </DialogTitle>
        </DialogHeader>

        <OpportunityForm
          action="Create"
          setShowDialog={setShowDialog}
          clientId={clientId}
          projects={projects}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateNewOpportunity
