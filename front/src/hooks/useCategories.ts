
import { NEXT_PUBLIC_API_BASE_URL } from '@/config/env';
import { useFetch } from './useFetch';
import axios from 'axios';


export const useCategories = () => {
    const { data, loading, error } = useFetch<{ member: Category[] }>(`${NEXT_PUBLIC_API_BASE_URL}/categories`);

    const createCategory = async (category: Omit<Category, 'id'>) => {
        await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/categories`, category);
    };

    const updateCategory = async (id: number, category: Omit<Category, 'id'>) => {
        await axios.put(`${NEXT_PUBLIC_API_BASE_URL}/categories/${id}`, category);
    };

    const deleteCategory = async (id: number) => {
        await axios.delete(`${NEXT_PUBLIC_API_BASE_URL}/categories/${id}`);
    };

    return {
        categories: data?.member || [],
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};

interface Category {
    id: number;
    title: string;
    operations?: string[];
}
