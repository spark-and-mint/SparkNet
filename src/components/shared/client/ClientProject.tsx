import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import { useGetProjectById } from "@/lib/react-query/queries"
import { Loader } from ".."
import ProjectMilestones from "./project/ProjectMilestones"
import ProjectDetails from "./project/ProjectDetails"
import ProjectTeam from "./ProjectTeam"

const ClientProject = () => {
  const { projectId } = useParams()
  const { data: project, isPending } = useGetProjectById(projectId)

  return (
    <div>
      <div className="flex flex-col gap-16">
        {isPending && !project ? (
          <Loader />
        ) : (
          <div>
            <h3 className="text-3xl font-bold tracking-tight">
              {project?.title}
            </h3>

            <Tabs defaultValue="details">
              <TabsList className="mt-6 mb-8">
                <TabsTrigger value="details">Project details</TabsTrigger>
                <TabsTrigger value="status">Project status</TabsTrigger>
                <TabsTrigger value="team">Team members</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <ProjectDetails project={project} />
              </TabsContent>
              <TabsContent value="status">
                <ProjectMilestones projectId={project?.$id} />
              </TabsContent>
              <TabsContent value="team">
                <ProjectTeam team={project?.team} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientProject
