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
        role: 'ADMIN' | 'OPERATOR' | 'PANGKALAN';
        pangkalan_id?: string | null;
        pangkalan?: {
            id: string;
            code: string;
            name: string;
        } | null;
    };
}

export interface UserProfile {
    id: string;
    code: string;
    email: string;
    name: string;
    phone: string | null;
    role: 'ADMIN' | 'OPERATOR' | 'PANGKALAN';
    avatar_url: string | null;
    is_active: boolean;
    pangkalan_id?: string | null;
    pangkalans?: {
        id: string;
        code: string;
        name: string;
        address: string;
        phone: string | null;
    } | null;
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

    async updateProfile(data: { name?: string; phone?: string; avatar_url?: string | null }): Promise<{ message: string; user: UserProfile }> {
        return apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async changePassword(data: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
        return apiRequest('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    logout(): void {
        removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },
};

// ============================================================
// UPLOAD API
// ============================================================

export interface UploadResponse {
    message: string;
    filename: string;
    url: string;
}

export const uploadApi = {
    /**
     * Upload avatar image (max 2MB, images only)
     */
    async uploadAvatar(file: File): Promise<UploadResponse> {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Upload gagal');
        }

        return data;
    },
};

// ============================================================
// NOTIFICATION API
// ============================================================

export interface NotificationItem {
    id: string;
    type: 'order_new' | 'agen_order' | 'stock_low' | 'stock_critical' | 'stock_out';
    title: string;
    message: string;
    icon: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    link?: string;
    time: string;
    // For agen_order type - order reference
    orderId?: string;
}

export interface NotificationResponse {
    notifications: NotificationItem[];
    unread_count: number;
}

export const notificationApi = {
    async getNotifications(limit = 10): Promise<NotificationResponse> {
        return apiRequest<NotificationResponse>(`/notifications?limit=${limit}`);
    },
    async markAllAsRead(): Promise<void> {
        return apiRequest('/notifications/mark-all-read', { method: 'POST' });
    },
};

// ============================================================
// AGEN ORDERS API (For Admin/Operator to manage pangkalan orders)
// ============================================================

export interface AgenOrderFromPangkalan {
    id: string;
    code: string;
    lpg_type: string;
    qty_ordered: number;
    qty_received: number | null;
    status: 'PENDING' | 'DIKIRIM' | 'DITERIMA' | 'BATAL';
    order_date: string;
    received_date: string | null;
    note: string | null;
    pangkalans: {
        code: string;
        name: string;
        phone: string | null;
    };
}

export const agenPangkalanOrdersApi = {
    /**
     * Get all orders from all pangkalan (agen view)
     */
    async getAll(status?: string): Promise<AgenOrderFromPangkalan[]> {
        const params = status && status !== 'all' ? `?status=${status}` : '';
        return apiRequest(`/agen-orders/agen/all${params}`);
    },

    /**
     * Get stats for agen
     */
    async getStats(): Promise<{ pending: number; dikirim: number; diterima: number; batal: number; total: number }> {
        return apiRequest('/agen-orders/agen/stats');
    },

    /**
     * Confirm order (PENDING -> DIKIRIM)
     */
    async confirm(id: string): Promise<AgenOrderFromPangkalan> {
        return apiRequest(`/agen-orders/agen/${id}/confirm`, { method: 'PATCH' });
    },

    /**
     * Complete order (DIKIRIM -> DITERIMA)
     */
    async complete(id: string, qtyReceived: number): Promise<AgenOrderFromPangkalan> {
        return apiRequest(`/agen-orders/agen/${id}/complete`, {
            method: 'PATCH',
            body: JSON.stringify({ qty_received: qtyReceived }),
        });
    },

    /**
     * Cancel order from agen
     */
    async cancel(id: string): Promise<AgenOrderFromPangkalan> {
        return apiRequest(`/agen-orders/agen/${id}/cancel`, { method: 'PATCH' });
    },
};

// ============================================================
// ACTIVITY API
// ============================================================

export interface ActivityLog {
    id: string;
    type: string;
    title: string;
    description: string | null;
    pangkalan_name: string | null;
    detail_numeric: number | null;
    icon_name: string | null;
    order_status: string | null;
    timestamp: string;
    users: {
        id: string;
        name: string;
    } | null;
    orders: {
        id: string;
        pangkalans: {
            name: string;
        };
    } | null;
}

export interface ActivityResponse {
    data: ActivityLog[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const activityApi = {
    /**
     * Get all activities with pagination and filter
     */
    async getAll(
        page = 1,
        limit = 20,
        type?: string
    ): Promise<ActivityResponse> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (type && type !== 'all') params.append('type', type);

        return apiRequest<ActivityResponse>(`/activities?${params.toString()}`);
    },

    /**
     * Get recent activities
     */
    async getRecent(limit = 10): Promise<ActivityLog[]> {
        return apiRequest<ActivityLog[]>(`/activities/recent?limit=${limit}`);
    },

    /**
     * Get activities by type
     */
    async getByType(type: string, limit = 20): Promise<ActivityLog[]> {
        return apiRequest<ActivityLog[]>(`/activities/by-type?type=${type}&limit=${limit}`);
    },
};

// ============================================================
// COMPANY PROFILE & SETTINGS API
// ============================================================

export interface CompanyProfile {
    id: string; // 6-digit agen code
    company_name: string;
    address: string;
    phone?: string;
    email?: string;
    pic_name?: string;
    sppbe_number?: string;
    region?: string;
    logo_url?: string;
    // App Settings
    ppn_rate: number;
    critical_stock_limit: number;
    invoice_prefix: string;
    order_code_prefix: string;
    created_at: string;
    updated_at: string;
}

export const companyProfileApi = {
    /**
     * Get company profile (singleton)
     */
    async get(): Promise<CompanyProfile> {
        return apiRequest<CompanyProfile>('/company-profile');
    },

    /**
     * Update company profile
     */
    async update(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
        return apiRequest<CompanyProfile>('/company-profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================
// REPORTS API
// ============================================================

export interface ReportPeriod {
    start: string;
    end: string;
}

export interface SalesReportSummary {
    total_orders: number;
    total_revenue: number;
    average_order: number;
    status_breakdown: Record<string, number>;
}

export interface SalesReportItem {
    id: string;
    date: string;
    code: string;
    pangkalan: string;
    pangkalan_code: string;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
}

export interface SalesReportResponse {
    summary: SalesReportSummary;
    data: SalesReportItem[];
    period: ReportPeriod;
}

export interface PaymentsReportSummary {
    total_payments: number;
    total_amount: number;
    average_payment: number;
    method_breakdown: Record<string, { count: number; amount: number }>;
}

export interface PaymentsReportItem {
    id: string;
    date: string;
    invoice_number: string;
    order_code: string;
    pangkalan: string;
    amount: number;
    method: string;
    note: string | null;
    recorded_by: string;
}

export interface PaymentsReportResponse {
    summary: PaymentsReportSummary;
    data: PaymentsReportItem[];
    period: ReportPeriod;
}

export interface StockMovementSummary {
    total_in: number;
    total_out: number;
    net_change: number;
    current_balance: number;
    movement_count: number;
}

export interface StockMovementItem {
    id: string;
    date: string;
    product: string;
    type: string;
    qty: number;
    note: string | null;
    recorded_by: string;
}

export interface StockMovementResponse {
    summary: StockMovementSummary;
    data: StockMovementItem[];
    period: ReportPeriod;
}

// Pangkalan Analytics Report Types
export interface PangkalanReportSummary {
    total_pangkalan: number;
    // Subsidi (3kg)
    total_orders_subsidi: number;
    total_tabung_subsidi: number;
    total_revenue_subsidi: number;
    // Non-Subsidi (5.5kg+)
    total_nonsubsidi_orders: number;
    total_nonsubsidi_tabung: number;
    total_nonsubsidi_revenue: number;
    // All products combined
    total_all_orders: number;
    total_all_tabung: number;
    total_all_revenue: number;
    // Per-type tabung breakdown
    tabung_by_type: {
        kg3: number;   // 3kg subsidi
        kg5: number;   // 5.5kg 
        kg12: number;  // 12kg
        kg50: number;  // 50kg
        gr220: number; // Bright Gas Can 220g
    };
    // Consumer stats
    total_consumers: number;
    active_consumers: number;
    top_pangkalan: string;
}

export interface PangkalanReportItem {
    id: string;
    code: string;
    name: string;
    address: string;
    region: string;
    pic_name: string;
    phone: string;
    alokasi_bulanan: number;
    total_orders_from_agen: number;
    total_tabung_from_agen: number;
    total_consumer_orders: number;
    total_tabung_to_consumers: number;
    total_revenue: number;
    // Non-subsidi
    total_nonsubsidi_orders: number;
    total_nonsubsidi_tabung: number;
    total_nonsubsidi_revenue: number;
    // All products
    total_all_orders: number;
    total_all_tabung: number;
    total_all_revenue: number;
    // Stats
    total_registered_consumers: number;
    active_consumers: number;
}

export interface PangkalanReportResponse {
    summary: PangkalanReportSummary;
    data: PangkalanReportItem[];
    period: ReportPeriod;
}

// Subsidi Consumers Audit Types
export interface SubsidiConsumersSummary {
    pangkalan_id: string;
    pangkalan_code: string;
    pangkalan_name: string;
    total_consumers: number;
    registered_consumers: number;
    walk_in_count: number;
    total_transactions: number;
    total_tabung: number;
}

export interface SubsidiConsumerItem {
    id: string;
    name: string;
    nik: string | null;
    kk: string | null;
    phone: string | null;
    address: string | null;
    consumer_type: string;
    total_purchases: number;
    total_tabung: number;
    last_purchase: string;
    purchases: Array<{ date: string; qty: number; amount: number }>;
}

export interface SubsidiConsumersResponse {
    summary: SubsidiConsumersSummary;
    data: SubsidiConsumerItem[];
    period: ReportPeriod;
}

export const reportsApi = {
    async getSalesReport(startDate?: string, endDate?: string): Promise<SalesReportResponse> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return apiRequest<SalesReportResponse>(`/reports/sales?${params.toString()}`);
    },

    async getPaymentsReport(startDate?: string, endDate?: string): Promise<PaymentsReportResponse> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return apiRequest<PaymentsReportResponse>(`/reports/payments?${params.toString()}`);
    },

    async getStockMovementReport(startDate?: string, endDate?: string, productId?: string): Promise<StockMovementResponse> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (productId) params.append('productId', productId);
        return apiRequest<StockMovementResponse>(`/reports/stock-movement?${params.toString()}`);
    },

    /**
     * Get pangkalan analytics report with subsidi distribution stats
     */
    async getPangkalanReport(startDate?: string, endDate?: string): Promise<PangkalanReportResponse> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return apiRequest<PangkalanReportResponse>(`/reports/pangkalan?${params.toString()}`);
    },

    /**
     * Get subsidi consumers for a specific pangkalan (for audit)
     */
    async getSubsidiConsumers(pangkalanId: string, startDate?: string, endDate?: string): Promise<SubsidiConsumersResponse> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return apiRequest<SubsidiConsumersResponse>(`/reports/pangkalan/${pangkalanId}/consumers?${params.toString()}`);
    },
};


// ============================================================
// PANGKALAN API
// ============================================================

export interface Pangkalan {
    id: string;
    code: string;  // Pangkalan code like PKL-0001
    name: string;
    address: string;
    region: string | null;
    pic_name: string | null;
    phone: string | null;
    email: string | null;  // Email for sending invoices
    capacity: number | null;
    alokasi_bulanan: number;  // Monthly LPG allocation quota
    note: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // User terkait dengan pangkalan ini (akun login)
    users?: {
        id: string;
        email: string;
        name: string;
        is_active: boolean;
    }[];
}

/**
 * Payload untuk membuat pangkalan baru.
 * Termasuk field untuk membuat akun login (login_email, login_password).
 */
export interface CreatePangkalanPayload {
    name: string;
    address: string;
    region?: string;
    pic_name?: string;
    phone?: string;
    email?: string | null;  // Email untuk invoice
    capacity?: number;
    alokasi_bulanan?: number;  // Monthly allocation
    note?: string;
    // Akun login
    login_email?: string;
    login_password?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        // Optional stats for summary cards (e.g., pangkalan/driver list)
        totalActive?: number;
        totalInactive?: number;
        totalAll?: number;
        // Optional stats for user list (by role)
        totalAdmin?: number;
        totalOperator?: number;
        totalPangkalan?: number;
    };
}

export const pangkalanApi = {
    /**
     * Get all pangkalan with pagination, search, and filter
     * @param page - Page number (default 1)
     * @param limit - Items per page (default 10)
     * @param search - Search by name, region, or PIC name
     * @param isActive - Filter by active status
     */
    async getAll(
        page = 1,
        limit = 10,
        search?: string,
        isActive?: boolean
    ): Promise<PaginatedResponse<Pangkalan>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (isActive !== undefined) params.append('is_active', isActive.toString());

        return apiRequest(`/pangkalans?${params.toString()}`);
    },

    async getById(id: string): Promise<Pangkalan> {
        return apiRequest(`/pangkalans/${id}`);
    },

    async create(data: CreatePangkalanPayload): Promise<Pangkalan> {
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
    /**
     * Get all drivers with pagination and filter
     * @param page - Page number (default 1)
     * @param limit - Items per page (default 10)
     * @param search - Search by name
     * @param isActive - Filter by active status
     */
    async getAll(
        page = 1,
        limit = 10,
        search?: string,
        isActive?: boolean
    ): Promise<PaginatedResponse<Driver>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (isActive !== undefined) params.append('is_active', isActive.toString());

        return apiRequest(`/drivers?${params.toString()}`);
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
// LPG PRODUCTS API (Dynamic Product Management)
// ============================================================

export type LpgCategory = 'SUBSIDI' | 'NON_SUBSIDI';

export interface LpgPrice {
    id: string;
    lpg_product_id: string;
    label: string;
    price: number;              // Harga jual
    cost_price?: number | null; // Harga beli (untuk hitung profit)
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface LpgProduct {
    id: string;
    name: string;
    size_kg: number;
    category: LpgCategory;
    color: string | null;
    brand: string | null;
    description: string | null;
    selling_price: number;          // Harga jual default
    cost_price?: number | null;     // Harga beli (untuk profit)
    is_active: boolean;
    prices: LpgPrice[];             // Deprecated, keep for backward compat
    created_at: string;
    updated_at: string;
}

export interface LpgProductWithStock extends LpgProduct {
    stock: {
        in: number;
        out: number;
        current: number;
    };
}

export const lpgProductsApi = {
    /**
     * Get all LPG products
     */
    async getAll(includeInactive = false): Promise<LpgProduct[]> {
        const params = includeInactive ? '?includeInactive=true' : '';
        return apiRequest(`/lpg-products${params}`);
    },

    /**
     * Get all LPG products with stock summary
     */
    async getWithStock(): Promise<LpgProductWithStock[]> {
        return apiRequest('/lpg-products/with-stock');
    },

    /**
     * Get single product by ID
     */
    async getOne(id: string): Promise<LpgProduct> {
        return apiRequest(`/lpg-products/${id}`);
    },

    /**
     * Create new LPG product (simplified pricing)
     */
    async create(data: {
        name: string;
        size_kg: number;
        category: LpgCategory;
        color?: string;
        description?: string;
        selling_price: number;  // Harga jual
        cost_price: number;     // Harga beli (wajib)
    }): Promise<LpgProduct> {
        return apiRequest('/lpg-products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Update LPG product
     */
    async update(id: string, data: {
        name?: string;
        size_kg?: number;
        category?: LpgCategory;
        color?: string;
        brand?: string;
        description?: string;
        selling_price?: number;  // Harga jual
        cost_price?: number;     // Harga beli
        is_active?: boolean;
    }): Promise<LpgProduct> {
        return apiRequest(`/lpg-products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete LPG product
     */
    async delete(id: string): Promise<void> {
        return apiRequest(`/lpg-products/${id}`, { method: 'DELETE' });
    },

    /**
     * Add price variant to product
     */
    async addPrice(productId: string, data: {
        label: string;
        price: number;
        is_default?: boolean;
    }): Promise<LpgPrice> {
        return apiRequest(`/lpg-products/${productId}/prices`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Update price variant
     */
    async updatePrice(priceId: string, data: {
        label: string;
        price: number;
        is_default?: boolean;
    }): Promise<LpgPrice> {
        return apiRequest(`/lpg-products/prices/${priceId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete price variant
     */
    async deletePrice(priceId: string): Promise<void> {
        return apiRequest(`/lpg-products/prices/${priceId}`, { method: 'DELETE' });
    },
};

// ============================================================
// STOCK API
// ============================================================

export type LpgType = '3kg' | '5kg' | '12kg' | '50kg';
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

    /**
     * Get stock history with pagination and filters
     */
    async getHistory(
        page = 1,
        limit = 10,
        lpgType?: LpgType,
        movementType?: MovementType
    ): Promise<PaginatedResponse<StockHistory>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (lpgType) params.append('lpg_type', lpgType);
        if (movementType) params.append('movement_type', movementType);

        return apiRequest(`/stocks/history?${params.toString()}`);
    },

    /**
     * Get history for specific LPG type
     */
    async getHistoryByType(lpgType: LpgType, limit = 20): Promise<StockHistory[]> {
        return apiRequest(`/stocks/history/${lpgType}?limit=${limit}`);
    },

    async createMovement(data: {
        lpg_product_id?: string;  // For dynamic products
        lpg_type?: LpgType;       // For legacy compatibility
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

// ============================================================
// USERS API
// ============================================================

export type UserRole = 'ADMIN' | 'OPERATOR' | 'PANGKALAN';

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: UserRole;
    is_active: boolean;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export const usersApi = {
    /**
     * Get all users with pagination
     * Requires ADMIN role
     * @param excludeRoles - Array of roles to exclude (e.g., ['PANGKALAN'])
     */
    async getAll(
        page = 1,
        limit = 10,
        search?: string,
        excludeRoles?: string[]
    ): Promise<PaginatedResponse<User>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (excludeRoles && excludeRoles.length > 0) {
            params.append('exclude_roles', excludeRoles.join(','));
        }

        return apiRequest(`/users?${params.toString()}`);
    },

    async getById(id: string): Promise<User> {
        return apiRequest(`/users/${id}`);
    },

    async create(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        role?: UserRole;
    }): Promise<User> {
        return apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<User>): Promise<User> {
        return apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiRequest(`/users/${id}`, { method: 'DELETE' });
    },

    /**
     * Reset password user - admin only
     * @returns new plain text password untuk diberikan ke user
     */
    async resetPassword(id: string): Promise<{ message: string; newPassword: string }> {
        return apiRequest(`/users/${id}/reset-password`, {
            method: 'POST',
        });
    },
};

// ============================================================
// DASHBOARD API
// ============================================================

/**
 * Dashboard KPI Stats
 */
export interface DashboardProductStock {
    id: string;
    name: string;
    size_kg: number;
    category: string;
    color: string | null;
    price: number;
    stock: {
        in: number;
        out: number;
        current: number;
    };
}

export interface DashboardStats {
    todayOrders: number;
    todaySales: number;
    pendingOrders: number;
    completedOrders: number;
    totalStock: {
        kg3: number;
        kg12: number;
        kg50: number;
    };
    dynamicProducts: DashboardProductStock[];
}

/**
 Chart data types
 */
export interface SalesChartData {
    data: { day: string; sales: number }[];
}

export interface StockChartData {
    products: { id: string; name: string; color: string }[];
    data: Record<string, any>[];
}

export interface ProfitChartData {
    data: { day: string; profit: number }[];
}

export interface TopPangkalanData {
    data: { name: string; value: number }[];
}

export interface StockConsumptionData {
    data: { day: string; lpg3kg: number; lpg12kg: number; lpg50kg: number }[];
}

export interface RecentActivity {
    id: string;
    action: string;
    title: string;
    description: string | null;
    timestamp: string;
    user: string;
}

export interface RecentActivitiesData {
    data: RecentActivity[];
}

/**
 * Dashboard API
 * 
 * PENJELASAN:
 * API untuk mengambil data dashboard seperti:
 * - Statistik KPI (orders hari ini, pending, completed, stock)
 * - Data chart (sales, stock, profit, top pangkalan)
 * - Aktivitas terbaru
 */
export const dashboardApi = {
    /**
     * Get KPI statistics for dashboard cards
     */
    async getStats(): Promise<DashboardStats> {
        return apiRequest('/dashboard/stats');
    },

    /**
     * Get sales chart data (7 days)
     */
    async getSalesChart(): Promise<SalesChartData> {
        return apiRequest('/dashboard/sales');
    },

    /**
     * Get stock trend chart data (7 days)
     */
    async getStockChart(): Promise<StockChartData> {
        return apiRequest('/dashboard/stock');
    },

    /**
     * Get profit chart data (7 days)
     */
    async getProfitChart(): Promise<ProfitChartData> {
        return apiRequest('/dashboard/profit');
    },

    /**
     * Get top 5 pangkalan by order count
     */
    async getTopPangkalan(): Promise<TopPangkalanData> {
        return apiRequest('/dashboard/top-pangkalan');
    },

    /**
     * Get stock consumption by LPG type (7 days)
     */
    async getStockConsumption(): Promise<StockConsumptionData> {
        return apiRequest('/dashboard/stock-consumption');
    },

    /**
     * Get recent activities (last 10)
     */
    async getRecentActivities(): Promise<RecentActivitiesData> {
        return apiRequest('/dashboard/activities');
    },
};

// ============================================================
// ORDERS API
// ============================================================

/**
 * Order Status - matches backend enum status_pesanan
 */
export type OrderStatus =
    | 'DRAFT'
    | 'MENUNGGU_PEMBAYARAN'
    | 'DIPROSES'
    | 'SIAP_KIRIM'
    | 'DIKIRIM'
    | 'SELESAI'
    | 'BATAL';

/**
 * Order Item interface
 */
export interface OrderItem {
    id: string;
    order_id: string;
    lpg_type: string;
    label: string;
    price_per_unit: number;
    qty: number;
    sub_total: number;
}

/**
 * Timeline Track for order status history
 */
export interface TimelineTrack {
    id: string;
    order_id: string;
    status: OrderStatus;
    description: string | null;
    note: string | null;
    created_at: string;
}

/**
 * Order interface - matches backend orders model
 */
export interface Order {
    id: string;
    code: string;  // Order code like ORD-0001
    pangkalan_id: string;
    driver_id: string | null;
    current_status: OrderStatus;
    note: string | null;
    total_amount: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    pangkalans?: Pangkalan;
    drivers?: Driver | null;
    order_items: OrderItem[];
    order_payment_details?: any[];
    timeline_tracks?: TimelineTrack[];
    invoices?: any[];
}

/**
 * Create Order DTO
 */
export interface CreateOrderDto {
    pangkalan_id: string;
    driver_id?: string;
    note?: string;
    items: {
        lpg_type: string;
        label: string;
        price_per_unit: number;
        qty: number;
    }[];
}

/**
 * Update Order Status DTO
 */
export interface UpdateOrderStatusDto {
    status: OrderStatus;
    description?: string;
    note?: string;
    payment_method?: 'TUNAI' | 'TRANSFER';  // For quick cash/transfer confirmation
}

/**
 * Orders list response with pagination
 */
export interface OrdersResponse {
    data: Order[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Orders API
 * 
 * PENJELASAN:
 * API untuk mengelola pesanan (orders):
 * - CRUD pesanan
 * - Update status pesanan
 * - Filter berdasarkan status, pangkalan, driver
 */
export const ordersApi = {
    /**
     * Get all orders with pagination, filters, and sorting
     */
    async getAll(
        page = 1,
        limit = 10,
        status?: OrderStatus,
        pangkalanId?: string,
        driverId?: string,
        sortBy: 'created_at' | 'total_amount' | 'code' | 'current_status' | 'pangkalan_name' = 'created_at',
        sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<OrdersResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (status) params.append('status', status);
        if (pangkalanId) params.append('pangkalan_id', pangkalanId);
        if (driverId) params.append('driver_id', driverId);
        params.append('sort_by', sortBy);
        params.append('sort_order', sortOrder);

        return apiRequest(`/orders?${params.toString()}`);
    },

    /**
     * Get order by ID with all relations
     */
    async getById(id: string): Promise<Order> {
        return apiRequest(`/orders/${id}`);
    },

    /**
     * Create new order
     */
    async create(dto: CreateOrderDto): Promise<Order> {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    },

    /**
     * Update order status with timeline tracking
     */
    async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
        return apiRequest(`/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(dto),
        });
    },

    /**
     * Update order details (note, driver, etc)
     * NOTE: Backend uses PUT not PATCH for this endpoint
     */
    async update(id: string, dto: Partial<{ driver_id: string; note: string }>): Promise<Order> {
        return apiRequest(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dto),
        });
    },

    /**
     * Delete order (soft delete)
     */
    async delete(id: string): Promise<{ message: string }> {
        return apiRequest(`/orders/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get order statistics by status
     * @param todayOnly - If true, only count today's orders
     */
    async getStats(todayOnly: boolean = false): Promise<OrderStats> {
        const params = todayOnly ? '?today=true' : '';
        return apiRequest(`/orders/stats${params}`);
    },
};

/**
 * Order Stats response interface
 */
export interface OrderStats {
    total: number;
    menunggu_pembayaran: number;
    diproses: number;
    siap_kirim: number;
    dikirim: number;
    selesai: number;
    batal: number;
    today_only: boolean;
}

// ============================================================
// PAYMENT API
// ============================================================

/**
 * Payment Method enum - sesuai dengan backend payment_method
 */
export type PaymentMethod = 'TUNAI' | 'TRANSFER';

/**
 * DTO untuk create payment record
 */
export interface CreatePaymentRecordDto {
    order_id?: string;
    invoice_id?: string;
    method: PaymentMethod;
    amount: number;
    proof_url?: string;
    note?: string;
}

/**
 * DTO untuk update order payment
 */
export interface UpdateOrderPaymentDto {
    is_paid?: boolean;
    is_dp?: boolean;
    payment_method?: PaymentMethod;
    amount_paid?: number;
    proof_url?: string;
}

/**
 * Order Payment Detail response
 */
export interface OrderPaymentDetail {
    id: string;
    order_id: string;
    is_paid: boolean;
    is_dp: boolean;
    payment_method: PaymentMethod | null;
    amount_paid: number;
    payment_date: string | null;
    proof_url: string | null;
    created_at: string;
    updated_at: string;
    orders?: {
        id: string;
        total_amount: number;
        pangkalans?: { name: string };
    };
}

/**
 * Payment Record response
 */
export interface PaymentRecord {
    id: string;
    order_id: string | null;
    invoice_id: string | null;
    method: PaymentMethod;
    amount: number;
    payment_time: string;
    proof_url: string | null;
    note: string | null;
    recorded_by_user_id: string;
    created_at: string;
    orders?: Order;
    users?: { id: string; name: string };
}

/**
 * Payment API - CRUD untuk payment records dan order payment
 * 
 * PENJELASAN:
 * - createRecord: Mencatat pembayaran baru
 * - getOrderPayment: Get detail pembayaran order
 * - updateOrderPayment: Update status pembayaran order
 */
export const paymentApi = {
    /**
     * Create payment record
     * Mencatat pembayaran baru untuk order/invoice
     */
    async createRecord(dto: CreatePaymentRecordDto): Promise<PaymentRecord> {
        return apiRequest('/payments/records', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    },

    /**
     * Get all payment records with pagination
     */
    async getRecords(
        page = 1,
        limit = 10,
        orderId?: string,
        method?: PaymentMethod
    ): Promise<{ data: PaymentRecord[]; meta: { total: number; page: number; limit: number } }> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (orderId) params.append('order_id', orderId);
        if (method) params.append('method', method);

        return apiRequest(`/payments/records?${params.toString()}`);
    },

    /**
     * Get payment record by ID
     */
    async getRecordById(id: string): Promise<PaymentRecord> {
        return apiRequest(`/payments/records/${id}`);
    },

    /**
     * Get order payment detail
     */
    async getOrderPayment(orderId: string): Promise<OrderPaymentDetail> {
        return apiRequest(`/payments/orders/${orderId}`);
    },

    /**
     * Update order payment status
     * Gunakan untuk menandai order sebagai lunas
     */
    async updateOrderPayment(orderId: string, dto: UpdateOrderPaymentDto): Promise<OrderPaymentDetail> {
        return apiRequest(`/payments/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify(dto),
        });
    },
};

// ============================================================
// CONSUMER API (Pangkalan Dashboard)
// ============================================================

// Consumer type for categorization
export type ConsumerType = 'RUMAH_TANGGA' | 'WARUNG';

export interface Consumer {
    id: string;
    pangkalan_id: string;
    name: string;
    nik: string | null;           // NIK for subsidy verification (16 digits)
    kk: string | null;            // Nomor KK for household ID (16 digits)
    consumer_type: ConsumerType | null;  // Consumer category
    phone: string | null;
    address: string | null;
    note: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    _count?: {
        consumer_orders: number;
    };
}

export interface ConsumerStats {
    total: number;
    active: number;
    inactive: number;
    rumahTangga: number;  // Count of RUMAH_TANGGA consumers
    warung: number;       // Count of WARUNG consumers
    withNik: number;      // Count of consumers with NIK verified
}

export const consumersApi = {
    async getAll(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Consumer>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (search) params.append('search', search);
        return apiRequest(`/consumers?${params.toString()}`);
    },

    async getById(id: string): Promise<Consumer> {
        return apiRequest(`/consumers/${id}`);
    },

    async getStats(): Promise<ConsumerStats> {
        return apiRequest('/consumers/stats');
    },

    async create(data: { name: string; nik?: string; kk?: string; phone?: string; address?: string; note?: string }): Promise<Consumer> {
        return apiRequest('/consumers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<Consumer>): Promise<Consumer> {
        return apiRequest(`/consumers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<{ message: string }> {
        return apiRequest(`/consumers/${id}`, { method: 'DELETE' });
    },
};

// ============================================================
// CONSUMER ORDER API (Pangkalan Dashboard)
// ============================================================


export type ConsumerPaymentStatus = 'LUNAS' | 'HUTANG';

export interface ConsumerOrder {
    id: string;
    code: string;
    pangkalan_id: string;
    consumer_id: string | null;
    consumer_name: string | null;
    lpg_type: LpgType;
    qty: number;
    price_per_unit: number;
    total_amount: number;
    payment_status: ConsumerPaymentStatus;
    note: string | null;
    sale_date: string;
    created_at: string;
    consumers?: {
        id: string;
        name: string;
        phone: string | null;
    } | null;
}

export interface ConsumerOrderStats {
    total_orders: number;
    total_qty: number;
    total_revenue: number;
    total_modal: number;      // Total modal (qty * cost_price)
    margin_kotor: number;     // Penjualan - Modal
    total_pengeluaran: number; // Total pengeluaran hari ini
    laba_bersih: number;      // Margin Kotor - Pengeluaran
}

export const consumerOrdersApi = {
    async getAll(
        page = 1,
        limit = 10,
        options?: {
            startDate?: string;
            endDate?: string;
            paymentStatus?: ConsumerPaymentStatus;
            consumerId?: string;
        }
    ): Promise<PaginatedResponse<ConsumerOrder>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (options?.startDate) params.append('startDate', options.startDate);
        if (options?.endDate) params.append('endDate', options.endDate);
        if (options?.paymentStatus) params.append('paymentStatus', options.paymentStatus);
        if (options?.consumerId) params.append('consumerId', options.consumerId);
        return apiRequest(`/consumer-orders?${params.toString()}`);
    },

    async getById(id: string): Promise<ConsumerOrder> {
        return apiRequest(`/consumer-orders/${id}`);
    },

    async getStats(todayOnly = false): Promise<ConsumerOrderStats> {
        const params = todayOnly ? '?today=true' : '';
        return apiRequest(`/consumer-orders/stats${params}`);
    },

    async getRecent(limit = 5): Promise<ConsumerOrder[]> {
        return apiRequest(`/consumer-orders/recent?limit=${limit}`);
    },

    async create(data: {
        consumer_id?: string;
        consumer_name?: string;
        lpg_type: LpgType;
        qty: number;
        price_per_unit: number;
        payment_status?: ConsumerPaymentStatus;
        note?: string;
    }): Promise<ConsumerOrder> {
        return apiRequest('/consumer-orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<ConsumerOrder>): Promise<ConsumerOrder> {
        return apiRequest(`/consumer-orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<{ message: string }> {
        return apiRequest(`/consumer-orders/${id}`, { method: 'DELETE' });
    },

    async getChartData(): Promise<ChartDataPoint[]> {
        return apiRequest('/consumer-orders/chart-data');
    },
};

// Chart data point for 7-day trend
export interface ChartDataPoint {
    day: string;
    date: string;
    penjualan: number;
    modal: number;
    pengeluaran: number;
    laba: number;
}

// Pangkalan Stock types
export interface StockLevel {
    id: string;
    lpg_type: LpgType;
    qty: number;
    warning_level: number;
    critical_level: number;
    status: 'AMAN' | 'RENDAH' | 'KRITIS';
    updated_at: string;
}

export interface StockLevelsResponse {
    stocks: StockLevel[];
    summary: {
        total: number;
        hasWarning: boolean;
        hasCritical: boolean;
    };
}

/**
 * Stock Movement type for pangkalan stock movements history
 */
export interface PangkalanStockMovement {
    id: string;
    pangkalan_id: string;
    lpg_type: string;
    movement_type: 'MASUK' | 'KELUAR' | 'IN' | 'OUT'; // Support both formats
    qty: number;
    source: string | null;
    reference_id: string | null;
    note: string | null;
    movement_date: string;
    created_at: string;
}

// Pangkalan Stock API
export const pangkalanStockApi = {
    async getStockLevels(): Promise<StockLevelsResponse> {
        return apiRequest('/pangkalan-stocks');
    },

    /**
     * Get stock movement history
     */
    async getMovements(options?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
        lpgType?: string;
    }): Promise<PangkalanStockMovement[]> {
        const params = new URLSearchParams();
        if (options?.startDate) params.append('startDate', options.startDate);
        if (options?.endDate) params.append('endDate', options.endDate);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.lpgType) params.append('lpgType', options.lpgType);
        return apiRequest(`/pangkalan-stocks/movements?${params.toString()}`);
    },

    async receiveStock(data: {
        lpg_type: LpgType;
        qty: number;
        note?: string;
        movement_date?: string;
    }): Promise<{ message: string; newQty: number }> {
        return apiRequest('/pangkalan-stocks/receive', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async adjustStock(data: {
        lpg_type: LpgType;
        actual_qty: number;
        note?: string;
    }): Promise<{ message: string; oldQty: number; newQty: number; difference: number }> {
        return apiRequest('/pangkalan-stocks/adjust', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================
// AGEN ORDERS API (Orders from Pangkalan to Agen)
// ============================================================

export type AgenOrderStatus = 'PENDING' | 'DIKIRIM' | 'DITERIMA' | 'BATAL';

export interface AgenOrder {
    id: string;
    code: string;
    pangkalan_id: string;
    agen_id: string | null;
    lpg_type: LpgType;
    qty_ordered: number;
    qty_received: number;
    status: AgenOrderStatus;
    order_date: string;
    received_date: string | null;
    note: string | null;
    created_at: string;
    updated_at: string;
    agen?: {
        name: string;
        phone: string | null;
    };
}

export interface AgenOrderStats {
    pending: number;
    dikirim: number;
    diterima: number;
    batal: number;
    total: number;
}

export const agenOrdersApi = {
    /**
     * Get all agen orders for pangkalan
     */
    async getOrders(status?: string): Promise<AgenOrder[]> {
        const params = status && status !== 'all' ? `?status=${status}` : '';
        return apiRequest(`/agen-orders${params}`);
    },

    /**
     * Get order statistics
     */
    async getStats(): Promise<AgenOrderStats> {
        return apiRequest('/agen-orders/stats');
    },

    /**
     * Get single order
     */
    async getOrder(id: string): Promise<AgenOrder> {
        return apiRequest(`/agen-orders/${id}`);
    },

    /**
     * Create new order to agen
     */
    async createOrder(data: {
        lpg_type: string;
        qty: number;
        note?: string;
    }): Promise<AgenOrder> {
        return apiRequest('/agen-orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Receive order and update stock
     */
    async receiveOrder(id: string, data: {
        qty_received: number;
        note?: string;
    }): Promise<AgenOrder> {
        return apiRequest(`/agen-orders/${id}/receive`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    /**
     * Cancel order
     */
    async cancelOrder(id: string): Promise<AgenOrder> {
        return apiRequest(`/agen-orders/${id}/cancel`, {
            method: 'PATCH',
        });
    },
};

// ============================================================
// EXPENSE API (Pangkalan Dashboard)
// ============================================================

export type ExpenseCategory = 'OPERASIONAL' | 'TRANSPORT' | 'SEWA' | 'LISTRIK' | 'GAJI' | 'LAINNYA';

export interface Expense {
    id: string;
    pangkalan_id: string;
    category: ExpenseCategory;
    amount: number;
    description: string | null;
    expense_date: string;
    created_at: string;
    updated_at: string;
}

export const expensesApi = {
    async getAll(startDate?: string, endDate?: string): Promise<Expense[]> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const queryString = params.toString();
        return apiRequest(`/expenses${queryString ? `?${queryString}` : ''}`);
    },

    async getById(id: string): Promise<Expense> {
        return apiRequest(`/expenses/${id}`);
    },

    async create(data: {
        category: ExpenseCategory;
        amount: number;
        description?: string;
        expense_date?: string;
    }): Promise<Expense> {
        return apiRequest('/expenses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: {
        category?: ExpenseCategory;
        amount?: number;
        description?: string;
        expense_date?: string;
    }): Promise<Expense> {
        return apiRequest(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<{ message: string }> {
        return apiRequest(`/expenses/${id}`, { method: 'DELETE' });
    },

    async getSummary(startDate: string, endDate: string): Promise<{
        total: number;
        count: number;
        byCategory: Record<string, number>;
        byDate: Record<string, number>;
    }> {
        return apiRequest(`/expenses/summary?startDate=${startDate}&endDate=${endDate}`);
    },
};

// ========================
// LPG PRICES API (Pangkalan Price Settings)
// ========================

/**
 * Pangkalan LPG Price type (for price settings per pangkalan)
 */
export interface PangkalanLpgPrice {
    id: string;
    pangkalan_id: string;
    lpg_type: string;
    cost_price: number;
    selling_price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * LPG Prices API
 * Untuk mengelola harga default LPG per pangkalan
 */
export const lpgPricesApi = {
    /**
     * Get all LPG prices for current pangkalan
     */
    async getAll(): Promise<PangkalanLpgPrice[]> {
        return apiRequest('/lpg-prices');
    },

    /**
     * Update a single price
     */
    async update(id: string, data: {
        cost_price?: number;
        selling_price?: number;
        is_active?: boolean;
    }): Promise<PangkalanLpgPrice> {
        return apiRequest(`/lpg-prices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Bulk update all prices
     */
    async bulkUpdate(prices: {
        lpg_type: string;
        cost_price: number;
        selling_price: number;
        is_active?: boolean;
    }[]): Promise<PangkalanLpgPrice[]> {
        return apiRequest('/lpg-prices/bulk', {
            method: 'POST',
            body: JSON.stringify({ prices }),
        });
    },
};

// ========================
// AGEN API (LPG Distributor/Supplier)
// ========================

/**
 * Agen (Distributor) interface
 */
export interface Agen {
    id: string;
    code: string;
    name: string;
    address: string | null;
    pic_name: string | null;
    phone: string | null;
    email: string | null;
    note: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Agen API - Manage agen (distributor) data
 */
export const agenApi = {
    /**
     * Get agen linked to current pangkalan
     */
    async getMyAgen(): Promise<Agen | null> {
        return apiRequest('/agen/my-agen');
    },

    /**
     * Get all agen (for admin or selection dropdown)
     */
    async getAll(): Promise<Agen[]> {
        return apiRequest('/agen');
    },

    /**
     * Get all active agen for selection
     */
    async getAllActive(): Promise<Agen[]> {
        const all = await apiRequest<Agen[]>('/agen');
        return all.filter(a => a.is_active);
    },

    /**
     * Create new agen
     */
    async create(data: {
        code: string;
        name: string;
        phone?: string;
        address?: string;
        pic_name?: string;
        email?: string;
        note?: string;
    }): Promise<Agen> {
        return apiRequest('/agen', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Update agen
     */
    async update(id: string, data: Partial<Agen>): Promise<Agen> {
        return apiRequest(`/agen/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete agen
     */
    async delete(id: string): Promise<void> {
        return apiRequest(`/agen/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Link current pangkalan to an agen
     */
    async linkToAgen(agenId: string): Promise<{ message: string }> {
        return apiRequest('/agen/link', {
            method: 'POST',
            body: JSON.stringify({ agen_id: agenId }),
        });
    },
};

// ============================================================
// PERTAMINA INTEGRATION APIS
// ============================================================

// --- PERENCANAAN (PLANNING) ---

export interface PerencanaanHarian {
    id: string;
    pangkalan_id: string;
    tanggal: string;
    jumlah: number;
    kondisi: 'NORMAL' | 'FAKULTATIF';
    alokasi_bulan: number;
    pangkalans?: {
        id: string;
        code: string;
        name: string;
        alokasi_bulanan: number;
        is_active: boolean;
    };
    created_at: string;
    updated_at: string;
}

export interface PerencanaanRekapitulasiItem {
    id_registrasi: string;
    nama_pangkalan: string;
    pangkalan_id: string;
    alokasi: number;
    status: string;
    daily: Record<number, number>;
    total_normal: number;
    total_fakultatif: number;
    sisa_alokasi: number;
    grand_total: number;
}

export interface PerencanaanRekapitulasiResponse {
    bulan: string;
    days_in_month: number;
    data: PerencanaanRekapitulasiItem[];
}

export const perencanaanApi = {
    async getAll(params?: {
        pangkalan_id?: string;
        bulan?: string;
        tanggal_awal?: string;
        tanggal_akhir?: string;
        kondisi?: 'NORMAL' | 'FAKULTATIF';
    }): Promise<PerencanaanHarian[]> {
        const urlParams = new URLSearchParams();
        if (params?.pangkalan_id) urlParams.append('pangkalan_id', params.pangkalan_id);
        if (params?.bulan) urlParams.append('bulan', params.bulan);
        if (params?.tanggal_awal) urlParams.append('tanggal_awal', params.tanggal_awal);
        if (params?.tanggal_akhir) urlParams.append('tanggal_akhir', params.tanggal_akhir);
        if (params?.kondisi) urlParams.append('kondisi', params.kondisi);
        return apiRequest(`/perencanaan?${urlParams.toString()}`);
    },

    async getRekapitulasi(bulan: string, kondisi?: string, lpgType?: string): Promise<PerencanaanRekapitulasiResponse> {
        const params = new URLSearchParams({ bulan });
        if (kondisi) params.append('kondisi', kondisi);
        if (lpgType) params.append('lpg_type', lpgType);
        return apiRequest(`/perencanaan/rekapitulasi?${params.toString()}`);
    },

    async create(data: {
        pangkalan_id: string;
        tanggal: string;
        jumlah: number;
        kondisi?: 'NORMAL' | 'FAKULTATIF';
        alokasi_bulan?: number;
    }): Promise<PerencanaanHarian> {
        return apiRequest('/perencanaan', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async bulkUpdate(data: {
        pangkalan_id: string;
        tanggal_awal: string;
        tanggal_akhir: string;
        kondisi?: 'NORMAL' | 'FAKULTATIF';
        data: { tanggal: string; jumlah: number }[];
    }): Promise<PerencanaanHarian[]> {
        return apiRequest('/perencanaan/bulk', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: {
        jumlah?: number;
        kondisi?: 'NORMAL' | 'FAKULTATIF';
    }): Promise<PerencanaanHarian> {
        return apiRequest(`/perencanaan/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiRequest(`/perencanaan/${id}`, { method: 'DELETE' });
    },

    async autoGenerate(data: {
        bulan: string;
        lpg_type?: string;
        kondisi?: 'NORMAL' | 'FAKULTATIF';
        overwrite?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        details: {
            bulan: string;
            lpg_type: string;
            kondisi: string;
            total_pangkalan: number;
            skipped_no_alokasi: number;
            work_days: number;
            deleted_records: number;
            created_records: number;
            duration_ms: number;
        };
    }> {
        return apiRequest('/perencanaan/auto-generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// --- PENYALURAN (DISTRIBUTION) ---

export interface PenyaluranHarian {
    id: string;
    pangkalan_id: string;
    tanggal: string;
    jumlah: number;
    tipe_pembayaran: string;
    pangkalans?: {
        id: string;
        code: string;
        name: string;
        alokasi_bulanan: number;
        is_active: boolean;
    };
    created_at: string;
    updated_at: string;
}

export interface PenyaluranRekapitulasiItem {
    id_registrasi: string;
    nama_pangkalan: string;
    pangkalan_id: string;
    alokasi: number;
    status: string;
    daily: Record<number, number>;
    total_normal: number;
    total_fakultatif: number;
    sisa_alokasi: number;
    grand_total: number;
}

export interface PenyaluranRekapitulasiResponse {
    bulan: string;
    days_in_month: number;
    data: PenyaluranRekapitulasiItem[];
}

export const penyaluranApi = {
    async getAll(params?: {
        pangkalan_id?: string;
        bulan?: string;
        tanggal_awal?: string;
        tanggal_akhir?: string;
        tipe_pembayaran?: string;
    }): Promise<PenyaluranHarian[]> {
        const urlParams = new URLSearchParams();
        if (params?.pangkalan_id) urlParams.append('pangkalan_id', params.pangkalan_id);
        if (params?.bulan) urlParams.append('bulan', params.bulan);
        if (params?.tanggal_awal) urlParams.append('tanggal_awal', params.tanggal_awal);
        if (params?.tanggal_akhir) urlParams.append('tanggal_akhir', params.tanggal_akhir);
        if (params?.tipe_pembayaran) urlParams.append('tipe_pembayaran', params.tipe_pembayaran);
        return apiRequest(`/penyaluran?${urlParams.toString()}`);
    },

    async getRekapitulasi(bulan: string, tipePembayaran?: string, lpgType?: string): Promise<PenyaluranRekapitulasiResponse> {
        const params = new URLSearchParams({ bulan });
        if (tipePembayaran) params.append('tipe_pembayaran', tipePembayaran);
        if (lpgType) params.append('lpg_type', lpgType);
        return apiRequest(`/penyaluran/rekapitulasi?${params.toString()}`);
    },

    async create(data: {
        pangkalan_id: string;
        tanggal: string;
        jumlah: number;
        tipe_pembayaran?: string;
    }): Promise<PenyaluranHarian> {
        return apiRequest('/penyaluran', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async bulkUpdate(data: {
        pangkalan_id: string;
        tanggal_awal: string;
        tanggal_akhir: string;
        tipe_pembayaran?: string;
        data: { tanggal: string; jumlah: number }[];
    }): Promise<PenyaluranHarian[]> {
        return apiRequest('/penyaluran/bulk', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: {
        jumlah?: number;
        tipe_pembayaran?: string;
    }): Promise<PenyaluranHarian> {
        return apiRequest(`/penyaluran/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiRequest(`/penyaluran/${id}`, { method: 'DELETE' });
    },

    /**
     * Create fakultatif (exception) penyaluran
     * Used for manual penyaluran entries outside of normal order flow
     */
    async createFakultatif(data: {
        pangkalan_id: string;
        tanggal: string;
        lpg_type: string;
        jumlah: number;
        kondisi: 'FAKULTATIF';
        catatan?: string;
    }): Promise<PenyaluranHarian> {
        return apiRequest('/penyaluran', {
            method: 'POST',
            body: JSON.stringify({
                ...data,
                tipe_pembayaran: 'CASHLESS', // Default for fakultatif
            }),
        });
    },
};

// --- PENERIMAAN (STOCK RECEIPT) ---

export interface PenerimaanStok {
    id: string;
    no_so: string;
    no_lo: string;
    nama_material: string;
    qty_pcs: number;
    qty_kg: number;
    tanggal: string;
    sumber: string | null;
    created_at: string;
    updated_at: string;
}

export interface InOutAgenDaily {
    stok_awal: number;
    penerimaan: number;
    penyaluran: number;
    stok_akhir: number;
}

export interface InOutAgenResponse {
    bulan: string;
    days_in_month: number;
    stok_awal_bulan: number;
    stok_akhir_bulan: number;
    total_penerimaan: number;
    total_penyaluran: number;
    daily: Record<number, InOutAgenDaily>;
}

export const penerimaanApi = {
    async getAll(params?: {
        bulan?: string;
        tanggal_awal?: string;
        tanggal_akhir?: string;
        sumber?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<PenerimaanStok>> {
        const urlParams = new URLSearchParams();
        if (params?.bulan) urlParams.append('bulan', params.bulan);
        if (params?.tanggal_awal) urlParams.append('tanggal_awal', params.tanggal_awal);
        if (params?.tanggal_akhir) urlParams.append('tanggal_akhir', params.tanggal_akhir);
        if (params?.sumber) urlParams.append('sumber', params.sumber);
        if (params?.page) urlParams.append('page', params.page.toString());
        if (params?.limit) urlParams.append('limit', params.limit.toString());
        return apiRequest(`/penerimaan?${urlParams.toString()}`);
    },

    async create(data: {
        no_so: string;
        no_lo: string;
        nama_material: string;
        qty_pcs: number;
        qty_kg: number;
        tanggal: string;
        sumber?: string;
        lpg_product_id?: string; // Link to product for chart integration
    }): Promise<PenerimaanStok> {
        return apiRequest('/penerimaan', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiRequest(`/penerimaan/${id}`, { method: 'DELETE' });
    },

    async getInOutAgen(bulan: string): Promise<InOutAgenResponse> {
        return apiRequest(`/penerimaan/in-out-agen?bulan=${bulan}`);
    },
};
