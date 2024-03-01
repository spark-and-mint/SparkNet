import ClientCard from "@/components/shared/client/ClientCard"
import CreateClient from "@/components/shared/client/CreateClient"
import { useGetClients } from "@/lib/react-query/queries"
import { IClient } from "@/types"
import { Models } from "appwrite"
import { RotateCw } from "lucide-react"
import { useState } from "react"

const tempClients: IClient[] = [
  {
    id: "1",
    name: "Spark + Mint",
    description: "",
    slug: "spark-and-mint",
    logoUrl: "/assets/logos/spark-and-mint-blue.svg",
    members: [
      {
        id: "1",
        name: "Jason Goodman",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        clients: [],
        contractSigned: true,
        applicationStatus: "accepted",
        avatarUrl: "/assets/avatars/04.png",
      },
      {
        id: "2",
        name: "Alex Kowalczyk",
        email: "alex@sparkandmint.com",
        primaryRole: "CMO",
        clients: [],
        contractSigned: true,
        applicationStatus: "accepted",
        avatarUrl: "/assets/avatars/02.png",
      },
      {
        id: "3",
        name: "Kevin Ivan",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        clients: [],
        contractSigned: true,
        applicationStatus: "accepted",
        avatarUrl: "/assets/avatars/03.png",
      },
      {
        id: "4",
        name: "Renata Enriquez",
        email: "renata@sparkandmint.com",
        primaryRole: "Product Designer",
        clients: [],
        contractSigned: true,
        applicationStatus: "accepted",
        avatarUrl: "/assets/avatars/01.png",
      },
    ],
    resources: [],
  },
  {
    id: "2",
    name: "Apply To Education",
    description: "",
    slug: "apply-to-education",
    logoUrl: "/assets/logos/a2e.svg",
    members: [
      {
        id: "1",
        name: "Alex Kowalczyk",
        email: "alex@sparkandmint.com",
        primaryRole: "CMO",
        clients: [],
        contractSigned: true,
        applicationStatus: "accepted",
        avatarUrl: "/assets/avatars/02.png",
      },
      {
        id: "2",
        name: "Kevin Ivan",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        clients: [],
        contractSigned: true,
        applicationStatus: "accepted",
        avatarUrl: "/assets/avatars/03.png",
      },
    ],
    resources: [],
  },
]

const ClientPage = () => {
  // const { data: clients, isPending, isError } = useGetClients()
  const [clients] = useState<IClient[]>(tempClients)

  // if (isError) {
  //   return (
  //     <div className="flex items-center justify-center h-96 text-center border">
  //       <p>
  //         Error getting clients. Check the JavaScript console for errors (option
  //         + cmd + J) and Contact Kevin!
  //       </p>
  //     </div>
  //   )
  // }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="h-full">
        <CreateClient />
      </div>
      {clients.map((client: IClient) => (
        <div key={client.id} className="h-full">
          <ClientCard client={client} />
        </div>
      ))}

      {/* {!isPending && !clients ? (
        <div className="flex items-center justify-center gap-1">
          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          Loading members...
        </div>
      ) : (
        <>
          {clients?.documents.map((client: Models.Document) => (
            <div key={client.id} className="h-full">
              <ClientCard client={client} />
            </div>
          ))}
        </>
      )} */}
    </div>
  )
}

export default ClientPage
