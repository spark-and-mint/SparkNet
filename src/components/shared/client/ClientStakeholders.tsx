import { useClient } from "@/context/ClientContext"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, RotateCw } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui"
import { useEffect, useState } from "react"
import {
  useGetStakeholders,
  useUpdateStakeholder,
} from "@/lib/react-query/queries"
import { Models } from "appwrite"
import Loader from "../Loader"

const ClientStakeholders = () => {
  const client = useClient()
  const { data: stakeholders, isPending: isLoadingStakeholders } =
    useGetStakeholders()
  const [selectedStakeholders, setSelectedStakeholders] = useState<
    Models.Document[]
  >([])
  const [addedSelect, setAddedSelect] = useState<number>(0)

  const { mutateAsync: updateStakeholder, isPending: isLoadingUpdate } =
    useUpdateStakeholder()

  const handleSubmit = async () => {
    try {
      await Promise.all(
        selectedStakeholders.map((stakeholder: Models.Document) =>
          updateStakeholder({
            stakeholderId: stakeholder.$id,
            email: stakeholder.email,
            firstName: stakeholder.firstName,
            lastName: stakeholder.lastName,
            clientId: client.$id,
          })
        )
      )
      toast.success("Client updated successfully!")
    } catch (error) {
      toast.error("Could not update client.")
    }
  }

  const handleChange = (value: string) => {
    const stakeholder = stakeholders?.documents.find(
      (stakeholder) => stakeholder.$id === value
    )

    if (stakeholder) {
      setSelectedStakeholders([...selectedStakeholders, stakeholder])
      setAddedSelect(0)
    }
  }

  useEffect(() => {
    if (stakeholders && client) {
      setSelectedStakeholders(
        stakeholders.documents.filter(
          (stakeholder) => stakeholder.clientId === client.$id
        )
      )
    }
  }, [stakeholders, client])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Client stakeholders</h3>
        <p className="text-sm text-muted-foreground">
          The individuals that get access to the projects from the client
          portal.
        </p>
      </div>
      <Separator />

      {isLoadingStakeholders ? (
        <Loader className="justify-start h-8" />
      ) : (
        <>
          <div className="max-w-xs space-y-4">
            {selectedStakeholders && selectedStakeholders.length > 0 ? (
              <>
                {selectedStakeholders.map((selectedStakeholder) => (
                  <Select
                    defaultValue={selectedStakeholder.$id}
                    disabled={isLoadingUpdate}
                    key={selectedStakeholder.$id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stakeholder" />
                    </SelectTrigger>
                    <SelectContent>
                      {stakeholders?.documents.map((stakeholder) => (
                        <SelectItem
                          key={stakeholder.$id}
                          value={stakeholder.$id}
                        >
                          {stakeholder.firstName} {stakeholder.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </>
            ) : (
              <Select onValueChange={handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stakeholder" />
                </SelectTrigger>
                <SelectContent>
                  {stakeholders?.documents.map((stakeholder) => (
                    <SelectItem key={stakeholder.$id} value={stakeholder.$id}>
                      {stakeholder.firstName} {stakeholder.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {Array.from({ length: addedSelect }).map((_, index) => (
              <Select key={index} onValueChange={handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stakeholder" />
                </SelectTrigger>
                <SelectContent>
                  {stakeholders?.documents.map((stakeholder) => (
                    <SelectItem key={stakeholder.$id} value={stakeholder.$id}>
                      {stakeholder.firstName} {stakeholder.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
          <Button
            onClick={() => setAddedSelect(addedSelect + 1)}
            type="button"
            variant="outline"
            size="sm"
            className="mt-8"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add stakeholder
          </Button>
          <div className="flex justify-end mt-8">
            <Button onClick={handleSubmit} disabled={isLoadingUpdate}>
              {isLoadingUpdate ? (
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default ClientStakeholders
