import {
    NEXT_PUBLIC_API_BASE_URL,
    NEXT_TOKEN_REFRESH_PATH,
    NEXT_TOKEN_INVALIDATE_PATH
} from '@/config/env';
import {create} from 'zustand';
import apiPrivate, {api} from '@/lib/api';
import {ROLE_USER,} from '@/constants';
import {toast} from 'sonner';
import axios from 'axios';
import {User} from '@/types/user';

interface AuthState {
    token: string | null;
    user: User | null;
    error: string | null;
    persist: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    refresh: () => Promise<string | null>;
    refreshOnReload: () => Promise<string | null>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    error: null,
    persist: localStorage.getItem("persist") === "true" || false,

    login: async (email, password) => {
        set({error: null});
        try {
            const response = await api.post('/login', {username: email, password});
            const token = response.data?.token;

            if (!token) {
                toast.error("Token not received.");
                return null;
            }

            const user = await getUser(token);
            if (!user) {
                toast.error("User not found after login.");
                return null;
            }

            localStorage.setItem("persist", "true");
            set({token, user, error: null, persist: true});

            return user;
        } catch (error: any) {
            console.error("Login failed:", error);
            if (error?.response?.status === 401) toast.error(error.response.data.message);
            else toast.error(error.message || "Login error");
            return Promise.reject(error);
        }
    },

    refresh: async () => {
        set({error: null});
        try {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}${NEXT_TOKEN_REFRESH_PATH}`, {withCredentials: true});
            const newToken = response.data?.token;

            if (!newToken) {
                localStorage.setItem("persist", "false");
                set({token: null, user: null, error: 'No new token received during refresh'});
                return null;
            }

            set({token: newToken, error: null});
            return newToken;
        } catch (error: any) {
            console.error("Token refresh failed:", error);
            localStorage.setItem("persist", "false");
            set({token: null, user: null, error: error.message || 'Failed to refresh token'});
            return null;
        }
    },

    refreshOnReload: async () => {
        set({error: null});
        try {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}${NEXT_TOKEN_REFRESH_PATH}`, {withCredentials: true});
            const newToken = response.data?.token;

            if (!newToken) {
                localStorage.setItem("persist", "false");
                set({token: null, user: null});
                return null;
            }

            const user = await getUser(newToken);
            if (!user) {
                console.warn("User not found after token refresh.");
                set({token: null, user: null});
                return null;
            }

            set({token: newToken, user, error: null});
            return newToken;
        } catch (error: any) {
            console.error("Token refresh failed:", error);
            localStorage.setItem("persist", "false");
            set({token: null, user: null, error: error.message || 'Token refresh failed'});
            return null;
        }
    },

    logout: async () => {
        set({error: null});
        try {
            await apiPrivate.get(NEXT_TOKEN_INVALIDATE_PATH);
        } catch (error: any) {
            console.error("Logout failed:", error);
            set({error: error.message || 'Logout failed. Please try again later.'});
        } finally {
            localStorage.setItem("persist", "false");
            set({token: null, user: null, error: null, persist: false});
        }
    },
}));

// Helper functions

const getUser = async (token: string): Promise<User | null> => {
    try {
        const meResponse = await api.get('/me', {
            headers: {Authorization: `Bearer ${token}`},
        });
        const user = meResponse.data;
        if (!user) return null;

        const role = getRole();
        return {...user, role};
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return null;
    }
};

const getRole = (): string => {
    return ROLE_USER;
};
