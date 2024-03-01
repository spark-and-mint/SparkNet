import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IClient, IMember } from "@/types"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { Link } from "react-router-dom"

const ClientCard = ({ client }: { client: IClient }) => {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            {client.name}
            {client.logo ? (
              <img src={client.logo} className="w-12 h-12 rounded-full" />
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
                  {client.members.map((member: IMember) => (
                    <TooltipProvider delayDuration={100} key={member.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar>
                            <AvatarImage src={member.imageUrl} />
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{member.name}</p>
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
          <Link to={`/clients/${client.slug}`}>Client details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ClientCard
