import { useGetProjectMilestones } from "@/lib/react-query/queries"
import Loader from "../../Loader"
import Milestone from "../Milestone"
import { Models } from "appwrite"
import CreateMilestone from "./CreateMilestone"

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
            <>
              <div className="flex items-center justify-between my-8">
                <h3 className="text-lg font-semibold">Milestones & Updates</h3>
                <CreateMilestone projectId={projectId} />
              </div>
              <div className="space-y-14">
                {milestones &&
                  milestones.map((milestone: Models.Document) => (
                    <Milestone key={milestone.$id} milestone={milestone} />
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProjectMilestones
