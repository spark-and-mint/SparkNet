import * as z from "zod"
import { Models } from "appwrite"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Textarea,
} from "@/components/ui"
import { OpportunityValidation } from "@/lib/validation"
import { toast } from "sonner"
import {
  useCreateOpportunity,
  useGetMembers,
  useUpdateOpportunity,
} from "@/lib/react-query/queries"
import { RotateCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type OpportunityFormProps = {
  opportunity?: Models.Document
  action: "Create" | "Update"
  setShowDialog: (value: boolean) => void
  clientId: string
  projects: Models.Document[]
}

const OpportunityForm = ({
  opportunity,
  action,
  setShowDialog,
  clientId,
  projects,
}: OpportunityFormProps) => {
  const { data: members, isPending: isPendingMembers } = useGetMembers()

  const form = useForm<z.infer<typeof OpportunityValidation>>({
    resolver: zodResolver(OpportunityValidation),
    defaultValues: {
      projectId: opportunity?.project.$id,
      memberId: opportunity?.member.$id,
      role: opportunity?.role,
      background: opportunity?.background,
      description: opportunity?.description,
      duration: opportunity?.duration,
      type: opportunity?.type,
      estimatedEarnings: opportunity?.estimatedEarnings,
      responsibilities: opportunity?.responsibilities,
    },
  })

  const { mutateAsync: createOpportunity, isPending: isLoadingCreate } =
    useCreateOpportunity()
  const { mutateAsync: updateOpportunity, isPending: isLoadingUpdate } =
    useUpdateOpportunity()

  const handleSubmit = async (
    values: z.infer<typeof OpportunityValidation>
  ) => {
    // UPDATE
    if (opportunity && action === "Update") {
      const updatedOpportunity = await updateOpportunity({
        opportunityId: opportunity.$id,
        ...values,
      })

      if (!updatedOpportunity) {
        toast.error("An error occured. Please try again.")
      } else {
        toast.success("Opportunity modified successfully.")
        setShowDialog(false)
      }

      return
    }

    // CREATE
    const newOpportunity = await createOpportunity({
      clientId,
      status: "awaiting response",
      ...values,
    })

    if (!newOpportunity) {
      toast.error("An error occured. Please try again.")
    } else {
      toast.success("Opportunity created successfully.")
      setShowDialog(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-2 pb-8">
        <ScrollArea className="h-[32rem] w-full">
          <div className="space-y-8 mb-8 px-8">
            <div className="grid grid-cols-2 gap-12">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.$id} value={project.$id}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="memberId"
                disabled={isPendingMembers}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members?.documents.map((member) => (
                            <SelectItem key={member.$id} value={member.$id}>
                              {member.firstName} {member.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-12">
              <FormField
                control={form.control}
                name="role"
                defaultValue={opportunity?.role}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member role</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Product Designer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                defaultValue={opportunity?.duration}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project duration</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="3 months" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-12">
              <FormField
                control={form.control}
                name="type"
                defaultValue={opportunity?.type}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project type</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Hourly | Part-time | Full-time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedEarnings"
                defaultValue={opportunity?.estimatedEarnings}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated earnings</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="$7,500 – $9,000 USD"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="px-8">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="background"
                defaultValue={opportunity?.background}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Global Unity is an innovative educational platform designed to create open-source learning opportunities. They want to redesign their website to enhance the learning experience."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                defaultValue={opportunity?.description}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Global Unity needs a new website redesign and you are the proposed lead designer for the project."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsibilities"
                defaultValue={opportunity?.responsibilities}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member responsibilities</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Lead the website redesign, collaborate with the development team, ensure UX/UI best practices are followed."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-4 items-center justify-end p-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoadingCreate || isLoadingUpdate}>
              {isLoadingCreate || isLoadingUpdate ? (
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 animate-spin" />
                  {action === "Create" ? "Creating..." : "Saving..."}
                </div>
              ) : (
                <>
                  {action === "Create"
                    ? "Create opportunity"
                    : "Save opportunity"}
                </>
              )}
            </Button>
          </div>
        </ScrollArea>
      </form>
    </Form>
  )
}

export default OpportunityForm
