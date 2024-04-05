import { Label } from "@radix-ui/react-label"
import { CirclePlus, RotateCw } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Input, Button, Form, FormField, FormItem } from "@/components/ui"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateProject } from "@/lib/react-query/queries"
import { ProjectValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"

const CreateNewProject = ({ clientId }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { mutateAsync: createProject, isPending } = useCreateProject()

  const form = useForm<z.infer<typeof ProjectValidation>>({
    resolver: zodResolver(ProjectValidation),
    defaultValues: {
      title: "",
    },
  })

  const handleCreateProject = async (
    project: z.infer<typeof ProjectValidation>
  ) => {
    const newProject = await createProject({
      clientId,
      title: project.title,
    })

    if (!newProject) {
      toast.error("Could not create project. Please try again.")
    } else {
      toast.success("Project created successfully.")
      setShowCreateDialog(false)
    }
  }

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Card className="flex flex-col items-center justify-center p-16 group hover:bg-gray-50 cursor-pointer transition-colors">
          <CirclePlus
            strokeWidth={1}
            className="w-10 h-10 text-gray-400 group-hover:text-black transition-colors"
          />
          <p className="mt-3 text-gray-600 group-hover:text-black">
            Create a new project
          </p>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(handleCreateProject)}
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

            <div className="flex justify-end mt-4">
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNewProject
