import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../../ui/button"
import { Link } from "react-router-dom"
import { Models } from "appwrite"
import { useGetClientProjects } from "@/lib/react-query/queries"
import Loader from "../Loader"

const ClientCard = ({ client }: { client: Models.Document }) => {
  const { data: projects, isPending } = useGetClientProjects(client.$id)

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-8 leading-8">
            {client.name}
            <img
              src={client.logoUrl}
              className="shrink-0 w-14 h-14 ring-1 ring-gray-300 rounded-full"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isPending && !projects ? (
            <Loader noText className="h-auto" />
          ) : (
            <div className="flex flex-col gap-4">
              {projects && projects.documents.length > 0 ? (
                <p className="text-center py-8">
                  {projects.documents.length} active{" "}
                  {projects.documents.length > 1 ? "projects" : "project"}
                </p>
              ) : (
                <p className="text-center py-8">No active projects</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/clients/${client.$id}`}>Client space</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ClientCard
