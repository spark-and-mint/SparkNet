import Loader from "@/components/shared/Loader"
import ClientCard from "@/components/shared/client/ClientCard"
import CreateClient from "@/components/shared/client/CreateClient"
import { Button } from "@/components/ui"
import { useGetClients } from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Link } from "react-router-dom"

const ClientPage = () => {
  const { data: clients, isPending, isError } = useGetClients()

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-96 text-center border rounded-lg">
        <p>Error getting data.</p>
        <Button asChild>
          <Link target="_blank" to="https://status.appwrite.online/">
            Check API status
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {isPending && !clients ? (
        <div className="mt-24">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="h-full">
            <CreateClient />
          </div>
          {clients?.documents.map((client: Models.Document) => (
            <div key={client.$id} className="h-full">
              <ClientCard client={client} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default ClientPage
