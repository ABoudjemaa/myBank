'use client'
import OperationForm from "@/components/forms/operation-form";
import {useGetCategories} from "@/hooks/get/use-get-categories";
import Loading from "@/components/loading";
import Error from "@/components/Error";
import React from "react";
import {usePost} from "@/hooks/use-post";
import {Operation} from "@/types/operation";
import {useRouter} from "next/navigation";
import {toast} from 'sonner';
import {OperationFormData} from "@/components/schema/operation-form-schema";
import {useOperationForm} from "@/hooks/form/use-operation-form";


function CreateOperationPage() {
    const {categories, loading, error} = useGetCategories();

    const {post, loading: postLoading} = usePost<Operation>();

    const form = useOperationForm();

    const router = useRouter();

    const handleSubmit = async (values: OperationFormData) => {
        console.log(values);
        post('/operations', values)
            .then(() => {
                toast.success("Operation created successfully", {
                    style: {
                        background: "#4CAF50",
                        color: "#FFFFFF",
                    },
                });
                router.push('/operations');
            })
            .catch((error) => {
                console.error('Error creating operation:', error);
                toast.error("Failed to create operation. Please try again.");
            });
    };

    if (loading)
        return <Loading/>;

    if (error)
        return <Error error={error}/>;

    return (
        <>
            {
                categories &&
                <OperationForm form={form} categories={categories} onSubmit={handleSubmit} isLoading={postLoading}/>
            }
        </>
    )
        ;
}

export default CreateOperationPage;