import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../../ui/button"
import { Avatar, AvatarFallback } from "../../ui/avatar"
import { Link } from "react-router-dom"
import { Models } from "appwrite"

const ClientCard = ({ client }: { client: Models.Document }) => {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            {client.name}
            {client.logoUrl ? (
              <img
                src={client.logoUrl}
                className="w-14 h-14 ring-1 ring-gray-300 rounded-full"
              />
            ) : (
              <Avatar>
                <AvatarFallback>
                  <span className="text-sm uppercase">
                    {client.name.substring(0, 2)}
                  </span>
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            {client.projects && client.projects.length > 0 ? (
              <p className="text-center py-8">
                {client.projects.length} active{" "}
                {client.projects.length > 1 ? "projects" : "project"}
              </p>
            ) : (
              <p className="text-center py-8">No active projects</p>
            )}
          </div>
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
