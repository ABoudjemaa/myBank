import * as z from "zod";

export const signUpFormSchema = z.object({
    firstName: z.string().min(1, "first Name is required"),
    lastName: z.string().min(1, "last Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
