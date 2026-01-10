import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.DfKLN4S1.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D1CatXxQ.js";
import { A as AdminFooter } from "../../_astro/AdminFooter.DVGEP8G7.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "../../_astro/card.OLhQVURm.js";
import { S as SafeIcon, B as Button, m as consumerOrdersApi } from "../../_astro/AuthGuard.Cq_0lvUi.js";
import { B as Badge, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
const LPG_NAMES = {
  "3kg": "3 kg",
  "5kg": "5.5 kg",
  "12kg": "12 kg",
  "50kg": "50 kg"
};
function RiwayatPenjualanPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [page2, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lpgTypeFilter, setLpgTypeFilter] = useState("");
  const fetchStats = async () => {
    try {
      const statsData = await consumerOrdersApi.getStats(true);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };
  const fetchOrders = async (showFullLoading = false) => {
    try {
      if (showFullLoading) {
        setIsLoading(true);
      } else {
        setIsPageLoading(true);
      }
      const ordersResponse = await consumerOrdersApi.getAll(page2, limit, {
        startDate: startDate || void 0,
        endDate: endDate || void 0
      });
      let filteredData = ordersResponse.data;
      if (debouncedSearch) {
        const search = debouncedSearch.toLowerCase();
        filteredData = filteredData.filter(
          (o) => (o.consumers?.name || o.consumer_name || "").toLowerCase().includes(search) || o.code.toLowerCase().includes(search)
        );
      }
      if (lpgTypeFilter) {
        filteredData = filteredData.filter((o) => o.lpg_type === lpgTypeFilter);
      }
      setOrders(filteredData);
      setTotalPages(ordersResponse.meta.totalPages);
      setTotal(ordersResponse.meta.total);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Gagal memuat data penjualan");
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
    fetchOrders(true);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {
    if (!isLoading) {
      fetchOrders(false);
    }
  }, [page2, limit, debouncedSearch, startDate, endDate, lpgTypeFilter]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, startDate, endDate, lpgTypeFilter]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page2 > 3) pages.push("...");
      const start = Math.max(2, page2 - 1);
      const end = Math.min(totalPages - 1, page2 + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page2 < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  if (isLoading && orders.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingBag", className: "h-6 w-6 text-blue-600" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-4 font-medium", children: "Memuat data penjualan..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fadeInDown", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 via-blue-400 to-emerald-500 animate-lineGrow" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight", children: "Penjualan" }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "History", className: "h-4 w-4 animate-pulse" }),
            "Riwayat dan pencatatan penjualan LPG"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: "group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-95",
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
          /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-sm mt-2", children: [
            stats?.total_qty || 0,
            " tabung"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-2", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-4 w-4" }) }),
          "Laba Hari Ini"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(stats?.laba_bersih || 0) }),
          /* @__PURE__ */ jsx("p", { className: "text-green-100 text-sm mt-2", children: "Profit bersih" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-3", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4 text-purple-600 dark:text-purple-400" }) }),
          "Transaksi Hari Ini"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white", children: stats?.total_orders || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: "Transaksi" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-4", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Database", className: "h-4 w-4 text-amber-600 dark:text-amber-400" }) }),
          "Total Record"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white", children: total }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: "Semua transaksi" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Cari nama pelanggan atau kode transaksi...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          }
        ),
        searchQuery && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
            children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-500 whitespace-nowrap", children: "Dari:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: startDate,
              onChange: (e) => setStartDate(e.target.value),
              className: "px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-500 whitespace-nowrap", children: "Sampai:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: endDate,
              onChange: (e) => setEndDate(e.target.value),
              className: "px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: lpgTypeFilter,
          onChange: (e) => setLpgTypeFilter(e.target.value),
          className: "px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Semua Tipe" }),
            /* @__PURE__ */ jsx("option", { value: "3kg", children: "3 kg" }),
            /* @__PURE__ */ jsx("option", { value: "5kg", children: "5.5 kg" }),
            /* @__PURE__ */ jsx("option", { value: "12kg", children: "12 kg" }),
            /* @__PURE__ */ jsx("option", { value: "50kg", children: "50 kg" })
          ]
        }
      ),
      (searchQuery || startDate || endDate || lpgTypeFilter) && /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setStartDate("");
            setEndDate("");
            setLpgTypeFilter("");
          },
          className: "rounded-xl whitespace-nowrap",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4 mr-1" }),
            "Hapus Filter"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingBag", className: "h-4 w-4 text-blue-600" }) }),
          "Daftar Transaksi"
        ] }),
        /* @__PURE__ */ jsxs(CardDescription, { className: "mt-1", children: [
          total,
          " transaksi tercatat"
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Inbox", className: "h-16 w-16 text-slate-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-700 mb-2", children: "Belum Ada Penjualan" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 mb-6", children: "Mulai catat penjualan LPG Anda" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "bg-blue-600 hover:bg-blue-700",
            onClick: () => window.location.href = "/pangkalan/penjualan/catat",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4 mr-2" }),
              "Catat Penjualan Pertama"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "hidden lg:grid lg:grid-cols-6 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600", children: [
          /* @__PURE__ */ jsx("div", { children: "Kode" }),
          /* @__PURE__ */ jsx("div", { children: "Pelanggan" }),
          /* @__PURE__ */ jsx("div", { className: "text-center", children: "Tipe LPG" }),
          /* @__PURE__ */ jsx("div", { className: "text-center", children: "Qty" }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: "Total" }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: "Waktu" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: orders.map((order, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex flex-col lg:grid lg:grid-cols-6 gap-2 lg:gap-4 p-4 lg:px-6 lg:py-4 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center lg:hidden", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-5 w-5 text-blue-600" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-mono text-sm font-semibold text-slate-700", children: order.code }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 lg:hidden", children: formatDate(order.sale_date) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: order.consumers?.name || order.consumer_name || "Walk-in" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: LPG_NAMES[order.lpg_type] || order.lpg_type }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: order.qty }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-sm ml-1", children: "tabung" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: formatCurrency(order.total_amount) }) }),
              /* @__PURE__ */ jsx("div", { className: "hidden lg:flex items-center justify-end text-right", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700", children: formatDate(order.sale_date) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: formatTime(order.sale_date) })
              ] }) })
            ]
          },
          order.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [
        /* @__PURE__ */ jsx("span", { children: "Tampilkan" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: limit,
            onChange: (e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            },
            className: "bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: 10, children: "10" }),
              /* @__PURE__ */ jsx("option", { value: 25, children: "25" }),
              /* @__PURE__ */ jsx("option", { value: 50, children: "50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("span", { children: [
          "dari ",
          total,
          " data"
        ] })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setPage((p) => Math.max(1, p - 1)),
            disabled: page2 === 1 || isPageLoading,
            className: "rounded-lg h-9 px-3",
            children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: getPageNumbers().map((pageNum, idx) => pageNum === "..." ? /* @__PURE__ */ jsx("span", { className: "px-2 text-slate-400", children: "..." }, `ellipsis-${idx}`) : /* @__PURE__ */ jsx(
          Button,
          {
            variant: page2 === pageNum ? "default" : "ghost",
            size: "sm",
            onClick: () => setPage(pageNum),
            disabled: isPageLoading,
            className: `w-9 h-9 rounded-lg ${page2 === pageNum ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-slate-100"}`,
            children: pageNum
          },
          pageNum
        )) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
            disabled: page2 === totalPages || isPageLoading,
            className: "rounded-lg h-9 px-3",
            children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Riwayat Penjualan - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "RiwayatPenjualanPage", RiwayatPenjualanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/RiwayatPenjualanPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/penjualan/index.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/penjualan/index.astro";
const $$url = "/pangkalan/penjualan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
