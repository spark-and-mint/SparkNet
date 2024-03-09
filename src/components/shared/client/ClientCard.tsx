import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"
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
            {client.members && client.members.length > 0 ? (
              <>
                <h4 className="text-sm font-medium -mt-4">Assigned members</h4>
                <div className="flex items-center space-x-4">
                  {client.members.map((member: Models.Document) => (
                    <TooltipProvider delayDuration={100} key={member.$id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar>
                            <AvatarImage src={member.avatarUrl} />
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {member.firstName} {member.lastName}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center py-8">No members assigned</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/clients/${client.$id}`}>Client details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ClientCard
