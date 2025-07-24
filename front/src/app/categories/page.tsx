'use client';

import Link from 'next/link';
import React from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTitle,
    AlertDialogDescription
} from '@/components/ui/alert-dialog';
import {toast} from 'sonner';
import {useGetCategories} from "@/hooks/get/use-get-categories";
import {useDelete} from "@/hooks/use-delete";
import Loading from "@/components/loading";
import Error from "@/components/Error";

const CategoriesPage: React.FC = () => {
    const {categories, loading, error} = useGetCategories();
    const {deleteItem, loading: deleteLoading} = useDelete()

    if (loading)
        return <Loading/>;

    if (error)
        return <Error error={error}/>;

    const handleDelete = async (id: number) => {

        deleteItem(`/categories/${id}`)
            .then(() => {
                toast.success("Category deleted successfully", {
                    style: {
                        background: "#4CAF50",
                        color: "#FFFFFF",
                    },
                });
            })
            .catch((error) => {
                console.log(error);
                toast.error("Failed to delete category. Please try again.");
            })
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Link href="/categories/create">
                    <Button disabled={deleteLoading}>+ Create New Category</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {categories && categories.map((category) => (
                    <Card key={category.id} className="shadow-md flex justify-between">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mt-4 gap-5">
                                <Link href={`/categories/edit/${category.id}`}>
                                    <Button variant="secondary" className="mr-2" disabled={deleteLoading}>
                                        Edit
                                    </Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={deleteLoading}>Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogTitle></AlertDialogTitle>
                                        <AlertDialogDescription></AlertDialogDescription>
                                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                                        <p>Are you sure you want to delete the category "{category.title}"?</p>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(category.id)}
                                                disabled={deleteLoading}
                                            >
                                                Confirm
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
