import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.C63pe5Ia.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D7Nub16D.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "../../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, B as Button, I as Input, q as consumerOrdersApi } from "../../_astro/AuthGuard.71S_I7hh.js";
import { L as Label } from "../../_astro/label.C1We_4rW.js";
import { B as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, o as DialogFooter, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "../../_astro/alert-dialog.DUcjkEK3.js";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
const LPG_NAMES = {
  "3kg": "3 kg",
  "5kg": "5.5 kg",
  "12kg": "12 kg",
  "50kg": "50 kg",
  "kg3": "3 kg",
  "kg5": "5.5 kg",
  "kg12": "12 kg",
  "kg50": "50 kg",
  "gr220": "Bright Gas 220gr",
  "220gr": "Bright Gas 220gr"
};
const LPG_COLORS = {
  "3kg": "#22C55E",
  "kg3": "#22C55E",
  "5kg": "#ff82c5",
  "kg5": "#ff82c5",
  "12kg": "#3B82F6",
  "kg12": "#3B82F6",
  "50kg": "#ef0e0e",
  "kg50": "#ef0e0e",
  "gr220": "#FFA500",
  "220gr": "#FFA500"
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
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({ qty: 1, pricePerUnit: 0, note: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);
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
        const LPG_EQUIVALENTS = {
          "kg3": ["kg3", "3kg"],
          "kg5": ["kg5", "5kg"],
          "kg12": ["kg12", "12kg"],
          "kg50": ["kg50", "50kg"],
          "gr220": ["gr220", "220gr", "bright_gas", "brightgas"]
        };
        const equivalents = LPG_EQUIVALENTS[lpgTypeFilter] || [lpgTypeFilter];
        filteredData = filteredData.filter(
          (o) => equivalents.includes(o.lpg_type?.toLowerCase() || "")
        );
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
  const handleDelete = (order) => {
    setDeletingOrder(order);
  };
  const confirmDelete = async () => {
    if (!deletingOrder) return;
    const scrollPosition = window.scrollY;
    try {
      const result = await consumerOrdersApi.delete(deletingOrder.id);
      toast.success(result.message || "Transaksi dihapus", { duration: 4e3 });
      setDeletingOrder(null);
      await fetchOrders(false);
      fetchStats();
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
      });
    } catch (error) {
      toast.error(error.message || "Gagal menghapus transaksi", { duration: 5e3 });
    }
  };
  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditForm({
      qty: order.qty,
      pricePerUnit: Number(order.price_per_unit),
      note: order.note || ""
    });
  };
  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    if (editForm.qty < 1) {
      toast.error("Jumlah minimal 1 tabung");
      return;
    }
    const scrollPosition = window.scrollY;
    setIsUpdating(true);
    try {
      await consumerOrdersApi.update(editingOrder.id, {
        qty: editForm.qty,
        price_per_unit: editForm.pricePerUnit,
        note: editForm.note || void 0
      });
      const qtyDelta = editForm.qty - editingOrder.qty;
      const stockMsg = qtyDelta !== 0 ? ` (Stok ${qtyDelta > 0 ? "dikurangi" : "ditambah"} ${Math.abs(qtyDelta)} tabung)` : "";
      toast.success(`Transaksi berhasil diupdate${stockMsg}`, { duration: 4e3 });
      setEditingOrder(null);
      await fetchOrders(false);
      fetchStats();
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
      });
    } catch (error) {
      toast.error(error.message || "Gagal mengupdate transaksi", { duration: 5e3 });
    } finally {
      setIsUpdating(false);
    }
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
            /* @__PURE__ */ jsx("option", { value: "kg3", children: "3 kg" }),
            /* @__PURE__ */ jsx("option", { value: "kg5", children: "5.5 kg" }),
            /* @__PURE__ */ jsx("option", { value: "kg12", children: "12 kg" }),
            /* @__PURE__ */ jsx("option", { value: "kg50", children: "50 kg" }),
            /* @__PURE__ */ jsx("option", { value: "gr220", children: "Bright Gas 220gr" })
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
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/images/illustrations/empty-sales.png",
            alt: "Belum ada penjualan",
            className: "w-48 h-48 object-contain mx-auto mb-4 opacity-80"
          }
        ),
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
            className: `p-3 sm:p-4 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "lg:hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center overflow-hidden",
                    style: {
                      background: `linear-gradient(135deg, ${LPG_COLORS[order.lpg_type] || "#3B82F6"}20, ${LPG_COLORS[order.lpg_type] || "#3B82F6"}10)`
                    },
                    children: LPG_IMAGES[order.lpg_type] ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: LPG_IMAGES[order.lpg_type],
                        alt: LPG_NAMES[order.lpg_type] || order.lpg_type,
                        className: "w-8 h-8 object-contain"
                      }
                    ) : /* @__PURE__ */ jsx(SafeIcon, { name: "Cylinder", className: "h-5 w-5", style: { color: LPG_COLORS[order.lpg_type] || "#3B82F6" } })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-mono text-xs sm:text-sm font-semibold text-slate-700 truncate", children: order.code }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-xs text-slate-400 shrink-0", children: formatDate(order.sale_date) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-slate-900 mt-1 truncate", children: order.consumers?.name || order.consumer_name || "Walk-in" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2 gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700 text-[10px] sm:text-xs px-1.5 py-0.5", children: LPG_NAMES[order.lpg_type] || order.lpg_type }),
                      /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm text-slate-600", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-bold", children: order.qty }),
                        " tabung"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm sm:text-base text-blue-600", children: formatCurrency(order.total_amount) }),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          onClick: () => openEditModal(order),
                          className: "h-7 w-7 p-0 hover:bg-blue-100 rounded-lg",
                          children: /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-3.5 w-3.5 text-blue-600" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          onClick: () => handleDelete(order),
                          className: "h-7 w-7 p-0 hover:bg-red-100 rounded-lg",
                          children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash", className: "h-3.5 w-3.5 text-red-600" })
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "hidden lg:grid lg:grid-cols-6 gap-4 items-center", children: [
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "font-mono text-sm font-semibold text-slate-700", children: order.code }) }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: order.consumers?.name || order.consumer_name || "Walk-in" }) }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden",
                      style: {
                        background: `linear-gradient(135deg, ${LPG_COLORS[order.lpg_type] || "#3B82F6"}20, ${LPG_COLORS[order.lpg_type] || "#3B82F6"}10)`
                      },
                      children: LPG_IMAGES[order.lpg_type] ? /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: LPG_IMAGES[order.lpg_type],
                          alt: LPG_NAMES[order.lpg_type] || order.lpg_type,
                          className: "w-7 h-7 object-contain"
                        }
                      ) : /* @__PURE__ */ jsx(SafeIcon, { name: "Cylinder", className: "h-4 w-4", style: { color: LPG_COLORS[order.lpg_type] || "#3B82F6" } })
                    }
                  ),
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: LPG_NAMES[order.lpg_type] || order.lpg_type })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: order.qty }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-sm ml-1", children: "tabung" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: formatCurrency(order.total_amount) }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-right flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700", children: formatDate(order.sale_date) }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: formatTime(order.sale_date) })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => openEditModal(order),
                      className: "h-8 w-8 p-0 hover:bg-blue-100 rounded-lg",
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-4 w-4 text-blue-600" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => handleDelete(order),
                      className: "h-8 w-8 p-0 hover:bg-red-100 rounded-lg",
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash", className: "h-4 w-4 text-red-600" })
                    }
                  )
                ] })
              ] })
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
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!editingOrder, onOpenChange: (open) => !open && setEditingOrder(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md rounded-xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-5 w-5 text-blue-600" }) }),
          "Edit Transaksi"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          editingOrder?.code,
          " • ",
          editingOrder && LPG_NAMES[editingOrder.lpg_type]
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-slate-50 border border-slate-200", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Pelanggan" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: editingOrder?.consumers?.name || editingOrder?.consumer_name || "Walk-in" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "edit-qty", className: "text-sm font-medium", children: "Jumlah (tabung)" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "h-10 w-10 rounded-xl",
                onClick: () => setEditForm((prev) => ({ ...prev, qty: Math.max(1, prev.qty - 1) })),
                disabled: editForm.qty <= 1,
                children: "−"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "edit-qty",
                type: "number",
                min: 1,
                value: editForm.qty,
                onChange: (e) => setEditForm((prev) => ({ ...prev, qty: Math.max(1, parseInt(e.target.value) || 1) })),
                className: "h-10 text-center font-bold text-lg rounded-xl flex-1"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "h-10 w-10 rounded-xl",
                onClick: () => setEditForm((prev) => ({ ...prev, qty: prev.qty + 1 })),
                children: "+"
              }
            )
          ] }),
          editingOrder && editForm.qty !== editingOrder.qty && /* @__PURE__ */ jsxs("div", { className: `text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${editForm.qty > editingOrder.qty ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-green-50 text-green-700 border border-green-200"}`, children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: editForm.qty > editingOrder.qty ? "ArrowDown" : "ArrowUp", className: "h-3.5 w-3.5" }),
            "Stok akan ",
            editForm.qty > editingOrder.qty ? "dikurangi" : "ditambah",
            " ",
            Math.abs(editForm.qty - editingOrder.qty),
            " tabung"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "edit-price", className: "text-sm font-medium", children: "Harga per Unit (Rp)" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500", children: "Rp" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "edit-price",
                type: "text",
                inputMode: "numeric",
                value: editForm.pricePerUnit.toLocaleString("id-ID"),
                onChange: (e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setEditForm((prev) => ({ ...prev, pricePerUnit: parseInt(val) || 0 }));
                },
                className: "h-10 pl-10 rounded-xl"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "edit-note", className: "text-sm font-medium", children: "Catatan (Opsional)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "edit-note",
              value: editForm.note,
              onChange: (e) => setEditForm((prev) => ({ ...prev, note: e.target.value })),
              placeholder: "Tambahkan catatan...",
              className: "h-10 rounded-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white", children: [
          /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-xs font-medium", children: "Total Baru" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: formatCurrency(editForm.qty * editForm.pricePerUnit) }),
          /* @__PURE__ */ jsxs("p", { className: "text-blue-200 text-xs mt-1", children: [
            editForm.qty,
            " × ",
            formatCurrency(editForm.pricePerUnit)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setEditingOrder(null),
            disabled: isUpdating,
            className: "rounded-xl",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleUpdateOrder,
            disabled: isUpdating,
            className: "rounded-xl bg-blue-600 hover:bg-blue-700",
            children: isUpdating ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 mr-2 animate-spin" }),
              " Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "h-4 w-4 mr-2" }),
              " Simpan Perubahan"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deletingOrder, onOpenChange: (open) => !open && setDeletingOrder(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "rounded-2xl", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { className: "flex items-center gap-2 text-red-600", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-5 w-5" }),
          "Hapus Transaksi?"
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Apakah Anda yakin ingin menghapus transaksi ",
          /* @__PURE__ */ jsx("strong", { children: deletingOrder?.code }),
          "?",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 p-3 rounded-lg border border-orange-200 text-orange-800 text-sm flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-4 w-4 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Tindakan ini tidak dapat dibatalkan. Stok tabung sejumlah ",
              /* @__PURE__ */ jsxs("strong", { children: [
                deletingOrder?.qty,
                " tabung"
              ] }),
              " akan dikembalikan ke stok pangkalan."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "rounded-xl", children: "Batal" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: confirmDelete,
            className: "bg-red-600 hover:bg-red-700 text-white rounded-xl",
            children: "Hapus & Kembalikan Stok"
          }
        )
      ] })
    ] }) })
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Riwayat Penjualan - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "RiwayatPenjualanPage", RiwayatPenjualanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/RiwayatPenjualanPage.tsx", "client:component-export": "default" })}
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
