'use client';
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'sonner';
import {useGetCategory} from "@/hooks/get/use-get-category";
import Loading from "@/components/loading";
import Error from "@/components/Error";
import {useCategoryForm} from "@/hooks/form/use-category-form";
import CategoryForm from "@/components/forms/category-form";
import {CategoryFormData} from "@/components/schema/category-form-schema";
import {usePatch} from "@/hooks/use-patch";

const EditCategoryPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {category, loading, error} = useGetCategory(id);

    const form = useCategoryForm()

    useEffect(() => {
        if (category) return form.reset(category)
    }, [category, form])

    const {patch} = usePatch<CategoryFormData>()


    const router = useRouter();

    const handleSubmit = async (values: CategoryFormData) => {
        console.log(values);
        patch(`/categories/${category?.id}`, values)
            .then(() => {
                toast.success("Category updated successfully", {
                    style: {
                        background: "#4CAF50",
                        color: "#FFFFFF",
                    },
                });
                router.push('/categories');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    if (loading)
        return <Loading/>;

    if (error)
        return <Error error={error}/>;

    return (
        <CategoryForm form={form} onSubmit={handleSubmit} isLoading={false}/>
    );
};

export default EditCategoryPage;
