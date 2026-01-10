import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../../_astro/BaseLayout.DfKLN4S1.js";
import { P as PangkalanSidebarLayout } from "../../../_astro/PangkalanSidebarLayout.OIui5EpG.js";
import { A as AdminFooter } from "../../../_astro/AdminFooter.B5Ap1SI9.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { C as Card, a as CardContent } from "../../../_astro/card.OLhQVURm.js";
import { t as consumersApi, S as SafeIcon, B as Button, I as Input, s as lpgPricesApi, m as consumerOrdersApi } from "../../../_astro/AuthGuard.Cq_0lvUi.js";
import { L as Label } from "../../../_astro/label.DNnd65zo.js";
import { B as Badge, P as ProtectedDashboard } from "../../../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { toast } from "sonner";
import { renderers } from "../../../renderers.mjs";
const LPG_DISPLAY = [
  { value: "3kg", dbType: "kg3", display: "3 kg", color: "#22C55E", bgClass: "from-green-500 to-emerald-600", defaultPrice: 2e4 },
  { value: "5kg", dbType: "kg5", display: "5.5 kg", color: "#ff82c5", bgClass: "from-pink-400 to-pink-600", defaultPrice: 6e4 },
  { value: "12kg", dbType: "kg12", display: "12 kg", color: "#3B82F6", bgClass: "from-blue-500 to-indigo-600", defaultPrice: 18e4 },
  { value: "50kg", dbType: "kg50", display: "50 kg", color: "#ef0e0e", bgClass: "from-red-500 to-red-600", defaultPrice: 7e5 }
];
function CatatPenjualanPage() {
  const [lpgType, setLpgType] = useState("3kg");
  const [qty, setQty] = useState(1);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [consumerSearch, setConsumerSearch] = useState("");
  const [consumers, setConsumers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lpgPrices, setLpgPrices] = useState([]);
  const [manualPrice, setManualPrice] = useState(null);
  const dropdownRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const prices = await lpgPricesApi.getAll();
        setLpgPrices(prices);
      } catch (error) {
        console.error("Failed to fetch LPG prices:", error);
      }
    };
    fetchPrices();
  }, []);
  const getPrice = (type) => {
    const displayItem = LPG_DISPLAY.find((l) => l.value === type);
    if (!displayItem) return 2e4;
    const priceFromDb = lpgPrices.find((p) => p.lpg_type === displayItem.dbType);
    return priceFromDb ? Number(priceFromDb.selling_price) : displayItem.defaultPrice;
  };
  const isLpgActive = (type) => {
    const displayItem = LPG_DISPLAY.find((l) => l.value === type);
    if (!displayItem) return false;
    const priceFromDb = lpgPrices.find((p) => p.lpg_type === displayItem.dbType);
    return priceFromDb ? priceFromDb.is_active : true;
  };
  const activeLpgTypes = LPG_DISPLAY.filter((lpg) => isLpgActive(lpg.value));
  useEffect(() => {
    if (lpgPrices.length > 0 && activeLpgTypes.length > 0) {
      if (!isLpgActive(lpgType)) {
        setLpgType(activeLpgTypes[0].value);
      }
    }
  }, [lpgPrices]);
  const selectedLpg = LPG_DISPLAY.find((l) => l.value === lpgType);
  const defaultPrice = getPrice(lpgType);
  const currentPrice = manualPrice !== null ? manualPrice : defaultPrice;
  const total = qty * currentPrice;
  useEffect(() => {
    setManualPrice(null);
  }, [lpgType]);
  const formatCurrency = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);
  const startHold = useCallback((action) => {
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        if (action === "inc") setQty((prev) => prev + 1);
        else setQty((prev) => Math.max(1, prev - 1));
      }, 80);
    }, 300);
  }, []);
  const stopHold = useCallback(() => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  }, []);
  useEffect(() => () => stopHold(), [stopHold]);
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await consumersApi.getAll(1, 10, consumerSearch || void 0);
        setConsumers(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [consumerSearch]);
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (qty < 1) return toast.error("Jumlah minimal 1");
    try {
      setIsSubmitting(true);
      await consumerOrdersApi.create({
        consumer_id: selectedConsumer?.id,
        consumer_name: selectedConsumer?.name || consumerSearch || "Walk-in",
        lpg_type: lpgType,
        qty,
        price_per_unit: currentPrice
        // Use dynamic price from API
        // payment_status selalu LUNAS (fitur hutang tidak tersedia)
      });
      setShowSuccess(true);
      toast.success("Penjualan berhasil!");
      setTimeout(() => {
        setShowSuccess(false);
        setQty(1);
        setSelectedConsumer(null);
        setConsumerSearch("");
      }, 2e3);
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (showSuccess) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[50vh]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-8 w-8 text-white" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-1", children: "Berhasil!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-500 mb-4", children: [
        qty,
        "× ",
        selectedLpg.display,
        " = ",
        formatCurrency(total)
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => setShowSuccess(false), className: "rounded-xl", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4 mr-1" }),
        " Catat Lagi"
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Catat Penjualan" }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "rounded-xl", onClick: () => window.location.href = "/pangkalan/penjualan", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "History", className: "h-4 w-4 mr-1" }),
        " Riwayat"
      ] })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(Card, { className: "shadow-lg border-0 rounded-2xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold text-slate-700 mb-3 block", children: "Tipe LPG" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: activeLpgTypes.map((lpg) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setLpgType(lpg.value),
              className: `relative p-3 rounded-xl border-2 text-left transition-all ${lpgType === lpg.value ? "border-transparent bg-gradient-to-br " + lpg.bgClass + " shadow-lg" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `w-10 h-10 rounded-lg flex items-center justify-center ${lpgType === lpg.value ? "bg-white/20" : ""}`,
                      style: { backgroundColor: lpgType !== lpg.value ? lpg.color + "20" : void 0 },
                      children: /* @__PURE__ */ jsx(
                        SafeIcon,
                        {
                          name: "Cylinder",
                          className: `h-5 w-5 ${lpgType === lpg.value ? "text-white" : ""}`,
                          style: { color: lpgType !== lpg.value ? lpg.color : void 0 }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: `font-bold block ${lpgType === lpg.value ? "text-white" : "text-slate-900"}`, children: lpg.display }),
                    /* @__PURE__ */ jsx("span", { className: `text-xs ${lpgType === lpg.value ? "text-white/80" : "text-slate-500"}`, children: formatCurrency(getPrice(lpg.value)) })
                  ] })
                ] }),
                lpgType === lpg.value && /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "absolute top-2 right-2 h-4 w-4 text-white" })
              ]
            },
            lpg.value
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold text-slate-700 mb-3 block", children: "Jumlah" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "h-12 w-12 text-lg font-bold rounded-xl",
                onClick: () => setQty(Math.max(0, qty - 1)),
                onMouseDown: () => startHold("dec"),
                onMouseUp: stopHold,
                onMouseLeave: stopHold,
                onTouchStart: () => startHold("dec"),
                onTouchEnd: stopHold,
                disabled: qty <= 0,
                children: "−"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                inputMode: "numeric",
                value: qty === 0 ? "" : qty.toString(),
                onChange: (e) => {
                  const val = e.target.value.replace(/^0+/, "").replace(/\D/g, "");
                  setQty(val === "" ? 0 : parseInt(val));
                },
                placeholder: "0",
                className: "h-12 text-center font-bold text-xl flex-1 rounded-xl"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "h-12 w-12 text-lg font-bold rounded-xl",
                onClick: () => setQty(qty + 1),
                onMouseDown: () => startHold("inc"),
                onMouseUp: stopHold,
                onMouseLeave: stopHold,
                onTouchStart: () => startHold("inc"),
                onTouchEnd: stopHold,
                children: "+"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { className: "text-sm font-semibold text-slate-700 mb-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Harga Jual" }),
            manualPrice == null && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setManualPrice(null),
                className: "text-xs text-blue-600 hover:text-blue-700 font-medium",
                children: "Reset ke default"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium", children: "Rp" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                inputMode: "numeric",
                value: manualPrice === null ? defaultPrice.toLocaleString("id-ID") : manualPrice === 0 ? "" : manualPrice.toLocaleString("id-ID"),
                onChange: (e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setManualPrice(val === "" ? 0 : parseInt(val));
                },
                onBlur: () => {
                  if (manualPrice === 0) {
                    setManualPrice(null);
                  }
                },
                placeholder: defaultPrice.toLocaleString("id-ID"),
                className: "h-12 pl-10 text-lg font-bold rounded-xl placeholder:text-slate-300 placeholder:font-normal"
              }
            ),
            manualPrice !== null && manualPrice !== 0 && manualPrice !== defaultPrice && /* @__PURE__ */ jsx(Badge, { className: "absolute right-3 top-1/2 -translate-y-1/2 bg-orange-100 text-orange-700", children: "Custom" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
            "Default: ",
            formatCurrency(defaultPrice)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { ref: dropdownRef, className: "relative", children: [
          /* @__PURE__ */ jsxs(Label, { className: "text-sm font-semibold text-slate-700 mb-3 flex items-center", children: [
            "Konsumen ",
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs ml-2", children: "Opsional" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: consumerSearch,
                onChange: (e) => {
                  setConsumerSearch(e.target.value);
                  setSelectedConsumer(null);
                  setShowDropdown(true);
                },
                onFocus: () => setShowDropdown(true),
                placeholder: "Cari konsumen...",
                className: "h-12 pl-10 rounded-xl"
              }
            ),
            selectedConsumer && /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle2", className: "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" })
          ] }),
          showDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-48 overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "p-4 text-center text-slate-500 text-sm", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin inline mr-2" }),
            " Memuat..."
          ] }) : consumers.length > 0 ? consumers.map((c) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedConsumer(c);
                setConsumerSearch(c.name);
                setShowDropdown(false);
              },
              className: "w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 border-b border-slate-100 last:border-0 transition-colors",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "h-5 w-5 text-blue-600" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 truncate", children: c.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 truncate", children: c.nik ? `NIK: ${c.nik}` : c.phone || "Konsumen terdaftar" })
                ] })
              ]
            },
            c.id
          )) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-slate-500 text-sm", children: consumerSearch ? `"${consumerSearch}" = Walk-in` : "Ketik untuk mencari..." }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "shadow-lg border-0 rounded-2xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border-2 border-green-500 bg-green-50 flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "h-5 w-5 text-green-600" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-green-700", children: "Pembayaran Lunas" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-center text-white shadow-lg", children: [
          /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm font-medium", children: "Total Pembayaran" }),
          /* @__PURE__ */ jsx("p", { className: "text-4xl font-bold my-2", children: formatCurrency(total) }),
          /* @__PURE__ */ jsxs("p", { className: "text-blue-200 text-sm", children: [
            qty,
            " × ",
            selectedLpg.display,
            " @ ",
            formatCurrency(currentPrice)
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting || qty < 1,
            className: "w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50",
            children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-5 w-5 animate-spin" }),
              " Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-5 w-5" }),
              " Simpan Penjualan"
            ] })
          }
        )
      ] }) })
    ] }) })
  ] });
}
const $$Catat = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Catat Penjualan - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "CatatPenjualanPage", CatatPenjualanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/CatatPenjualanPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/penjualan/catat.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/penjualan/catat.astro";
const $$url = "/pangkalan/penjualan/catat.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Catat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
