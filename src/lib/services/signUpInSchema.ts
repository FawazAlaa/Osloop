import { z } from "zod";

 const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email");
   
  const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 chars")
  .regex(/[A-Z]/, "Password must contain 1 uppercase letter");

 export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is Required"),
    age: z.number().int("Enter a valid Age").min(10, "Age is required and must be at least 10 years of old"),
    email: emailSchema,
    password: passwordSchema, 
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z.string().min(1, "Phone is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
