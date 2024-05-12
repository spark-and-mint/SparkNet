import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useGetRequestStatus,
  useUpdateRequest,
} from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { toast } from "sonner"

interface RequestStatusSelectProps {
  request: Models.Document
  className?: string
}

const RequestStatusSelect = ({
  request,
  className,
}: RequestStatusSelectProps) => {
  const { mutateAsync: updateRequest, isPending } = useUpdateRequest()
  const { data: requestStatus, refetch } = useGetRequestStatus(request.$id)

  const handleChange = async (
    status: "in review" | "reviewed" | "accepted" | "rejected"
  ) => {
    try {
      await updateRequest({
        requestId: request.$id,
        status: status,
      })

      refetch()
    } catch (error) {
      toast.error("Failed to update request status")
    }
  }

  return (
    <Select
      defaultValue={request.status}
      value={requestStatus || request.status}
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
          <SelectItem value="reviewed">
            <div className="flex items-center">
              <span className="mr-2 text-2xl text-purple-500">•</span>
              Reviewed
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

export default RequestStatusSelect
