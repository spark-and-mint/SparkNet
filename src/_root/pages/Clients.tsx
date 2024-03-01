import ClientCard from "@/components/shared/ClientCard"
import CreateClient from "@/components/shared/CreateClient"
import { IClient } from "@/types"
import { useState } from "react"

const tempClients: IClient[] = [
  {
    id: "1",
    name: "Spark + Mint",
    slug: "spark-and-mint",
    logo: "/assets/logos/spark-and-mint-blue.svg",
    members: [
      {
        id: "1",
        name: "Jason Goodman",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        assignedTo: "Spark + Mint",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/04.png",
      },
      {
        id: "2",
        name: "Alex Kowalczyk",
        email: "alex@sparkandmint.com",
        primaryRole: "CMO",
        assignedTo: "Apply To Education",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/02.png",
      },
      {
        id: "3",
        name: "Kevin Ivan",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        assignedTo: "Spark + Mint",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/03.png",
      },
      {
        id: "4",
        name: "Renata Enriquez",
        email: "renata@sparkandmint.com",
        primaryRole: "Product Designer",
        assignedTo: "Spark + Mint",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/01.png",
      },
    ],
    resources: [],
  },
  {
    id: "2",
    name: "Apply To Education",
    slug: "apply-to-education",
    logo: "/assets/logos/a2e.svg",
    members: [
      {
        id: "1",
        name: "Alex Kowalczyk",
        email: "alex@sparkandmint.com",
        primaryRole: "CMO",
        assignedTo: "Apply To Education",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/02.png",
      },
      {
        id: "2",
        name: "Kevin Ivan",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        assignedTo: "Spark + Mint",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/03.png",
      },
    ],
    resources: [],
  },
  {
    id: "3",
    name: "Celo",
    slug: "celo",
    logo: "",
    members: [],
    resources: [],
  },
  {
    id: "4",
    name: "OpenAI",
    slug: "openai",
    logo: "",
    members: [],
    resources: [],
  },
]

const ClientPage = () => {
  const [clients, setClients] = useState<IClient[]>(tempClients)

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="h-full">
        <CreateClient setClients={setClients} />
      </div>
      {clients.map((client: IClient) => (
        <div key={client.id} className="h-full">
          <ClientCard client={client} />
        </div>
      ))}
    </div>
  )
}

export default ClientPage
