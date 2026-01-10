import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BOBS5-gD.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { B as Button, S as SafeIcon } from "../_astro/AuthGuard.Cq_0lvUi.js";
import "../_astro/currency._AzJKMQz.js";
import { B as Badge, S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "../_astro/card.OLhQVURm.js";
import { A as AdminFooter } from "../_astro/AdminFooter.B5Ap1SI9.js";
import { renderers } from "../renderers.mjs";
const mockNotifications = [
  {
    id: 1,
    title: "Pesanan Baru",
    message: "Pesanan #12345 dari Pangkalan Maju Jaya telah dibuat",
    time: "5 menit yang lalu",
    type: "info",
    icon: "ShoppingCart",
    read: false
  },
  {
    id: 2,
    title: "Pembayaran Diterima",
    message: "Pembayaran untuk pesanan #12344 telah dikonfirmasi sebesar Rp 2.500.000",
    time: "1 jam yang lalu",
    type: "success",
    icon: "CheckCircle",
    read: false
  },
  {
    id: 3,
    title: "Stok Menipis",
    message: "Stok LPG 3kg tersisa 50 tabung. Pertimbangkan untuk melakukan pemesanan ulang.",
    time: "2 jam yang lalu",
    type: "warning",
    icon: "AlertTriangle",
    read: false
  },
  {
    id: 4,
    title: "Pengiriman Selesai",
    message: "Pengiriman #DEL-001 ke Pangkalan Sejahtera telah selesai",
    time: "3 jam yang lalu",
    type: "success",
    icon: "Truck",
    read: true
  },
  {
    id: 5,
    title: "Driver Tidak Tersedia",
    message: "Driver Budi tidak tersedia untuk pengiriman pada tanggal 15 Januari 2026",
    time: "5 jam yang lalu",
    type: "warning",
    icon: "AlertCircle",
    read: true
  },
  {
    id: 6,
    title: "Sistem Update",
    message: "Sistem akan melakukan pemeliharaan pada 20 Januari 2026 pukul 22:00 - 23:00",
    time: "1 hari yang lalu",
    type: "info",
    icon: "Info",
    read: true
  },
  {
    id: 7,
    title: "Pesanan Dibatalkan",
    message: "Pesanan #12340 telah dibatalkan oleh Pangkalan Sentosa",
    time: "2 hari yang lalu",
    type: "error",
    icon: "XCircle",
    read: true
  },
  {
    id: 8,
    title: "Laporan Bulanan Siap",
    message: "Laporan penjualan bulan Januari 2026 telah siap untuk diunduh",
    time: "3 hari yang lalu",
    type: "info",
    icon: "FileText",
    read: true
  }
];
function NotificationPageContent() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !notif.read;
    return notif.type === selectedFilter;
  });
  const unreadCount = notifications.filter((n) => !n.read).length;
  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "bg-primary/10 text-primary";
      case "warning":
        return "bg-accent/20 text-accent-foreground";
      case "error":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary text-foreground";
    }
  };
  const getNotificationBadgeVariant = (type) => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };
  const markAsRead = (id) => {
    setNotifications(notifications.map(
      (n) => n.id === id ? { ...n, read: true } : n
    ));
  };
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };
  const clearAll = () => {
    setNotifications([]);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Notifikasi" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Kelola dan lihat semua notifikasi penting dari sistem" })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Daftar Notifikasi" }),
        /* @__PURE__ */ jsx(CardDescription, { children: unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        unreadCount > 0 && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: markAllAsRead,
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "mr-2 h-4 w-4" }),
              "Tandai Semua Dibaca"
            ]
          }
        ),
        notifications.length > 0 && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: clearAll,
            className: "text-destructive hover:text-destructive",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "mr-2 h-4 w-4" }),
              "Hapus Semua"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: [
      { label: "Semua", value: "all" },
      { label: "Belum Dibaca", value: "unread" },
      { label: "Sukses", value: "success" },
      { label: "Peringatan", value: "warning" },
      { label: "Error", value: "error" }
    ].map((filter) => /* @__PURE__ */ jsx(
      Button,
      {
        variant: selectedFilter === filter.value ? "default" : "outline",
        size: "sm",
        onClick: () => setSelectedFilter(filter.value),
        children: filter.label
      },
      filter.value
    )) }),
    filteredNotifications.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: filteredNotifications.map((notification, index) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Card, { className: `transition-all ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`, children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: `flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getNotificationColor(notification.type)}`, children: /* @__PURE__ */ jsx(SafeIcon, { name: notification.icon, className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: notification.title }),
              !notification.read && /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-primary" })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: getNotificationBadgeVariant(notification.type), children: [
              notification.type === "success" && "Sukses",
              notification.type === "warning" && "Peringatan",
              notification.type === "error" && "Error",
              notification.type === "info" && "Info"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: notification.message }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: notification.time })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0", children: [
          !notification.read && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => markAsRead(notification.id),
              title: "Tandai sebagai dibaca",
              children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => deleteNotification(notification.id),
              className: "text-destructive hover:text-destructive",
              title: "Hapus notifikasi",
              children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4" })
            }
          )
        ] })
      ] }) }) }),
      index < filteredNotifications.length - 1 && /* @__PURE__ */ jsx(Separator, { className: "my-2" })
    ] }, notification.id)) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-12 pb-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-8 w-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Tidak Ada Notifikasi" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: selectedFilter === "unread" ? "Semua notifikasi sudah dibaca" : "Tidak ada notifikasi untuk filter yang dipilih" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "bg-primary/5 border-primary/20", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-primary shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Notifikasi Otomatis" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sistem akan mengirimkan notifikasi otomatis untuk pesanan baru, pembayaran, pengiriman, dan perubahan stok penting." })
      ] })
    ] }) }) })
  ] });
}
const $$NotifikasiModal = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Notifikasi - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "NotificationPageContent", NotificationPageContent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/notifikasi-modal/NotificationPageContent.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/notifikasi-modal.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/notifikasi-modal.astro";
const $$url = "/notifikasi-modal.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$NotifikasiModal,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
