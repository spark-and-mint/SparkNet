import slugify from "slugify"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { RotateCw } from "lucide-react"
import { ClientValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCreateClient } from "@/lib/react-query/queries"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"

const CreateClient = () => {
  const form = useForm<z.infer<typeof ClientValidation>>({
    resolver: zodResolver(ClientValidation),
    defaultValues: {
      name: "",
      slug: "",
      file: undefined,
    },
    mode: "onChange",
  })

  const fileRef = form.register("file")

  const { mutateAsync: createClient, isPending } = useCreateClient()

  const handleCreateClient = async (
    client: z.infer<typeof ClientValidation>
  ) => {
    const newClient = await createClient({
      name: client.name,
      slug: slugify(client.name, { lower: true }),
      file: client.file,
    })

    if (!newClient) {
      toast({
        title: "Could not create client. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="flex flex-col justify-between h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateClient)}>
          <CardHeader>
            <CardTitle>Create new client</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input type="text" className="col-span-3" {...field} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              // { field } might be required
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Logo</Label>
                    <Input
                      type="file"
                      className="col-span-3 cursor-pointer"
                      {...fileRef}
                    />
                  </div>
                  <FormDescription className="text-xs text-end">
                    Allowed image types: .jpg, jpeg, .png
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <RotateCw className="mr-1 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add client"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default CreateClient
