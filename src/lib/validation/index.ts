import { z } from "zod"

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  primaryRole: z
    .string()
    .min(2, { message: "Primary role must be at least 2 characters." }),
  file: z.custom<File[]>(),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
})

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
})
