import { Label } from "@radix-ui/react-label"
import slugify from "slugify"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { useState } from "react"
import { RotateCw } from "lucide-react"

const CreateClient = () => {
  const [clientName, setClientName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateClient = async () => {
    setLoading(true)
    const slug = slugify(clientName, { lower: true })
    console.log(slug)
    setLoading(false)
  }

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>Create new client</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 pt-6 pb-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              onChange={(e) => setClientName(e.target.value)}
              className="col-span-3"
            />
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
          onClick={handleCreateClient}
        >
          {loading ? (
            <>
              <RotateCw className="mr-1 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add client"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CreateClient
