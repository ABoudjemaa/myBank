import { Operation } from '@/types/interfaces';
import { useFetch } from './useFetch';
import { NEXT_PUBLIC_API_BASE_URL } from '@/config/env';

export const useOperations = () => {
    const { data, loading, error } = useFetch<{ member: Operation[] }>(`${NEXT_PUBLIC_API_BASE_URL}/operations`);

    return {
        operations: data?.member || [],
        loading,
        error,
    };
};

