import { useState } from 'react';
import useAuthenticatedApi from './use-authenticated-api';
import {AxiosResponse} from "axios";

export function usePost<TResponse>() {
    const authenticatedApi = useAuthenticatedApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<TResponse | null>(null);

    const post = async (url: string, body: any): Promise<TResponse> => {
        setLoading(true);
        setError(null);
        try {
            const res: AxiosResponse<TResponse> = await authenticatedApi.post(url, body, {
                headers: {
                    'Content-Type': 'application/ld+json',
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

    return { post, loading, error, data };
}