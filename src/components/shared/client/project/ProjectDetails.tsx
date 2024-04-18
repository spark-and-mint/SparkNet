import {
  Input,
  Button,
  Label,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useGetMembers, useUpdateProject } from "@/lib/react-query/queries"
import { ProjectValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { RotateCw } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const ProjectDetails = ({ project }) => {
  const { data: members, isPending: isPendingMembers } = useGetMembers()

  const form = useForm<z.infer<typeof ProjectValidation>>({
    resolver: zodResolver(ProjectValidation),
    defaultValues: {
      title: project.title,
      sparkRep: project.sparkRep?.$id ?? "",
      briefLink: project.briefLink ?? "",
      roadmapLink: project.roadmapLink ?? "",
    },
  })

  const { mutateAsync: updateProject, isPending } = useUpdateProject()

  const handleUpdate = async (values: z.infer<typeof ProjectValidation>) => {
    const updatedProject = await updateProject({
      projectId: project.$id,
      title: values.title,
      sparkRep: values.sparkRep,
      briefLink: values.briefLink,
      roadmapLink: values.roadmapLink,
    })

    if (!updatedProject) {
      toast.error("Could not update project. Please try again.")
    } else {
      toast.success("Project updated successfully.")
    }
  }

  return (
    <Card className="py-6 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-12">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>Title</Label>
                    <Input type="text" {...field} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sparkRep"
                disabled={isPendingMembers}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spark + Mint Representative</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a representative" />
                        </SelectTrigger>
                        <SelectContent>
                          {members?.documents.map((member) => (
                            <SelectItem
                              key={member.accountId}
                              value={member.$id}
                            >
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
                name="briefLink"
                render={({ field }) => (
                  <FormItem>
                    <Label>Project brief link</Label>
                    <Input
                      type="text"
                      {...field}
                      placeholder="https://page.notion.site/document"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roadmapLink"
                render={({ field }) => (
                  <FormItem>
                    <Label>Roadmap link</Label>
                    <Input
                      type="text"
                      {...field}
                      placeholder="https://page.notion.site/document"
                    />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 justify-end">
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <RotateCw className="mr-1 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update project"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default ProjectDetails
