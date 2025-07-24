import { useState, useEffect } from 'react';
import useAuthenticatedApi from './use-authenticated-api';

export function useAxiosPrivate<TData>({
    url,
    method,
    body = null,
    headers = null,
    skip = false,
    trigger = 0, // new
}: {
    url: string,
    method: "get" | "post" | "put" | "patch" | "delete",
    body?: any,
    headers?: any,
    skip?: boolean,
    trigger?: number, // new
}) {
    const authenticatedApi = useAuthenticatedApi();
    const [response, setResponse] = useState<TData | null>(null);
    const [error, setError] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = () => {
        setLoading(true);
        authenticatedApi[method](url, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                setResponse(res.data);
                console.log('url', url);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!skip) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [method, url, body, headers, skip, trigger]); // add `trigger`

    return { response, error, loading };
}
