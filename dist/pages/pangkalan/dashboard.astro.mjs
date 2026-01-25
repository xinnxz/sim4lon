import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.C63pe5Ia.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D7Nub16D.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "../../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, B as Button, f as authApi, q as consumerOrdersApi, s as pangkalanStockApi, t as expensesApi, v as lpgPricesApi } from "../../_astro/AuthGuard.71S_I7hh.js";
import { P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { W as WelcomePopup } from "../../_astro/WelcomePopup.dIpGv1MM.js";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell } from "recharts";
import { renderers } from "../../renderers.mjs";
const lpgTypeConfig = {
  // Bright Gas 220gr
  "gr220": { name: "Bright Gas 220gr", color: "#FFA500" },
  "220gr": { name: "Bright Gas 220gr", color: "#FFA500" },
  // Standard formats
  "3kg": { name: "3 kg", color: "#22C55E" },
  "5kg": { name: "5.5 kg", color: "#ff82c5ff" },
  "12kg": { name: "12 kg", color: "#3B82F6" },
  "50kg": { name: "50 kg", color: "#ef0e0eff" },
  // Legacy format support
  "kg3": { name: "3 kg", color: "#22C55E" },
  "kg5": { name: "5.5 kg", color: "#ff82c5ff" },
  "kg12": { name: "12 kg", color: "#3B82F6" },
  "kg50": { name: "50 kg", color: "#ef0e0eff" }
};
const LPG_IMAGES = {
  "gr220": "/images/products/bright-gas-220gr.png",
  "220gr": "/images/products/bright-gas-220gr.png",
  "3kg": "/images/products/lpg-3kg.png",
  "kg3": "/images/products/lpg-3kg.png",
  "5kg": "/images/products/lpg-5kg.png",
  "kg5": "/images/products/lpg-5kg.png",
  "12kg": "/images/products/lpg-12kg.png",
  "kg12": "/images/products/lpg-12kg.png",
  "50kg": "/images/products/lpg-50kg.png",
  "kg50": "/images/products/lpg-50kg.png"
};
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-slate-900/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-slate-700", children: [
      /* @__PURE__ */ jsx("p", { className: "text-white font-semibold text-sm mb-2", children: label }),
      payload.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: item.color } }),
        /* @__PURE__ */ jsxs("span", { className: "text-slate-300", children: [
          item.name,
          ":"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-white font-medium", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.value) })
      ] }, index))
    ] });
  }
  return null;
};
const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value;
    const isExpenseData = value >= 1e3;
    const allValues = payload.map((p) => p.value);
    const total = allValues.reduce((a, b) => a + b, 0) || data.payload?.total || 0;
    const percentage = total > 0 ? (value / total * 100).toFixed(1) : "0";
    const formattedValue = isExpenseData ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value) : `${value} tabung`;
    let status = { text: "Aman", color: "text-green-600", bg: "bg-green-100" };
    if (!isExpenseData) {
      if (value <= 10) {
        status = { text: "Kritis!", color: "text-red-600", bg: "bg-red-100" };
      } else if (value <= 30) {
        status = { text: "Menipis", color: "text-orange-600", bg: "bg-orange-100" };
      }
    }
    return /* @__PURE__ */ jsxs("div", { className: "bg-white px-4 py-3 rounded-xl shadow-2xl border border-slate-200 min-w-[160px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: data.payload.color } }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: data.payload.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-slate-800", children: formattedValue }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-sm", children: "Proporsi:" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-700", children: [
            percentage,
            "%"
          ] })
        ] }),
        !isExpenseData && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-1 border-t border-slate-100 mt-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-sm", children: "Status:" }),
          /* @__PURE__ */ jsx("span", { className: `text-sm font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`, children: status.text })
        ] })
      ] })
    ] });
  }
  return null;
};
const EXPENSE_CATEGORIES = {
  // Standard categories (uppercase)
  "OPERASIONAL": { label: "Operasional", color: "#8B5CF6" },
  // Purple
  "TRANSPORT": { label: "Transport", color: "#F97316" },
  // Orange
  "SEWA": { label: "Sewa", color: "#EC4899" },
  // Pink
  "LISTRIK": { label: "Listrik/Air", color: "#EAB308" },
  // Yellow
  "GAJI": { label: "Gaji", color: "#3B82F6" },
  // Blue
  "LAINNYA": { label: "Lainnya", color: "#10B981" },
  // Emerald
  // Legacy/alternative formats
  "MAINTENANCE": { label: "Maintenance", color: "#06B6D4" },
  // Cyan
  "Maintenance": { label: "Maintenance", color: "#06B6D4" },
  "maintenance": { label: "Maintenance", color: "#06B6D4" },
  "PERAWATAN": { label: "Perawatan", color: "#14B8A6" },
  // Teal
  "LAIN-LAIN": { label: "Lain-lain", color: "#6366F1" },
  // Indigo
  "Lain-lain": { label: "Lain-lain", color: "#6366F1" },
  "lain-lain": { label: "Lain-lain", color: "#6366F1" }
};
function PangkalanDashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [expenseSummary, setExpenseSummary] = useState({ total: 0, byCategory: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const footer = document.getElementById("app-footer");
    if (footer) {
      footer.style.display = isLoading ? "none" : "";
    }
    return () => {
      if (footer) footer.style.display = "";
    };
  }, [isLoading]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const profileData = await authApi.getProfile();
        setProfile(profileData);
        const now = /* @__PURE__ */ new Date();
        const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
        const [statsData, monthlyStatsData, recentData, chartDataFromApi, stockResponse, expenseData, pricesData] = await Promise.all([
          consumerOrdersApi.getStats({ todayOnly: true }),
          consumerOrdersApi.getStats({ startDate, endDate }),
          consumerOrdersApi.getRecent(5),
          consumerOrdersApi.getChartData(),
          pangkalanStockApi.getStockLevels(),
          expensesApi.getAll(startDate, endDate),
          lpgPricesApi.getAll()
          // Fetch prices to filter by active
        ]);
        setStats(statsData);
        setMonthlyStats(monthlyStatsData);
        setRecentSales(recentData);
        if (chartDataFromApi && chartDataFromApi.length > 0) {
          setChartData(chartDataFromApi);
        }
        if (stockResponse && stockResponse.stocks) {
          const normalizeType = (type) => {
            if (type.startsWith("kg")) return type;
            const match = type.match(/^(\d+\.?\d*)kg$/);
            if (match) return `kg${match[1]}`;
            if (type.match(/g?r?220g?r?/i)) return "gr220";
            return type;
          };
          const activeLpgTypes = pricesData.filter((p) => p.is_active).map((p) => normalizeType(p.lpg_type));
          const activeStocks = stockResponse.stocks.filter(
            (stock) => activeLpgTypes.includes(normalizeType(stock.lpg_type))
          );
          const total = activeStocks.reduce((sum, s) => sum + s.qty, 0);
          const pieData = activeStocks.map((stock) => ({
            name: lpgTypeConfig[stock.lpg_type]?.name || stock.lpg_type,
            value: stock.qty,
            color: lpgTypeConfig[stock.lpg_type]?.color || "#94A3B8",
            total
            // Include total for percentage calculation
          }));
          setStockData(pieData);
          setTotalStock(total);
        }
        if (expenseData && expenseData.length > 0) {
          const total = expenseData.reduce((sum, e) => sum + Number(e.amount), 0);
          const byCategory = {};
          expenseData.forEach((e) => {
            byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
          });
          const pieData = Object.entries(byCategory).map(([cat, amount]) => ({
            name: EXPENSE_CATEGORIES[cat]?.label || cat,
            value: amount,
            color: EXPENSE_CATEGORIES[cat]?.color || "#6B7280"
          }));
          setExpenseSummary({ total, byCategory: pieData });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err?.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };
  const formatCurrencyShort = (value) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}jt`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}rb`;
    return value.toString();
  };
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };
  const enhancedChartData = chartData.map((day) => ({
    ...day,
    name: formatDate(day.date)
  }));
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "LayoutDashboard", className: "h-6 w-6 text-blue-600" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-4 font-medium", children: "Memuat dashboard..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-8 w-8 text-red-500" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Gagal Memuat Data" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-4", children: error }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => window.location.reload(), className: "bg-blue-600 hover:bg-blue-700", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: "h-4 w-4 mr-2" }),
        "Coba Lagi"
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-8", children: [
    /* @__PURE__ */ jsx(WelcomePopup, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fadeInDown", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 sm:h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 via-blue-400 to-emerald-500 animate-lineGrow" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight", children: "Dashboard" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Sparkles", className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 animate-pulse" }),
            "Selamat datang, ",
            profile?.name?.split(" ")[0] || "Pak"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: "hidden sm:flex group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-95",
          onClick: () => window.location.href = "/pangkalan/penjualan/catat",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" }),
            "Catat Penjualan"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-1", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Banknote", className: "h-4 w-4" }) }),
          "Penjualan Hari Ini"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(stats?.total_revenue || 0) }),
          /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-sm mt-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-3.5 w-3.5" }),
            stats?.total_qty || 0,
            " tabung terjual"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-2", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "BadgeDollarSign", className: "h-4 w-4" }) }),
          "Laba Bersih (Profit)"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(stats?.laba_bersih || 0) }),
          /* @__PURE__ */ jsx("p", { className: "text-green-100 text-sm mt-2", children: "Hari ini" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-3", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4 text-purple-600 dark:text-purple-400" }) }),
          "Total Transaksi"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white", children: stats?.total_orders || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: "Transaksi hari ini" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-4", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-4 w-4 text-amber-600 dark:text-amber-400" }) }),
          "Total Stok"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white", children: [
            totalStock,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-lg font-normal text-slate-500 dark:text-slate-400", children: "tabung" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: [
            stockData.length,
            " tipe LPG"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-2 bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-4 w-4 text-blue-600" }) }),
            "Trend Penjualan, Modal, Pengeluaran & Laba"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "7 hari terakhir • Laba Bersih = (Penjualan - Modal) - Pengeluaran" })
        ] }) }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[280px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: enhancedChartData, children: [
            /* @__PURE__ */ jsxs("defs", { children: [
              /* @__PURE__ */ jsxs("linearGradient", { id: "penjualanGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.3 }),
                /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0 })
              ] }),
              /* @__PURE__ */ jsxs("linearGradient", { id: "labaGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#22C55E", stopOpacity: 0.3 }),
                /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#22C55E", stopOpacity: 0 })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2E8F0", vertical: false }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#64748B", fontSize: 12, tickLine: false, axisLine: false }),
            /* @__PURE__ */ jsx(YAxis, { stroke: "#64748B", fontSize: 12, tickFormatter: formatCurrencyShort, tickLine: false, axisLine: false }),
            /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
            /* @__PURE__ */ jsx(
              Area,
              {
                type: "monotone",
                dataKey: "penjualan",
                name: "Penjualan",
                stroke: "#3B82F6",
                strokeWidth: 2,
                fill: "url(#penjualanGradient)",
                dot: { r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }
              }
            ),
            /* @__PURE__ */ jsx(
              Area,
              {
                type: "monotone",
                dataKey: "modal",
                name: "Modal",
                stroke: "#F97316",
                strokeWidth: 2,
                fill: "transparent",
                dot: { r: 3, fill: "#F97316", strokeWidth: 2, stroke: "#fff" }
              }
            ),
            /* @__PURE__ */ jsx(
              Area,
              {
                type: "monotone",
                dataKey: "pengeluaran",
                name: "Pengeluaran",
                stroke: "#EF4444",
                strokeWidth: 2,
                strokeDasharray: "5 5",
                fill: "transparent",
                dot: { r: 3, fill: "#EF4444", strokeWidth: 2, stroke: "#fff" }
              }
            ),
            /* @__PURE__ */ jsx(
              Area,
              {
                type: "monotone",
                dataKey: "laba",
                name: "Laba Bersih",
                stroke: "#22C55E",
                strokeWidth: 3,
                fill: "url(#labaGradient)",
                dot: { r: 5, fill: "#22C55E", strokeWidth: 3, stroke: "#fff" }
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-6 mt-4 pt-4 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-blue-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Penjualan" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-orange-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Modal" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-0.5 bg-red-500", style: { borderTop: "2px dashed #EF4444" } }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Pengeluaran" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-green-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Laba Bersih" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "PieChart", className: "h-4 w-4 text-emerald-600" }) }),
            "Stok per Tipe"
          ] }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            "Total: ",
            totalStock,
            " tabung"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[200px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
            /* @__PURE__ */ jsx(
              Pie,
              {
                data: stockData,
                cx: "50%",
                cy: "50%",
                innerRadius: 50,
                outerRadius: 80,
                dataKey: "value",
                strokeWidth: 3,
                stroke: "#fff",
                children: stockData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `cell-${index}`))
              }
            ),
            /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(PieTooltip, {}) })
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2 mt-4", children: stockData.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700", children: item.name })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: item.value })
          ] }, index)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-4 w-4 text-red-600" }) }),
              "Pengeluaran Bulan Ini"
            ] }),
            /* @__PURE__ */ jsxs(CardDescription, { className: "mt-1", children: [
              "Total: ",
              formatCurrency(expenseSummary.total)
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-red-600 hover:text-red-700 hover:bg-red-50", asChild: true, children: /* @__PURE__ */ jsx("a", { href: "/pangkalan/pengeluaran", children: "Kelola →" }) })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: expenseSummary.byCategory.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/illustrations/empty-report.png",
              alt: "Belum ada pengeluaran",
              className: "w-32 h-32 object-contain mx-auto mb-3 opacity-70"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: "Belum ada pengeluaran bulan ini" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[150px] w-[150px] flex-shrink-0", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
            /* @__PURE__ */ jsx(
              Pie,
              {
                data: expenseSummary.byCategory,
                cx: "50%",
                cy: "50%",
                innerRadius: 40,
                outerRadius: 65,
                dataKey: "value",
                strokeWidth: 2,
                stroke: "#fff",
                children: expenseSummary.byCategory.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `expense-cell-${index}`))
              }
            ),
            /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(PieTooltip, {}) })
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-2", children: expenseSummary.byCategory.slice(0, 4).map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: item.name })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900", children: formatCurrency(item.value) })
          ] }, index)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-4 w-4 text-purple-600" }) }),
          "Ringkasan Bulan Ini"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 pt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowUpRight", className: "h-5 w-5 text-blue-600" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "Total Penjualan" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-blue-600", children: formatCurrency(monthlyStats?.total_revenue || 0) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowDownRight", className: "h-5 w-5 text-red-600" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "Total Pengeluaran" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-red-600", children: [
              "-",
              formatCurrency(monthlyStats?.total_pengeluaran || 0)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Banknote", className: "h-5 w-5 text-green-600" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-green-700", children: "Laba Bersih" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-green-600", children: formatCurrency(monthlyStats?.laba_bersih || 0) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-4 w-4 text-amber-600" }) }),
            "Penjualan Terakhir"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "5 transaksi terbaru hari ini" })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50", asChild: true, children: /* @__PURE__ */ jsx("a", { href: "/pangkalan/penjualan", children: "Lihat Semua →" }) })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: recentSales.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/images/illustrations/empty-sales.png",
            alt: "Belum ada penjualan",
            className: "w-40 h-40 object-contain mx-auto mb-3 opacity-70"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: "Belum ada penjualan hari ini" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "mt-4",
            onClick: () => window.location.href = "/pangkalan/penjualan/catat",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4 mr-2" }),
              "Catat Penjualan Pertama"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: recentSales.map((sale, index) => /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden",
              style: {
                background: `linear-gradient(135deg, ${lpgTypeConfig[sale.lpg_type]?.color || "#3B82F6"}20, ${lpgTypeConfig[sale.lpg_type]?.color || "#3B82F6"}10)`
              },
              children: LPG_IMAGES[sale.lpg_type] ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: LPG_IMAGES[sale.lpg_type],
                  alt: lpgTypeConfig[sale.lpg_type]?.name || sale.lpg_type,
                  className: "w-8 h-8 object-contain"
                }
              ) : /* @__PURE__ */ jsx(SafeIcon, { name: "Cylinder", className: "h-5 w-5", style: { color: lpgTypeConfig[sale.lpg_type]?.color || "#3B82F6" } })
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: sale.consumers?.name || sale.consumer_name || "Walk-in Customer" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
              sale.qty,
              " × ",
              lpgTypeConfig[sale.lpg_type]?.name || sale.lpg_type
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900", children: formatCurrency(sale.total_amount) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: formatTime(sale.sale_date) })
        ] })
      ] }, sale.id)) }) })
    ] })
  ] });
}
const $$Dashboard = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Dashboard Pangkalan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "PangkalanDashboard", PangkalanDashboard, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/PangkalanDashboard.tsx", "client:component-export": "default" })}
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/dashboard.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/dashboard.astro";
const $$url = "/pangkalan/dashboard.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
