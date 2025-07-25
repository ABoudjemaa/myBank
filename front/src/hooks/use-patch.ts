import {useState} from 'react';
import useAuthenticatedApi from './use-authenticated-api';
import {AxiosResponse} from "axios";

export function usePatch<TResponse = any>() {
    const authenticatedApi = useAuthenticatedApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<TResponse | null>(null);

    const patch = async (url: string, body: any): Promise<TResponse> => {
        setLoading(true);
        setError(null);
        try {
            const res: AxiosResponse<TResponse> = await authenticatedApi.patch(url, body, {
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
            });
            setData(res.data);
            return res.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {patch, loading, error, data};
}