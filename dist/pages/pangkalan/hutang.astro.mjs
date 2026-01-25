import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.C7j8yK_x.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D7Nub16D.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, a as CardContent, b as CardHeader, d as CardTitle } from "../../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, B as Button, q as consumerOrdersApi } from "../../_astro/AuthGuard.71S_I7hh.js";
import { B as Badge, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
function HutangPage() {
  const [orders, setOrders] = useState([]);
  const [totalHutang, setTotalHutang] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await consumerOrdersApi.getAll(1, 100, { paymentStatus: "HUTANG" });
      setOrders(response.data);
      const total = response.data.reduce((sum, order) => sum + order.total_amount, 0);
      setTotalHutang(total);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Gagal memuat data hutang");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const handleMarkAsPaid = async (order) => {
    try {
      await consumerOrdersApi.update(order.id, { payment_status: "LUNAS" });
      toast.success("Berhasil dilunasi!");
      fetchOrders();
    } catch (error) {
      toast.error(error.message || "Gagal melunasi");
    }
  };
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
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-blue-500" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-slate-50 dark:bg-slate-900 min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3 animate-fadeInDown", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-orange-500 via-orange-400 to-amber-500 animate-lineGrow" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Hutang" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4 animate-pulse" }),
          "Daftar piutang yang belum lunas"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-1 mb-6", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden group", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-6 relative", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-orange-100 text-sm mb-1", children: "Total Hutang" }),
          /* @__PURE__ */ jsx("p", { className: "text-4xl font-bold", children: formatCurrency(totalHutang) }),
          /* @__PURE__ */ jsxs("p", { className: "text-orange-100 text-sm mt-2", children: [
            orders.length,
            " transaksi belum lunas"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-8 w-8" }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs(Card, { className: "shadow-lg", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Daftar Hutang" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-slate-500", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-16 w-16 mx-auto mb-4 text-green-500" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: "Tidak ada hutang!" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Semua transaksi sudah lunas" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: orders.map((order) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "h-6 w-6 text-orange-600" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: order.consumers?.name || order.consumer_name || "Walk-in" }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
                  order.lpg_type,
                  " × ",
                  order.qty,
                  " • ",
                  formatDate(order.sale_date)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-lg text-orange-600", children: formatCurrency(order.total_amount) }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-orange-50 text-orange-700 border-orange-200", children: "Hutang" })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => handleMarkAsPaid(order),
                  className: "bg-green-600 hover:bg-green-700",
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "mr-1 h-4 w-4" }),
                    "Lunasi"
                  ]
                }
              )
            ] })
          ]
        },
        order.id
      )) }) })
    ] })
  ] });
}
const $$Hutang = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Hutang - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "HutangPage", HutangPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/HutangPage.tsx", "client:component-export": "default" })}
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/hutang.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/hutang.astro";
const $$url = "/pangkalan/hutang.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Hutang,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
