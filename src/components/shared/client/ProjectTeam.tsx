import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardTitle } from "@/components/ui/card"

const ProjectTeam = ({ team }) => {
  return (
    <div>
      {team.length < 1 ? (
        <p className="pt-5 pb-6 text-sm">No team members added yet.</p>
      ) : (
        <>
          {team.map((member: any) => (
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
    </div>
  )
}

export default ProjectTeam
