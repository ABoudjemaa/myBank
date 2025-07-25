import * as z from "zod";

export const operationFormSchema = z.object({
    label: z.string().min(1, "Label is required"),
    amount: z
        .string()
        .min(1, "Amount is required")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
            message: "Amount must be a number greater than or equal to 0",
        }),
    category: z.string().min(1, "Category is required"),
});

export type OperationFormData = z.infer<typeof operationFormSchema>;
