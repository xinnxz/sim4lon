import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.Bvdpe0CJ.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { S as SafeIcon, B as Button, o as ordersApi, u as uploadApi, a as paymentApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { c as cn, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "../_astro/card.CnUj7wdc.js";
import { L as Label } from "../_astro/label.C1We_4rW.js";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { T as Textarea } from "../_astro/textarea.F19kpFWl.js";
import { S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { f as formatCurrency } from "../_astro/currency.CHcHKzei.js";
import { toast } from "sonner";
import { renderers } from "../renderers.mjs";
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
function PaymentRecordForm({
  order,
  onSubmit,
  isSubmitting,
  isPaymentSuccessful = false
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const amount = order.totalAmount;
  const [transferProof, setTransferProof] = useState(null);
  const [transferProofUrl, setTransferProofUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const processFile = (file) => {
    if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        transferProof: "Format file harus JPG, PNG, WebP, atau PDF"
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        transferProof: "Ukuran file maksimal 5MB"
      }));
      return;
    }
    setTransferProof(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.transferProof;
      return newErrors;
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPaymentSuccessful) {
      setIsDragging(true);
    }
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isPaymentSuccessful) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (paymentMethod === "transfer") {
      if (!transferProof && !transferProofUrl.trim()) {
        newErrors.transferProof = "Bukti transfer harus diunggah";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = {
      orderId: order.id,
      paymentMethod,
      amount,
      // Already a number, no parsing needed
      transferProof: paymentMethod === "transfer" ? transferProof : null,
      transferProofUrl: paymentMethod === "transfer" ? transferProofUrl : void 0,
      notes,
      recordedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    onSubmit(formData);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    isPaymentSuccessful && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-6 w-6 text-green-600" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-green-900", children: "✔️ Sudah Dibayar" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-green-700", children: "Pembayaran telah berhasil dicatat dan aman tersimpan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "Metode Pembayaran" }),
      /* @__PURE__ */ jsxs(
        RadioGroup,
        {
          value: paymentMethod,
          onValueChange: setPaymentMethod,
          disabled: isPaymentSuccessful,
          children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center space-x-2 p-3 border rounded-lg ${isPaymentSuccessful ? "bg-muted/50 cursor-not-allowed" : "hover:bg-secondary/50 cursor-pointer"}`, children: [
              /* @__PURE__ */ jsx(RadioGroupItem, { value: "cash", id: "cash", disabled: isPaymentSuccessful }),
              /* @__PURE__ */ jsxs(Label, { htmlFor: "cash", className: `flex-1 ${isPaymentSuccessful ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`, children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Cash" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Pembayaran langsung dengan uang tunai" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `flex items-center space-x-2 p-3 border rounded-lg ${isPaymentSuccessful ? "bg-muted/50 cursor-not-allowed" : "hover:bg-secondary/50 cursor-pointer"}`, children: [
              /* @__PURE__ */ jsx(RadioGroupItem, { value: "transfer", id: "transfer", disabled: isPaymentSuccessful }),
              /* @__PURE__ */ jsxs(Label, { htmlFor: "transfer", className: `flex-1 ${isPaymentSuccessful ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`, children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Cashless" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Pembayaran melalui transfer bank / non-tunai" })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t pt-6" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { className: "font-semibold", children: "Nominal Pembayaran" }),
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-primary", children: formatCurrency(amount) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Sesuai total pesanan" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-5 w-5 text-primary" }) })
      ] }) })
    ] }),
    paymentMethod === "transfer" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "border-t pt-6" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "transferProof", className: "font-semibold", children: "Bukti Transfer" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `border-2 border-dashed rounded-lg p-4 text-center transition-all ${isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "hover:bg-secondary/50"} ${isPaymentSuccessful ? "opacity-60 cursor-not-allowed" : ""}`,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "transferProof",
                  type: "file",
                  accept: ".jpg,.jpeg,.png,.pdf",
                  onChange: handleFileChange,
                  className: "hidden",
                  disabled: isPaymentSuccessful
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "transferProof", className: isPaymentSuccessful ? "cursor-not-allowed block" : "cursor-pointer block", children: transferProof ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                imagePreview && /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-xs", children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "cursor-pointer group",
                      onClick: (e) => {
                        e.preventDefault();
                        setShowPreviewModal(true);
                      },
                      children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: imagePreview,
                            alt: "Bukti transfer",
                            className: "w-full max-h-40 object-contain rounded-lg border shadow-sm group-hover:opacity-90 transition-opacity"
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ZoomIn", className: "h-8 w-8 text-white" }) })
                      ]
                    }
                  ),
                  !isPaymentSuccessful && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTransferProof(null);
                        setImagePreview(null);
                        const input = document.getElementById("transferProof");
                        if (input) input.value = "";
                      },
                      className: "absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors z-10",
                      title: "Hapus gambar",
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-5 w-5 text-primary" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate max-w-[200px]", children: transferProof.name })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Klik gambar untuk zoom • Klik area lain untuk ganti file" })
              ] }) : /* @__PURE__ */ jsxs("div", { className: `space-y-2 ${isPaymentSuccessful ? "opacity-60" : ""}`, children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Upload", className: "h-8 w-8 mx-auto text-muted-foreground" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: isDragging ? "Lepaskan file di sini..." : "Seret file atau klik untuk unggah" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "JPG, PNG, WebP, atau PDF (Max 5MB)" })
                ] })
              ] }) })
            ]
          }
        ),
        errors.transferProof && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
          errors.transferProof
        ] })
      ] }),
      showPreviewModal && imagePreview && /* @__PURE__ */ jsxs(
        "div",
        {
          className: "fixed inset-0 z-50 flex items-center justify-center",
          onClick: () => setShowPreviewModal(false),
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/90 backdrop-blur-sm" }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "relative z-10 max-w-4xl max-h-[90vh] mx-4",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imagePreview,
                      alt: "Bukti transfer",
                      className: "max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowPreviewModal(false),
                      className: "absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl hover:scale-110 transition-transform",
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-5 w-5 text-gray-700 dark:text-gray-200" })
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-xl", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[250px]", children: transferProof?.name }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm", children: "Klik di luar gambar untuk menutup" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "notes", className: "font-semibold", children: "Catatan (Opsional)" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "notes",
          placeholder: "Tambahkan catatan atau keterangan pembayaran...",
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          rows: 3,
          disabled: isPaymentSuccessful
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-3 pt-6 border-t", children: !isPaymentSuccessful ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("code") || params.get("orderId") || params.get("id");
            window.location.href = id ? `/detail-pesanan?code=${id}` : "/daftar-pesanan";
          },
          disabled: isSubmitting,
          children: "Batal"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "flex-1 bg-primary hover:bg-primary/90",
          disabled: isSubmitting,
          children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
            "Menyimpan..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-4 w-4" }),
            "Simpan Pembayaran"
          ] })
        }
      )
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("code") || params.get("orderId") || params.get("id");
            window.location.href = id ? `/detail-pesanan?code=${id}` : "/daftar-pesanan";
          },
          className: "flex-1",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "mr-2 h-4 w-4" }),
            "Kembali ke Pesanan"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          onClick: () => {
            const params = new URLSearchParams(window.location.search);
            const orderId = params.get("code") || params.get("orderId") || params.get("id");
            window.location.href = `/nota-pembayaran?code=${orderId}`;
          },
          className: "flex-1 bg-primary hover:bg-primary/90",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "mr-2 h-4 w-4" }),
            "Lihat Invoice"
          ]
        }
      )
    ] }) })
  ] });
}
function PaymentSummary({ order }) {
  const hasItems = order.items && order.items.length > 0;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Ringkasan Pesanan" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "ID Pesanan" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono font-semibold text-sm", children: order.id })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Pangkalan" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: order.baseStation })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Detail LPG" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: hasItems ? (
          // Show each item with quantity
          order.items.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: item.type })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold", children: [
                  item.quantity,
                  " unit"
                ] })
              ]
            },
            index
          ))
        ) : (
          // Fallback for old interface
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: order.lpgType })
          ] })
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-secondary rounded-lg p-3 border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Total Jumlah" }),
        /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-primary", children: [
          order.quantity,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-sm font-normal text-muted-foreground", children: "unit" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Tanggal Pesanan" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-4 w-4 text-muted-foreground" }),
          new Date(order.date).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Total Pembayaran" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-primary", children: formatCurrency(order.totalAmount) })
      ] })
    ] })
  ] });
}
function PaymentRecordPage() {
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderUuid, setOrderUuid] = useState(null);
  const [orderCode, setOrderCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("code") || params.get("orderId") || params.get("id");
    if (id) {
      setOrderId(id);
    } else {
      setError("Order ID tidak ditemukan di URL");
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const apiOrder = await ordersApi.getById(orderId);
        setOrderUuid(apiOrder.id);
        setOrderCode(apiOrder.code || `ORD-${apiOrder.id.slice(0, 4).toUpperCase()}`);
        const totalQty = apiOrder.order_items.reduce((sum, item) => sum + item.qty, 0);
        const lpgTypes = [...new Set(apiOrder.order_items.map((item) => item.label || item.lpg_type))].join(", ");
        const items = apiOrder.order_items.map((item) => ({
          type: item.label || item.lpg_type,
          quantity: item.qty
        }));
        setOrder({
          id: apiOrder.code || apiOrder.id.substring(0, 12),
          baseStation: apiOrder.pangkalans?.name || "Unknown",
          lpgType: lpgTypes,
          quantity: totalQty,
          items,
          totalAmount: apiOrder.total_amount,
          status: apiOrder.current_status,
          date: apiOrder.created_at
          // Keep full datetime for time display
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err.message || "Gagal memuat data pesanan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);
  const handleSubmit = async (data) => {
    if (!orderUuid || !order) return;
    setIsSubmitting(true);
    try {
      let proofUrl = void 0;
      if (data.paymentMethod === "transfer" && data.transferProof) {
        try {
          const uploadResult = await uploadApi.uploadPaymentProof(data.transferProof);
          proofUrl = uploadResult.url;
          console.log("Payment proof uploaded:", proofUrl);
        } catch (uploadErr) {
          toast.error("Gagal upload bukti transfer", {
            description: uploadErr.message || "Coba lagi atau gunakan file yang lebih kecil"
          });
          setIsSubmitting(false);
          return;
        }
      }
      const paymentDto = {
        order_id: orderUuid,
        // Must be UUID
        method: data.paymentMethod === "cash" ? "TUNAI" : "TRANSFER",
        amount: data.amount,
        proof_url: proofUrl,
        // URL dari Supabase Storage
        note: data.notes || void 0
      };
      await paymentApi.createRecord(paymentDto);
      await paymentApi.updateOrderPayment(orderUuid, {
        is_paid: true,
        payment_method: paymentDto.method,
        amount_paid: data.amount,
        proof_url: proofUrl
      });
      if (order.status === "MENUNGGU_PEMBAYARAN") {
        await ordersApi.updateStatus(orderUuid, {
          status: "DIPROSES",
          note: "Pembayaran diterima"
        });
      }
      setPaymentSuccessful(true);
      toast.success("Pembayaran Berhasil!", {
        description: `Pembayaran sebesar ${formatCurrency(data.amount)} telah dicatat.`,
        action: {
          label: "Lihat Nota",
          onClick: () => {
            window.location.href = `/nota-pembayaran?code=${orderCode}`;
          }
        },
        duration: 5e3
      });
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error("Gagal mencatat pembayaran", {
        description: err.message || "Terjadi kesalahan saat menyimpan pembayaran"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin mx-auto text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Memuat data pesanan..." })
    ] }) });
  }
  if (error || !order) {
    return /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsx(Card, { className: "max-w-md", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 text-center space-y-4", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-12 w-12 mx-auto text-destructive" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Gagal Memuat Pesanan" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: error || "Pesanan tidak ditemukan" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => window.location.href = "/daftar-pesanan", children: "Kembali ke Daftar Pesanan" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => {
            if (orderCode) {
              window.location.href = `/detail-pesanan?code=${orderCode}`;
            } else {
              window.location.href = "/daftar-pesanan";
            }
          },
          children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "h-10 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gradient-primary", children: "Catat Pembayaran" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "Pencatatan pembayaran untuk pesanan ",
          order.id
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs(Card, { className: "glass-card", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Detail Pembayaran" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Pilih metode pembayaran dan masukkan informasi pembayaran" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
          PaymentRecordForm,
          {
            order,
            onSubmit: handleSubmit,
            isSubmitting,
            isPaymentSuccessful: paymentSuccessful
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(PaymentSummary, { order }),
        /* @__PURE__ */ jsxs(Card, { className: "border-primary/20 bg-primary/5 dark:bg-primary/10 dark:border-primary/30", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-4 w-4 text-primary" }),
            "Informasi Penting"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "text-sm space-y-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx("p", { children: "• Pastikan nominal pembayaran sesuai dengan total pesanan" }),
            /* @__PURE__ */ jsx("p", { children: "• Untuk transfer bank, masukkan URL bukti transfer" }),
            /* @__PURE__ */ jsx("p", { children: '• Status pesanan akan otomatis diperbarui ke "Diproses"' }),
            /* @__PURE__ */ jsx("p", { children: "• Simpan informasi pembayaran untuk referensi" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const $$CatatPembayaran = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Catat Pembayaran - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "PaymentRecordPage", PaymentRecordPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/catat-pembayaran/PaymentRecordPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/catat-pembayaran.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/catat-pembayaran.astro";
const $$url = "/catat-pembayaran.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$CatatPembayaran,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
