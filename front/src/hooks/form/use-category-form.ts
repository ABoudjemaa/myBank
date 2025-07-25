import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CategoryFormData, categoryFormSchema} from "@/components/schema/category-form-schema";
import {categoryDefaultValues} from "@/components/schema/category-defaults";

export function useCategoryForm(defaultValues?: Partial<CategoryFormData>) {
    return useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            ...categoryDefaultValues,
            ...defaultValues,
        },
    });
}
