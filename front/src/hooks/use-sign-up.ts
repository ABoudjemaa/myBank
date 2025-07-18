import { useState } from 'react';
import {AxiosResponse} from "axios";
import {api} from '@/lib/api';
import {SignUpFormData} from "@/components/auth/sign-up-form-schema";

export function useSignUp<TResponse>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<TResponse | null>(null);

    const signUp = async (body: SignUpFormData): Promise<TResponse> => {
        setLoading(true);
        setError(null);
        try {
            const res: AxiosResponse<TResponse> = await api.post(`/register`, body,{
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

    return { signUp, loading, error, data };
}