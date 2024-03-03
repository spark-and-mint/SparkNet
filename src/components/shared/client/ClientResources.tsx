import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

const clientResourcesSchema = z.object({
  resources: z
    .array(
      z.object({
        link: z.string(),
      })
    )
    .optional(),
})

type ClientResourcesValues = z.infer<typeof clientResourcesSchema>

const defaultValues: Partial<ClientResourcesValues> = {
  resources: [{ link: "" }, { link: "" }],
}

const ClientResources = () => {
  const form = useForm<ClientResourcesValues>({
    resolver: zodResolver(clientResourcesSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "resources",
    control: form.control,
  })

  function onSubmit(data: ClientResourcesValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Client resources</h3>
        <p className="text-sm text-muted-foreground">
          Add links, design assets, documents, and more.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-3">
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`resources.${index}.link`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Resources
                    </FormLabel>
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
              onClick={() => append({ link: "" })}
            >
              Add resource
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update client</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ClientResources
