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

  // const project = {
  //   title: "Marketing Website Redesign",
  //   description:
  //     "Redesign the Global Unity website to make it more modern and user-friendly.",
  //   status: "In progress",
  //   client: {
  //     name: "Global Unity",
  //     logoUrl: "/assets/logos/global-unity.png",
  //   },
  //   team: [
  //     {
  //       $id: "1",
  //       firstName: "Alice",
  //       lastName: "Doe",
  //       role: "Project Manager",
  //       avatarUrl: "/assets/avatars/01.png",
  //     },
  //     {
  //       $id: "2",
  //       firstName: "Anna-Lisa",
  //       lastName: "Smitherson",
  //       role: "Product Designer",
  //       avatarUrl: "/assets/avatars/03.png",
  //     },
  //     {
  //       $id: "4",
  //       firstName: "David",
  //       lastName: "Smith",
  //       role: "Frontend Developer",
  //       avatarUrl: "/assets/avatars/04.png",
  //     },
  //   ],
  //   milestones: [
  //     {
  //       milestoneId: "1",
  //       title: "Research & Discovery",
  //       description: "Research and discovery phase for the new website design.",
  //       status: "approved",
  //       updates: [
  //         {
  //           updateId: "1",
  //           member: {
  //             $id: "2",
  //             firstName: "Anna-Lisa",
  //             lastName: "Smitherson",
  //             avatarUrl: "/assets/avatars/03.png",
  //           },
  //           title: "User Research Report",
  //           type: "Document",
  //           link: "#",
  //           description:
  //             "The user research report for the new website design. It includes user personas, user journey maps, and user stories.",
  //         },
  //         {
  //           updateId: "2",
  //           member: {
  //             $id: "2",
  //             firstName: "Charlie",
  //             lastName: "Turing",
  //             avatarUrl: "/assets/avatars/02.png",
  //           },
  //           title: "Competitor Analysis",
  //           type: "Document",
  //           link: "#",
  //           description:
  //             "The competitor analysis for the new website design. It includes a list of competitors, their strengths, and weaknesses.",
  //         },
  //       ],
  //     },
  //     {
  //       milestoneId: "2",
  //       title: "Wireframes & Mockups",
  //       description: "Wireframes and mockups for the new website design.",
  //       status: "in-progress",
  //       updates: [
  //         {
  //           updateId: "3",
  //           member: {
  //             $id: "2",
  //             firstName: "Anna-Lisa",
  //             lastName: "Smitherson",
  //             role: "Product Designer",
  //             avatarUrl: "/assets/avatars/03.png",
  //           },
  //           title: "Lo-Fi Wireframes",
  //           link: "https://www.figma.com",
  //           type: "Design asset",
  //           description:
  //             "Wireframes for the new website design. Includes home page, about page, and contact page.",
  //         },
  //       ],
  //     },
  //     {
  //       milestoneId: "3",
  //       title: "Prototype Development",
  //       description: "Development phase for the new website design.",
  //       status: "not-started",
  //       updates: [],
  //     },
  //   ],
  // }

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
                <ProjectMilestones milestones={project?.milestones} />
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
