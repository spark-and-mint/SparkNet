import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Input, Button } from "@/components/ui"
import { ProfileUploader, Loader } from "@/components/shared"

import { ProfileValidation } from "@/lib/validation"
import { useMemberContext } from "@/context/AuthContext"
import { useGetMemberById, useUpdateMember } from "@/lib/react-query/queries"
import { RotateCw } from "lucide-react"

const ProfileSettings = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { id } = useParams()
  const { member, setMember } = useMemberContext()
  const { data: currentMember } = useGetMemberById(id || "")
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: currentMember?.name,
      primaryRole: currentMember?.primaryRole,
      email: currentMember?.email,
    },
  })

  const { mutateAsync: updateMember, isPending: isLoadingUpdate } =
    useUpdateMember()

  if (!currentMember) return <Loader />

  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedMember = await updateMember({
      memberId: currentMember.$id,
      name: value.name,
      email: value.email,
      primaryRole: value.primaryRole,
      file: value.file,
      avatarUrl: currentMember.avatarUrl,
      avatarId: currentMember.avatarId,
    })

    if (!updatedMember) {
      toast({
        title: `Update member failed. Please try again.`,
      })
    }

    setMember({
      ...member,
      name: updatedMember?.name,
      email: updatedMember?.email,
      primaryRole: updatedMember?.primaryRole,
      avatarUrl: updatedMember?.avatarUrl,
    })
    return navigate(`/`)
  }

  return (
    <div className="w-64 mx-auto mt-5">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Profile Settings{" "}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            defaultValue={currentMember.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryRole"
            defaultValue={currentMember.primaryRole}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary role</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            defaultValue={currentMember.email}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar or profile picture</FormLabel>
                <FormControl>
                  <ProfileUploader
                    fieldChange={field.onChange}
                    mediaUrl={currentMember.avatarUrl}
                    profileSettings
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-6">
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoadingUpdate}
                className="flex w-full"
              >
                {isLoadingUpdate ? (
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  "Update profile"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProfileSettings
