import { useEffect } from "react";
import apiPrivate from "@/lib/api";
import {useAuthStore} from "@/store/use-auth-store";

const useAuthenticatedApi = () => {
    const token = useAuthStore((state)=>state.token)
    const refresh = useAuthStore((state)=>state.refresh)

    useEffect(() => {
        const requestIntercept = apiPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = apiPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                if ((error?.response?.status === 401 ||error?.response?.status === 403) && !prevRequest?.sent) {
                    prevRequest.sent = true; // Prevent infinite loops

                    try {
                        const newAccessToken = await refresh(); // Get new token
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return apiPrivate(prevRequest); // Retry with new token
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        
                        return Promise.reject(refreshError); // Handle token refresh failure
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            apiPrivate.interceptors.request.eject(requestIntercept);
            apiPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [token, refresh]);

    return apiPrivate;
};

export default useAuthenticatedApi;
