import { Users } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../../ui"

const ViewTeamMembers = ({ team }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2 pb-0.25" />
          View team members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Team members</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-8 gap-4">
          {team.map((member: any) => (
            <div key={member.firstName} className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={member.avatarUrl} />
              </Avatar>
              <div>
                <p className="font-medium leading-none">
                  {member.firstName} {member.lastName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewTeamMembers
