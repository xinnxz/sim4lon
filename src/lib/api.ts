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
    code: string;  // Pangkalan code like PKL-0001
    name: string;
    address: string;
    region: string | null;
    pic_name: string | null;
    phone: string | null;
    email: string | null;  // Email for sending invoices
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
    price: number;
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
    description: string | null;
    is_active: boolean;
    prices: LpgPrice[];
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
     * Create new LPG product
     */
    async create(data: {
        name: string;
        size_kg: number;
        category: LpgCategory;
        color?: string;
        description?: string;
        prices?: { label: string; price: number; is_default?: boolean }[];
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
        description?: string;
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

export type LpgType = '3kg' | '12kg' | '50kg';
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

export type UserRole = 'ADMIN' | 'OPERATOR';

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
     */
    async getAll(
        page = 1,
        limit = 10,
        search?: string
    ): Promise<PaginatedResponse<User>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);

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
    data: { day: string; stock: number }[];
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
     * Get all orders with pagination and filters
     */
    async getAll(
        page = 1,
        limit = 10,
        status?: OrderStatus,
        pangkalanId?: string,
        driverId?: string
    ): Promise<OrdersResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (status) params.append('status', status);
        if (pangkalanId) params.append('pangkalanId', pangkalanId);
        if (driverId) params.append('driverId', driverId);

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
};

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
