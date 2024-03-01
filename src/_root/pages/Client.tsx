import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
// import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import FileUploader from "@/components/shared/FileUploader"
import { Link } from "react-router-dom"
import TaskList from "@/components/shared/TaskList"

const clientFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  description: z.string().max(160).min(4),
  logo: z.custom<File[]>(),
  resources: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

const defaultValues: Partial<ClientFormValues> = {
  description: "",
  resources: [{ value: "" }, { value: "" }],
}

const Client = () => {
  // const { slug } = useParams()
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "resources",
    control: form.control,
  })

  function onSubmit(data: ClientFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const client = {
    id: "1",
    name: "Spark + Mint",
    slug: "spark-and-mint",
    logo: "",
    // logo: "/assets/logos/spark-and-mint-blue.svg",
    members: [
      {
        id: "1",
        name: "Jason Goodman",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        assignedTo: "Spark + Mint",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/04.png",
      },
      {
        id: "2",
        name: "Alex Kowalczyk",
        email: "alex@sparkandmint.com",
        primaryRole: "CMO",
        assignedTo: "Apply To Education",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/02.png",
      },
      {
        id: "3",
        name: "Kevin Ivan",
        email: "kevin@sparkandmint.com",
        primaryRole: "Frontend Developer",
        assignedTo: "Spark + Mint",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/03.png",
      },
      {
        id: "4",
        name: "Renata Enriquez",
        email: "renata@sparkandmint.com",
        primaryRole: "Product Designer",
        assignedTo: "Spark + Mint",
        contractSigned: true,
        applicationStatus: "accepted",
        imageUrl: "/assets/avatars/01.png",
      },
    ],
    resources: [],
  }

  return (
    <div>
      <Card className="flex flex-col gap-12 p-12">
        <div className="relative flex items-center justify-between">
          <Button asChild variant="link">
            <Link to="/clients">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Link>
          </Button>
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold ">
            {client?.name}
          </div>
          <div className="mr-4">
            {client?.logo ? (
              <img src={client.logo} className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 bg-slate-200 rounded-full" />
            )}
          </div>
        </div>

        <div className="flex gap-12">
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Update client</CardTitle>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 pt-3"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} defaultValue={client.name} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="About the client"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          <FormControl>
                            <FileUploader
                              fieldChange={field.onChange}
                              mediaUrl={client?.logo}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      {fields.map((field, index) => (
                        <FormField
                          control={form.control}
                          key={field.id}
                          name={`resources.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={cn(index !== 0 && "sr-only")}
                              >
                                Resources
                              </FormLabel>
                              <FormDescription
                                className={cn(index !== 0 && "sr-only")}
                              >
                                Add links, design assets, documents, and more.
                              </FormDescription>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => append({ value: "" })}
                      >
                        Add resource
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Update client</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-12 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kevin's progress</CardTitle>
              </CardHeader>

              <CardContent>
                <TaskList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Jason's progress</CardTitle>
              </CardHeader>

              <CardContent>
                <TaskList />
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Client
