import * as z from "zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  useCreateMemberAccount,
  useSignInAccount,
} from "@/lib/react-query/queries"
import { SignUpValidation } from "@/lib/validation"
import { useMemberContext } from "@/context/AuthContext"
import ProfileUploader from "@/components/shared/ProfileUploader"
import { RotateCw } from "lucide-react"

const SignUpForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthMember, isLoading: isMemberLoading } = useMemberContext()

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      primaryRole: "",
      file: [],
      email: "",
      password: "",
    },
  })

  const { mutateAsync: createMemberAccount, isPending: isCreatingAccount } =
    useCreateMemberAccount()
  const { mutateAsync: signInAccount, isPending: isSigningInMember } =
    useSignInAccount()

  const handleSignUp = async (member: z.infer<typeof SignUpValidation>) => {
    try {
      const newMember = await createMemberAccount(member)

      if (!newMember) {
        console.log("could not create member account")
        toast({
          title: "Sign up failed. Please try again.",
          variant: "destructive",
        })
        return
      }

      console.log(newMember)

      const session = await signInAccount({
        email: member.email,
        password: member.password,
      })

      if (!session) {
        console.log("could not login")
        toast({
          title: "Something went wrong. Please try again.",
          variant: "destructive",
        })
        navigate("/sign-in")
        return
      }

      const isLoggedIn = await checkAuthMember()

      if (isLoggedIn) {
        form.reset()
        navigate("/")
      } else {
        toast({
          title: "Login failed. Please try again.",
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar or profile picture</FormLabel>
              <FormControl>
                <ProfileUploader fieldChange={field.onChange} mediaUrl="" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isCreatingAccount || isSigningInMember || isMemberLoading}
          >
            {isCreatingAccount || isSigningInMember || isMemberLoading ? (
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
        </div>

        <p className="text-sm text-center">
          Already have an account?
          <Link to="/sign-in" className="font-semibold ml-1">
            Log in
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default SignUpForm
