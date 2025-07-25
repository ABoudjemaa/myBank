import {useAxiosPrivate} from "@/hooks/use-axios-private";
import {CollectionResponse} from "@/types";
import {Operation} from "@/types/operation";

export function useGetOperations() {

    const {response, loading, error} = useAxiosPrivate<CollectionResponse<Operation>>({
        method: "get",
        url: `/operations`,
    });

    return {
        operations: response?.member,
        loading,
        error,
    };
}
