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

const clientFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  description: z.string().max(160).min(4),
  logo: z.custom<File[]>(),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

const defaultValues: Partial<ClientFormValues> = {
  description: "",
}

const ClientForm = () => {
  const navigate = useNavigate()
  const client = useClient()
  const confirm = useConfirm()
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ClientFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={client?.name} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
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
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={client?.logoUrl}
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
              <Button type="submit">Update client</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ClientForm
