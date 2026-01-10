import { c as createComponent, r as renderComponent, a as renderTemplate } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BOBS5-gD.js";
import { A as AdminFooter } from "../_astro/AdminFooter.B5Ap1SI9.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as SafeIcon, l as lpgProductsApi, b as dashboardApi, B as Button, I as Input } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle, d as CardDescription } from "../_astro/card.OLhQVURm.js";
import { B as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts";
import { L as Label } from "../_astro/label.DNnd65zo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.DOfMR1sZ.js";
import { S as Switch } from "../_astro/switch.2DDutblW.js";
import { toast } from "sonner";
import { renderers } from "../renderers.mjs";
const getStatusFromStock = (current, minStock) => {
  if (current <= minStock * 0.25) return "critical";
  if (current <= minStock) return "warning";
  return "normal";
};
const getStatusBadge = (status) => {
  switch (status) {
    case "critical":
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20", children: "Kritis" });
    case "warning":
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400", children: "Perhatian" });
    default:
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20", children: "Aman" });
  }
};
const getCategoryLabel = (category) => {
  return category === "SUBSIDI" ? "Subsidi" : "Non-Subsidi";
};
const getColorHex$1 = (colorName) => {
  if (!colorName) return "#6b7280";
  const colorMap = {
    "hijau": "#22c55e",
    "biru": "#38bdf8",
    "ungu": "#a855f7",
    "pink": "#ec4899",
    "merah": "#dc2626",
    "kuning": "#eab308",
    "orange": "#f97316"
  };
  return colorMap[colorName.toLowerCase()] || "#6b7280";
};
function StockSummaryCards({ refreshTrigger, showSummary = true }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await lpgProductsApi.getWithStock();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products with stock:", err);
      setError("Gagal memuat data stok");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxs(Card, { className: "glass-card animate-pulse", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-muted rounded w-1/2" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted/50 rounded w-1/3 mt-2" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 bg-muted rounded w-1/2" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 bg-muted/50 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "h-12 bg-muted/50 rounded" })
        ] })
      ] })
    ] }, i)) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "p-6 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-10 w-10 mx-auto mb-2 text-destructive" }),
      /* @__PURE__ */ jsx("p", { children: error }),
      /* @__PURE__ */ jsx("button", { onClick: fetchData, className: "mt-2 text-primary hover:underline", children: "Coba lagi" })
    ] });
  }
  if (products.length === 0) {
    return /* @__PURE__ */ jsx(Card, { className: "border-2 border-dashed", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Belum Ada Produk LPG" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tambahkan produk LPG terlebih dahulu untuk melihat stok." })
    ] }) });
  }
  const totalStock = products.reduce((sum, p) => sum + (p.stock.current || 0), 0);
  const totalSubsidi = products.filter((p) => p.category === "SUBSIDI").reduce((sum, p) => sum + (p.stock.current || 0), 0);
  const totalNonSubsidi = products.filter((p) => p.category === "NON_SUBSIDI").reduce((sum, p) => sum + (p.stock.current || 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    showSummary && /* @__PURE__ */ jsx("div", { className: "glass-card rounded-2xl overflow-hidden animate-fadeInUp", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-8 w-8 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Stok Keseluruhan" }),
          /* @__PURE__ */ jsxs("p", { className: "text-4xl font-bold text-foreground", children: [
            /* @__PURE__ */ jsx(AnimatedNumber, { value: totalStock, delay: 100 }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-lg font-normal text-muted-foreground", children: "unit" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 md:gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-primary/10 dark:bg-primary/20 min-w-[100px]", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Subsidi" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-primary", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: totalSubsidi, delay: 200 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "unit" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-accent/10 dark:bg-accent/20 min-w-[100px]", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Non-Subsidi" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-accent", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: totalNonSubsidi, delay: 300 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "unit" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 rounded-xl bg-muted/50 dark:bg-muted/30 min-w-[100px]", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Jenis Produk" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: products.length, delay: 400 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "produk aktif" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: products.map((product, index) => {
      const minStock = product.category === "SUBSIDI" ? 100 : 50;
      const status = getStatusFromStock(product.stock.current, minStock);
      const displayPrice = product.selling_price || product.prices?.find((p) => p.is_default)?.price || product.prices?.[0]?.price || 0;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "animate-fadeInUp",
          style: { animationDelay: `${0.1 + index * 0.05}s` },
          children: /* @__PURE__ */ jsxs(
            Card,
            {
              className: "overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
              style: {
                background: `linear-gradient(135deg, ${getColorHex$1(product.color)}08 0%, transparent 50%)`
              },
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-1.5 w-full",
                    style: { background: `linear-gradient(90deg, ${getColorHex$1(product.color)}, ${getColorHex$1(product.color)}80)` }
                  }
                ),
                /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold truncate", children: product.name }),
                    /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground text-sm font-medium", children: [
                      product.size_kg,
                      " kg"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      style: {
                        background: `linear-gradient(135deg, ${getColorHex$1(product.color)}30, ${getColorHex$1(product.color)}10)`,
                        boxShadow: `0 4px 12px -2px ${getColorHex$1(product.color)}40`
                      },
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: "Cylinder", className: "h-6 w-6", style: { color: getColorHex$1(product.color) } })
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "text-center py-4 rounded-xl",
                      style: { background: `linear-gradient(135deg, ${getColorHex$1(product.color)}08, transparent)` },
                      children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `text-5xl font-bold ${product.stock.current < 0 ? "text-destructive" : ""}`,
                            style: { color: product.stock.current >= 0 ? getColorHex$1(product.color) : void 0 },
                            children: /* @__PURE__ */ jsx(AnimatedNumber, { value: product.stock.current, delay: 500 + index * 100 })
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-lg text-muted-foreground ml-2", children: "unit" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `px-3 py-1 font-medium ${product.category === "SUBSIDI" ? "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20" : "bg-accent/10 text-accent border-accent/30 dark:bg-accent/20"}`,
                        children: getCategoryLabel(product.category)
                      }
                    ),
                    displayPrice > 0 && /* @__PURE__ */ jsx("span", { className: "font-bold text-lg", children: formatPrice(Number(displayPrice)) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-2 border-t", children: [
                    getStatusBadge(status),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "h-3 w-3" }),
                      /* @__PURE__ */ jsx("span", { children: "Read-only" })
                    ] })
                  ] })
                ] })
              ]
            }
          )
        },
        product.id
      );
    }) })
  ] });
}
const getUsageLevel = (qty) => {
  if (qty <= 0) return { text: "TIDAK ADA", color: "text-muted-foreground bg-muted/50" };
  if (qty >= 50) return { text: "TINGGI", color: "text-primary bg-primary/10 dark:bg-primary/20" };
  if (qty >= 20) return { text: "SEDANG", color: "text-accent bg-accent/10 dark:bg-accent/20" };
  return { text: "RENDAH", color: "text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/20" };
};
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const totalQty = payload.reduce((sum, p) => sum + (p.value || 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border shadow-2xl p-4 min-w-[240px] bg-card/95 backdrop-blur-md border-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3 pb-2 border-b border-border", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-foreground", children: [
        "📦 Pemakaian - ",
        label
      ] }),
      /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs bg-primary/10 text-primary font-bold dark:bg-primary/20", children: [
        totalQty,
        " Unit"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: payload.map((entry, index) => {
      const level = getUsageLevel(entry.value);
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-3 h-3 rounded-full shadow-sm",
              style: { backgroundColor: entry.color }
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground font-medium truncate max-w-[100px]", children: entry.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", style: { color: entry.color }, children: entry.value || 0 }),
          /* @__PURE__ */ jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-medium ${level.color}`, children: level.text })
        ] })
      ] }, index);
    }) })
  ] });
};
const CustomLegend = ({ payload }) => {
  if (!payload) return null;
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-3 pt-4", children: payload.map((entry, index) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/50 dark:bg-card/30 shadow-sm hover:shadow-md transition-shadow",
      style: { borderColor: `${entry.color}40` },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-2.5 h-2.5 rounded-full",
            style: { backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}60` }
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: entry.value })
      ]
    },
    index
  )) });
};
function WeeklyConsumptionChart({ refreshTrigger }) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getStockChart();
        setChartData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch stock consumption chart:", err);
        setError("Gagal memuat data");
        setChartData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);
  if (isLoading) {
    return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden glass-card", children: [
      /* @__PURE__ */ jsx("div", { className: "h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" }),
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-muted animate-pulse" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "h-5 w-48 bg-muted rounded animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-64 bg-muted/50 rounded animate-pulse" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "w-full h-64 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-5 w-5 animate-spin" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Memuat data grafik..." })
      ] }) }) })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-0 shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "h-1 bg-gradient-to-r from-red-400 to-red-500" }),
      /* @__PURE__ */ jsx(CardContent, { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-red-100/50", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-6 w-6 text-red-500" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: error })
      ] }) })
    ] });
  }
  if (!chartData || chartData.data.length === 0 || chartData.products.length === 0) {
    return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-0 shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "h-1 bg-gradient-to-r from-gray-300 to-gray-400" }),
      /* @__PURE__ */ jsx(CardContent, { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gray-100/50", children: /* @__PURE__ */ jsx(SafeIcon, { name: "BarChart3", className: "h-6 w-6 text-gray-400" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "Belum ada data pemakaian" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Data akan muncul setelah ada pergerakan stok" })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden glass-card hover:shadow-xl transition-shadow duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "h-1 bg-gradient-to-r from-primary via-accent to-primary" }),
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-5 w-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold", children: "Tren Pemakaian Mingguan" }),
          /* @__PURE__ */ jsxs(CardDescription, { className: "text-xs", children: [
            "Pergerakan stok 7 hari terakhir • ",
            chartData.products.length,
            " produk aktif"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs bg-primary/10 text-primary border-primary/30 dark:bg-primary/20", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Activity", className: "h-3 w-3 mr-1" }),
        "Live"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsx("div", { className: "w-full h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: chartData.data, margin: { top: 20, right: 20, left: -10, bottom: 0 }, children: [
      /* @__PURE__ */ jsx("defs", { children: chartData.products.map((product) => /* @__PURE__ */ jsxs("linearGradient", { id: `gradient-stock-${product.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: product.color, stopOpacity: 0.3 }),
        /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: product.color, stopOpacity: 0.02 })
      ] }, `gradient-${product.id}`)) }),
      /* @__PURE__ */ jsx(
        CartesianGrid,
        {
          strokeDasharray: "3 3",
          stroke: "hsl(var(--border))",
          opacity: 0.4,
          vertical: false
        }
      ),
      /* @__PURE__ */ jsx(
        XAxis,
        {
          dataKey: "day",
          stroke: "hsl(var(--muted-foreground))",
          style: { fontSize: "11px", fontWeight: 500 },
          tickLine: false,
          axisLine: { stroke: "hsl(var(--border))" }
        }
      ),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          stroke: "hsl(var(--muted-foreground))",
          style: { fontSize: "11px" },
          tickLine: false,
          axisLine: false,
          tickFormatter: (value) => `${value}`
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: /* @__PURE__ */ jsx(CustomTooltip, {}),
          cursor: { stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5 }
        }
      ),
      /* @__PURE__ */ jsx(Legend, { content: /* @__PURE__ */ jsx(CustomLegend, {}) }),
      chartData.products.map((product, index) => /* @__PURE__ */ jsx(
        Area,
        {
          type: "monotone",
          dataKey: product.id,
          name: product.name,
          stroke: product.color,
          strokeWidth: 2.5,
          fill: `url(#gradient-stock-${product.id})`,
          dot: {
            fill: product.color,
            r: 4,
            strokeWidth: 2,
            stroke: "white"
          },
          activeDot: {
            r: 7,
            strokeWidth: 3,
            stroke: "white",
            style: { filter: `drop-shadow(0 0 6px ${product.color})` }
          },
          animationBegin: index * 100,
          animationDuration: 800,
          animationEasing: "ease-out"
        },
        product.id
      ))
    ] }) }) }) })
  ] });
}
const colorOptions = [
  { name: "hijau", hex: "#22c55e", label: "Hijau" },
  { name: "biru", hex: "#38bdf8", label: "Biru" },
  { name: "pink", hex: "#ec4899", label: "Pink" },
  { name: "kuning", hex: "#eab308", label: "Kuning" },
  { name: "merah", hex: "#dc2626", label: "Merah" },
  { name: "ungu", hex: "#a855f7", label: "Ungu" },
  { name: "orange", hex: "#f97316", label: "Orange" }
];
const sizeOptions = [
  { value: "0.22", label: "220 gram" },
  { value: "3", label: "3 kg" },
  { value: "5.5", label: "5.5 kg" },
  { value: "12", label: "12 kg" },
  { value: "50", label: "50 kg" }
];
const brandOptions = [
  "Elpiji",
  "Bright Gas",
  "Arsy Gas",
  "MyGas",
  "PrimGas",
  "GGA"
];
const getColorHex = (colorName) => {
  if (!colorName) return "#6b7280";
  const found = colorOptions.find((c) => c.name.toLowerCase() === colorName.toLowerCase());
  return found?.hex || "#6b7280";
};
const formatCurrency = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
function ManageLPGTypesModal({ open, onOpenChange, onProductUpdate }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    size_kg: "3",
    category: "NON_SUBSIDI",
    color: "biru",
    brand: "Elpiji",
    selling_price: "",
    cost_price: "",
    is_active: true
  });
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await lpgProductsApi.getAll(true);
      const withStock = await lpgProductsApi.getWithStock();
      const merged = data.map((p) => {
        const stockData = withStock.find((ws) => ws.id === p.id);
        return { ...p, stock: stockData?.stock || { current: 0 } };
      });
      setProducts(merged);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Gagal memuat data produk");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      fetchProducts();
      setViewMode("list");
      setEditingProduct(null);
    }
  }, [open]);
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      size_kg: String(product.size_kg),
      category: product.category,
      color: product.color || "biru",
      brand: product.brand || "Elpiji",
      selling_price: String(product.selling_price || 0),
      cost_price: String(product.cost_price || 0),
      is_active: product.is_active !== false
    });
    setViewMode("edit");
  };
  const handleSave = async () => {
    if (!formData.name || !formData.size_kg || !formData.selling_price) {
      toast.error("Nama, ukuran, dan harga jual wajib diisi");
      return;
    }
    setSaving(true);
    try {
      if (editingProduct) {
        await lpgProductsApi.update(editingProduct.id, {
          name: formData.name,
          size_kg: parseFloat(formData.size_kg),
          category: formData.category,
          color: formData.color,
          brand: formData.brand,
          selling_price: parseFloat(formData.selling_price),
          cost_price: parseFloat(formData.cost_price) || 0,
          is_active: formData.is_active
        });
        toast.success("Produk berhasil diperbarui");
      }
      await fetchProducts();
      onProductUpdate?.();
      setViewMode("list");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  };
  const handleToggleActive = async (product) => {
    setTogglingId(product.id);
    try {
      const newStatus = product.is_active === false ? true : false;
      await lpgProductsApi.update(product.id, { is_active: newStatus });
      toast.success(`Produk ${newStatus ? "diaktifkan" : "dinonaktifkan"}`);
      await fetchProducts();
      onProductUpdate?.();
    } catch (err) {
      console.error("Failed to toggle product:", err);
      toast.error("Gagal mengubah status produk");
    } finally {
      setTogglingId(null);
    }
  };
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active !== false).length;
  const totalStock = products.filter((p) => p.is_active !== false).reduce((sum, p) => sum + (p.stock?.current || 0), 0);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70", style: { boxShadow: "0 4px 12px -2px rgba(var(--primary-rgb), 0.4)" }, children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: viewMode === "list" ? "Kelola Produk LPG" : `Edit ${editingProduct?.name}` }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: viewMode === "list" ? "Atur tampilan dan harga produk LPG" : "Ubah detail produk" })
          ] })
        ] }),
        viewMode !== "list" && /* @__PURE__ */ jsxs(Button, { variant: "ghost", onClick: () => setViewMode("list"), className: "gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "h-4 w-4" }),
          "Kembali"
        ] })
      ] }) }),
      viewMode === "list" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 mt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center p-3 rounded-xl bg-white/50 dark:bg-gray-800/50", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-primary", children: totalProducts }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Produk" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-3 rounded-xl bg-green-500/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: activeProducts }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Produk Aktif" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-3 rounded-xl bg-purple-500/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-600", children: totalStock.toLocaleString("id-ID") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Stok Aktif" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [
      viewMode === "list" && /* Products List */
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" }, i)) }) : products.map((product) => {
        const isActive = product.is_active !== false;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-4 p-4 rounded-xl border bg-card transition-all ${isActive ? "hover:shadow-md" : "opacity-50"}`,
            style: { borderLeftWidth: "4px", borderLeftColor: isActive ? getColorHex(product.color) : "#9ca3af" },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  style: {
                    background: isActive ? `linear-gradient(135deg, ${getColorHex(product.color)}30, ${getColorHex(product.color)}10)` : "rgba(156,163,175,0.1)"
                  },
                  children: /* @__PURE__ */ jsx(
                    SafeIcon,
                    {
                      name: "Cylinder",
                      className: "h-6 w-6",
                      style: { color: isActive ? getColorHex(product.color) : "#9ca3af" }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold truncate", children: product.name }),
                  /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `shrink-0 text-xs ${product.category === "SUBSIDI" ? "bg-green-500/10 text-green-700 border-green-300" : "bg-blue-500/10 text-blue-700 border-blue-300"}`,
                      children: product.category === "SUBSIDI" ? "Subsidi" : "Non-Subsidi"
                    }
                  ),
                  !isActive && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Nonaktif" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    product.size_kg,
                    " kg"
                  ] }),
                  /* @__PURE__ */ jsx("span", { children: "•" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Jual: ",
                    formatCurrency(Number(product.selling_price || 0))
                  ] }),
                  isActive && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Stok: ",
                      product.stock?.current || 0
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: isActive ? "Aktif" : "Nonaktif" }),
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: isActive,
                    disabled: togglingId === product.id,
                    onCheckedChange: () => handleToggleActive(product)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => handleEdit(product),
                  className: "gap-1 shrink-0",
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-4 w-4" }),
                    "Edit"
                  ]
                }
              )
            ]
          },
          product.id
        );
      }) }),
      viewMode === "edit" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-muted/30", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Status Produk" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: formData.is_active ? "Produk aktif dan muncul di halaman Stok LPG" : "Produk nonaktif dan tidak muncul di halaman Stok LPG" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${formData.is_active ? "text-green-600" : "text-muted-foreground"}`, children: formData.is_active ? "Aktif" : "Nonaktif" }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: formData.is_active,
                onCheckedChange: (checked) => setFormData({ ...formData, is_active: checked })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-sm font-semibold", children: "Nama Produk" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              placeholder: "Contoh: LPG 3 kg Subsidi",
              className: "h-11"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Ukuran (kg)" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.size_kg,
                onValueChange: (v) => setFormData({ ...formData, size_kg: v }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "h-11", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: sizeOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Kategori" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.category,
                onValueChange: (v) => setFormData({ ...formData, category: v }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "h-11", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "SUBSIDI", children: "Subsidi" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "NON_SUBSIDI", children: "Non-Subsidi" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Merek" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.brand,
              onValueChange: (v) => setFormData({ ...formData, brand: v }),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "h-11", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih merek" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: brandOptions.map((brand) => /* @__PURE__ */ jsx(SelectItem, { value: brand, children: brand }, brand)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "selling", className: "text-sm font-semibold", children: "Harga Jual (Rp)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "selling",
                type: "number",
                value: formData.selling_price,
                onChange: (e) => setFormData({ ...formData, selling_price: e.target.value }),
                placeholder: "16000",
                className: "h-11"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "cost", className: "text-sm font-semibold", children: "Harga Beli (Rp)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "cost",
                type: "number",
                value: formData.cost_price,
                onChange: (e) => setFormData({ ...formData, cost_price: e.target.value }),
                placeholder: "13000",
                className: "h-11"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Warna Tampilan" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: colorOptions.map((color) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setFormData({ ...formData, color: color.name }),
              className: `w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 ${formData.color === color.name ? "ring-2 ring-offset-2 ring-primary scale-110" : ""}`,
              style: { backgroundColor: color.hex, borderColor: color.hex },
              title: color.label
            },
            color.name
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border bg-muted/30", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide", children: "Preview" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex h-12 w-12 items-center justify-center rounded-xl",
                style: {
                  background: formData.is_active ? `linear-gradient(135deg, ${getColorHex(formData.color)}30, ${getColorHex(formData.color)}10)` : "rgba(156,163,175,0.1)"
                },
                children: /* @__PURE__ */ jsx(
                  SafeIcon,
                  {
                    name: "Cylinder",
                    className: "h-6 w-6",
                    style: { color: formData.is_active ? getColorHex(formData.color) : "#9ca3af" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: formData.is_active ? "" : "opacity-50", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold", children: formData.name || "Nama Produk" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                formData.size_kg || "0",
                " kg • ",
                formData.category === "SUBSIDI" ? "Subsidi" : "Non-Subsidi",
                formData.selling_price && ` • ${formatCurrency(parseFloat(formData.selling_price))}`,
                !formData.is_active && " • Nonaktif"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleSave,
            disabled: saving || !formData.name || !formData.size_kg || !formData.selling_price,
            className: "w-full h-12 text-base font-semibold gap-2",
            style: {
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              boxShadow: "0 4px 12px -2px rgba(34,197,94,0.4)"
            },
            children: saving ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-5 w-5" }),
              "Simpan Perubahan"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t p-4 flex justify-end items-center bg-muted/30", children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Tutup" }) })
  ] }) });
}
const HeaderSkeleton = () => /* @__PURE__ */ jsx("div", { className: "rounded-2xl p-4 animate-pulse border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row xl:items-center gap-4", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
    /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-primary/50 to-accent/50 w-[52px] h-[52px]" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 w-20 bg-muted rounded animate-shimmer" }),
        /* @__PURE__ */ jsx("div", { className: "h-9 w-32 bg-muted rounded animate-shimmer" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-10 bg-muted rounded animate-shimmer" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-4 w-56 bg-muted rounded animate-shimmer" })
    ] })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50", children: [
    /* @__PURE__ */ jsx("div", { className: "h-3 w-12 bg-muted rounded animate-shimmer" }),
    /* @__PURE__ */ jsx("div", { className: "h-5 w-14 bg-muted rounded animate-shimmer" })
  ] }, i)) }),
  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-9 w-24 bg-muted rounded-lg animate-shimmer" }, i)) })
] }) });
function RingkasanStokPageContent() {
  const [showManageLPGModal, setShowManageLPGModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, subsidi: 0, nonSubsidi: 0, products: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const products = await lpgProductsApi.getWithStock();
        const total = products.reduce((sum, p) => sum + (p.stock?.current || 0), 0);
        const subsidi = products.filter((p) => p.category === "SUBSIDI").reduce((sum, p) => sum + (p.stock?.current || 0), 0);
        const nonSubsidi = products.filter((p) => p.category === "NON_SUBSIDI").reduce((sum, p) => sum + (p.stock?.current || 0), 0);
        setStats({ total, subsidi, nonSubsidi, products: products.length });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [refreshTrigger]);
  const handleProductUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  const handleManageLPGClick = () => {
    setShowManageLPGModal(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("main", { className: "flex-1 flex flex-col", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-6", children: [
      isLoading ? /* @__PURE__ */ jsx(HeaderSkeleton, {}) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl p-4 animate-fadeInUp border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 shadow-lg backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row xl:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-7 w-7 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-foreground", children: "Stok LPG" }),
              /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-primary", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats.total, delay: 100 }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "unit" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Kelola stok LPG subsidi dan non-subsidi" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Subsidi" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-primary", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats.subsidi, delay: 200 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 dark:bg-accent/20", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Non-Subsidi" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-accent", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats.nonSubsidi, delay: 300 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 dark:bg-muted/30", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Produk" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-foreground", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: stats.products, delay: 400 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("a", { href: "/penerimaan", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/50", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "PackagePlus", className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Penerimaan" })
          ] }) }),
          /* @__PURE__ */ jsx("a", { href: "/in-out-agen", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5 hover:bg-accent/10 hover:text-accent hover:border-accent/50", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeftRight", className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "In/Out" })
          ] }) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleManageLPGClick,
              size: "sm",
              className: "gap-1.5 bg-gradient-to-r from-primary to-primary/80",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Settings2", className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Kelola" })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(StockSummaryCards, { showSummary: false, refreshTrigger }),
      /* @__PURE__ */ jsx(WeeklyConsumptionChart, { refreshTrigger })
    ] }) }),
    /* @__PURE__ */ jsx(
      ManageLPGTypesModal,
      {
        open: showManageLPGModal,
        onOpenChange: setShowManageLPGModal,
        onProductUpdate: handleProductUpdate
      }
    )
  ] });
}
const $$StokLpg = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Stok LPG - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "RingkasanStokPageContent", RingkasanStokPageContent, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/ringkasan-stok/RingkasanStokPageContent.tsx", "client:component-export": "default" })}
      ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/stok-lpg.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/stok-lpg.astro";
const $$url = "/stok-lpg.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$StokLpg,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
