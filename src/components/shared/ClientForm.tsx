import { Edit, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { IClient } from "@/types"
import Loader from "./Loader"

const tempClients: IClient[] = [
  {
    name: "OpenAI",
  },
  {
    name: "Talent Proposal Deck",
  },
  {
    name: "Celo",
  },
]

const ClientForm = () => {
  const [clients, setClients] = useState<IClient[]>(tempClients)
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex w-full gap-12">
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Create new</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 pt-6 pb-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  className="col-span-3 cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => {
                const nameInput = document.getElementById(
                  "name"
                ) as HTMLInputElement
                const name = nameInput.value
                setLoading(true)
                setTimeout(() => {
                  setClients((prevClients) => [{ name }, ...prevClients])
                  nameInput.value = ""
                  setLoading(false)
                }, 1500)
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader /> Adding...
                </div>
              ) : (
                "Add opportunity"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Current opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mt-4 space-y-3 divide-y">
              {clients.map((client: IClient) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between pt-3"
                >
                  <div className="text-regular font-medium" key={client.name}>
                    {client.name}
                  </div>
                  <div>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setClients((prevClients) =>
                          prevClients.filter(
                            (c: IClient) => c.name !== client.name
                          )
                        )
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ClientForm
