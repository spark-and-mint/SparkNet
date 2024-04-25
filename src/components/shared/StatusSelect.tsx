import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetMemberStatus, useUpdateMember } from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { toast } from "sonner"

interface StatusSelectProps {
  member: Models.Document
  className?: string
}

const StatusSelect = ({ member, className }: StatusSelectProps) => {
  const { mutateAsync: updateMember, isPending } = useUpdateMember()
  const { data: memberStatus, refetch } = useGetMemberStatus(member.$id)

  const handleChange = async (
    status: "in review" | "1on1 done" | "accepted" | "rejected"
  ) => {
    try {
      await updateMember({
        memberId: member.$id,
        email: member.email,
        profileId: member.profileId,
        firstName: member.firstName,
        lastName: member.lastName,
        avatarUrl: member.avatarUrl,
        avatarId: member.avatarId,
        file: [],
        status: status,
      })

      toast.success(
        `${member.firstName}'s status updated to "${
          status.charAt(0).toUpperCase() + status.slice(1)
        }"`
      )

      refetch()
    } catch (error) {
      toast.error("Failed to update member status")
    }
  }

  return (
    <Select
      defaultValue={member.status}
      value={memberStatus || member.status}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="in review">
            <div className="flex items-center">
              <span className="mr-2 text-2xl text-yellow-500">•</span>
              In review
            </div>
          </SelectItem>
          <SelectItem value="1on1 done">
            <div className="flex items-center">
              <span className="mr-2 text-2xl text-purple-500">•</span>
              1on1 done
            </div>
          </SelectItem>
          <SelectItem value="accepted">
            <div className="flex items-center">
              <span className="mr-2 text-2xl text-green-500">•</span>
              Accepted
            </div>
          </SelectItem>
          <SelectItem value="rejected">
            <div className="flex items-center">
              <span className="mr-2 text-2xl text-red-500">•</span>
              Rejected
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default StatusSelect
