import Loader from "@/components/shared/Loader"
import ClientCard from "@/components/shared/client/ClientCard"
import CreateClient from "@/components/shared/client/CreateClient"
import { useGetClients } from "@/lib/react-query/queries"
import { Models } from "appwrite"

const ClientPage = () => {
  const { data: clients, isPending, isError } = useGetClients()

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96 text-center border">
        <p>Error getting clients.</p>
      </div>
    )
  }

  return (
    <>
      {isPending && !clients ? (
        <Loader />
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
