import { Button } from "@/components/ui"
import {
  useDeleteDocument,
  useGetEukapayInvoice,
} from "@/lib/react-query/queries"
import { Models } from "appwrite"
import { Dot, ExternalLink, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import Loader from "../Loader"

const Invoice = ({ invoice }: { invoice: Models.Document }) => {
  const { data: invoiceData, isPending: isPendingInvoice } =
    useGetEukapayInvoice(invoice.code)
  const { mutateAsync: deleteDocument } = useDeleteDocument()

  const getStatus = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <span className="flex gap-0.5 pr-3 pl-1 py-1.5 text-[0.9rem] border border-border rounded-lg">
            <Dot className="w-6 h-6 text-green-500 scale-150" />
            Accepted
          </span>
        )
      default:
        return (
          <span className="flex gap-0.5 pr-3 pl-1 py-1.5 text-[0.9rem] border border-border rounded-lg">
            <Dot className="w-6 h-6 text-amber-400 scale-150" />
            {status}
          </span>
        )
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

  if (isPendingInvoice) {
    return <Loader className="justify-start h-8" />
  }

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex gap-4">
        <Link to={invoiceData.paymentUrl} target="_blank">
          <Button type="button" size="sm">
            {invoice.title}
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        {getStatus(invoiceData.status)}
      </div>
      <div className="flex gap-4">
        <p className="text-sm">{invoice.status}</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleDelete(invoice.$id)}
          className="w-14"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Invoice
