import { z } from "zod"

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  primaryRole: z
    .string()
    .min(2, { message: "Role must be at least 2 characters." }),
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

export const ClientValidation = z.object({
  name: z
    .string()
    .min(2, { message: "Minimum 2 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  slug: z.string(),
  file: z.custom<File[]>(),
})

export const ProfileValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  primaryRole: z
    .string()
    .min(2, { message: "Role must be at least 2 characters." }),
  email: z.string().email(),
  file: z.custom<File[]>(),
})
