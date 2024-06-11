import { Button } from "@/components/ui"
import { useDeleteDocument } from "@/lib/react-query/queries"
import { Check, ExternalLink, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { useConfirm } from "../AlertDialogProvider"
import { useEffect, useState } from "react"

const Invoice = ({ id, createdAt, title, eukapayInvoice, stripePayment }) => {
  const { mutateAsync: deleteDocument } = useDeleteDocument()
  const confirm = useConfirm()
  const [isPaidEukaPay, setIsPaidEukaPay] = useState(false)
  const [isPaidStripe, setIsPaidStripe] = useState(false)

  const getStatusBadge = (paid: boolean) => {
    if (paid) {
      return (
        <Badge
          variant="outline"
          className="rounded-md text-[0.65rem] px-1.5 py-0.5 bg-green-100 text-green-600"
        >
          <Check strokeWidth={3} className="w-3 h-3 mr-1" />
          Paid with {isPaidEukaPay ? "EukaPay" : "Stripe"}
        </Badge>
      )
    } else {
      return (
        <Badge
          variant="outline"
          className="rounded-md text-[0.65rem] px-1.5 py-0.5 bg-yellow-100 text-yellow-600"
        >
          Unpaid
        </Badge>
      )
    }
  }

  const handleDelete = async (documentId: string) => {
    const deleteConfirmed = await confirm({
      title: `Deleting ${title} payment`,
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

  useEffect(() => {
    if (stripePayment?.paid === true) {
      setIsPaidStripe(true)
    } else if (eukapayInvoice?.status === "Paid") {
      setIsPaidEukaPay(true)
    }
  }, [stripePayment, eukapayInvoice])

  const createdAtString = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const paidOn = stripePayment?.paidOn
    ? new Date(stripePayment?.paidOn).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex w-full justify-between gap-6">
        <div className="flex flex-col gap-1 mr-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{title}</p>
            {getStatusBadge(isPaidEukaPay || isPaidStripe)}
          </div>
          <p className="text-xs text-muted-foreground">
            Created {createdAtString} {paidOn && `⋅ Paid on ${paidOn}`}
          </p>
        </div>
        <div className="flex gap-6">
          {eukapayInvoice?.paymentUrl && (
            <Link to={eukapayInvoice?.paymentUrl} target="_blank">
              <Button type="button" size="sm">
                EukaPay
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
          {stripePayment?.url && (
            <Link to={stripePayment?.url} target="_blank">
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
          onClick={() => handleDelete(id)}
          className="w-10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Invoice
