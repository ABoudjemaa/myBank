import { NEXT_PUBLIC_API_BASE_URL } from '@/config/env';
import axios from 'axios';


export const api = axios.create({
    baseURL: NEXT_PUBLIC_API_BASE_URL,
    withCredentials: false,
});

const apiPrivate = axios.create({
    baseURL: NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true
});

export default apiPrivate;


export function getApiReferenceUrl(id: string, resourceName: string): string {
    return id ? `/api/${resourceName}/${id}` : '';
}