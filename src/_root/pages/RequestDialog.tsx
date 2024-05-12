import StatusSelect from "@/components/shared/RequestStatusSelect"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Models } from "appwrite"

interface RequestDialogProps {
  request: Models.Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RequestDialog = ({ request, open, onOpenChange }: RequestDialogProps) => {
  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="pt-8 pb-4 px-8">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="mr-2">
                {request?.avatarUrl ? (
                  <img
                    src={request.avatarUrl}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-200 rounded-full" />
                )}
              </div>

              <div className="text-2xl font-semibold">{request?.name}</div>
            </div>
            <div>
              <StatusSelect request={request} className="w-[10rem]" />
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[32rem] w-full">
          <div className="flex flex-col gap-8 pt-4 pb-8 px-8">
            <div>
              <dl className="divide-y divide-gray-100">
                <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-primary">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                    {request.email}
                  </dd>
                </div>
                <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-primary">
                    Company
                  </dt>
                  <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                    {request.company}
                  </dd>
                </div>
                {request.industry && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Industry
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {request.industry}
                    </dd>
                  </div>
                )}
                {request.goal && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Goal
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {request.goal}
                    </dd>
                  </div>
                )}
                {request.fixedOrOngoing && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Fixed or Ongoing
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 capitalize">
                      {request.fixedOrOngoing}
                    </dd>
                  </div>
                )}
                {request.individualOrTeam && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Individual or Team
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 capitalize">
                      {request.individualOrTeam}
                    </dd>
                  </div>
                )}
                {request.skill && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Skills Needed
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {request.skill}
                    </dd>
                  </div>
                )}
                {request.timeFrame && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Time frame
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {request.timeFrame}
                    </dd>
                  </div>
                )}
                {request.budget && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Budget
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {request.budget}
                    </dd>
                  </div>
                )}
                {request.contactPreference && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Contact Preference
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {request.contactPreference}
                    </dd>
                  </div>
                )}
                {request.contactInfo && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Contact Info
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {request.contactInfo}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default RequestDialog
