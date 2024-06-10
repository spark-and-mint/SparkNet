import { Button } from "@/components/ui"
import {
  useDeleteDocument,
  useGetEukapayInvoice,
} from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { ExternalLink, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import Loader from "../Loader"
import { Badge } from "@/components/ui/badge"
import { useConfirm } from "../AlertDialogProvider"

const Invoice = ({ invoice }: { invoice: Models.Document }) => {
  const { data: eukapayInvoice, isPending: isPendingInvoice } =
    useGetEukapayInvoice(invoice.code)
  const { mutateAsync: deleteDocument } = useDeleteDocument()
  const confirm = useConfirm()

  const getStatus = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge
            variant="outline"
            className="rounded-md text-[0.65rem] px-1.5 py-0.5 bg-green-100 text-green-600"
          >
            {status}
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="rounded-md text-[0.65rem] px-1.5 py-0.5 bg-yellow-100 text-yellow-600"
          >
            {status}
          </Badge>
        )
    }
  }

  const handleDelete = async (documentId: string) => {
    const deleteConfirmed = await confirm({
      title: `Deleting ${invoice?.title} payment`,
      body: "Are you sure you want to do that?",
      cancelButton: "Cancel",
      actionButton: "Delete",
    })

    if (!deleteConfirmed) return

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

  if (isPendingInvoice) {
    return <Loader className="justify-start h-8" />
  }

  const createdAt = new Date(invoice.$createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex w-full justify-between gap-6">
        <div className="flex flex-col gap-1 mr-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{invoice.title}</p>
            {getStatus(eukapayInvoice.status)}
          </div>
          <p className="text-xs text-muted-foreground">Created {createdAt}</p>
        </div>
        <div className="flex gap-6">
          {eukapayInvoice.paymentUrl && (
            <Link to={eukapayInvoice.paymentUrl} target="_blank">
              <Button type="button" size="sm">
                EukaPay
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
          {invoice.link && (
            <Link to={invoice.link} target="_blank">
              <Button type="button" size="sm">
                Stripe
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleDelete(invoice.$id)}
          className="w-10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Invoice
