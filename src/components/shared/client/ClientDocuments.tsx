import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { useClient } from "@/context/ClientContext"
import { useUpdateClient } from "@/lib/react-query/queries"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, RotateCw, Trash2 } from "lucide-react"
import { IResource } from "@/types"

const clientResourcesSchema = z.object({
  resources: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Can't be empty." }),
        link: z.string().min(1, { message: "Can't be empty." }),
        type: z.enum(["design", "document", "other"]),
      })
    )
    .optional(),
})

type ClientResourcesValues = z.infer<typeof clientResourcesSchema>

const ClientDocuments = () => {
  const client = useClient()
  const form = useForm<ClientResourcesValues>({
    resolver: zodResolver(clientResourcesSchema),
    defaultValues: {
      resources: [
        ...(client.resources?.map((resource: IResource) => ({
          title: resource.title ? resource.title : "",
          link: resource.link ? resource.link : "",
          type: resource.type ? resource.type : "document",
        })) || []),
      ],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "resources",
    control: form.control,
  })

  const { mutateAsync: updateClient, isPending: isLoadingUpdate } =
    useUpdateClient()

  const handleSubmit = async (value: ClientResourcesValues) => {
    const updatedClient = await updateClient({
      id: client.$id,
      name: client.name,
      file: [],
      logoId: client.logoId,
      logoUrl: client.logoUrl,
      resources: value.resources,
    })

    if (!updatedClient) {
      toast.error("This is not wired up yet.")
    } else {
      toast.success("Client updated successfully!")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Legal documents</h3>
        <p className="text-sm text-muted-foreground">
          Add the master service agreement (MSA), contracts, proposals, etc.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-7 divide-y">
            {fields.length === 0 ? (
              <p className="py-3 text-sm">No documents added yet.</p>
            ) : (
              <>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-3 pt-5">
                    <FormField
                      control={form.control}
                      name={`resources.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`resources.${index}.link`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="w-24"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-8"
            onClick={() => append({ title: "", link: "", type: "document" })}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add document
          </Button>
          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={isLoadingUpdate}>
              {isLoadingUpdate ? (
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update documents"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ClientDocuments
