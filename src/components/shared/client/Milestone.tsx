import { CircleSlash, Pickaxe, ThumbsUp, TriangleAlert } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Models } from "appwrite"
import Update from "./Update"
import { useGetMilestoneUpdates } from "@/lib/react-query/queries"

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

  return (
    <Card className="p-2">
      <CardHeader>
        <div className="flex flex-col gap-4 justify-between lg:flex-row lg:items-center mb-4">
          <div className="flex items-center">
            <h5 className="font-medium">{milestone.title}</h5>
            <div className="ml-4">{getMilestoneStatus(milestone.status)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!updates || isPendingUpdates ? (
          <div>loading</div>
        ) : (
          <>
            {updates && updates.length === 0 ? (
              <Card className="flex flex-col items-center justify-center h-full pt-14 pb-16">
                <h4 className="h4 text-[1.325rem] mt-3 text-center">
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
