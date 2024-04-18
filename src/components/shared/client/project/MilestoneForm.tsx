import * as z from "zod"
import { Models } from "appwrite"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  Button,
  Input,
  Label,
} from "@/components/ui"
import { MilestoneValidation } from "@/lib/validation"
import { toast } from "sonner"
import {
  useCreateMilestone,
  useUpdateMilestone,
} from "@/lib/react-query/queries"
import { RotateCw } from "lucide-react"

type MilestoneFormProps = {
  milestone?: Models.Document
  projectId?: string
  action: "create" | "update"
  setOpen: (value: boolean) => void
}

const MilestoneForm = ({
  milestone,
  projectId,
  action,
  setOpen,
}: MilestoneFormProps) => {
  const form = useForm<z.infer<typeof MilestoneValidation>>({
    resolver: zodResolver(MilestoneValidation),
    defaultValues: {
      title: milestone?.title ?? "",
    },
  })

  const { mutateAsync: createMilestone, isPending: isLoadingCreate } =
    useCreateMilestone()
  const { mutateAsync: updateMilestone, isPending: isLoadingUpdate } =
    useUpdateMilestone()

  const handleSubmit = async (values: z.infer<typeof MilestoneValidation>) => {
    // UPDATE
    if (milestone && action === "update") {
      const updatedMilestone = await updateMilestone({
        milestoneId: milestone.$id,
        title: values.title,
      })

      if (!updatedMilestone) {
        toast.error("An error occured. Please try again.")
      } else {
        toast.success("Milestone updated successfully.")
        setOpen(false)
      }

      return
    }

    // CREATE
    if (projectId) {
      const newMilestone = await createMilestone({
        projectId,
        title: values.title,
      })

      if (!newMilestone) {
        toast.error("An error occured. Please try again.")
      } else {
        toast.success("Milestone created successfully.")
        setOpen(false)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4 py-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm font-medium">Title</Label>
              <Input type="text" {...field} />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoadingCreate || isLoadingUpdate}>
            {isLoadingCreate || isLoadingUpdate ? (
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 animate-spin" />
                {action === "create" ? "Creating..." : "Saving..."}
              </div>
            ) : (
              <>{action === "create" ? "Create milestone" : "Save"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default MilestoneForm
