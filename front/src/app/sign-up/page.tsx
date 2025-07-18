"use client"

import {AuthWrapper} from "@/components/auth/auth-wrapper";
import SignUpForm from "@/components/auth/sign-up-form";
import {useSignUpForm} from "@/hooks/form/use-sign-up-form";
import {useSignUp} from "@/hooks/use-sign-up";
import {useRouter} from "next/navigation";
import {SignUpFormData} from "@/components/auth/sign-up-form-schema";


const SignUpPage = () => {
    const router = useRouter();

    const {signUp, loading} = useSignUp()

    const form = useSignUpForm()

    const onSubmit = async (values: SignUpFormData) => {
        signUp(values)
            .then(() => {
                router.push("/login")

            })
            .catch((error) => {
                console.error('Error signing up:', error);
            });
    };

    return (
        <AuthWrapper>
            <SignUpForm
                form={form}
                onSubmit={onSubmit}
                submitLabel="Create Account"
                isLoading={loading}
            />
        </AuthWrapper>
    );
};

export default SignUpPage;