import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"

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
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { SignInValidation } from "@/lib/validation"
import { useSignInAccount } from "@/lib/react-query/queries"
import { useMemberContext } from "@/context/AuthContext"

const SignInForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthMember, isLoading: isMemberLoading } = useMemberContext()
  const { mutateAsync: signInAccount, isPending } = useSignInAccount()

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignin = async (member: z.infer<typeof SignInValidation>) => {
    const session = await signInAccount(member)

    if (!session) {
      toast({ title: "Login failed. Please try again." })
      return
    }

    const isLoggedIn = await checkAuthMember()

    if (isLoggedIn) {
      form.reset()
      navigate("/")
    } else {
      toast({ title: "Login failed. Please try again." })
      return
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignin)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
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
              <FormLabel className="shad-form_label">Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isPending || isMemberLoading}
          >
            {isPending || isMemberLoading ? (
              <div className="flex items-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>
        </div>

        <p className="text-sm text-center">
          Don&apos;t have an account?
          <Link to="/sign-up" className="font-semibold ml-1">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default SignInForm
