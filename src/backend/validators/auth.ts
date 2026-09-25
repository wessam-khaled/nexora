import { z } from "zod";

export const registerSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, { message: "Company name is required" }),
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;   



export const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(8)
})

export type LoginInput = z.infer<typeof loginSchema>