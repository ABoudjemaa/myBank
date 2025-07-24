'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {useGetCategory} from "@/hooks/get/use-get-category";
import Loading from "@/components/loading";
import Error from "@/components/Error";

const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {category, loading, error} = useGetCategory(id);
  
  const [title, setTitle] = useState(category?.title || '');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await updateCategory(Number(id), { title });
      toast.success("Category updated successfully" , {
        style: {
          background: "#4CAF50",
          color: "#FFFFFF",
        },
      }
      );
      router.push('/categories');
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return <Loading/>;

  if (error)
    return <Error error={error}/>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800">Edit Category</h1>

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
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </div>
  );
};

export default EditCategoryPage;
