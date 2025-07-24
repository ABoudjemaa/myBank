import {Category} from '@/types/category';
import {useAxiosPrivate} from "@/hooks/use-axios-private";

export function useGetCategory(id?: string) {

    const {response, loading, error} = useAxiosPrivate<Category>({
        method: "get",
        url: `/categories/${id}`,
    });

    return {
        category: response,
        loading,
        error,
    };
}
