import { z } from "zod"

export const SignUpValidation = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
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
  description: z.string().optional(),
  website: z
    .string()
    .url({ message: "Invalid url. Please add https." })
    .optional()
    .or(z.literal("")),
  x: z
    .string()
    .url({ message: "Invalid url. Please add https." })
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url({ message: "Invalid url. Please add https." })
    .optional()
    .or(z.literal("")),
  file: z.custom<File[]>(),
})

export const ProjectValidation = z.object({
  title: z
    .string()
    .min(2, { message: "Minimum 2 characters." })
    .max(255, { message: "Maximum 255 caracters" }),
  sparkRep: z.string().optional(),
  briefLink: z.string().url().optional(),
  roadmapLink: z.string().url().optional(),
})

export const ProfileValidation = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  primaryRole: z
    .string()
    .min(2, { message: "Role must be at least 2 characters." }),
  email: z.string().email(),
  file: z.custom<File[]>(),
})

export const OpportunityValidation = z.object({
  projectId: z.string({
    required_error: "Please select a project.",
  }),
  memberId: z.string({
    required_error: "Please select a member.",
  }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  background: z.string().optional(),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  duration: z
    .string()
    .min(2, { message: "Duration must be at least 2 characters." }),
  type: z
    .string()
    .min(2, { message: "Project type must be at least 2 characters." }),
  estimatedEarnings: z.string().optional(),
  responsibilities: z
    .string()
    .min(2, { message: "Responsibilities must be at least 2 characters." }),
})

export const MilestoneValidation = z.object({
  title: z
    .string()
    .min(2, { message: "Minimum 2 characters." })
    .max(255, { message: "Maximum 255 caracters" }),
})
