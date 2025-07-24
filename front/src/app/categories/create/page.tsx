'use client';
import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import {Alert} from '@/components/ui/alert';
import {usePost} from "@/hooks/use-post";
import {Category} from "@/types/category";

const CreateCategoryPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const router = useRouter();
    const {post, loading: postLoading} = usePost<Category>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await post("/categories", {title})
            .then(() => {
                toast.success("Category added successfully", {
                    style: {
                        background: "#4CAF50",
                        color: "#FFFFFF",
                    },
                });
                router.push('/categories');
            })
            .catch((error) => {
                console.log(error);
                setError('Failed to update category. Please try again.');
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6"
            >
                <h1 className="text-2xl font-semibold text-gray-800">Create Category</h1>
                {error && (
                    <Alert variant="destructive" className="text-sm">
                        {error}
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Title
                    </Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter category title"
                        className="w-full"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={postLoading}>
                    Create
                </Button>
            </form>
        </div>
    );
};

export default CreateCategoryPage;
