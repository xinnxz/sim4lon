import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../../_astro/BaseLayout.C7j8yK_x.js";
import { P as PangkalanSidebarLayout } from "../../../_astro/PangkalanSidebarLayout.D7Nub16D.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { C as Card, a as CardContent } from "../../../_astro/card.CnUj7wdc.js";
import { w as consumersApi, S as SafeIcon, B as Button, I as Input, v as lpgPricesApi, s as pangkalanStockApi, q as consumerOrdersApi } from "../../../_astro/AuthGuard.71S_I7hh.js";
import { L as Label } from "../../../_astro/label.C1We_4rW.js";
import { B as Badge, P as ProtectedDashboard } from "../../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { toast } from "sonner";
import { renderers } from "../../../renderers.mjs";
const LPG_DISPLAY = [
  { value: "kg3", dbType: "kg3", stockType: "3kg", display: "3 kg", color: "#22C55E", bgClass: "from-green-500 to-emerald-600", defaultPrice: 2e4 },
  { value: "kg5", dbType: "kg5", stockType: "5kg", display: "5.5 kg", color: "#ff82c5", bgClass: "from-pink-400 to-pink-600", defaultPrice: 6e4 },
  { value: "kg12", dbType: "kg12", stockType: "12kg", display: "12 kg", color: "#3B82F6", bgClass: "from-blue-500 to-indigo-600", defaultPrice: 18e4 },
  { value: "kg50", dbType: "kg50", stockType: "50kg", display: "50 kg", color: "#ef0e0e", bgClass: "from-red-500 to-red-600", defaultPrice: 7e5 },
  { value: "gr220", dbType: "gr220", stockType: "gr220", display: "220 gr", color: "#F59E0B", bgClass: "from-amber-500 to-orange-600", defaultPrice: 22e3 }
];
const LPG_IMAGES = {
  "kg3": "/images/products/lpg-3kg.png",
  "kg5": "/images/products/lpg-5kg.png",
  "kg12": "/images/products/lpg-12kg.png",
  "kg50": "/images/products/lpg-50kg.png",
  "gr220": "/images/products/bright-gas-220gr.png"
};
function CatatPenjualanPage() {
  const [lpgType, setLpgType] = useState("kg3");
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
  const [stockLevels, setStockLevels] = useState([]);
  const dropdownRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prices, stockResponse] = await Promise.all([
          lpgPricesApi.getAll(),
          pangkalanStockApi.getStockLevels()
        ]);
        setLpgPrices(prices);
        setStockLevels(stockResponse.stocks);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
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
  const getStockForType = (type) => {
    const displayItem = LPG_DISPLAY.find((l) => l.value === type);
    if (!displayItem) return 0;
    const stock = stockLevels.find((s) => s.lpg_type === displayItem.stockType);
    return stock?.qty ?? 0;
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
    const maxStock = getStockForType(lpgType);
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        if (action === "inc") setQty((prev) => Math.min(maxStock, prev + 1));
        else setQty((prev) => Math.max(1, prev - 1));
      }, 80);
    }, 300);
  }, [lpgType]);
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
    const currentStock = getStockForType(lpgType);
    const lpgDisplay = LPG_DISPLAY.find((l) => l.value === lpgType);
    if (qty > currentStock) {
      toast.error(`Stok ${lpgDisplay?.display || lpgType} tidak mencukupi! Tersedia: ${currentStock} tabung, diminta: ${qty} tabung.`);
      return;
    }
    if (lpgType === "kg3") {
      if (!selectedConsumer) {
        toast.error("⚠️ LPG 3kg Subsidi hanya untuk konsumen TERDAFTAR!\n\nSilakan pilih konsumen dari daftar atau daftarkan konsumen baru dengan NIK dan KK.", {
          duration: 5e3
        });
        return;
      }
      if (!selectedConsumer.nik || !selectedConsumer.kk) {
        toast.error(`⚠️ Konsumen "${selectedConsumer.name}" belum lengkap!

LPG 3kg Subsidi memerlukan NIK dan KK yang valid. Silakan lengkapi data konsumen terlebih dahulu.`, {
          duration: 5e3
        });
        return;
      }
    }
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
      setStockLevels((prev) => prev.map(
        (s) => s.lpg_type === lpgType ? { ...s, qty: s.qty - qty } : s
      ));
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl font-bold text-slate-900", children: "Catat Penjualan" }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "rounded-xl text-xs sm:text-sm", onClick: () => window.location.href = "/pangkalan/penjualan", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "History", className: "h-4 w-4 mr-1" }),
        " Riwayat"
      ] })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-4 sm:gap-6", children: [
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
                      className: `w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden ${lpgType === lpg.value ? "bg-white/20 p-1" : "bg-white border p-1"}`,
                      children: LPG_IMAGES[lpg.value] ? /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: LPG_IMAGES[lpg.value],
                          alt: lpg.display,
                          className: "w-full h-full object-contain"
                        }
                      ) : /* @__PURE__ */ jsx(
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
                    /* @__PURE__ */ jsx("span", { className: `text-xs ${lpgType === lpg.value ? "text-white/80" : "text-slate-500"}`, children: formatCurrency(getPrice(lpg.value)) }),
                    /* @__PURE__ */ jsxs("span", { className: `text-xs block ${getStockForType(lpg.value) === 0 ? "text-red-500 font-semibold" : getStockForType(lpg.value) < 10 ? "text-amber-500" : lpgType === lpg.value ? "text-white/60" : "text-slate-400"}`, children: [
                      "Stok: ",
                      getStockForType(lpg.value)
                    ] })
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
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "h-14 w-14 sm:h-12 sm:w-12 text-xl sm:text-lg font-bold rounded-xl touch-target",
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
                  const numVal = val === "" ? 0 : parseInt(val);
                  const maxStock = getStockForType(lpgType);
                  setQty(Math.min(maxStock, numVal));
                },
                placeholder: "0",
                className: "h-14 sm:h-12 text-center font-bold text-xl flex-1 rounded-xl"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "h-14 w-14 sm:h-12 sm:w-12 text-xl sm:text-lg font-bold rounded-xl touch-target",
                onClick: () => {
                  const maxStock = getStockForType(lpgType);
                  setQty((prev) => Math.min(maxStock, prev + 1));
                },
                onMouseDown: () => startHold("inc"),
                onMouseUp: stopHold,
                onMouseLeave: stopHold,
                onTouchStart: () => startHold("inc"),
                onTouchEnd: stopHold,
                disabled: qty >= getStockForType(lpgType),
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
          selectedConsumer ? /* @__PURE__ */ jsxs("div", { className: `h-14 px-4 rounded-xl border-2 flex items-center gap-3 transition-all ${selectedConsumer.consumer_type === "WARUNG" ? "border-orange-300 bg-orange-50" : selectedConsumer.consumer_type === "RUMAH_TANGGA" ? "border-green-300 bg-green-50" : "border-blue-300 bg-blue-50"}`, children: [
            /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedConsumer.consumer_type === "WARUNG" ? "bg-orange-200" : selectedConsumer.consumer_type === "RUMAH_TANGGA" ? "bg-green-200" : "bg-blue-200"}`, children: /* @__PURE__ */ jsx(
              SafeIcon,
              {
                name: selectedConsumer.consumer_type === "WARUNG" ? "Store" : selectedConsumer.consumer_type === "RUMAH_TANGGA" ? "Home" : "User",
                className: `h-5 w-5 ${selectedConsumer.consumer_type === "WARUNG" ? "text-orange-700" : selectedConsumer.consumer_type === "RUMAH_TANGGA" ? "text-green-700" : "text-blue-700"}`
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 truncate text-sm", children: selectedConsumer.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 truncate", children: [
                selectedConsumer.consumer_type === "WARUNG" ? "Warung" : selectedConsumer.consumer_type === "RUMAH_TANGGA" ? "Rumah Tangga" : "Konsumen",
                selectedConsumer.nik ? ` • ${selectedConsumer.nik}` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setSelectedConsumer(null);
                  setConsumerSearch("");
                },
                className: "p-1.5 rounded-full hover:bg-white/50 transition-colors",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4 text-slate-500" })
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: consumerSearch,
                onChange: (e) => {
                  setConsumerSearch(e.target.value);
                  setShowDropdown(true);
                },
                onFocus: () => setShowDropdown(true),
                placeholder: "Cari konsumen...",
                className: "h-12 pl-10 rounded-xl"
              }
            )
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
                /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${c.consumer_type === "WARUNG" ? "bg-orange-100" : c.consumer_type === "RUMAH_TANGGA" ? "bg-green-100" : "bg-blue-100"}`, children: /* @__PURE__ */ jsx(
                  SafeIcon,
                  {
                    name: c.consumer_type === "WARUNG" ? "Store" : c.consumer_type === "RUMAH_TANGGA" ? "Home" : "User",
                    className: `h-5 w-5 ${c.consumer_type === "WARUNG" ? "text-orange-600" : c.consumer_type === "RUMAH_TANGGA" ? "text-green-600" : "text-blue-600"}`
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 truncate", children: c.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 truncate", children: [
                    c.consumer_type === "WARUNG" ? "Warung" : c.consumer_type === "RUMAH_TANGGA" ? "Rumah Tangga" : "",
                    c.nik ? ` • NIK: ${c.nik}` : c.phone ? ` • ${c.phone}` : ""
                  ] })
                ] })
              ]
            },
            c.id
          )) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-slate-500 text-sm", children: consumerSearch ? `"${consumerSearch}" = Walk-in` : "Ketik untuk mencari..." }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "shadow-lg border-0 rounded-2xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border-2 border-blue-500 bg-blue-50 flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Banknote", className: "h-5 w-5 text-blue-600" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-blue-700", children: "Bayar Tunai" })
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
      ${renderComponent($$result4, "CatatPenjualanPage", CatatPenjualanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/CatatPenjualanPage.tsx", "client:component-export": "default" })}
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
