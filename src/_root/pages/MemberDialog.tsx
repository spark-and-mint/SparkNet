import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import StatusSelect from "@/components/shared/MemberStatusSelect"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Models } from "appwrite"

interface MemberDialogProps {
  member: Models.Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MemberDialog = ({ member, open, onOpenChange }: MemberDialogProps) => {
  if (!member) return null

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
                {member?.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-200 rounded-full" />
                )}
              </div>

              <div className="text-2xl font-semibold">{member?.name}</div>
            </div>
            <div>
              <StatusSelect member={member} className="w-[10rem]" />
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
                    {member.email}
                  </dd>
                </div>
                {member.workStatus && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Work status
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.workStatus}
                    </dd>
                  </div>
                )}
                {member.seniority && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Seniority
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.seniority}
                    </dd>
                  </div>
                )}
                {member.rate && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Hourly rate
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.rate}
                    </dd>
                  </div>
                )}
                {member.availability && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Availability
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.availability}
                    </dd>
                  </div>
                )}
                {member.lookingFor && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Looking for
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.lookingFor}
                    </dd>
                  </div>
                )}
                {member.roles && member.roles.length > 0 ? (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Roles
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.roles.join(", ")}
                    </dd>
                  </div>
                ) : null}
                {member.skills && member.skills.length > 0 ? (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Skills
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.skills.join(", ")}
                    </dd>
                  </div>
                ) : null}
                {member.domains && member.domains.length > 0 ? (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Industries
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                      {member.domains.join(", ")}
                    </dd>
                  </div>
                ) : null}
                {member.website && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Website
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 truncate">
                      <Button asChild variant="link" className="p-0 h-0">
                        <Link to={member.website} target="_blank">
                          {member.website}
                        </Link>
                      </Button>
                    </dd>
                  </div>
                )}
                {member.linkedin && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      LinkedIn
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 truncate">
                      <Button asChild variant="link" className="p-0 h-0">
                        <Link to={member.linkedin} target="_blank">
                          {member.linkedin}
                        </Link>
                      </Button>
                    </dd>
                  </div>
                )}
                {member.github && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      GitHub
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 truncate">
                      <Button asChild variant="link" className="p-0 h-0">
                        <Link to={member.github} target="_blank">
                          {member.github}
                        </Link>
                      </Button>
                    </dd>
                  </div>
                )}
                {member.x && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      X
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 truncate">
                      <Button asChild variant="link" className="p-0 h-0">
                        <Link to={member.x} target="_blank">
                          {member.x}
                        </Link>
                      </Button>
                    </dd>
                  </div>
                )}
                {member.farcaster && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Farcaster
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 truncate">
                      <Button asChild variant="link" className="p-0 h-0">
                        <Link to={member.farcaster} target="_blank">
                          {member.farcaster}
                        </Link>
                      </Button>
                    </dd>
                  </div>
                )}
                {member.dribbble && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Dribbble
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 truncate">
                      <Button asChild variant="link" className="p-0 h-0">
                        <Link to={member.dribbble} target="_blank">
                          {member.dribbble}
                        </Link>
                      </Button>
                    </dd>
                  </div>
                )}
                {member.behance && (
                  <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-primary">
                      Behance
                    </dt>
                    <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 truncate">
                      <Button asChild variant="link" className="p-0 h-0">
                        <Link to={member.behance} target="_blank">
                          {member.behance}
                        </Link>
                      </Button>
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

export default MemberDialog
