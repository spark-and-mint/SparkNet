import { SidebarNav } from "@/components/shared/client/SidebarNav"
import { Button } from "@/components/ui/button"
import { useMatch, useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { Link, Outlet } from "react-router-dom"
import { useGetClientById } from "@/lib/react-query/queries"
import Loader from "@/components/shared/Loader"
import { ClientContext } from "@/context/ClientContext"
import { cn } from "@/lib/utils"

const ClientLayout = () => {
  const { id } = useParams()
  const { data: client } = useGetClientById(id)
  const projectRoute = useMatch("/clients/:id/project/*")

  const sidebarNavLinks = [
    {
      title: "Projects",
      to: `/clients/${id}`,
    },
    {
      title: "Assign team",
      to: `/clients/${id}/opportunities`,
    },
    {
      title: "Stakeholders",
      to: `/clients/${id}/stakeholders`,
    },
    {
      title: "Legal docs",
      to: `/clients/${id}/documents`,
    },
    {
      title: "Payments",
      to: `/clients/${id}/payments`,
    },
    {
      title: "Settings",
      to: `/clients/${id}/settings`,
    },
  ]

  if (!client) {
    return <Loader />
  }

  return (
    <div className="mx-32">
      <Card className="flex flex-col gap-8 py-8 px-8">
        <div className="relative flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link to={projectRoute ? `/clients/${id}` : "/clients"}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Link>
          </Button>
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold ">
            {client?.name}
          </div>
          <div className="mr-2">
            {client?.logoUrl ? (
              <img src={client.logoUrl} className="w-14 h-14 rounded-full" />
            ) : (
              <div className="w-14 h-14 bg-slate-200 rounded-full" />
            )}
          </div>
        </div>

        <Separator className="mb-5" />

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          {projectRoute ? null : (
            <aside className="lg:w-1/4">
              <SidebarNav links={sidebarNavLinks} />
            </aside>
          )}
          <div className={cn("flex-1", !projectRoute && "lg:max-w-2xl")}>
            <ClientContext.Provider value={client}>
              <Outlet />
            </ClientContext.Provider>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ClientLayout
