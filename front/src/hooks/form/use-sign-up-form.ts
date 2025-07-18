import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignUpFormData, signUpFormSchema} from "@/components/auth/sign-up-form-schema";
import {signUpDefaultValues} from "@/components/auth/sign-up-defaults";

export function useSignUpForm(defaultValues?: Partial<SignUpFormData>) {
    return useForm<SignUpFormData>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            ...signUpDefaultValues,
            ...defaultValues,
        },
    });
}
