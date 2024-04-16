import { useClient } from "@/context/ClientContext"
import { Models } from "appwrite"
import { FolderX } from "lucide-react"
import Loader from "../Loader"
import CreateNewOpportunity from "./opportunities/CreateNewOpportunity"
import {
  useGetClientOpportunities,
  useGetClientProjects,
} from "@/lib/react-query/queries"
import Opportunity from "./Opportunity"

const ClientOpportunities = () => {
  const client = useClient()
  const { data: opportunities, isPending } = useGetClientOpportunities(
    client.$id
  )
  const { data: projects } = useGetClientProjects(client.$id)

  return (
    <div>
      {isPending && !opportunities ? (
        <Loader />
      ) : (
        <>
          {projects && projects.documents.length < 1 ? (
            <div className="flex gap-2 items-center justify-center py-16">
              <FolderX strokeWidth={1} className="h-7 w-7 text-primary" />
              <p>You need to create a project first</p>
            </div>
          ) : (
            <>
              {opportunities?.documents.map((opportunity: Models.Document) => (
                <Opportunity
                  key={opportunity.$id}
                  client={client}
                  opportunity={opportunity}
                />
              ))}
              <div>
                <CreateNewOpportunity clientId={client.$id} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ClientOpportunities
