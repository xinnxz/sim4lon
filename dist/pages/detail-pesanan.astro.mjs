import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C63pe5Ia.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as SafeIcon, B as Button, o as ordersApi, d as driversApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { C as Card, b as CardHeader, d as CardTitle, a as CardContent } from "../_astro/card.CnUj7wdc.js";
import { S as Separator, B as Badge, e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, A as Avatar, k as AvatarFallback, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "../_astro/table.OJLE4Veh.js";
import { f as formatCurrency } from "../_astro/currency.CHcHKzei.js";
import { u as useAppSettings } from "../_astro/useAppSettings.B8L48MuF.js";
import { toast } from "sonner";
import { renderers } from "../renderers.mjs";
function OrderItemsTable({ items, showTotalRow = false }) {
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalSubtotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
  return /* @__PURE__ */ jsxs(Card, { className: "shadow-none border-0 hover:shadow-none", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Item Pesanan" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Jenis LPG" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Qty" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Harga Satuan" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Subtotal" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: items.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: item.type }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: item.quantity }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right whitespace-nowrap", children: formatCurrency(item.price) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right font-medium whitespace-nowrap", children: formatCurrency(item.subtotal) })
      ] }, item.id)) }),
      showTotalRow && /* @__PURE__ */ jsx(TableFooter, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50 font-semibold", children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-bold", children: "Total" }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right font-bold", children: totalQty }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right" }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right font-bold whitespace-nowrap", children: formatCurrency(totalSubtotal) })
      ] }) })
    ] }) }) })
  ] });
}
function OrderSummaryCard({ order }) {
  const { settings: appSettings } = useAppSettings();
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 sm:pb-4", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base sm:text-lg", children: "Ringkasan Pesanan" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 sm:space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Tanggal Pesanan" }),
        /* @__PURE__ */ jsxs("p", { className: "font-medium text-sm sm:text-base", children: [
          order.createdDate,
          " ",
          order.createdTime
        ] })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(OrderItemsTable, { items: order.items, showTotalRow: true }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:space-y-3 px-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs sm:text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatCurrency(order.subtotal) })
        ] }),
        order.tax > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs sm:text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground flex items-center gap-1 sm:gap-2", children: [
            "PPN ",
            appSettings.ppnRate,
            "%",
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0 bg-orange-50 text-orange-600 border-orange-200", children: "Non-Subsidi" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-orange-600", children: [
            "+ ",
            formatCurrency(order.tax)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-primary/10 p-3 sm:p-4 rounded-lg border border-primary/20", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-sm sm:text-base", children: "Total" }),
        /* @__PURE__ */ jsx("span", { className: "text-lg sm:text-xl font-bold text-primary", children: formatCurrency(order.total) })
      ] })
    ] })
  ] });
}
function OrderTimelineStatus({ timeline }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Timeline Status" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: timeline.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-full border-2 ${item.completed ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted text-muted-foreground"}`, children: item.completed ? /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-5 w-5" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-5 w-5" }) }),
        index < timeline.length - 1 && /* @__PURE__ */ jsx("div", { className: `w-0.5 h-12 ${item.completed ? "bg-primary" : "bg-muted"}` })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 pt-1", children: [
        /* @__PURE__ */ jsx("p", { className: `font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`, children: item.label }),
        item.date && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: item.date })
      ] })
    ] }, item.status)) }) })
  ] });
}
function OrderActionsPanel({
  orderStatus,
  onPaymentClick,
  onPaymentConfirmed,
  onPrintInvoice,
  onSendInvoiceWA,
  onSendNotaWA,
  onDriverAssignClick,
  onCompleteOrder,
  onEditOrder,
  onCancelOrder,
  onConfirmOrder,
  isPaymentConfirmed = false,
  isDriverAssigned = false,
  isPaid = false
}) {
  const isDraft = orderStatus === "created";
  const isPending = orderStatus === "pending_payment";
  const isConfirmed = orderStatus === "payment_confirmed" || orderStatus === "ready_to_ship";
  const isInDelivery = orderStatus === "in_delivery";
  const isCompleted = orderStatus === "completed";
  const isCancelled = orderStatus === "cancelled";
  const canEdit = orderStatus === "created";
  const canCancel = !isCompleted && !isCancelled;
  const canComplete = (isDriverAssigned || isInDelivery) && !isCompleted && !isCancelled;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Aksi" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
      isDraft && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: onConfirmOrder,
            className: "w-full bg-primary hover:bg-primary/90",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "mr-2 h-4 w-4" }),
              "Konfirmasi Pesanan"
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Konfirmasi untuk memproses ke tahap pembayaran" })
      ] }),
      isPending && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: onPaymentClick,
            className: "w-full bg-primary hover:bg-primary/90",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "CreditCard", className: "mr-2 h-4 w-4" }),
              "Catat Pembayaran"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: onPaymentConfirmed,
            variant: "outline",
            className: "w-full",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "mr-2 h-4 w-4" }),
              "Konfirmasi Lunas (Cash)"
            ]
          }
        )
      ] }),
      isConfirmed && !isDriverAssigned && /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onDriverAssignClick,
          className: "w-full bg-primary hover:bg-primary/90",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "UserPlus", className: "mr-2 h-4 w-4" }),
            "Tugaskan Driver"
          ]
        }
      ),
      canComplete && /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onCompleteOrder,
          className: "w-full bg-green-600 hover:bg-green-700",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle2", className: "mr-2 h-4 w-4" }),
            "Selesaikan Pesanan"
          ]
        }
      ),
      canEdit && onEditOrder && /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onEditOrder,
          variant: "outline",
          className: "w-full",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Edit", className: "mr-2 h-4 w-4" }),
            "Edit Pesanan"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: onPrintInvoice,
            variant: "outline",
            className: "w-full",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Printer", className: "mr-2 h-4 w-4" }),
              "Cetak Invoice/Nota"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "w-full",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "MessageCircle", className: "mr-2 h-4 w-4" }),
                "Share via WA",
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "ml-2 h-3 w-3" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: onSendInvoiceWA, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "mr-2 h-4 w-4 text-amber-500" }),
              "Share Invoice"
            ] }),
            isPaid && onSendNotaWA && /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: onSendNotaWA, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "mr-2 h-4 w-4 text-green-500" }),
              "Share Nota"
            ] }),
            !isPaid && /* @__PURE__ */ jsxs(DropdownMenuItem, { disabled: true, className: "opacity-50 cursor-not-allowed", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "mr-2 h-4 w-4" }),
              "Nota (Belum Lunas)"
            ] })
          ] })
        ] })
      ] }),
      canCancel && onCancelOrder && /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onCancelOrder,
          variant: "outline",
          className: "w-full text-destructive border-destructive/50 hover:bg-destructive/10",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "mr-2 h-4 w-4" }),
            "Batalkan Pesanan"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => window.location.href = "/daftar-pesanan",
          variant: "ghost",
          className: "w-full",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "mr-2 h-4 w-4" }),
            "Kembali ke Daftar"
          ]
        }
      )
    ] })
  ] });
}
function CustomerInfoCard({ customer }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 sm:pb-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base sm:text-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-4 w-4 text-primary" }),
      "Informasi Pangkalan"
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 sm:space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Nama Pangkalan" }),
        /* @__PURE__ */ jsx("p", { className: "font-medium text-sm sm:text-base", children: customer.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Alamat" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm", children: customer.address })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Email" }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `mailto:${customer.email}`,
            className: "text-xs sm:text-sm text-primary hover:underline flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Mail", className: "h-3 w-3 sm:h-4 sm:w-4" }),
              customer.email
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t pt-3 sm:pt-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Kontak Penanggung Jawab" }),
        /* @__PURE__ */ jsx("p", { className: "font-medium text-xs sm:text-sm", children: customer.contact }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `tel:${customer.contactPhone}`,
            className: "text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 mt-1",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-3 w-3 sm:h-4 sm:w-4" }),
              customer.contactPhone
            ]
          }
        )
      ] })
    ] })
  ] });
}
function DeliveryInfoCard({ delivery }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 sm:pb-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base sm:text-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-4 w-4 text-indigo-500" }),
      "Informasi Pengiriman"
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 sm:space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Status Pengiriman" }),
        /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "status",
            className: `mt-1 text-xs ${delivery.status === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : delivery.status === "not_scheduled" || delivery.status === "ready_to_ship" ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" : delivery.status === "scheduled" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : delivery.status === "in_delivery" || delivery.status === "assigned" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`,
            children: delivery.statusLabel
          }
        )
      ] }),
      delivery.driver ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Driver" }),
        /* @__PURE__ */ jsx("p", { className: "font-medium text-sm sm:text-base", children: delivery.driver }),
        delivery.driverPhone && /* @__PURE__ */ jsxs(
          "a",
          {
            href: `tel:${delivery.driverPhone}`,
            className: "text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 mt-1",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-3 w-3 sm:h-4 sm:w-4" }),
              delivery.driverPhone
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Driver" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground italic", children: "Belum ditugaskan" })
      ] }),
      delivery.estimatedDate ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Tanggal Estimasi" }),
        /* @__PURE__ */ jsx("p", { className: "font-medium text-sm sm:text-base", children: delivery.estimatedDate })
      ] }) : null,
      /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 p-2 sm:p-3 rounded-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground font-medium mb-1", children: "Catatan" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm", children: delivery.notes })
      ] })
    ] })
  ] });
}
const STATUS_MAP = {
  DRAFT: { status: "created", label: "Draft" },
  MENUNGGU_PEMBAYARAN: { status: "pending_payment", label: "Menunggu Pembayaran" },
  DIPROSES: { status: "payment_confirmed", label: "Pembayaran Diterima" },
  SIAP_KIRIM: { status: "ready_to_ship", label: "Siap Dikirim" },
  // Legacy
  DIKIRIM: { status: "in_delivery", label: "Sedang Dikirim" },
  SELESAI: { status: "completed", label: "Pesanan Selesai" },
  BATAL: { status: "cancelled", label: "Dibatalkan" }
};
function mapApiToUI(apiOrder) {
  const statusInfo = STATUS_MAP[apiOrder.current_status] || { status: "unknown", label: "Unknown" };
  const createdAt = new Date(apiOrder.created_at);
  const paymentDetails = Array.isArray(apiOrder.order_payment_details) ? apiOrder.order_payment_details[0] : apiOrder.order_payment_details;
  return {
    id: apiOrder.code || `ORD-${apiOrder.id.slice(0, 4).toUpperCase()}`,
    apiId: apiOrder.id,
    status: statusInfo.status,
    statusLabel: statusInfo.label,
    createdDate: createdAt.toLocaleDateString("id-ID"),
    createdTime: createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    customer: {
      name: apiOrder.pangkalans?.name || "Unknown",
      address: apiOrder.pangkalans?.address || "-",
      email: apiOrder.pangkalans?.email || "-",
      contact: apiOrder.pangkalans?.pic_name || "-",
      contactPhone: apiOrder.pangkalans?.phone || "-"
    },
    items: apiOrder.order_items.map((item, idx) => ({
      id: idx + 1,
      type: item.label || item.lpg_type,
      quantity: item.qty,
      price: item.price_per_unit,
      subtotal: item.sub_total
    })),
    subtotal: apiOrder.subtotal || apiOrder.total_amount,
    tax: apiOrder.tax_amount || 0,
    total: apiOrder.total_amount,
    paymentMethod: paymentDetails?.payment_method || null,
    paidAmount: paymentDetails?.amount_paid || 0,
    paymentProofUrl: paymentDetails?.proof_url || null,
    delivery: {
      status: apiOrder.current_status === "BATAL" ? "cancelled" : apiOrder.drivers ? "assigned" : "not_scheduled",
      statusLabel: apiOrder.current_status === "BATAL" ? "Dibatalkan" : apiOrder.drivers ? "Sedang Dikirim" : "Belum Dijadwalkan",
      driver: apiOrder.drivers?.name || null,
      driverPhone: apiOrder.drivers?.phone || null,
      estimatedDate: null,
      notes: apiOrder.note || "Tidak ada catatan"
    },
    timeline: buildTimeline(apiOrder)
  };
}
function buildTimeline(apiOrder) {
  const baseTimeline = [
    { status: "created", label: "Pesanan Dibuat", date: null, completed: false },
    { status: "pending_payment", label: "Menunggu Pembayaran", date: null, completed: false },
    { status: "payment_confirmed", label: "Pembayaran Diterima", date: null, completed: false },
    { status: "in_delivery", label: "Sedang Dikirim", date: null, completed: false },
    { status: "completed", label: "Pesanan Selesai", date: null, completed: false }
  ];
  baseTimeline[0].completed = true;
  baseTimeline[0].date = new Date(apiOrder.created_at).toLocaleString("id-ID");
  if (apiOrder.timeline_tracks) {
    apiOrder.timeline_tracks.forEach((track) => {
      const mappedStatus = STATUS_MAP[track.status]?.status;
      const idx = baseTimeline.findIndex((t) => t.status === mappedStatus);
      if (idx !== -1) {
        baseTimeline[idx].completed = true;
        baseTimeline[idx].date = new Date(track.created_at).toLocaleString("id-ID");
      }
    });
  }
  let highestCompletedIndex = -1;
  for (let i = baseTimeline.length - 1; i >= 0; i--) {
    if (baseTimeline[i].completed) {
      highestCompletedIndex = i;
      break;
    }
  }
  if (highestCompletedIndex > 0) {
    for (let i = 0; i < highestCompletedIndex; i++) {
      if (!baseTimeline[i].completed) {
        baseTimeline[i].completed = true;
        baseTimeline[i].date = new Date(apiOrder.created_at).toLocaleString("id-ID");
      }
    }
  }
  return baseTimeline;
}
function OrderDetailContent() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const getOrderIdOrCode = () => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("code") || params.get("id");
  };
  useEffect(() => {
    const fetchData = async () => {
      const orderId = getOrderIdOrCode();
      if (!orderId) {
        toast.error("ID pesanan tidak ditemukan");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const [apiOrder, driversRes] = await Promise.all([
          ordersApi.getById(orderId),
          driversApi.getAll(1, 100, void 0, true)
        ]);
        console.log("API Order:", apiOrder);
        console.log("Payment Details:", apiOrder.order_payment_details);
        console.log("Proof URL:", apiOrder.order_payment_details?.[0]?.proof_url);
        setOrder(mapApiToUI(apiOrder));
        setDrivers(driversRes.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Gagal memuat data pesanan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const updateStatus = async (newStatus, description) => {
    if (!order) return;
    try {
      setIsUpdating(true);
      const updated = await ordersApi.updateStatus(order.apiId, { status: newStatus, description });
      setOrder(mapApiToUI(updated));
      toast.success(`Status diubah ke ${STATUS_MAP[newStatus].label}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(error.message || "Gagal mengubah status");
    } finally {
      setIsUpdating(false);
    }
  };
  const updateStatusWithPayment = async (newStatus, description, paymentMethod) => {
    if (!order) return;
    try {
      setIsUpdating(true);
      const updated = await ordersApi.updateStatus(order.apiId, {
        status: newStatus,
        description,
        payment_method: paymentMethod
        // Include payment method in request
      });
      setOrder(mapApiToUI(updated));
      toast.success(`Status diubah ke ${STATUS_MAP[newStatus].label}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(error.message || "Gagal mengubah status");
    } finally {
      setIsUpdating(false);
    }
  };
  const handlePaymentClick = () => {
    window.location.href = `/catat-pembayaran?code=${order?.id}`;
  };
  const handlePaymentConfirmed = async () => {
    await updateStatusWithPayment("DIPROSES", "Pembayaran dikonfirmasi (Cash)", "TUNAI");
  };
  const handlePrintInvoice = () => {
    if (!order) return;
    const isPaid = order.status === "payment_confirmed" || order.status === "DIPROSES" || order.status === "SELESAI";
    const docType = isPaid ? "nota" : "invoice";
    window.location.href = `/nota-pembayaran?code=${order.id}&type=${docType}`;
  };
  const generateWhatsAppMessage = (docType) => {
    if (!order) return;
    const isNota = docType === "nota";
    const docTitle = isNota ? "NOTA PEMBAYARAN" : "INVOICE";
    isNota ? `NOTA-${order.id.replace("ORD-", "")}` : `INV-${order.id.replace("ORD-", "")}`;
    const itemLines = order.items.map(
      (item) => `• ${item.type} x${item.quantity} = Rp ${item.subtotal.toLocaleString("id-ID")}`
    ).join("\n");
    const docLink = `${window.location.origin}/nota-pembayaran?code=${order.id}&type=${docType}`;
    const message = `*${docTitle}*

\`No: ${order.id}\`
\`Tgl: ${order.createdDate}\`

*Kepada:*
${order.customer.name}
${order.customer.address}

*Item Pesanan:*
${itemLines}

\`\`\`
SUBTOTAL : Rp ${order.subtotal.toLocaleString("id-ID")}
PPN      : Rp ${order.tax.toLocaleString("id-ID")}
TOTAL    : Rp ${order.total.toLocaleString("id-ID")}
\`\`\`

${isNota ? "*Status: LUNAS*" : "*Status: Belum Dibayar*"}

*Lihat Dokumen:*
${docLink}

_SIM4LON - Sistem Manajemen LPG_`;
    const phone = order.customer.contactPhone?.replace(/\D/g, "") || "";
    const whatsappUrl = `https://wa.me/62${phone.startsWith("0") ? phone.slice(1) : phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  const handleSendInvoiceWA = () => {
    generateWhatsAppMessage("invoice");
  };
  const handleSendNotaWA = () => {
    generateWhatsAppMessage("nota");
  };
  const handleSelectDriver = async (driverId) => {
    if (!order) return;
    try {
      setIsUpdating(true);
      const [, updated] = await Promise.all([
        // 1. Update driver assignment
        ordersApi.update(order.apiId, { driver_id: driverId }),
        // 2. Update status to DIKIRIM
        ordersApi.updateStatus(order.apiId, {
          status: "DIKIRIM",
          note: "Driver ditugaskan, pesanan sedang dikirim"
        })
      ]);
      setOrder(mapApiToUI(updated));
      setIsDriverModalOpen(false);
      toast.success("Driver berhasil ditugaskan");
    } catch (error) {
      console.error("Failed to assign driver:", error);
      toast.error(error.message || "Gagal menugaskan driver");
    } finally {
      setIsUpdating(false);
    }
  };
  const handleCompleteOrder = async () => {
    await updateStatus("SELESAI", "Pesanan selesai");
  };
  const handleConfirmOrder = async () => {
    await updateStatus("MENUNGGU_PEMBAYARAN", "Pesanan dikonfirmasi, menunggu pembayaran");
  };
  const handleEditOrder = () => {
    if (order) {
      window.location.href = `/buat-pesanan?code=${order.id}`;
    }
  };
  const handleCancelOrder = () => {
    setIsCancelModalOpen(true);
  };
  const confirmCancelOrder = async () => {
    await updateStatus("BATAL", "Pesanan dibatalkan");
    setIsCancelModalOpen(false);
    window.location.href = "/daftar-pesanan";
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center justify-center p-6", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "ml-2", children: "Memuat detail pesanan..." })
    ] });
  }
  if (!order) {
    return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-6 gap-4", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/images/illustrations/error-illustration.png",
          alt: "Pesanan tidak ditemukan",
          className: "w-40 h-40 object-contain opacity-80"
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Pesanan Tidak Ditemukan" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center text-sm max-w-md", children: "Pesanan yang Anda cari tidak tersedia atau mungkin sudah dihapus." }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => window.location.href = "/daftar-pesanan", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "mr-2 h-4 w-4" }),
        "Kembali ke Daftar"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => window.location.href = "/daftar-pesanan",
            className: "h-8 w-8 sm:h-10 sm:w-10",
            children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "h-4 w-4 sm:h-5 sm:w-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-3xl font-bold", children: "Detail Pesanan" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground font-mono", children: [
            "ID: ",
            order.id
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Badge,
        {
          variant: "status",
          className: `self-start sm:self-auto text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2 ${order.status === "pending_payment" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" : order.status === "payment_confirmed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" : order.status === "in_delivery" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" : order.status === "completed" || order.status === "delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : order.status === "cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}`,
          children: order.statusLabel
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Separator, { className: "hidden sm:block" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1", children: [
        /* @__PURE__ */ jsx(OrderSummaryCard, { order }),
        /* @__PURE__ */ jsx(OrderTimelineStatus, { timeline: order.timeline })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6 order-1 lg:order-2", children: [
        /* @__PURE__ */ jsx(CustomerInfoCard, { customer: order.customer }),
        /* @__PURE__ */ jsx(DeliveryInfoCard, { delivery: order.delivery }),
        order.paymentProofUrl && /* @__PURE__ */ jsxs(Card, { className: "glass-card overflow-hidden", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4 text-primary" }),
            "Bukti Transfer"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "pt-0", children: [
            order.paymentProofUrl.endsWith(".pdf") ? (
              // PDF Link
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: order.paymentProofUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-6 w-6 text-red-600 dark:text-red-400" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: "Bukti Transfer (PDF)" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: order.paymentProofUrl.split("/").pop() })
                    ] }),
                    /* @__PURE__ */ jsx(SafeIcon, { name: "ExternalLink", className: "h-4 w-4 text-muted-foreground shrink-0" })
                  ]
                }
              )
            ) : (
              // Image Preview
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: order.paymentProofUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "block rounded-lg overflow-hidden border hover:opacity-90 transition-opacity",
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: order.paymentProofUrl,
                      alt: "Bukti Transfer",
                      className: "w-full h-auto max-h-48 object-contain bg-slate-50 dark:bg-slate-900"
                    }
                  )
                }
              )
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-2 text-center", children: "Klik untuk melihat ukuran penuh" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          OrderActionsPanel,
          {
            orderStatus: order.status,
            onPaymentClick: handlePaymentClick,
            onPaymentConfirmed: handlePaymentConfirmed,
            onPrintInvoice: handlePrintInvoice,
            onSendInvoiceWA: handleSendInvoiceWA,
            onSendNotaWA: handleSendNotaWA,
            onDriverAssignClick: () => setIsDriverModalOpen(true),
            onCompleteOrder: handleCompleteOrder,
            onEditOrder: handleEditOrder,
            onCancelOrder: handleCancelOrder,
            onConfirmOrder: handleConfirmOrder,
            isPaymentConfirmed: order.status === "payment_confirmed",
            isDriverAssigned: order.delivery.driver !== null,
            isPaid: order.status === "payment_confirmed" || order.status === "DIPROSES" || order.status === "SELESAI"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isDriverModalOpen, onOpenChange: setIsDriverModalOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Pilih Driver" }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-80 overflow-y-auto", children: drivers.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-4 text-muted-foreground", children: "Tidak ada supir tersedia" }) : drivers.map((driver) => {
        const isBusy = driver.is_busy || false;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => !isBusy && handleSelectDriver(driver.id),
            disabled: isUpdating || isBusy,
            className: `w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left
                      ${isBusy ? "opacity-60 cursor-not-allowed bg-muted/50 border-dashed" : "hover:bg-accent disabled:opacity-50"}`,
            title: isBusy ? `Sedang mengantar ${driver.active_order?.code || "pesanan"}` : "Pilih supir ini",
            children: [
              /* @__PURE__ */ jsx(Avatar, { className: "h-10 w-10", children: /* @__PURE__ */ jsx(AvatarFallback, { className: isBusy ? "bg-orange-100 text-orange-600" : "", children: driver.name.charAt(0) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: driver.name }),
                  isBusy && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs bg-orange-100 text-orange-700 border-orange-200", children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-3 w-3 mr-1" }),
                    "Mengantar"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: isBusy ? `Sedang antar: ${driver.active_order?.code || "pesanan"}` : driver.phone || "Tersedia" })
              ] }),
              selectedDriverId === driver.id && !isBusy && /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-5 w-5 text-primary" }),
              !isBusy && /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 text-muted-foreground" })
            ]
          },
          driver.id
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isCancelModalOpen, onOpenChange: setIsCancelModalOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-5 w-5 text-destructive" }),
        "Batalkan Pesanan"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-destructive/10 border border-destructive/20 rounded-lg p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive mb-2", children: "Tindakan ini tidak dapat dibatalkan" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Apakah Anda yakin ingin membatalkan pesanan ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: order.id }),
            "? Pesanan akan ditandai sebagai dibatalkan dan tidak dapat diproses lebih lanjut."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => setIsCancelModalOpen(false),
              variant: "outline",
              className: "flex-1",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: confirmCancelOrder,
              variant: "destructive",
              className: "flex-1",
              disabled: isUpdating,
              children: [
                isUpdating ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "mr-2 h-4 w-4" }),
                "Batalkan Pesanan"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const $$DetailPesanan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Detail Pesanan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "OrderDetailContent", OrderDetailContent, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/detail-pesanan/OrderDetailContent.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/detail-pesanan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/detail-pesanan.astro";
const $$url = "/detail-pesanan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DetailPesanan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
