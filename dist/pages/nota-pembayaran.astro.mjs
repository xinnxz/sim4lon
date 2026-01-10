import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { f as formatCurrency, A as AdminHeader } from "../_astro/currency._AzJKMQz.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { o as ordersApi, a as paymentApi, k as companyProfileApi, S as SafeIcon, B as Button } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { C as Card, a as CardContent } from "../_astro/card.OLhQVURm.js";
import { B as Badge, S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "../_astro/tabs.DZPauEIq.js";
import { toast } from "sonner";
import { u as useAppSettings } from "../_astro/useAppSettings.WcNHyYak.js";
import { renderers } from "../renderers.mjs";
function NotaPembayaranPage() {
  const [documentType, setDocumentType] = useState("nota");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const { settings: appSettings } = useAppSettings();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("id") || params.get("orderId");
    const type = params.get("type");
    if (type === "invoice" || type === "nota") {
      setDocumentType(type);
    }
    if (!orderId) {
      setError("Order ID tidak ditemukan");
      setIsLoading(false);
      return;
    }
    fetchData(orderId);
  }, []);
  const fetchData = async (orderId) => {
    try {
      setIsLoading(true);
      const [order, payment, profile] = await Promise.all([
        ordersApi.getById(orderId),
        paymentApi.getOrderPayment(orderId).catch(() => null),
        companyProfileApi.get().catch(() => null)
      ]);
      if (profile) {
        setCompanyProfile(profile);
      }
      const pangkalan = order.pangkalans;
      const items = order.order_items.map((item) => ({
        name: item.label || `LPG ${item.lpg_type}`,
        quantity: item.qty,
        unitPrice: Number(item.price_per_unit),
        subtotal: Number(item.sub_total || item.price_per_unit * item.qty)
      }));
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const taxAmount = items.reduce((sum, item) => {
        const itemTax = order.order_items.find(
          (oi) => (oi.label || oi.lpg_type) === item.name
        )?.tax_amount || 0;
        return sum + Number(itemTax);
      }, 0);
      const paidStatuses = ["DIPROSES", "DIKIRIM", "SELESAI"];
      const isPaidFromStatus = paidStatuses.includes(order.current_status);
      const isPaid = payment?.is_paid || isPaidFromStatus;
      setData({
        orderId: order.id,
        orderCode: order.code || `ORD-${order.id.slice(0, 4).toUpperCase()}`,
        orderDate: new Date(order.created_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        customerName: pangkalan?.name || "Unknown",
        customerAddress: pangkalan?.address || "",
        customerPhone: pangkalan?.phone || "",
        customerEmail: pangkalan?.email || "",
        contactPerson: pangkalan?.pic_name || "",
        items,
        subtotal,
        taxRate: appSettings.ppnRate,
        taxAmount,
        total: order.total_amount,
        isPaid,
        paymentMethod: payment?.payment_method || null,
        paymentDate: payment?.payment_date ? new Date(payment.payment_date).toLocaleDateString("id-ID") : null,
        amountPaid: Number(payment?.amount_paid || 0)
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch document data:", err);
      setError(err.message || "Gagal memuat data dokumen");
    } finally {
      setIsLoading(false);
    }
  };
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };
  const handleShareWhatsApp = () => {
    if (!data) return;
    const isNota2 = documentType === "nota";
    const docTitle = isNota2 ? "NOTA PEMBAYARAN" : "INVOICE";
    const itemLines = data.items.map(
      (item) => `• ${item.name} x${item.quantity} = ${formatCurrency(item.subtotal)}`
    ).join("\n");
    const docLink = window.location.href;
    const message = `*${docTitle}*

\`No: ${data.orderCode}\`
\`Tgl: ${data.orderDate}\`

*Kepada:*
${data.customerName}
${data.customerAddress}

*Detail Pesanan:*
${itemLines}

\`\`\`
Subtotal : ${formatCurrency(data.subtotal)}
PPN 12%  : ${formatCurrency(data.taxAmount)}
─────────────────────
TOTAL    : ${formatCurrency(data.total)}
\`\`\`

${isNota2 ? "✅ *Status: LUNAS*" : "⏳ *Status: Belum Dibayar*"}

📄 *Lihat Dokumen:*
${docLink}

_SIM4LON - Sistem Manajemen LPG_`;
    const phone = data.customerPhone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/62${phone.startsWith("0") ? phone.slice(1) : phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link berhasil disalin!");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin mx-auto text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Memuat dokumen..." })
    ] }) });
  }
  if (error || !data) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800", children: /* @__PURE__ */ jsx(Card, { className: "max-w-md glass-card", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 text-center space-y-4", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-12 w-12 mx-auto text-destructive" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Gagal Memuat Dokumen" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: error || "Data tidak ditemukan" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => window.location.href = "/daftar-pesanan", children: "Kembali ke Daftar Pesanan" })
    ] }) }) });
  }
  const isNota = documentType === "nota";
  const docNumber = isNota ? `NOTA-${data.orderCode.replace("ORD-", "")}` : `INV-${data.orderCode.replace("ORD-", "")}`;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap gap-3 print:hidden", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => {
              const params = new URLSearchParams(window.location.search);
              const orderId = params.get("id") || params.get("orderId");
              if (orderId) {
                window.location.href = `/detail-pesanan?id=${orderId}`;
              } else {
                window.location.href = "/daftar-pesanan";
              }
            },
            variant: "outline",
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "h-4 w-4" }),
              "Kembali"
            ]
          }
        ),
        /* @__PURE__ */ jsx(Tabs, { value: documentType, onValueChange: (v) => {
          if (v === "nota" && !data.isPaid) {
            toast.error("Nota hanya tersedia setelah pembayaran lunas");
            return;
          }
          setDocumentType(v);
        }, children: /* @__PURE__ */ jsxs(TabsList, { className: "bg-secondary", children: [
          /* @__PURE__ */ jsxs(
            TabsTrigger,
            {
              value: "invoice",
              className: "gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-4 w-4" }),
                "Invoice"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            TabsTrigger,
            {
              value: "nota",
              className: "gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white",
              disabled: !data.isPaid,
              title: !data.isPaid ? "Nota tersedia setelah pembayaran lunas" : "",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4" }),
                "Nota",
                !data.isPaid && /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "h-3 w-3 ml-1 opacity-50" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleCopyLink, variant: "outline", className: "gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Link", className: "h-4 w-4" }),
          "Copy Link"
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleShareWhatsApp, variant: "outline", className: "gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "MessageCircle", className: "h-4 w-4" }),
          "Share WA"
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handlePrint, disabled: isPrinting, className: "gap-2 bg-primary hover:bg-primary/90", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Printer", className: "h-4 w-4" }),
          isPrinting ? "Mencetak..." : "Print"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-white dark:bg-card shadow-xl dark:shadow-2xl print:shadow-none print:border-0 relative overflow-hidden print:overflow-visible border-0", children: [
        isNota && data.isPaid && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none z-10", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-green-500/10 dark:text-green-400/10 print:text-green-500/15",
            style: {
              fontSize: "clamp(100px, 20vw, 180px)",
              fontWeight: 900,
              transform: "rotate(-35deg)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              userSelect: "none",
              whiteSpace: "nowrap"
            },
            children: "LUNAS"
          }
        ) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "p-8 print:p-6 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              companyProfile?.logo_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: companyProfile.logo_url,
                  alt: "Company Logo",
                  className: "w-16 h-16 object-contain rounded-lg border"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "h-8 w-8 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-primary", children: companyProfile?.company_name || "SIM4LON" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: companyProfile?.address || "Sistem Manajemen LPG" }),
                companyProfile?.phone && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Tel: ",
                  companyProfile.phone
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: isNota ? "NOTA PEMBAYARAN" : "INVOICE" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-mono mt-1", children: docNumber }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: data.orderDate }),
              isNota && data.isPaid && /* @__PURE__ */ jsxs(Badge, { className: "mt-2 bg-green-500 text-white", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-3 w-3 mr-1" }),
                "LUNAS"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, { className: "my-6" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-8 mb-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground mb-2", children: "TAGIHAN KEPADA" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-lg", children: data.customerName }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: data.customerAddress }),
              data.contactPerson && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
                "PIC: ",
                data.contactPerson
              ] }),
              data.customerPhone && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
                "Tel: ",
                data.customerPhone
              ] }),
              data.customerEmail && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
                "Email: ",
                data.customerEmail
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground mb-2", children: "REFERENSI" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
                "No. Order: ",
                /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold", children: data.orderCode })
              ] }),
              isNota && data.paymentDate && /* @__PURE__ */ jsxs("p", { className: "text-sm mt-1", children: [
                "Tanggal Bayar: ",
                data.paymentDate
              ] }),
              isNota && data.paymentMethod && /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
                "Metode: ",
                data.paymentMethod
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border dark:border-border/50 rounded-lg overflow-hidden mb-8 shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "text-left p-3 text-sm font-semibold", children: "Item" }),
              /* @__PURE__ */ jsx("th", { className: "text-center p-3 text-sm font-semibold w-20", children: "Qty" }),
              /* @__PURE__ */ jsx("th", { className: "text-right p-3 text-sm font-semibold w-32", children: "Harga" }),
              /* @__PURE__ */ jsx("th", { className: "text-right p-3 text-sm font-semibold w-36", children: "Subtotal" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: data.items.map((item, index) => /* @__PURE__ */ jsxs("tr", { className: "border-t dark:border-border/50 hover:bg-muted/30 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "p-3 text-sm", children: item.name }),
              /* @__PURE__ */ jsx("td", { className: "p-3 text-sm text-center", children: item.quantity }),
              /* @__PURE__ */ jsx("td", { className: "p-3 text-sm text-right", children: formatCurrency(item.unitPrice) }),
              /* @__PURE__ */ jsx("td", { className: "p-3 text-sm text-right font-medium", children: formatCurrency(item.subtotal) })
            ] }, index)) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "w-72 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { children: formatCurrency(data.subtotal) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                "PPN (",
                data.taxRate,
                "%)"
              ] }),
              /* @__PURE__ */ jsx("span", { children: formatCurrency(data.taxAmount) })
            ] }),
            /* @__PURE__ */ jsx(Separator, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-bold text-lg", children: [
              /* @__PURE__ */ jsx("span", { children: "TOTAL" }),
              /* @__PURE__ */ jsx("span", { className: "text-primary", children: formatCurrency(data.total) })
            ] }),
            isNota && data.isPaid && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-green-600 font-medium", children: [
              /* @__PURE__ */ jsx("span", { children: "Terbayar" }),
              /* @__PURE__ */ jsx("span", { children: formatCurrency(data.amountPaid || data.total) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-12 pt-6 border-t dark:border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Catatan:" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: isNota ? "Terima kasih atas pembayaran Anda. Simpan nota ini sebagai bukti transaksi." : "Pembayaran dapat dilakukan melalui transfer bank. Harap sertakan nomor order saat transfer." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-8", children: "Hormat kami," }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "SIM4LON" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sistem Manajemen LPG" })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        @media print {
          /* CRITICAL: Force light theme for print regardless of dark mode */
          html, body, .dark, :root { 
            background: white !important;
            background-color: white !important;
            color: #1f2937 !important;
            color-scheme: light !important;
          }
          
          /* Override dark mode variables for print */
          :root, .dark {
            --background: 0 0% 100% !important;
            --foreground: 222.2 84% 4.9% !important;
            --card: 0 0% 100% !important;
            --card-foreground: 222.2 84% 4.9% !important;
            --muted: 210 40% 96.1% !important;
            --muted-foreground: 215.4 16.3% 46.9% !important;
            --border: 214.3 31.8% 91.4% !important;
          }
          
          /* Force white background on all elements */
          *, *::before, *::after {
            background-color: transparent !important;
          }
          
          /* Card must be white */
          .bg-white, 
          [class*="bg-card"],
          [class*="dark:bg-card"],
          .dark .bg-white,
          .dark [class*="bg-card"] {
            background: white !important;
            background-color: white !important;
            color: #1f2937 !important;
          }
          
          /* Page background */
          .min-h-screen,
          [class*="from-slate"],
          [class*="dark:from-slate"] {
            background: white !important;
          }
          
          /* Text colors for print */
          h1, h2, h3, h4, h5, h6, p, span, td, th, label {
            color: #1f2937 !important;
          }
          
          .text-muted-foreground,
          [class*="text-gray"] {
            color: #6b7280 !important;
          }
          
          .text-primary {
            color: #16a34a !important;
          }
          
          /* Table styling for print */
          table { border-collapse: collapse !important; }
          thead { background: #f9fafb !important; }
          th, td { 
            border-color: #e5e7eb !important;
            background: transparent !important;
          }
          
          /* Hide action bar and non-print elements */
          header, footer, nav, aside,
          .print\\:hidden,
          [data-radix-portal],
          [role="navigation"],
          .toaster { 
            display: none !important; 
          }
          
          /* Document container */
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-0 { border: none !important; }
          
          /* Ensure content fits on one page */
          .max-w-4xl { 
            max-width: 100% !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* No page breaks inside elements */
          table, tr, td, th, thead, tbody { 
            page-break-inside: avoid !important; 
          }
          
          /* Watermark visibility on print */
          [class*="text-green-500/10"],
          [class*="text-green-400/10"] {
            color: rgba(34, 197, 94, 0.15) !important;
          }
          
          /* Badge styling */
          .bg-green-500 {
            background-color: #22c55e !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        @page { 
          size: A4 portrait; 
          margin: 0.8cm;
        }
      ` })
  ] });
}
const $$NotaPembayaran = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Nota Pembayaran - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AdminHeader", AdminHeader, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/common/AdminHeader.tsx", "client:component-export": "default" })}
    ${maybeRenderHead()}<main className="flex-1 bg-background">
      ${renderComponent($$result3, "NotaPembayaranPage", NotaPembayaranPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/nota-pembayaran/NotaPembayaranPage.tsx", "client:component-export": "default" })}
    </main>
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/nota-pembayaran.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/nota-pembayaran.astro";
const $$url = "/nota-pembayaran.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$NotaPembayaran,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
