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
import {
  useCreateDocument,
  useDeleteDocument,
  useGetClientDocuments,
  useUpdateDocument,
} from "@/lib/react-query/queries"
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
import { ExternalLink, PlusIcon, RotateCw, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Models } from "appwrite"
import Loader from "../Loader"
import { Link } from "react-router-dom"

const clientDocumentsSchema = z.object({
  documents: z.array(
    z.object({
      title: z.string().min(1, { message: "Can't be empty." }),
      link: z.string().url({
        message: "Invalid url. Please add https.",
      }),
      status: z.string().optional(),
    })
  ),
})

type ClientDocumentsValues = z.infer<typeof clientDocumentsSchema>

const ClientDocuments = () => {
  const client = useClient()
  const { data: documents, isPending: isPendingDocuments } =
    useGetClientDocuments(client.$id)
  const invoices = documents?.documents.filter((doc) => doc.invoice === true)

  const form = useForm<ClientDocumentsValues>({
    resolver: zodResolver(clientDocumentsSchema),
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "documents",
    control: form.control,
  })

  const { mutateAsync: createDocument, isPending: isLoadingCreate } =
    useCreateDocument()
  const { mutateAsync: updateDocument } = useUpdateDocument()
  const { mutateAsync: deleteDocument } = useDeleteDocument()

  const handleSubmit = async (value: ClientDocumentsValues) => {
    console.log(fields)
    try {
      const updatedDocuments = await Promise.all(
        value.documents.map(
          (document: { title: string; link: string; status?: string }) => {
            return createDocument({
              clientId: client.$id,
              title: document.title,
              link: document.link,
              status: "Awaiting Payment",
              invoice: true,
            })
          }
        )
      )

      if (updatedDocuments) {
        setTimeout(() => {
          remove()
        }, 10)
        toast.success("Client updated successfully!")
      }
    } catch (error) {
      toast.error("Could not update client.")
    }
  }

  const handleDelete = (documentId: string) => {
    try {
      const deletePromise = deleteDocument(documentId)
      toast.promise(deletePromise, {
        loading: "Deleting...",
        success: "Document deleted successfully.",
        error: "Could not delete document.",
      })
    } catch (error) {
      toast.error("Could not delete document.")
    }
  }

  const documentStatuses = ["Paid", "Awaiting Payment", "Cancelled"]

  const handleStatusChange = async (documentId: string, status: string) => {
    try {
      const updatedDocument = await updateDocument({
        documentId,
        status,
      })

      if (updatedDocument) {
        toast.success(`Document status updated to ${status}.`)
      } else {
        toast.error("Could not update document status.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Payments and invoices</h3>
        <p className="text-sm text-muted-foreground">
          Client payment and invoice management.
        </p>
      </div>
      <Separator />
      {isPendingDocuments ? (
        <Loader className="justify-start h-8" />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              {invoices && invoices.length < 1 && fields.length === 0 ? (
                <p className="py-3 text-sm">No invoices added yet.</p>
              ) : (
                <>
                  {invoices && invoices.length > 0 ? (
                    <>
                      {invoices.map((document: Models.Document) => (
                        <div
                          key={document.$id}
                          className="flex items-center justify-between gap-6"
                        >
                          <Link to={document.link} target="_blank">
                            <Button type="button" size="sm">
                              {document.title}
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                          <div className="flex gap-4">
                            <Select
                              defaultValue={document.status || ""}
                              onValueChange={(status) =>
                                handleStatusChange(document.$id, status)
                              }
                            >
                              <SelectTrigger className="min-w-40">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {documentStatuses.map((status: string) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(document.$id)}
                              className="w-14"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={cn("flex items-end gap-6 pt-5")}
                    >
                      <FormField
                        control={form.control}
                        name={`documents.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="relative w-3/4">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage className="absolute" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`documents.${index}.link`}
                        render={({ field }) => (
                          <FormItem className="relative w-full">
                            <FormLabel>Payment link</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage className="absolute" />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(fields.length > 0 ? "mt-14" : "mt-8")}
              onClick={() => append({ title: "", link: "" })}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add invoice
            </Button>
            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                disabled={isLoadingCreate || fields.length < 1}
              >
                {isLoadingCreate ? (
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  "Update payments"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ClientDocuments
