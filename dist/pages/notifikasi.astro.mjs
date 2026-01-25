import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C63pe5Ia.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { n as notificationApi, S as SafeIcon, B as Button, m as agenPangkalanOrdersApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { B as Badge, S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "../_astro/card.CnUj7wdc.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { toast } from "sonner";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { renderers } from "../renderers.mjs";
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];
function NotificationPageContent() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [stockAlertCount, setStockAlertCount] = useState(0);
  useEffect(() => {
    fetchNotifications();
  }, [currentPage, pageSize, selectedFilter]);
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications(currentPage, pageSize, selectedFilter);
      setNotifications(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
      setPendingCount(response.meta.pendingCount);
      setStockAlertCount(response.meta.stockAlertCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Gagal memuat notifikasi");
    } finally {
      setIsLoading(false);
    }
  };
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };
  const handlePageSizeChange = (value) => {
    setPageSize(parseInt(value));
    setCurrentPage(1);
  };
  const getNotificationColor = (type) => {
    switch (type) {
      case "stock_out":
      case "stock_critical":
        return "bg-destructive/10 text-destructive";
      case "stock_low":
        return "bg-amber-500/10 text-amber-600";
      case "agen_order":
        return "bg-primary/10 text-primary";
      case "order_new":
        return "bg-emerald-500/10 text-emerald-600";
      default:
        return "bg-secondary text-foreground";
    }
  };
  const getNotificationBadgeVariant = (priority) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "critical":
        return "Kritis!";
      case "high":
        return "Penting";
      case "medium":
        return "Info";
      default:
        return "";
    }
  };
  const handleNotificationClick = (notification) => {
    if (notification.link && notification.type !== "agen_order") {
      window.location.href = notification.link;
    }
  };
  const handleAcceptOrder = async (e, notification) => {
    e.stopPropagation();
    if (!notification.orderId) return;
    try {
      setProcessingId(notification.id);
      await agenPangkalanOrdersApi.confirm(notification.orderId);
      toast.success("Pesanan berhasil dikonfirmasi!");
      fetchNotifications();
    } catch (error) {
      toast.error(error.message || "Gagal mengkonfirmasi pesanan");
    } finally {
      setProcessingId(null);
    }
  };
  const handleRejectOrder = async (e, notification) => {
    e.stopPropagation();
    if (!notification.orderId) return;
    try {
      setProcessingId(notification.id);
      await agenPangkalanOrdersApi.cancel(notification.orderId);
      toast.success("Pesanan ditolak");
      fetchNotifications();
    } catch (error) {
      toast.error(error.message || "Gagal menolak pesanan");
    } finally {
      setProcessingId(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Notifikasi" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Kelola dan lihat semua notifikasi penting dari sistem" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: total }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Total Notifikasi" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingCart", className: "h-6 w-6 text-amber-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: pendingCount }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Pesanan Menunggu" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-6 w-6 text-destructive" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: stockAlertCount }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Alert Stok" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Daftar Notifikasi" }),
        /* @__PURE__ */ jsx(CardDescription, { children: isLoading ? "Memuat..." : `Menampilkan ${notifications.length} dari ${total} notifikasi` })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: fetchNotifications,
          disabled: isLoading,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: `mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}` }),
            "Refresh"
          ]
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: [
      { label: "Semua", value: "all" },
      { label: "Pesanan Pending", value: "pending", count: pendingCount },
      { label: "Alert Stok", value: "stock", count: stockAlertCount },
      { label: "Pesanan Baru", value: "order" }
    ].map((filter) => /* @__PURE__ */ jsxs(
      Button,
      {
        variant: selectedFilter === filter.value ? "default" : "outline",
        size: "sm",
        onClick: () => handleFilterChange(filter.value),
        children: [
          filter.label,
          filter.count !== void 0 && filter.count > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs", children: filter.count })
        ]
      },
      filter.value
    )) }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4 animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg bg-muted" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-3/4" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-1/2" })
      ] })
    ] }) }) }, i)) }) : notifications.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: notifications.map((notification, index) => {
      const isAgenOrder = notification.type === "agen_order";
      const isProcessing = processingId === notification.id;
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          Card,
          {
            className: `transition-all ${!isAgenOrder ? "cursor-pointer hover:shadow-md" : ""} ${notification.priority === "critical" ? "border-destructive/50" : notification.priority === "high" ? "border-amber-500/50" : ""}`,
            onClick: () => handleNotificationClick(notification),
            children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: `flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getNotificationColor(notification.type)}`, children: /* @__PURE__ */ jsx(SafeIcon, { name: notification.icon, className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: notification.title }),
                  (notification.priority === "critical" || notification.priority === "high") && /* @__PURE__ */ jsx(Badge, { variant: getNotificationBadgeVariant(notification.priority), children: getPriorityLabel(notification.priority) })
                ] }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: notification.message }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-3 w-3" }),
                  notification.time
                ] }),
                isAgenOrder && notification.orderId && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-3", children: [
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "gap-1 bg-emerald-600 hover:bg-emerald-700",
                      onClick: (e) => handleAcceptOrder(e, notification),
                      disabled: isProcessing,
                      children: [
                        isProcessing ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4" }),
                        "Terima"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "gap-1 text-rose-600 border-rose-300 hover:bg-rose-50",
                      onClick: (e) => handleRejectOrder(e, notification),
                      disabled: isProcessing,
                      children: [
                        /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4" }),
                        "Tolak"
                      ]
                    }
                  )
                ] })
              ] }),
              !isAgenOrder && notification.link && /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-5 w-5 text-muted-foreground" }) })
            ] }) })
          }
        ),
        index < notifications.length - 1 && /* @__PURE__ */ jsx(Separator, { className: "my-2" })
      ] }, notification.id);
    }) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-12 pb-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-8 w-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Tidak Ada Notifikasi" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: selectedFilter !== "all" ? "Tidak ada notifikasi untuk filter ini" : "Belum ada notifikasi saat ini" })
      ] })
    ] }) }) }),
    total > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Tampilkan" }),
          /* @__PURE__ */ jsxs(Select, { value: pageSize.toString(), onValueChange: handlePageSizeChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[80px] h-8", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: PAGE_SIZE_OPTIONS.map((size) => /* @__PURE__ */ jsx(SelectItem, { value: size.toString(), children: size }, size)) })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "per halaman" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground hidden sm:inline", children: [
          "Menampilkan ",
          (currentPage - 1) * pageSize + 1,
          "-",
          Math.min(currentPage * pageSize, total),
          " dari ",
          total
        ] })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
            disabled: currentPage === 1 || isLoading,
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4 mr-1" }),
              "Sebelumnya"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium px-2", children: [
          currentPage,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
            disabled: currentPage === totalPages || isLoading,
            children: [
              "Selanjutnya",
              /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 ml-1" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "bg-primary/5 border-primary/20", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-primary shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Notifikasi Otomatis" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sistem akan mengirimkan notifikasi otomatis untuk pesanan baru dari pangkalan, pembayaran, dan perubahan stok penting." })
      ] })
    ] }) }) })
  ] });
}
const $$Notifikasi = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Notifikasi - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "NotificationPageContent", NotificationPageContent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/notifikasi/NotificationPageContent.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/notifikasi.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/notifikasi.astro";
const $$url = "/notifikasi.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Notifikasi,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
