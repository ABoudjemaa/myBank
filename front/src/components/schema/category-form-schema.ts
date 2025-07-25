import * as z from "zod";

export const categoryFormSchema = z.object({
    title: z.string().min(1, "first Name is required"),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
