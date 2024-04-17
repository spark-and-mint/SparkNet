import { Models } from "appwrite"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn, toRelativeTimeString } from "@/lib/utils"
import { useGetMemberById } from "@/lib/react-query/queries"

const Update = ({ update }: { update: Models.Document }) => {
  const { data: creator } = useGetMemberById(update.creatorId)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="p-0">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-between p-6 cursor-pointer",
              !isOpen && "hover:bg-slate-600/5"
            )}
          >
            <div className="flex gap-5 items-center">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium leading-none">{update.title}</p>
                </div>
                <p className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  {creator?.firstName} {creator?.lastName} <span>•</span>{" "}
                  {toRelativeTimeString(new Date(update.$createdAt))}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <ChevronDown className="h-6 w-6" />
              )}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6">
            <dl className="divide-y divide-stroke-1">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-primary">
                  Description
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  {update.description}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-primary">
                  Link
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                  <Button asChild variant="link" className="p-0 font-medium">
                    <Link to={update.link ?? update.fileUrl}>
                      {update.link ?? update.fileUrl}
                    </Link>
                  </Button>
                </dd>
              </div>
            </dl>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default Update
