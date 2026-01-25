import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C7j8yK_x.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { c as cn, C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "../_astro/card.CnUj7wdc.js";
import { B as Badge, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { S as SafeIcon, B as Button, e as activityApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { MoreHorizontal } from "lucide-react";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { renderers } from "../renderers.mjs";
const Pagination = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  }
);
Pagination.displayName = "Pagination";
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  }
));
PaginationContent.displayName = "PaginationContent";
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, className: cn("", className), ...props }));
PaginationItem.displayName = "PaginationItem";
const PaginationEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  "span",
  {
    "aria-hidden": true,
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "More pages" })
    ]
  }
);
PaginationEllipsis.displayName = "PaginationEllipsis";
const formatRelativeTime = (timestamp) => {
  const now = /* @__PURE__ */ new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffMs / 864e5);
  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};
const getActivityConfig = (type, iconOverride) => {
  const configs = {
    // Order activities
    "ORDER_NEW": {
      icon: "ShoppingCart",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Pesanan Baru",
      gradient: "from-blue-500 to-blue-600"
    },
    "ORDER_CREATED": {
      icon: "ShoppingCart",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Pesanan Dibuat",
      gradient: "from-blue-500 to-blue-600"
    },
    "ORDER_UPDATED": {
      icon: "RefreshCw",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      label: "Update Pesanan",
      gradient: "from-amber-500 to-amber-600"
    },
    "ORDER_STATUS_UPDATED": {
      icon: "RefreshCw",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      label: "Status Diperbarui",
      gradient: "from-amber-500 to-amber-600"
    },
    "ORDER_COMPLETED": {
      icon: "CheckCircle2",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderColor: "border-emerald-500/20",
      label: "Selesai",
      gradient: "from-emerald-600/90 to-emerald-500/90"
    },
    "ORDER_DELIVERED": {
      icon: "Truck",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      label: "Dikirim",
      gradient: "from-cyan-500 to-cyan-600"
    },
    "ORDER_CANCELLED": {
      icon: "XCircle",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Dibatalkan",
      gradient: "from-red-500 to-red-600"
    },
    // Stock activities
    "STOCK_IN": {
      icon: "PackagePlus",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      label: "Stok Masuk",
      gradient: "from-primary to-primary/80"
    },
    "STOCK_OUT": {
      icon: "PackageMinus",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      label: "Stok Keluar",
      gradient: "from-orange-500 to-orange-600"
    },
    // System activities
    "USER_LOGIN": {
      icon: "User",
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      borderColor: "border-border",
      label: "Login",
      gradient: "from-muted-foreground/60 to-muted-foreground/50"
    },
    "SYSTEM_CREATE": {
      icon: "Plus",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderColor: "border-emerald-500/20",
      label: "Data Dibuat",
      gradient: "from-emerald-600/90 to-emerald-500/90"
    },
    "SYSTEM_UPDATE": {
      icon: "Edit",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      label: "Data Diperbarui",
      gradient: "from-amber-500 to-amber-600"
    },
    "SYSTEM_DELETE": {
      icon: "Trash2",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Data Dihapus",
      gradient: "from-red-500 to-red-600"
    }
  };
  const normalizedType = type.toUpperCase();
  const config = configs[normalizedType] || {
    icon: "Activity",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    label: "Aktivitas",
    gradient: "from-gray-500 to-gray-600"
  };
  return { ...config, icon: iconOverride || config.icon };
};
const activityFilters = [
  { value: "all", label: "Semua", icon: "ListFilter", color: "from-slate-500 to-slate-600" },
  { value: "ORDER", label: "Pesanan", icon: "ShoppingCart", color: "from-cyan-500 to-blue-600" },
  { value: "STOCK", label: "Stok LPG", icon: "Package", color: "from-primary to-primary/80" },
  { value: "SYSTEM", label: "Sistem", icon: "Settings", color: "from-slate-600 to-slate-700" }
];
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];
const TimelineSkeleton = () => /* @__PURE__ */ jsx("div", { className: "space-y-4", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 animate-pulse", style: { animationDelay: `${i * 100}ms` }, children: [
  /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex flex-col items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-slate-200 animate-shimmer" }),
    /* @__PURE__ */ jsx("div", { className: "w-0.5 h-16 bg-slate-200 mt-2 animate-shimmer" })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50/50", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-5 w-40 bg-slate-200 rounded animate-shimmer" }),
      /* @__PURE__ */ jsx("div", { className: "h-5 w-20 bg-slate-200 rounded animate-shimmer" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-4 w-3/4 bg-slate-200 rounded animate-shimmer mb-3" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-3 w-24 bg-slate-200 rounded animate-shimmer" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 w-20 bg-slate-200 rounded animate-shimmer" })
    ] })
  ] })
] }, i)) });
function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activities, setActivities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let typeParam;
        if (selectedFilter === "ORDER") {
          typeParam = "ORDER_NEW";
        } else if (selectedFilter === "STOCK") {
          typeParam = "STOCK_IN";
        } else if (selectedFilter === "SYSTEM") {
          typeParam = "USER_LOGIN";
        } else if (selectedFilter !== "all") {
          typeParam = selectedFilter;
        }
        const response = await activityApi.getAll(currentPage, itemsPerPage, typeParam);
        setActivities(response.data);
        setMeta(response.meta);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Gagal memuat riwayat aktivitas. Silakan coba lagi.");
        setActivities([]);
        setMeta(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [currentPage, itemsPerPage, selectedFilter]);
  const stats = useMemo(() => ({
    total: meta?.total || 0,
    showing: activities.length,
    orderCount: activities.filter((a) => a.type.startsWith("ORDER")).length,
    stockCount: activities.filter((a) => a.type.startsWith("STOCK")).length,
    systemCount: activities.filter((a) => a.type.startsWith("USER") || a.type.startsWith("SYSTEM")).length
  }), [meta, activities]);
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  };
  const totalPages = meta?.totalPages || 1;
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else if (currentPage <= 3) {
      items.push(1, 2, 3, 4, "ellipsis", totalPages);
    } else if (currentPage >= totalPages - 2) {
      items.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      items.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
    }
    return items;
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-primary/40" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gradient-primary", children: "Riwayat Aktivitas" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/80 mt-1", children: "Pantau semua aktivitas sistem secara real-time" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "px-4 py-2 text-sm font-medium bg-card/50 backdrop-blur-sm w-fit", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Database", className: "h-4 w-4 mr-2" }),
        isLoading ? "... " : /* @__PURE__ */ jsx(AnimatedNumber, { value: stats.total, delay: 0 }),
        " Total"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
    /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: activityFilters.map((filter) => /* @__PURE__ */ jsxs(
      Button,
      {
        variant: selectedFilter === filter.value ? "default" : "outline",
        size: "sm",
        className: `gap-2 transition-all duration-200 ${selectedFilter === filter.value ? `bg-gradient-to-r ${filter.color} text-white shadow-md hover:shadow-lg` : "bg-transparent hover:bg-white/50 text-muted-foreground"}`,
        onClick: () => handleFilterChange(filter.value),
        children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: filter.icon, className: "h-4 w-4" }),
          filter.label
        ]
      },
      filter.value
    )) }) }) }),
    /* @__PURE__ */ jsxs(Card, { className: "glass-card overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4 border-b border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Timeline Aktivitas" }),
            /* @__PURE__ */ jsx(CardDescription, { children: isLoading ? "Memuat..." : `Menampilkan ${stats.showing} dari ${stats.total} aktivitas` })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: itemsPerPage.toString(),
            onValueChange: (v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            },
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-36 bg-white/50", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: ITEMS_PER_PAGE_OPTIONS.map((opt) => /* @__PURE__ */ jsxs(SelectItem, { value: opt.toString(), children: [
                opt,
                " per halaman"
              ] }, opt)) })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
        isLoading ? /* @__PURE__ */ jsx(TimelineSkeleton, {}) : error ? (
          // Error State
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-10 w-10 text-destructive" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-xl mb-2", children: "Terjadi Kesalahan" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6 max-w-md", children: error }),
            /* @__PURE__ */ jsxs(Button, { onClick: handleRetry, className: "bg-gradient-to-r from-primary to-primary/80 text-white", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: "h-4 w-4 mr-2" }),
              "Coba Lagi"
            ] })
          ] })
        ) : activities.length === 0 ? (
          // Empty State
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/images/illustrations/empty-notification.png",
                alt: "Belum ada aktivitas",
                className: "w-48 h-48 object-contain opacity-80 mb-4"
              }
            ),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-xl mb-2", children: "Belum Ada Aktivitas" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-md", children: "Aktivitas sistem akan muncul di sini saat pesanan dibuat, pembayaran diterima, atau stok diperbarui." })
          ] })
        ) : (
          // Timeline View
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden sm:block" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: activities.map((activity, index) => {
              const config = getActivityConfig(activity.type, activity.icon_name);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative flex gap-4 group animate-fadeInUp",
                  style: { animationDelay: `${index * 50}ms` },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "hidden sm:flex flex-col items-center z-10", children: /* @__PURE__ */ jsx("div", { className: `h-12 w-12 rounded-full bg-gradient-to-br ${config.gradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`, children: /* @__PURE__ */ jsx(SafeIcon, { name: config.icon, className: "h-5 w-5 text-white" }) }) }),
                    /* @__PURE__ */ jsxs("div", { className: `flex-1 p-5 rounded-xl border ${config.borderColor} bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group-hover:translate-x-1`, children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx("div", { className: `sm:hidden h-10 w-10 rounded-xl bg-gradient-to-br ${config.gradient} shadow-sm flex items-center justify-center`, children: /* @__PURE__ */ jsx(SafeIcon, { name: config.icon, className: "h-5 w-5 text-white" }) }),
                          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-lg", children: activity.title })
                        ] }),
                        /* @__PURE__ */ jsx(Badge, { className: `text-xs bg-gradient-to-r ${config.gradient} text-white border-0 shadow-sm w-fit`, children: config.label })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: activity.description || activity.pangkalan_name || "Tidak ada detail" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 bg-muted rounded-full px-3 py-1", children: [
                          /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-3.5 w-3.5" }),
                          formatRelativeTime(activity.timestamp)
                        ] }),
                        activity.users && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 bg-muted rounded-full px-3 py-1", children: [
                          /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "h-3.5 w-3.5" }),
                          activity.users.name
                        ] }),
                        activity.detail_numeric && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 font-medium", children: [
                          /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-3.5 w-3.5" }),
                          activity.detail_numeric.toLocaleString("id-ID"),
                          " tabung"
                        ] })
                      ] })
                    ] })
                  ]
                },
                activity.id
              );
            }) })
          ] })
        ),
        meta && meta.totalPages > 1 && !isLoading && !error && /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Halaman ",
            currentPage,
            " dari ",
            totalPages
          ] }),
          /* @__PURE__ */ jsx(Pagination, { children: /* @__PURE__ */ jsxs(PaginationContent, { children: [
            /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: currentPage === 1,
                onClick: () => setCurrentPage((p) => p - 1),
                className: "hover:bg-purple-50",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4 mr-1" }),
                  "Prev"
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mx-2", children: getPaginationItems().map((item, i) => /* @__PURE__ */ jsx(PaginationItem, { children: item === "ellipsis" ? /* @__PURE__ */ jsx(PaginationEllipsis, {}) : /* @__PURE__ */ jsx(
              Button,
              {
                variant: item === currentPage ? "default" : "ghost",
                size: "sm",
                onClick: () => setCurrentPage(item),
                className: item === currentPage ? "bg-purple-500 hover:bg-purple-600" : "",
                children: item
              }
            ) }, i)) }),
            /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: currentPage === totalPages,
                onClick: () => setCurrentPage((p) => p + 1),
                className: "hover:bg-purple-50",
                children: [
                  "Next",
                  /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 ml-1" })
                ]
              }
            ) })
          ] }) })
        ] }) })
      ] })
    ] })
  ] });
}
const $$RiwayatAktivitas = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Aktivitas Terbaru - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "ActivityPage", ActivityPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/riwayat-aktivitas/ActivityPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/riwayat-aktivitas.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/riwayat-aktivitas.astro";
const $$url = "/riwayat-aktivitas.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$RiwayatAktivitas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
