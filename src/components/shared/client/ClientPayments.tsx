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
  useGetClientDocuments,
  useGetEukapayInvoices,
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
import { PlusIcon, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Models } from "appwrite"
import Loader from "../Loader"
import Invoice from "./Invoice"
import { useEffect, useState } from "react"

const clientInvoiceSchema = z.object({
  documents: z.array(
    z.object({
      title: z.string().min(1, { message: "Can't be empty." }),
      code: z.string().min(1, { message: "Can't be empty." }),
    })
  ),
})

type ClientDocumentsValues = z.infer<typeof clientInvoiceSchema>

const ClientDocuments = () => {
  const client = useClient()
  const { data: documents, isPending: isPendingDocuments } =
    useGetClientDocuments(client.$id)
  const { data: eukapayInvoiceData } = useGetEukapayInvoices()
  const [eukapayInvoices, setEukapayInvoices] = useState([])
  const invoices = documents?.documents.filter((doc) => doc.invoice === true)

  const form = useForm<ClientDocumentsValues>({
    resolver: zodResolver(clientInvoiceSchema),
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "documents",
    control: form.control,
  })

  const { mutateAsync: createDocument, isPending: isLoadingCreate } =
    useCreateDocument()

  const handleSubmit = async (value: ClientDocumentsValues) => {
    try {
      const updatedDocuments = await Promise.all(
        value.documents.map((document: { title: string; code: string }) => {
          return createDocument({
            clientId: client.$id,
            title: document.title,
            code: document.code,
            invoice: true,
          })
        })
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

  useEffect(() => {
    if (eukapayInvoiceData) {
      const cutoffDate = new Date("2024-06-01T00:00:00.000Z")
      const invoices = eukapayInvoiceData.filter(
        (invoice: { createdAt: string | number | Date; status: string }) => {
          const invoiceDate = new Date(invoice.createdAt)
          return invoice.status !== "Paid" && invoiceDate >= cutoffDate
        }
      )
      setEukapayInvoices(invoices)
    }
  }, [eukapayInvoiceData])

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
                      {invoices.map((invoice: Models.Document) => (
                        <Invoice key={invoice.$id} invoice={invoice} />
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
                        name={`documents.${index}.code`}
                        render={({ field }) => (
                          <FormItem className="relative w-full">
                            <FormLabel>Invoice</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="min-w-40">
                                  <SelectValue placeholder="Select invoice" />
                                </SelectTrigger>
                                <SelectContent>
                                  {eukapayInvoices &&
                                    eukapayInvoices.length > 0 &&
                                    eukapayInvoices.map(
                                      (invoice: {
                                        code: string
                                        number: string
                                      }) => (
                                        <SelectItem
                                          key={invoice.code}
                                          value={invoice.code}
                                        >
                                          {invoice.number}
                                        </SelectItem>
                                      )
                                    )}
                                </SelectContent>
                              </Select>
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
              onClick={() => append({ title: "", code: "" })}
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
