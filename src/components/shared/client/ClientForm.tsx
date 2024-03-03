import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import FileUploader from "@/components/shared/FileUploader"
import { Separator } from "@/components/ui/separator"
import { useConfirm } from "@/components/shared/AlertDialogProvider"
import { useClient } from "@/context/ClientContext"
import { useNavigate } from "react-router-dom"
import { deleteClient } from "@/lib/appwrite/api"
import { ClientValidation } from "@/lib/validation"
import { useUpdateClient } from "@/lib/react-query/queries"
import { useState } from "react"
import { RotateCw } from "lucide-react"

const ClientForm = () => {
  const navigate = useNavigate()
  const client = useClient()
  const confirm = useConfirm()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const form = useForm<z.infer<typeof ClientValidation>>({
    resolver: zodResolver(ClientValidation),
    defaultValues: {
      name: client ? client.name : "",
      description: client ? client.description : "",
      file: [],
    },
  })

  const { mutateAsync: updateClient, isPending: isLoadingUpdate } =
    useUpdateClient()

  const handleSubmit = async (value: z.infer<typeof ClientValidation>) => {
    const updatedClient = await updateClient({
      ...value,
      id: client.$id,
      logoId: client.logoId,
      logoUrl: client.logoUrl,
    })

    if (!updatedClient) {
      toast({
        title: "Failed to update client. Please try again.",
      })
    }

    setUpdateSuccess(true)

    setTimeout(() => {
      setUpdateSuccess(false)
    }, 2000)
  }

  const handleDelete = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const deleteConfirmed = await confirm({
      title: `Deleting ${client?.name}`,
      body: "Are you sure you want to do that?",
      cancelButton: "Cancel",
      actionButton: "Delete",
    })

    if (!deleteConfirmed) return

    try {
      await deleteClient(client?.$id, client?.logoId)
      navigate("/clients")
    } catch (error) {
      console.error({ error })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Client settings</h3>
        <p className="text-sm text-muted-foreground">
          Update this client's profile settings
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 pt-3"
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue={client.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            defaultValue={client.description}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="About the client"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={client.logoUrl}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <div className="flex gap-6 pt-8">
              <Button variant="secondary" onClick={handleDelete}>
                Delete client
              </Button>
              <Button type="submit" disabled={isLoadingUpdate}>
                {isLoadingUpdate ? (
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Updating...
                  </div>
                ) : updateSuccess ? (
                  "Update successful!"
                ) : (
                  "Update client"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ClientForm
