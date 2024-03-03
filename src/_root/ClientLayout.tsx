import { SidebarNav } from "@/components/shared/client/SidebarNav"
import { Button } from "@/components/ui/button"
import { useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { Link, Outlet } from "react-router-dom"
import { useGetClientById } from "@/lib/react-query/queries"
import Loader from "@/components/shared/Loader"
import { ClientContext } from "@/context/ClientContext"

const ClientLayout = () => {
  const { id } = useParams()
  const { data: client, isPending } = useGetClientById(id)

  const sidebarNavLinks = [
    {
      title: "Work progress",
      to: `/clients/${id}`,
    },
    {
      title: "Resources",
      to: `/clients/${id}/resources`,
    },
    {
      title: "Settings",
      to: `/clients/${id}/settings`,
    },
  ]

  return (
    <>
      {isPending && !client ? (
        <Loader />
      ) : (
        <div className="mx-32">
          <Card className="flex flex-col gap-12 py-12 px-12">
            <div className="relative flex items-center justify-between">
              <Button asChild variant="ghost">
                <Link to="/clients">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold ">
                {client?.name}
              </div>
              <div className="mr-4">
                {client?.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded-full" />
                )}
              </div>
            </div>

            <Separator className="mb-5" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="lg:w-1/4">
                <SidebarNav links={sidebarNavLinks} />
              </aside>
              <div className="flex-1 lg:max-w-2xl">
                <ClientContext.Provider value={client}>
                  <Outlet />
                </ClientContext.Provider>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default ClientLayout
