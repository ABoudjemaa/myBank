import {Operation} from '@/types/operation';
import {useAxiosPrivate} from "@/hooks/use-axios-private";

export function useGetOperation(id?: string) {

    const {response, loading, error} = useAxiosPrivate<Operation>({
        method: "get",
        url: `/operations/${id}`,
    });

    return {
        operation: response,
        loading,
        error,
    };
}
