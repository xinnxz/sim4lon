import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { lazy, Suspense, createElement, useState, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { e as cn } from "./card.xR1H4xxx.js";
import { Circle } from "lucide-react";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const iconCache = /* @__PURE__ */ new Map();
function SafeIcon({ name, ...props }) {
  if (!iconCache.has(name)) {
    try {
      const IconComponent2 = lazy(
        () => import("lucide-react").then((module) => {
          const icon = module[name];
          if (!icon) {
            console.warn(`Icon "${name}" not found in lucide-react, using fallback`);
            return { default: Circle };
          }
          return { default: icon };
        }).catch(() => {
          console.warn(`Failed to load icon "${name}", using fallback`);
          return { default: Circle };
        })
      );
      iconCache.set(name, IconComponent2);
    } catch {
      iconCache.set(name, Circle);
    }
  }
  const IconComponent = iconCache.get(name) || Circle;
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Circle, { ...props }), children: createElement(IconComponent, props) });
}
const API_BASE_URL = "http://localhost:3000/api";
const TOKEN_KEY = "sim4lon_token";
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}
function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}
function isAuthenticated() {
  return !!getToken();
}
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
}
const authApi = {
  async login(data) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    });
    setToken(response.access_token);
    return response;
  },
  async getProfile() {
    return apiRequest("/auth/profile");
  },
  async updateProfile(data) {
    return apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async changePassword(data) {
    return apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  logout() {
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};
const uploadApi = {
  /**
   * Upload avatar image (max 2MB, images only)
   */
  async uploadAvatar(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/upload/avatar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Upload gagal");
    }
    return data;
  }
};
const notificationApi = {
  async getNotifications(limit = 10) {
    return apiRequest(`/notifications?limit=${limit}`);
  },
  async markAllAsRead() {
    return apiRequest("/notifications/mark-all-read", { method: "POST" });
  }
};
const agenPangkalanOrdersApi = {
  /**
   * Get all orders from all pangkalan (agen view)
   */
  async getAll(status) {
    const params = status && status !== "all" ? `?status=${status}` : "";
    return apiRequest(`/agen-orders/agen/all${params}`);
  },
  /**
   * Get stats for agen
   */
  async getStats() {
    return apiRequest("/agen-orders/agen/stats");
  },
  /**
   * Confirm order (PENDING -> DIKIRIM)
   */
  async confirm(id) {
    return apiRequest(`/agen-orders/agen/${id}/confirm`, { method: "PATCH" });
  },
  /**
   * Complete order (DIKIRIM -> DITERIMA)
   */
  async complete(id, qtyReceived) {
    return apiRequest(`/agen-orders/agen/${id}/complete`, {
      method: "PATCH",
      body: JSON.stringify({ qty_received: qtyReceived })
    });
  },
  /**
   * Cancel order from agen
   */
  async cancel(id) {
    return apiRequest(`/agen-orders/agen/${id}/cancel`, { method: "PATCH" });
  }
};
const activityApi = {
  /**
   * Get all activities with pagination and filter
   */
  async getAll(page = 1, limit = 20, type) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (type && type !== "all") params.append("type", type);
    return apiRequest(`/activities?${params.toString()}`);
  },
  /**
   * Get recent activities
   */
  async getRecent(limit = 10) {
    return apiRequest(`/activities/recent?limit=${limit}`);
  },
  /**
   * Get activities by type
   */
  async getByType(type, limit = 20) {
    return apiRequest(`/activities/by-type?type=${type}&limit=${limit}`);
  }
};
const companyProfileApi = {
  /**
   * Get company profile (singleton)
   */
  async get() {
    return apiRequest("/company-profile");
  },
  /**
   * Update company profile
   */
  async update(data) {
    return apiRequest("/company-profile", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
};
const reportsApi = {
  async getSalesReport(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiRequest(`/reports/sales?${params.toString()}`);
  },
  async getPaymentsReport(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiRequest(`/reports/payments?${params.toString()}`);
  },
  async getStockMovementReport(startDate, endDate, productId) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (productId) params.append("productId", productId);
    return apiRequest(`/reports/stock-movement?${params.toString()}`);
  },
  /**
   * Get pangkalan analytics report with subsidi distribution stats
   */
  async getPangkalanReport(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiRequest(`/reports/pangkalan?${params.toString()}`);
  },
  /**
   * Get subsidi consumers for a specific pangkalan (for audit)
   */
  async getSubsidiConsumers(pangkalanId, startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiRequest(`/reports/pangkalan/${pangkalanId}/consumers?${params.toString()}`);
  }
};
const pangkalanApi = {
  /**
   * Get all pangkalan with pagination, search, and filter
   * @param page - Page number (default 1)
   * @param limit - Items per page (default 10)
   * @param search - Search by name, region, or PIC name
   * @param isActive - Filter by active status
   */
  async getAll(page = 1, limit = 10, search, isActive) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (isActive !== void 0) params.append("is_active", isActive.toString());
    return apiRequest(`/pangkalans?${params.toString()}`);
  },
  async getById(id) {
    return apiRequest(`/pangkalans/${id}`);
  },
  async create(data) {
    return apiRequest("/pangkalans", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/pangkalans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/pangkalans/${id}`, { method: "DELETE" });
  }
};
const driversApi = {
  /**
   * Get all drivers with pagination and filter
   * @param page - Page number (default 1)
   * @param limit - Items per page (default 10)
   * @param search - Search by name
   * @param isActive - Filter by active status
   */
  async getAll(page = 1, limit = 10, search, isActive) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (isActive !== void 0) params.append("is_active", isActive.toString());
    return apiRequest(`/drivers?${params.toString()}`);
  },
  async getById(id) {
    return apiRequest(`/drivers/${id}`);
  },
  async create(data) {
    return apiRequest("/drivers", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/drivers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/drivers/${id}`, { method: "DELETE" });
  }
};
const lpgProductsApi = {
  /**
   * Get all LPG products
   */
  async getAll(includeInactive = false) {
    const params = includeInactive ? "?includeInactive=true" : "";
    return apiRequest(`/lpg-products${params}`);
  },
  /**
   * Get all LPG products with stock summary
   */
  async getWithStock() {
    return apiRequest("/lpg-products/with-stock");
  },
  /**
   * Get single product by ID
   */
  async getOne(id) {
    return apiRequest(`/lpg-products/${id}`);
  },
  /**
   * Create new LPG product (simplified pricing)
   */
  async create(data) {
    return apiRequest("/lpg-products", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  /**
   * Update LPG product
   */
  async update(id, data) {
    return apiRequest(`/lpg-products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  /**
   * Delete LPG product
   */
  async delete(id) {
    return apiRequest(`/lpg-products/${id}`, { method: "DELETE" });
  },
  /**
   * Add price variant to product
   */
  async addPrice(productId, data) {
    return apiRequest(`/lpg-products/${productId}/prices`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  /**
   * Update price variant
   */
  async updatePrice(priceId, data) {
    return apiRequest(`/lpg-products/prices/${priceId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  /**
   * Delete price variant
   */
  async deletePrice(priceId) {
    return apiRequest(`/lpg-products/prices/${priceId}`, { method: "DELETE" });
  }
};
const usersApi = {
  /**
   * Get all users with pagination
   * Requires ADMIN role
   * @param excludeRoles - Array of roles to exclude (e.g., ['PANGKALAN'])
   */
  async getAll(page = 1, limit = 10, search, excludeRoles) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (excludeRoles && excludeRoles.length > 0) {
      params.append("exclude_roles", excludeRoles.join(","));
    }
    return apiRequest(`/users?${params.toString()}`);
  },
  async getById(id) {
    return apiRequest(`/users/${id}`);
  },
  async create(data) {
    return apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/users/${id}`, { method: "DELETE" });
  },
  /**
   * Reset password user - admin only
   * @returns new plain text password untuk diberikan ke user
   */
  async resetPassword(id) {
    return apiRequest(`/users/${id}/reset-password`, {
      method: "POST"
    });
  }
};
const dashboardApi = {
  /**
   * Get KPI statistics for dashboard cards
   */
  async getStats() {
    return apiRequest("/dashboard/stats");
  },
  /**
   * Get sales chart data (7 days)
   */
  async getSalesChart() {
    return apiRequest("/dashboard/sales");
  },
  /**
   * Get stock trend chart data (7 days)
   */
  async getStockChart() {
    return apiRequest("/dashboard/stock");
  },
  /**
   * Get profit chart data (7 days)
   */
  async getProfitChart() {
    return apiRequest("/dashboard/profit");
  },
  /**
   * Get top 5 pangkalan by order count
   */
  async getTopPangkalan() {
    return apiRequest("/dashboard/top-pangkalan");
  },
  /**
   * Get stock consumption by LPG type (7 days)
   */
  async getStockConsumption() {
    return apiRequest("/dashboard/stock-consumption");
  },
  /**
   * Get recent activities (last 10)
   */
  async getRecentActivities() {
    return apiRequest("/dashboard/activities");
  }
};
const ordersApi = {
  /**
   * Get all orders with pagination, filters, and sorting
   */
  async getAll(page = 1, limit = 10, status, pangkalanId, driverId, sortBy = "created_at", sortOrder = "desc") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (status) params.append("status", status);
    if (pangkalanId) params.append("pangkalan_id", pangkalanId);
    if (driverId) params.append("driver_id", driverId);
    params.append("sort_by", sortBy);
    params.append("sort_order", sortOrder);
    return apiRequest(`/orders?${params.toString()}`);
  },
  /**
   * Get order by ID with all relations
   */
  async getById(id) {
    return apiRequest(`/orders/${id}`);
  },
  /**
   * Create new order
   */
  async create(dto) {
    return apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(dto)
    });
  },
  /**
   * Update order status with timeline tracking
   */
  async updateStatus(id, dto) {
    return apiRequest(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(dto)
    });
  },
  /**
   * Update order details (note, driver, etc)
   * NOTE: Backend uses PUT not PATCH for this endpoint
   */
  async update(id, dto) {
    return apiRequest(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto)
    });
  },
  /**
   * Delete order (soft delete)
   */
  async delete(id) {
    return apiRequest(`/orders/${id}`, {
      method: "DELETE"
    });
  },
  /**
   * Get order statistics by status
   * @param todayOnly - If true, only count today's orders
   */
  async getStats(todayOnly = false) {
    const params = todayOnly ? "?today=true" : "";
    return apiRequest(`/orders/stats${params}`);
  }
};
const paymentApi = {
  /**
   * Create payment record
   * Mencatat pembayaran baru untuk order/invoice
   */
  async createRecord(dto) {
    return apiRequest("/payments/records", {
      method: "POST",
      body: JSON.stringify(dto)
    });
  },
  /**
   * Get all payment records with pagination
   */
  async getRecords(page = 1, limit = 10, orderId, method) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (orderId) params.append("order_id", orderId);
    if (method) params.append("method", method);
    return apiRequest(`/payments/records?${params.toString()}`);
  },
  /**
   * Get payment record by ID
   */
  async getRecordById(id) {
    return apiRequest(`/payments/records/${id}`);
  },
  /**
   * Get order payment detail
   */
  async getOrderPayment(orderId) {
    return apiRequest(`/payments/orders/${orderId}`);
  },
  /**
   * Update order payment status
   * Gunakan untuk menandai order sebagai lunas
   */
  async updateOrderPayment(orderId, dto) {
    return apiRequest(`/payments/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(dto)
    });
  }
};
const consumersApi = {
  async getAll(page = 1, limit = 10, search) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (search) params.append("search", search);
    return apiRequest(`/consumers?${params.toString()}`);
  },
  async getById(id) {
    return apiRequest(`/consumers/${id}`);
  },
  async getStats() {
    return apiRequest("/consumers/stats");
  },
  async create(data) {
    return apiRequest("/consumers", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/consumers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/consumers/${id}`, { method: "DELETE" });
  }
};
const consumerOrdersApi = {
  async getAll(page = 1, limit = 10, options) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (options?.startDate) params.append("startDate", options.startDate);
    if (options?.endDate) params.append("endDate", options.endDate);
    if (options?.paymentStatus) params.append("paymentStatus", options.paymentStatus);
    if (options?.consumerId) params.append("consumerId", options.consumerId);
    return apiRequest(`/consumer-orders?${params.toString()}`);
  },
  async getById(id) {
    return apiRequest(`/consumer-orders/${id}`);
  },
  async getStats(todayOnly = false) {
    const params = todayOnly ? "?today=true" : "";
    return apiRequest(`/consumer-orders/stats${params}`);
  },
  async getRecent(limit = 5) {
    return apiRequest(`/consumer-orders/recent?limit=${limit}`);
  },
  async create(data) {
    return apiRequest("/consumer-orders", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/consumer-orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/consumer-orders/${id}`, { method: "DELETE" });
  },
  async getChartData() {
    return apiRequest("/consumer-orders/chart-data");
  }
};
const pangkalanStockApi = {
  async getStockLevels() {
    return apiRequest("/pangkalan-stocks");
  },
  /**
   * Get stock movement history
   */
  async getMovements(options) {
    const params = new URLSearchParams();
    if (options?.startDate) params.append("startDate", options.startDate);
    if (options?.endDate) params.append("endDate", options.endDate);
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.lpgType) params.append("lpgType", options.lpgType);
    return apiRequest(`/pangkalan-stocks/movements?${params.toString()}`);
  },
  async receiveStock(data) {
    return apiRequest("/pangkalan-stocks/receive", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async adjustStock(data) {
    return apiRequest("/pangkalan-stocks/adjust", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};
const agenOrdersApi = {
  /**
   * Get all agen orders for pangkalan
   */
  async getOrders(status) {
    const params = status && status !== "all" ? `?status=${status}` : "";
    return apiRequest(`/agen-orders${params}`);
  },
  /**
   * Get order statistics
   */
  async getStats() {
    return apiRequest("/agen-orders/stats");
  },
  /**
   * Get single order
   */
  async getOrder(id) {
    return apiRequest(`/agen-orders/${id}`);
  },
  /**
   * Create new order to agen
   */
  async createOrder(data) {
    return apiRequest("/agen-orders", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  /**
   * Receive order and update stock
   */
  async receiveOrder(id, data) {
    return apiRequest(`/agen-orders/${id}/receive`, {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  },
  /**
   * Cancel order
   */
  async cancelOrder(id) {
    return apiRequest(`/agen-orders/${id}/cancel`, {
      method: "PATCH"
    });
  }
};
const expensesApi = {
  async getAll(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const queryString = params.toString();
    return apiRequest(`/expenses${queryString ? `?${queryString}` : ""}`);
  },
  async getById(id) {
    return apiRequest(`/expenses/${id}`);
  },
  async create(data) {
    return apiRequest("/expenses", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/expenses/${id}`, { method: "DELETE" });
  },
  async getSummary(startDate, endDate) {
    return apiRequest(`/expenses/summary?startDate=${startDate}&endDate=${endDate}`);
  }
};
const lpgPricesApi = {
  /**
   * Get all LPG prices for current pangkalan
   */
  async getAll() {
    return apiRequest("/lpg-prices");
  },
  /**
   * Update a single price
   */
  async update(id, data) {
    return apiRequest(`/lpg-prices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  /**
   * Bulk update all prices
   */
  async bulkUpdate(prices) {
    return apiRequest("/lpg-prices/bulk", {
      method: "POST",
      body: JSON.stringify({ prices })
    });
  }
};
const perencanaanApi = {
  async getAll(params) {
    const urlParams = new URLSearchParams();
    if (params?.pangkalan_id) urlParams.append("pangkalan_id", params.pangkalan_id);
    if (params?.bulan) urlParams.append("bulan", params.bulan);
    if (params?.tanggal_awal) urlParams.append("tanggal_awal", params.tanggal_awal);
    if (params?.tanggal_akhir) urlParams.append("tanggal_akhir", params.tanggal_akhir);
    if (params?.kondisi) urlParams.append("kondisi", params.kondisi);
    return apiRequest(`/perencanaan?${urlParams.toString()}`);
  },
  async getRekapitulasi(bulan, kondisi, lpgType) {
    const params = new URLSearchParams({ bulan });
    if (kondisi) params.append("kondisi", kondisi);
    if (lpgType) params.append("lpg_type", lpgType);
    return apiRequest(`/perencanaan/rekapitulasi?${params.toString()}`);
  },
  async create(data) {
    return apiRequest("/perencanaan", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async bulkUpdate(data) {
    return apiRequest("/perencanaan/bulk", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/perencanaan/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/perencanaan/${id}`, { method: "DELETE" });
  },
  async autoGenerate(data) {
    return apiRequest("/perencanaan/auto-generate", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};
const penyaluranApi = {
  async getAll(params) {
    const urlParams = new URLSearchParams();
    if (params?.pangkalan_id) urlParams.append("pangkalan_id", params.pangkalan_id);
    if (params?.bulan) urlParams.append("bulan", params.bulan);
    if (params?.tanggal_awal) urlParams.append("tanggal_awal", params.tanggal_awal);
    if (params?.tanggal_akhir) urlParams.append("tanggal_akhir", params.tanggal_akhir);
    if (params?.tipe_pembayaran) urlParams.append("tipe_pembayaran", params.tipe_pembayaran);
    return apiRequest(`/penyaluran?${urlParams.toString()}`);
  },
  async getRekapitulasi(bulan, tipePembayaran, lpgType) {
    const params = new URLSearchParams({ bulan });
    if (tipePembayaran) params.append("tipe_pembayaran", tipePembayaran);
    if (lpgType) params.append("lpg_type", lpgType);
    return apiRequest(`/penyaluran/rekapitulasi?${params.toString()}`);
  },
  async create(data) {
    return apiRequest("/penyaluran", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async bulkUpdate(data) {
    return apiRequest("/penyaluran/bulk", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async update(id, data) {
    return apiRequest(`/penyaluran/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/penyaluran/${id}`, { method: "DELETE" });
  },
  /**
   * Create fakultatif (exception) penyaluran
   * Used for manual penyaluran entries outside of normal order flow
   */
  async createFakultatif(data) {
    return apiRequest("/penyaluran", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        tipe_pembayaran: "CASHLESS"
        // Default for fakultatif
      })
    });
  }
};
const penerimaanApi = {
  async getAll(params) {
    const urlParams = new URLSearchParams();
    if (params?.bulan) urlParams.append("bulan", params.bulan);
    if (params?.tanggal_awal) urlParams.append("tanggal_awal", params.tanggal_awal);
    if (params?.tanggal_akhir) urlParams.append("tanggal_akhir", params.tanggal_akhir);
    if (params?.sumber) urlParams.append("sumber", params.sumber);
    if (params?.page) urlParams.append("page", params.page.toString());
    if (params?.limit) urlParams.append("limit", params.limit.toString());
    return apiRequest(`/penerimaan?${urlParams.toString()}`);
  },
  async create(data) {
    return apiRequest("/penerimaan", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async delete(id) {
    return apiRequest(`/penerimaan/${id}`, { method: "DELETE" });
  },
  async getInOutAgen(bulan) {
    return apiRequest(`/penerimaan/in-out-agen?bulan=${bulan}`);
  }
};
const api = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activityApi,
  agenOrdersApi,
  agenPangkalanOrdersApi,
  authApi,
  companyProfileApi,
  consumerOrdersApi,
  consumersApi,
  dashboardApi,
  driversApi,
  expensesApi,
  getToken,
  isAuthenticated,
  lpgPricesApi,
  lpgProductsApi,
  notificationApi,
  ordersApi,
  pangkalanApi,
  pangkalanStockApi,
  paymentApi,
  penerimaanApi,
  penyaluranApi,
  perencanaanApi,
  removeToken,
  reportsApi,
  setToken,
  uploadApi,
  usersApi
}, Symbol.toStringTag, { value: "Module" }));
const PROFILE_CACHE_KEY = "sim4lon_user_profile";
const PROFILE_CACHE_TIME_KEY = "sim4lon_profile_cache_time";
const CACHE_DURATION_MS = 5 * 60 * 1e3;
function getDashboardByRole(role) {
  const dashboardRoutes = {
    "ADMIN": "/dashboard-admin",
    "OPERATOR": "/dashboard-admin",
    "PANGKALAN": "/pangkalan/dashboard"
  };
  return dashboardRoutes[role] || "/dashboard-admin";
}
function getCachedProfile() {
  if (typeof window === "undefined") return null;
  try {
    const cachedTime = sessionStorage.getItem(PROFILE_CACHE_TIME_KEY);
    const cachedProfile = sessionStorage.getItem(PROFILE_CACHE_KEY);
    if (!cachedTime || !cachedProfile) return null;
    const elapsed = Date.now() - parseInt(cachedTime, 10);
    if (elapsed > CACHE_DURATION_MS) {
      sessionStorage.removeItem(PROFILE_CACHE_KEY);
      sessionStorage.removeItem(PROFILE_CACHE_TIME_KEY);
      return null;
    }
    return JSON.parse(cachedProfile);
  } catch {
    return null;
  }
}
function setCachedProfile(profile) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    sessionStorage.setItem(PROFILE_CACHE_TIME_KEY, Date.now().toString());
  } catch {
  }
}
function clearCachedProfile() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROFILE_CACHE_KEY);
  sessionStorage.removeItem(PROFILE_CACHE_TIME_KEY);
}
function AuthGuard({
  children,
  allowedRoles = [],
  redirectTo = "/login",
  forceRefresh = false
}) {
  const cachedProfile = getCachedProfile();
  const hasValidCache = !forceRefresh && cachedProfile !== null;
  const [isChecking, setIsChecking] = useState(!hasValidCache);
  const [isAuthorized, setIsAuthorized] = useState(hasValidCache);
  const [user, setUser] = useState(cachedProfile);
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        window.location.href = redirectTo;
        return;
      }
      if (!forceRefresh && cachedProfile) {
        if (allowedRoles.length > 0 && !allowedRoles.includes(cachedProfile.role)) {
          const correctDashboard = getDashboardByRole(cachedProfile.role);
          window.location.href = correctDashboard;
          return;
        }
        return;
      }
      try {
        const userProfile = await authApi.getProfile();
        setCachedProfile(userProfile);
        if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile.role)) {
          const correctDashboard = getDashboardByRole(userProfile.role);
          window.location.href = correctDashboard;
          return;
        }
        setUser(userProfile);
        setIsAuthorized(true);
      } catch (error) {
        clearCachedProfile();
        removeToken();
        window.location.href = redirectTo;
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [allowedRoles, redirectTo, forceRefresh]);
  if (hasValidCache && isAuthorized) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  if (isChecking) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Memverifikasi akses..." })
    ] }) });
  }
  if (!isAuthorized) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
export {
  AuthGuard as A,
  Button as B,
  perencanaanApi as C,
  api as D,
  Input as I,
  SafeIcon as S,
  paymentApi as a,
  dashboardApi as b,
  activityApi as c,
  driversApi as d,
  authApi as e,
  uploadApi as f,
  penerimaanApi as g,
  removeToken as h,
  isAuthenticated as i,
  clearCachedProfile as j,
  companyProfileApi as k,
  lpgProductsApi as l,
  consumerOrdersApi as m,
  pangkalanStockApi as n,
  ordersApi as o,
  pangkalanApi as p,
  expensesApi as q,
  reportsApi as r,
  lpgPricesApi as s,
  consumersApi as t,
  usersApi as u,
  agenOrdersApi as v,
  penyaluranApi as w,
  notificationApi as x,
  agenPangkalanOrdersApi as y,
  buttonVariants as z
};
