
import { NEXT_PUBLIC_API_BASE_URL } from '@/config/env';
import { useFetch } from './useFetch';
import axios from 'axios';

const url = `${NEXT_PUBLIC_API_BASE_URL}/categories`;
const headers = {
    'Content-Type': 'application/ld+json',
}


export const useCategories = () => {
    const { data, loading, error, setData } = useFetch<{ member: Category[] }>(`${url}`);

    const createCategory = async (category: any) => {
        const body = JSON.stringify(category);
        console.log(body);
        await axios.post(`${url}`, body, {
            headers: {
                'Content-Type': 'application/ld+json',
            }
        });
    };

    const updateCategory = async (id: number, category: any) => {
        const body = JSON.stringify(category);
        console.log(body);
        await axios.patch(`${url}/${id}`, body, { headers: {
            'Content-Type': 'application/merge-patch+json',
        } });
    };

    const deleteCategory = async (id: number) => {
    try {
        await axios.delete(`${url}/${id}`);
        // Remove the category locally
        setData((prev) => ({
            ...prev!,
            member: prev!.member.filter((category) => category.id !== id),
        }));
    } catch (err) {
        console.error('Error deleting category:', err);
    }
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
