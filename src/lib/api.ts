/**
 * API Client - Koneksi ke Backend NestJS
 * 
 * File ini berisi fungsi-fungsi untuk berkomunikasi dengan backend API.
 * Semua request ke backend akan melalui file ini.
 */

// Base URL backend - sesuaikan dengan environment
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

// Token storage key
const TOKEN_KEY = 'sim4lon_token';

/**
 * Get stored auth token
 */
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Save auth token
 */
export function setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove auth token (logout)
 */
export function removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * API Request helper with automatic auth header
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        // Handle 401 - redirect to login
        // PENTING: Jangan redirect jika sedang di halaman login!
        // Ini supaya error message "email/password salah" bisa ditampilkan
        if (response.status === 401) {
            removeToken();
            // Cek apakah bukan di halaman login sebelum redirect
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        throw new Error(data.message || 'Request failed');
    }

    return data;
}

// ============================================================
// AUTH API
// ============================================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: 'ADMIN' | 'OPERATOR';
    };
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: 'ADMIN' | 'OPERATOR';
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const authApi = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await apiRequest<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        // Save token
        setToken(response.access_token);

        return response;
    },

    async getProfile(): Promise<UserProfile> {
        return apiRequest<UserProfile>('/auth/profile');
    },

    logout(): void {
        removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },
};

// ============================================================
// PANGKALAN API
// ============================================================

export interface Pangkalan {
    id: string;
    name: string;
    address: string;
    region: string | null;
    pic_name: string | null;
    phone: string | null;
    capacity: number | null;
    note: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const pangkalanApi = {
    async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Pangkalan>> {
        return apiRequest(`/pangkalans?page=${page}&limit=${limit}`);
    },

    async getById(id: string): Promise<Pangkalan> {
        return apiRequest(`/pangkalans/${id}`);
    },

    async create(data: Partial<Pangkalan>): Promise<Pangkalan> {
        return apiRequest('/pangkalans', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<Pangkalan>): Promise<Pangkalan> {
        return apiRequest(`/pangkalans/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiRequest(`/pangkalans/${id}`, { method: 'DELETE' });
    },
};

// ============================================================
// DRIVERS API
// ============================================================

export interface Driver {
    id: string;
    name: string;
    phone: string | null;
    vehicle_id: string | null;
    is_active: boolean;
    note: string | null;
    created_at: string;
    updated_at: string;
}

export const driversApi = {
    async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Driver>> {
        return apiRequest(`/drivers?page=${page}&limit=${limit}`);
    },

    async getById(id: string): Promise<Driver> {
        return apiRequest(`/drivers/${id}`);
    },

    async create(data: Partial<Driver>): Promise<Driver> {
        return apiRequest('/drivers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<Driver>): Promise<Driver> {
        return apiRequest(`/drivers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiRequest(`/drivers/${id}`, { method: 'DELETE' });
    },
};

// ============================================================
// STOCK API
// ============================================================

export type LpgType = 'kg3' | 'kg12' | 'kg50';
export type MovementType = 'MASUK' | 'KELUAR';

export interface StockHistory {
    id: string;
    lpg_type: LpgType;
    movement_type: MovementType;
    qty: number;
    note: string | null;
    timestamp: string;
    users?: {
        id: string;
        name: string;
    };
}

export interface StockSummary {
    [key: string]: {
        in: number;
        out: number;
        current: number;
    };
}

export const stockApi = {
    async getSummary(): Promise<StockSummary> {
        return apiRequest('/stocks/summary');
    },

    async getHistory(page = 1, limit = 10): Promise<PaginatedResponse<StockHistory>> {
        return apiRequest(`/stocks/history?page=${page}&limit=${limit}`);
    },

    async createMovement(data: {
        lpg_type: LpgType;
        movement_type: MovementType;
        qty: number;
        note?: string;
    }): Promise<StockHistory> {
        return apiRequest('/stocks/movements', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
