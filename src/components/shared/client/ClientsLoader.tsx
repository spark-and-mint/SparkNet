import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ClientsLoader = () => (
  <div className="grid grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map(() => (
      <Card className="h-[290px] flex flex-col justify-between">
        <CardHeader>
          <div className="flex justify-between">
            <Skeleton className="h-[40px] w-[200px]" />
            <Skeleton className="h-[52px] w-[52px] rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-8 w-[250px]" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-14 w-full" />
        </CardFooter>
      </Card>
    ))}
  </div>
)

export default ClientsLoader
