import { useGetProjectMilestones } from "@/lib/react-query/queries"
import Loader from "../../Loader"
import Milestone from "../Milestone"
import { Models } from "appwrite"

const ProjectMilestones = ({ projectId }) => {
  const { data: milestones, isPending } = useGetProjectMilestones(projectId)

  return (
    <div>
      {isPending && !milestones ? (
        <Loader />
      ) : (
        <>
          {milestones && milestones.length < 1 ? (
            <p className="pt-5 pb-6 text-sm">No milestones added yet.</p>
          ) : (
            <div className="space-y-14">
              {milestones &&
                milestones.map((milestone: Models.Document) => (
                  <Milestone key={milestone.$id} milestone={milestone} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProjectMilestones
