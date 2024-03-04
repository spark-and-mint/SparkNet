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
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { Separator } from "@/components/ui/separator"
import { RotateCw } from "lucide-react"
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

const ClientResources = () => {
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
        { title: "", link: "", type: "document" },
      ],
    },
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
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
      toast.error("Failed to update client. Please try again.")
    } else {
      toast.success("Client updated successfully!")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Client resources</h3>
        <p className="text-sm text-muted-foreground">
          Add design assets, documents, and more.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="pt-3">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name={`resources.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`resources.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type of resource" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="design">Design asset</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ title: "", link: "", type: "document" })}
            >
              Add resource
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoadingUpdate}>
              {isLoadingUpdate ? (
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update client"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ClientResources
