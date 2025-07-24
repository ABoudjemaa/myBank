import {useAxiosPrivate} from "@/hooks/use-axios-private";
import {Category} from "@/types/category";
import {CollectionResponse} from "@/types";

export function useGetCategories() {

    const {response, loading, error} = useAxiosPrivate<CollectionResponse<Category>>({
        method: "get",
        url: `/categories`,
    });

    return {
        categories: response?.member,
        loading,
        error,
    };
}
