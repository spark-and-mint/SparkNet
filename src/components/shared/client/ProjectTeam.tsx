import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardTitle } from "@/components/ui/card"
import { useGetProjectTeam } from "@/lib/react-query/queries"
import Loader from "../Loader"

interface TeamMember {
  firstName: string
  lastName: string
  avatarUrl: string
  role: string
}

const ProjectTeam = ({ project }) => {
  const { data: teamMembers, isPending } = useGetProjectTeam(
    project?.$id,
    project?.team
  )

  return (
    <div>
      {isPending ? (
        <Loader />
      ) : (
        <>
          {!teamMembers || (teamMembers && teamMembers.length === 0) ? (
            <p className="pt-5 pb-6 text-sm">No team members added yet.</p>
          ) : (
            <>
              {teamMembers &&
                teamMembers.length > 0 &&
                teamMembers.map((member: TeamMember) => (
                  <Card className="space-y-8 gap-4 p-8">
                    <CardTitle className="text-lg">Team members</CardTitle>
                    <div
                      key={member.firstName}
                      className="flex items-center space-x-3"
                    >
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
                  </Card>
                ))}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProjectTeam
