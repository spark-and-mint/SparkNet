import { Button } from "@/components/ui"
import { useClient } from "@/context/ClientContext"
import { Link } from "react-router-dom"
import CreateNewProject from "./project/CreateNewProject"
import { useGetClientProjects } from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Loader } from ".."

const ClientProjects = () => {
  const client = useClient()
  const { data: projects, isPending } = useGetClientProjects(client.$id)

  return (
    <div>
      {isPending && !projects ? (
        <Loader />
      ) : (
        <>
          {projects?.documents.map((project: Models.Document) => (
            <div key={project.$id} className="mb-8 pb-5 border-b">
              <div className="mb-2 flex items-center">
                <div className="text-sm font-semibold mr-4">
                  {project.title}
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2 py-0.5 rounded  border border-yellow-300">
                  In progress
                </span>
                <Button asChild size="sm" variant="outline" className="ml-auto">
                  <Link to={`/clients/${client.$id}/project/${project.$id}`}>
                    View project
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </>
      )}

      {!isPending && (
        <div>
          <CreateNewProject clientId={client.$id} />
        </div>
      )}
    </div>
  )
}

export default ClientProjects
