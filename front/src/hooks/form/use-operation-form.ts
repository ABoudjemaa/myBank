import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {OperationFormData, operationFormSchema} from "@/components/schema/operation-form-schema";
import {operationDefaultValues} from "@/components/schema/operation-defaults";

export function useOperationForm(defaultValues?: Partial<OperationFormData>) {
    return useForm<OperationFormData>({
        resolver: zodResolver(operationFormSchema),
        defaultValues: {
            ...operationDefaultValues,
            ...defaultValues,
        },
    });
}
