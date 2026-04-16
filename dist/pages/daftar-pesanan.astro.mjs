import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DMB591cw.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.B0qA0Ni6.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DJv7CO6O.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { B as Button, S as SafeIcon, I as Input, o as ordersApi } from "../_astro/AuthGuard.BLl0uVB7.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "../_astro/table.OJLE4Veh.js";
import "../_astro/card.CnUj7wdc.js";
import { B as Badge, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.igvMWLOj.js";
import { T as Tilt3DCard } from "../_astro/Tilt3DCard.DHI-RZXC.js";
import { toast } from "sonner";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { renderers } from "../renderers.mjs";
const statusLabels = {
  DRAFT: "Draft",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  DIPROSES: "Diproses",
  SIAP_KIRIM: "Siap Kirim",
  // Legacy - kept for backward compatibility
  DIKIRIM: "Sedang Dikirim",
  SELESAI: "Selesai",
  BATAL: "Dibatalkan"
};
const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  MENUNGGU_PEMBAYARAN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DIPROSES: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SIAP_KIRIM: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  // Legacy
  DIKIRIM: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  SELESAI: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  BATAL: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
};
const getLpgImage = (label) => {
  if (!label) return null;
  const l = label.toLowerCase();
  if (l.includes("bright") || l.includes("220")) {
    return "/images/products/bright-gas-220gr.png";
  }
  if (l.includes("50kg") || l.includes("50 kg")) {
    return "/images/products/lpg-50kg.png";
  }
  if (l.includes("12kg") || l.includes("12 kg")) {
    return "/images/products/lpg-12kg.png";
  }
  if (l.includes("5.5") || l.includes("5kg") || l.includes("5 kg")) {
    return "/images/products/lpg-5kg.png";
  }
  if (l.includes("3kg") || l.includes("3 kg")) {
    return "/images/products/lpg-3kg.png";
  }
  return null;
};
function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pangkalanFilter, setPangkalanFilter] = useState(null);
  const [pangkalanName, setPangkalanName] = useState(null);
  const [isUrlParsed, setIsUrlParsed] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pangkalanId = params.get("pangkalan_id");
      if (pangkalanId) {
        setPangkalanFilter(pangkalanId);
      }
      setIsUrlParsed(true);
    }
  }, []);
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const status = statusFilter === "all" ? void 0 : statusFilter;
      const response = await ordersApi.getAll(currentPage, pageSize, status, pangkalanFilter || void 0, void 0, sortBy, sortOrder, searchTerm || void 0);
      setOrders(response.data);
      setTotalOrders(response.meta.total);
      setTotalPages(response.meta.totalPages);
      if (pangkalanFilter && response.data.length > 0 && !pangkalanName) {
        setPangkalanName(response.data[0].pangkalans?.name || "Pangkalan");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Gagal memuat data pesanan");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await ordersApi.getStats(true);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);
  useEffect(() => {
    if (isUrlParsed) {
      fetchOrders();
    }
  }, [currentPage, pageSize, statusFilter, pangkalanFilter, isUrlParsed, sortBy, sortOrder]);
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };
  const getSortIcon = (column) => {
    if (sortBy !== column) return "ArrowUpDown";
    return sortOrder === "asc" ? "ArrowUp" : "ArrowDown";
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const formatOrderCode = (order) => {
    return order.code || `ORD-${order.id.slice(0, 4).toUpperCase()}`;
  };
  const getItemsSummary = (order) => {
    if (!order.order_items || order.order_items.length === 0) {
      return "-";
    }
    const first = order.order_items[0];
    const more = order.order_items.length - 1;
    const summary = `${first.label} (${first.qty})`;
    return more > 0 ? `${summary} +${more} lainnya` : summary;
  };
  const getTotalQty = (order) => {
    if (!order.order_items) return 0;
    return order.order_items.reduce((sum, item) => sum + item.qty, 0);
  };
  const filteredOrders = orders;
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-6 dashboard-gradient-bg min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: pangkalanFilter ? `Pesanan ${pangkalanName || "Pangkalan"}` : "Daftar Pesanan",
          subtitle: pangkalanFilter ? "Riwayat pesanan pangkalan ini" : "Kelola semua pesanan masuk dengan mudah"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          className: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto",
          children: /* @__PURE__ */ jsxs("a", { href: "/buat-pesanan", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "mr-2 h-4 w-4" }),
            "Buat Pesanan"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-5 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-3xl font-bold mt-1 sm:mt-2", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats?.total || 0, delay: 100 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "hari ini" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingCart", className: "h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" })
      ] }) }),
      /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-5 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Menunggu" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-amber-600 dark:text-amber-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats?.menunggu_pembayaran || 0, delay: 200 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "bayar" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 dark:from-amber-700 dark:via-amber-500 dark:to-amber-700" })
      ] }) }),
      /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-5 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Diproses" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-blue-600 dark:text-blue-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats?.diproses || 0, delay: 300 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "hari ini" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50", children: /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: "h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 dark:from-blue-700 dark:via-blue-500 dark:to-blue-700" })
      ] }) }),
      /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-5 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Dikirim" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-indigo-600 dark:text-indigo-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats?.dikirim || 0, delay: 400 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "hari ini" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-300 dark:from-indigo-700 dark:via-indigo-500 dark:to-indigo-700" })
      ] }) }),
      /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-xl sm:rounded-2xl overflow-hidden animate-slideInBlur stagger-5 card-hover-glow col-span-2 sm:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-5 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Selesai" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-green-600 dark:text-green-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats?.selesai || 0, delay: 500 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "hari ini" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-300 dark:from-green-700 dark:via-green-500 dark:to-green-700" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-primary" }),
        "Filter & Pencarian"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-3", children: [
        pangkalanFilter && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-3 flex items-center gap-2 p-3 bg-primary/10 rounded-lg", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
            "Filter: ",
            pangkalanName || "Pangkalan"
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-6 px-2 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10",
              onClick: () => {
                setPangkalanFilter(null);
                setPangkalanName(null);
                window.history.replaceState({}, "", "/daftar-pesanan");
              },
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-3 w-3 mr-1" }),
                "Hapus Filter"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative sm:col-span-2", children: [
          /* @__PURE__ */ jsx(
            SafeIcon,
            {
              name: "Search",
              className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Cari ID pesanan, pangkalan, atau jenis LPG...",
              className: "pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: (v) => {
          setStatusFilter(v);
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-11 bg-background/50 border-border/50", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter Status" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Semua Status" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "DRAFT", children: "Draft" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "MENUNGGU_PEMBAYARAN", children: "Menunggu Pembayaran" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "DIPROSES", children: "Diproses" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "DIKIRIM", children: "Sedang Dikirim" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "SELESAI", children: "Selesai" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "BATAL", children: "Dibatalkan" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "chart-card-premium rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-border/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Daftar Pesanan" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          "Total ",
          filteredOrders.length,
          " pesanan ditampilkan"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
        isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-primary" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "lg:hidden space-y-3", children: filteredOrders.length > 0 ? filteredOrders.map((order, index) => /* @__PURE__ */ jsxs(
            "a",
            {
              href: `/detail-pesanan?code=${formatOrderCode(order)}`,
              className: `block p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-primary text-sm", children: formatOrderCode(order) }),
                  /* @__PURE__ */ jsx(Badge, { variant: "status", className: `${statusColors[order.current_status]} text-[10px]`, children: statusLabels[order.current_status] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate mb-1", children: order.pangkalans?.name || "-" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate mb-2", children: getItemsSummary(order) }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border/50", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: formatCurrency(order.total_amount) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      getTotalQty(order),
                      " unit"
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) })
                  ] })
                ] })
              ]
            },
            order.id
          )) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 py-12", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/images/illustrations/empty-orders.png",
                alt: "Tidak ada pesanan",
                className: "w-40 h-40 object-contain opacity-80"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-1", children: "Tidak ada pesanan" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Belum ada pesanan yang sesuai dengan kriteria pencarian" })
            ] }),
            /* @__PURE__ */ jsx("a", { href: "/buat-pesanan", children: /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4" }),
              "Buat Pesanan Baru"
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:block overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
              /* @__PURE__ */ jsx(
                TableHead,
                {
                  className: "font-semibold cursor-pointer hover:bg-muted/50 select-none",
                  onClick: () => handleSort("code"),
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    "ID Pesanan",
                    /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("code"), className: "h-3.5 w-3.5" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                TableHead,
                {
                  className: "font-semibold cursor-pointer hover:bg-muted/50 select-none",
                  onClick: () => handleSort("pangkalan_name"),
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    "Pangkalan",
                    /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("pangkalan_name"), className: "h-3.5 w-3.5" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(TableHead, { className: "font-semibold", children: "Item" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right font-semibold", children: "Qty" }),
              /* @__PURE__ */ jsx(
                TableHead,
                {
                  className: "text-right font-semibold cursor-pointer hover:bg-muted/50 select-none",
                  onClick: () => handleSort("total_amount"),
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-end gap-1", children: [
                    "Total",
                    /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("total_amount"), className: "h-3.5 w-3.5" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                TableHead,
                {
                  className: "font-semibold cursor-pointer hover:bg-muted/50 select-none",
                  onClick: () => handleSort("current_status"),
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    "Status",
                    /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("current_status"), className: "h-3.5 w-3.5" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                TableHead,
                {
                  className: "font-semibold cursor-pointer hover:bg-muted/50 select-none",
                  onClick: () => handleSort("created_at"),
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    "Tanggal",
                    /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("created_at"), className: "h-3.5 w-3.5" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right font-semibold", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: filteredOrders.length > 0 ? filteredOrders.map((order) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/50", children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-primary font-mono", children: formatOrderCode(order) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: order.pangkalans?.name || "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                order.order_items && order.order_items.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex -space-x-2 shrink-0", children: order.order_items.slice(0, 5).map((item, idx) => {
                  const imgSrc = getLpgImage(item.label);
                  if (!imgSrc) return null;
                  return /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm",
                      style: { zIndex: 5 - idx },
                      title: item.label,
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: imgSrc,
                          alt: item.label,
                          className: "w-6 h-6 object-contain"
                        }
                      )
                    },
                    idx
                  );
                }) }),
                /* @__PURE__ */ jsx("span", { children: getItemsSummary(order) })
              ] }) }),
              /* @__PURE__ */ jsxs(TableCell, { className: "text-right text-sm", children: [
                getTotalQty(order),
                " unit"
              ] }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right text-sm font-medium", children: formatCurrency(order.total_amount) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "status", className: statusColors[order.current_status], children: statusLabels[order.current_status] }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: formatDate(order.created_at) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(
                Button,
                {
                  asChild: true,
                  variant: "outline",
                  size: "sm",
                  className: "hover:bg-primary hover:text-primary-foreground",
                  children: /* @__PURE__ */ jsxs("a", { href: `/detail-pesanan?code=${formatOrderCode(order)}`, className: "flex items-center justify-center gap-2", children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Eye", className: "h-4 w-4" }),
                    "Lihat"
                  ] })
                }
              ) })
            ] }, order.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/images/illustrations/empty-orders.png",
                  alt: "Tidak ada pesanan",
                  className: "w-48 h-48 object-contain opacity-80"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-1", children: "Tidak ada pesanan ditemukan" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Coba ubah filter atau kata kunci pencarian" })
              ] }),
              /* @__PURE__ */ jsx("a", { href: "/buat-pesanan", children: /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-2", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4" }),
                "Buat Pesanan Baru"
              ] }) })
            ] }) }) }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Menampilkan ",
            Math.min((currentPage - 1) * pageSize + 1, totalOrders),
            " - ",
            Math.min(currentPage * pageSize, totalOrders),
            " dari ",
            totalOrders,
            " data"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage(1),
                disabled: currentPage === 1,
                className: "hidden sm:flex",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronsLeft", className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                disabled: currentPage === 1,
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium px-3 py-1 bg-muted rounded", children: [
              currentPage,
              " / ",
              totalPages || 1
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
                disabled: currentPage === totalPages || totalPages === 0,
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage(totalPages),
                disabled: currentPage === totalPages || totalPages === 0,
                className: "hidden sm:flex",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronsRight", className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Per halaman:" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: pageSize.toString(),
                onValueChange: (v) => {
                  setPageSize(parseInt(v));
                  setCurrentPage(1);
                },
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[70px] h-8", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "10", children: "10" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "25", children: "25" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "50", children: "50" })
                  ] })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
const $$DaftarPesanan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Daftar Pesanan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "OrderListPage", OrderListPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/daftar-pesanan/OrderListPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/daftar-pesanan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/daftar-pesanan.astro";
const $$url = "/daftar-pesanan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DaftarPesanan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
