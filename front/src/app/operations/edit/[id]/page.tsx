'use client'
import OperationForm from "@/components/forms/operation-form";
import {useGetCategories} from "@/hooks/get/use-get-categories";
import Loading from "@/components/loading";
import Error from "@/components/Error";
import React, {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {toast} from 'sonner';
import {OperationFormData} from "@/components/schema/operation-form-schema";
import {useOperationForm} from "@/hooks/form/use-operation-form";
import {useGetOperation} from "@/hooks/get/use-get-operation";
import {usePatch} from "@/hooks/use-patch";
import {CategoryFormData} from "@/components/schema/category-form-schema";


function CreateOperationPage() {
    const {id} = useParams<{ id: string }>();
    const {categories, loading: categoriesLoading, error: categoriesError} = useGetCategories();
    const {operation, loading, error} = useGetOperation(id);

    const form = useOperationForm();

    useEffect(() => {
        if (operation) return form.reset({
            label: operation.label,
            category: `/api/categories/${typeof operation.category !== "string" ? operation.category?.id : ''}`,
            amount: Number(operation.amount),
        })
    }, [operation, form])

    const {patch, loading: patchLoading} = usePatch<CategoryFormData>()


    const router = useRouter();

    const handleSubmit = async (values: OperationFormData) => {
        console.log(values);
        patch(`/operations/${operation?.id}`, values)
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
                categories && operation &&
                <OperationForm
                    form={form}
                    categories={categories}
                    onSubmit={handleSubmit}
                    isLoading={patchLoading}
                    submitLabel={'Update Operation'}
                />
            }
        </>
    )
        ;
}

export default CreateOperationPage;