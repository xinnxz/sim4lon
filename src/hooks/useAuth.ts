/**
 * useAuth Hook - Authentication State Management
 * 
 * Hook untuk mengelola state autentikasi di React components.
 * Menyediakan fungsi login, logout, dan check auth status.
 */

import { useState, useEffect, useCallback } from 'react';
import { authApi, getToken, removeToken, type UserProfile, type LoginRequest } from '../lib/api';

interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    // Check auth status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
            });
            return;
        }

        try {
            const user = await authApi.getProfile();
            setState({
                user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } catch (error) {
            // Token invalid or expired
            removeToken();
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: 'Session expired',
            });
        }
    }, []);

    const login = useCallback(async (data: LoginRequest) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authApi.login(data);

            // Fetch full profile after login
            const user = await authApi.getProfile();

            setState({
                user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });

            return { success: true, user };
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Login failed',
            }));

            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(() => {
        authApi.logout();
        setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        login,
        logout,
        checkAuth,
    };
}
