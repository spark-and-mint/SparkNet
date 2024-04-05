import Milestone from "../Milestone"

const ProjectMilestones = ({ milestones }) => {
  return (
    <div>
      {milestones.length < 1 ? (
        <p className="pt-5 pb-6 text-sm">No milestones added yet.</p>
      ) : (
        <div className="space-y-14">
          {milestones.map((milestone) => (
            <Milestone key={milestone.milestoneId} {...milestone} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectMilestones
