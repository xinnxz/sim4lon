import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C7j8yK_x.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, c as dashboardApi, B as Button, e as activityApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { B as Badge, D as Dialog, i as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, j as Skeleton, S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { useState, useEffect, useRef } from "react";
import { W as WelcomePopup } from "../_astro/WelcomePopup.dIpGv1MM.js";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, AreaChart, Area, Legend, Cell, PieChart, Pie } from "recharts";
import { renderers } from "../renderers.mjs";
function CreateOrderButton() {
  return /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs(
    "a",
    {
      href: "/buat-pesanan",
      className: "group inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 bg-white border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-border active:scale-95 transition-all duration-300 ease-out font-semibold text-sm sm:text-base text-foreground",
      id: "icez9",
      children: [
        /* @__PURE__ */ jsx(
          SafeIcon,
          {
            name: "Plus",
            className: "h-5 w-5 stroke-[2] flex-shrink-0 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110 text-primary"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text", children: "Buat Pesanan" })
      ]
    }
  ) });
}
function useCountUp(target, duration = 1500, startDelay = 0) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const hasStarted = useRef(false);
  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    const startAnimation = () => {
      hasStarted.current = true;
      const animate = (timestamp) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        const easeProgress = 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(easeProgress * target));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };
      requestAnimationFrame(animate);
    };
    const timeoutId = setTimeout(startAnimation, startDelay);
    return () => {
      clearTimeout(timeoutId);
      startTimeRef.current = null;
    };
  }, [target, duration, startDelay]);
  return count;
}
function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}
function formatCurrency$1(num) {
  return `Rp ${formatNumber(num)}`;
}
function AnimatedNumber({
  value,
  delay = 0,
  className = "",
  isCurrency = false
}) {
  const animatedValue = useCountUp(value, 1200, delay);
  return /* @__PURE__ */ jsx("span", { className: `kpi-number animate-countUp ${className}`, style: { animationDelay: `${delay}ms` }, children: isCurrency ? formatCurrency$1(animatedValue) : formatNumber(animatedValue) });
}
function FloatingOrb({ className = "", delay = 0 }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `absolute rounded-full bg-white/40 dark:bg-white/20 animate-floatOrb ${className}`,
      style: { animationDelay: `${delay}s` }
    }
  );
}
const KPICardSkeleton = ({ index }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: `animate-slideInBlur stagger-${index + 1}`,
    style: { opacity: 0 },
    children: /* @__PURE__ */ jsx("div", { className: "h-32 bg-gradient-to-br from-muted to-muted/50 dark:from-muted/80 dark:to-muted/30 rounded-2xl relative overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 shine-effect" }) })
  }
);
function DashboardKPICards() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardApi.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2", children: [0, 1, 2, 3].map((index) => /* @__PURE__ */ jsx(KPICardSkeleton, { index }, index)) });
  }
  const totalStock = stats?.dynamicProducts?.reduce((sum, p) => sum + p.stock.current, 0) || 0;
  const productCount = stats?.dynamicProducts?.length || 0;
  const kpiCards = [
    {
      title: "Total Pesanan",
      value: stats?.todayOrders || 0,
      subtitle: "Hari ini",
      icon: "ShoppingCart",
      subtitleIcon: "CalendarDays",
      gradient: "from-cyan-500 to-blue-600",
      shadowColor: "shadow-blue-500/25 hover:shadow-blue-500/40",
      textAccent: "text-blue-100",
      delay: 100,
      href: "/daftar-pesanan"
    },
    {
      title: "Penjualan Hari Ini",
      value: stats?.todaySales || 0,
      subtitle: "Total revenue",
      icon: "Banknote",
      subtitleIcon: "TrendingUp",
      gradient: "from-rose-500 to-red-600",
      shadowColor: "shadow-rose-500/25 hover:shadow-rose-500/40",
      textAccent: "text-rose-100",
      delay: 200,
      isCurrency: true,
      href: "/laporan"
    },
    {
      title: "Pesanan Selesai",
      value: stats?.completedOrders || 0,
      subtitle: "Hari ini",
      icon: "Truck",
      subtitleIcon: "CheckCircle2",
      gradient: "from-green-500 to-emerald-600",
      shadowColor: "shadow-green-500/25 hover:shadow-green-500/40",
      textAccent: "text-green-100",
      delay: 300,
      href: "/daftar-pesanan?status=selesai"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2", children: [
    kpiCards.map((card, index) => /* @__PURE__ */ jsx(
      "a",
      {
        href: card.href,
        className: "animate-slideInBlur block cursor-pointer",
        style: { animationDelay: `${card.delay}ms`, opacity: 0 },
        children: /* @__PURE__ */ jsxs(
          Card,
          {
            className: `group relative overflow-hidden h-[140px] bg-gradient-to-br ${card.gradient} text-white shadow-lg ${card.shadowColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] rounded-2xl border-0`,
            children: [
              /* @__PURE__ */ jsx(FloatingOrb, { className: "w-24 h-24 top-0 right-0 -translate-y-1/2 translate-x-1/2", delay: index * 0.5 }),
              /* @__PURE__ */ jsx(FloatingOrb, { className: "w-16 h-16 bottom-0 left-0 translate-y-1/2 -translate-x-1/2 opacity-50", delay: index * 0.5 + 1 }),
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative z-10", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: card.icon, className: "h-4 w-4 icon-bounce-target icon-rotate-hover transition-transform duration-300" }),
                card.title
              ] }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "relative z-10", children: [
                /* @__PURE__ */ jsx("p", { className: `${card.isCurrency ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"} font-bold tracking-tight`, children: /* @__PURE__ */ jsx(AnimatedNumber, { value: card.value, delay: card.delay + 200, isCurrency: card.isCurrency }) }),
                /* @__PURE__ */ jsxs("p", { className: `${card.textAccent} text-sm mt-2 flex items-center gap-1`, children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: card.subtitleIcon, className: "h-3.5 w-3.5" }),
                  card.subtitle
                ] })
              ] })
            ]
          }
        )
      },
      card.title
    )),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "animate-slideInBlur",
        style: { animationDelay: "400ms", opacity: 0 },
        children: /* @__PURE__ */ jsx("a", { href: "/stok-lpg", className: "block cursor-pointer", children: /* @__PURE__ */ jsxs(
          Card,
          {
            className: "group relative overflow-hidden h-[140px] bg-card dark:bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] rounded-2xl border-0",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-primary/20 dark:bg-primary/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-primary/15 dark:bg-primary/25 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed opacity-80" }),
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative z-10", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-muted-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-4 w-4 text-primary icon-bounce-target icon-rotate-hover" }) }),
                "Total Stok LPG"
              ] }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "relative z-10", children: [
                /* @__PURE__ */ jsx("p", { className: "text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: totalStock, delay: 600 }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-sm mt-2 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Layers", className: "h-3.5 w-3.5" }),
                  productCount > 0 ? `${productCount} jenis produk` : "Belum ada produk"
                ] })
              ] })
            ]
          }
        ) })
      }
    )
  ] });
}
function DSSAlertSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-muted animate-pulse" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-5 w-48 bg-muted rounded animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 w-32 bg-muted/50 rounded animate-pulse" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 h-40 bg-muted rounded-2xl animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-20 bg-muted rounded-xl animate-pulse" }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-48 bg-muted rounded-2xl animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "h-48 bg-muted rounded-2xl animate-pulse" })
    ] })
  ] });
}
function HealthScoreRing({ score }) {
  const size = 120;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100 * circumference;
  const getColor = (score2) => {
    if (score2 >= 80) return { main: "text-emerald-500", bg: "from-emerald-500 to-teal-500", label: "Excellent" };
    if (score2 >= 60) return { main: "text-amber-500", bg: "from-amber-500 to-yellow-500", label: "Good" };
    if (score2 >= 40) return { main: "text-orange-500", bg: "from-orange-500 to-red-500", label: "Fair" };
    return { main: "text-red-500", bg: "from-red-500 to-rose-500", label: "Critical" };
  };
  const colors = getColor(score);
  return /* @__PURE__ */ jsxs(Card, { className: "bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2" }),
    /* @__PURE__ */ jsx(CardContent, { className: "p-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", style: { width: size, height: size }, children: [
        /* @__PURE__ */ jsxs("svg", { className: "transform -rotate-90", width: size, height: size, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "health-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", className: colors.main.replace("text-", "stop-") }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", className: colors.main.replace("text-", "stop-"), style: { stopOpacity: 0.6 } })
          ] }) }),
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: size / 2,
              cy: size / 2,
              r: radius,
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "10",
              className: "text-muted"
            }
          ),
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: size / 2,
              cy: size / 2,
              r: radius,
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${progress} ${circumference}`,
              className: `${colors.main} transition-all duration-1000 ease-out`
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("span", { className: `text-4xl font-bold ${colors.main}`, children: score }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-medium", children: colors.label })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-1", children: "Health Score" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: score >= 80 ? "Semua sistem berjalan optimal" : score >= 60 ? "Ada beberapa hal perlu diperhatikan" : "Diperlukan tindakan segera" })
      ] })
    ] }) })
  ] });
}
function StatCard({ label, value, icon, gradient, textColor }) {
  return /* @__PURE__ */ jsxs("div", { className: `group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${gradient} text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: icon, className: "w-4 h-4 opacity-80" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs opacity-80", children: label })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: value })
    ] })
  ] });
}
function AlertItem({
  severity,
  title,
  subtitle,
  badge,
  detail,
  recommendation
}) {
  const isCritical = severity === "critical";
  return /* @__PURE__ */ jsxs("div", { className: `group p-4 rounded-xl border transition-all hover:shadow-md ${isCritical ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30" : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground truncate", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: subtitle })
      ] }),
      /* @__PURE__ */ jsx(Badge, { variant: isCritical ? "destructive" : "secondary", className: "shrink-0", children: badge })
    ] }),
    detail && /* @__PURE__ */ jsx("p", { className: `text-sm font-medium mb-2 ${isCritical ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`, children: detail }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Lightbulb", className: "w-4 h-4 shrink-0 text-primary mt-0.5" }),
      /* @__PURE__ */ jsx("span", { children: recommendation })
    ] })
  ] });
}
function AlertSectionCard({
  title,
  icon,
  iconBg,
  iconColor,
  count,
  criticalCount,
  children,
  emptyMessage,
  isEmpty
}) {
  if (isEmpty) {
    return /* @__PURE__ */ jsx(Card, { className: "bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`, children: /* @__PURE__ */ jsx(SafeIcon, { name: icon, className: `w-5 h-5 ${iconColor}` }) }),
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle2", className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: emptyMessage })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(Card, { className: "bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`, children: /* @__PURE__ */ jsx(SafeIcon, { name: icon, className: `w-5 h-5 ${iconColor}` }) }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        criticalCount > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "destructive", className: "animate-pulse", children: [
          criticalCount,
          " critical"
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
          count,
          " total"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "p-4 space-y-3 max-h-[300px] overflow-y-auto", children })
  ] });
}
function DSSAlertSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStockAlerts, setShowStockAlerts] = useState(true);
  useEffect(() => {
    const savedStockAlerts = localStorage.getItem("app_stockAlerts");
    setShowStockAlerts(savedStockAlerts !== "false");
    fetchDSSAlerts();
  }, []);
  const fetchDSSAlerts = async () => {
    try {
      if (data) setIsRefreshing(true);
      else setLoading(true);
      setError(null);
      const result = await dashboardApi.getDSSAlerts();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch DSS alerts:", err);
      setError("Gagal memuat data DSS alerts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(DSSAlertSkeleton, {});
  }
  if (error || !data) {
    return /* @__PURE__ */ jsx(Card, { className: "bg-card shadow-lg rounded-2xl border-dashed border-2", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "w-12 h-12 text-muted-foreground mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: error || "Data tidak tersedia" }),
      /* @__PURE__ */ jsxs(Button, { onClick: fetchDSSAlerts, variant: "outline", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: "w-4 h-4 mr-2" }),
        "Coba Lagi"
      ] })
    ] }) });
  }
  const hasAlerts = showStockAlerts && data.lowStockAlerts.length > 0 || data.paymentOverdueAlerts.length > 0;
  const visibleAlertCount = (showStockAlerts ? data.lowStockAlerts.length : 0) + data.paymentOverdueAlerts.length;
  const formatCurrency2 = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-fadeInUp", style: { animationDelay: "0.15s" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2", children: [
            "Perlu Tindakan!",
            hasAlerts && /* @__PURE__ */ jsxs(Badge, { variant: "destructive", className: "animate-pulse text-xs", children: [
              visibleAlertCount,
              " alerts"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/80", children: "AI-powered operational insights" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => fetchDSSAlerts(),
          disabled: isRefreshing,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: `w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}` }),
            isRefreshing ? "Loading..." : "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 animate-fadeInUp", style: { animationDelay: "0.2s" }, children: /* @__PURE__ */ jsx(HealthScoreRing, { score: data.summary.overallHealthScore }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeInUp", style: { animationDelay: "0.25s" }, children: [
        /* @__PURE__ */ jsx(
          StatCard,
          {
            label: "Pending",
            value: data.summary.pendingOrdersCount,
            icon: "ClipboardList",
            gradient: "from-cyan-500 to-blue-600",
            textColor: "text-white"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            label: "Urgent",
            value: data.summary.urgentOrdersCount,
            icon: "Truck",
            gradient: "from-purple-500 to-violet-600",
            textColor: "text-white"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            label: "Low Stock",
            value: data.summary.totalLowStockProducts,
            icon: "Package",
            gradient: "from-amber-500 to-orange-600",
            textColor: "text-white"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            label: "Overdue",
            value: data.summary.totalOverduePayments,
            icon: "AlertCircle",
            gradient: "from-rose-500 to-red-600",
            textColor: "text-white"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp", style: { animationDelay: "0.35s" }, children: showStockAlerts ? /* @__PURE__ */ jsx(
        AlertSectionCard,
        {
          title: "Low Stock Alerts",
          icon: "Package",
          iconBg: "bg-amber-100 dark:bg-amber-500/20",
          iconColor: "text-amber-600 dark:text-amber-400",
          count: data.lowStockAlerts.length,
          criticalCount: data.lowStockAlerts.filter((a) => a.severity === "critical").length,
          isEmpty: data.lowStockAlerts.length === 0,
          emptyMessage: "Semua stok dalam kondisi aman",
          children: data.lowStockAlerts.map((alert) => /* @__PURE__ */ jsx(
            AlertItem,
            {
              severity: alert.severity,
              title: alert.name,
              subtitle: `Stok: ${alert.currentStock} unit`,
              badge: alert.severity === "critical" ? "Kritis" : "Warning",
              recommendation: alert.recommendation
            },
            alert.id
          ))
        }
      ) : /* @__PURE__ */ jsx(Card, { className: "bg-card dark:bg-card shadow-lg rounded-2xl border-0 overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "w-5 h-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: "Low Stock Alerts" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground bg-muted/50 p-3 rounded-xl", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "EyeOff", className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Notifikasi stok dinonaktifkan dari Pengaturan" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp", style: { animationDelay: "0.45s" }, children: /* @__PURE__ */ jsx(
        AlertSectionCard,
        {
          title: "Payment Overdue",
          icon: "Wallet",
          iconBg: "bg-red-100 dark:bg-red-500/20",
          iconColor: "text-red-600 dark:text-red-400",
          count: data.paymentOverdueAlerts.length,
          criticalCount: data.paymentOverdueAlerts.filter((a) => a.severity === "critical").length,
          isEmpty: data.paymentOverdueAlerts.length === 0,
          emptyMessage: "Tidak ada pembayaran terlambat",
          children: data.paymentOverdueAlerts.map((alert) => /* @__PURE__ */ jsx(
            AlertItem,
            {
              severity: alert.severity,
              title: alert.pangkalanName,
              subtitle: alert.orderCode,
              badge: `${alert.daysOverdue} hari`,
              detail: `Sisa: ${formatCurrency2(alert.totalAmount - alert.amountPaid)}`,
              recommendation: alert.recommendation
            },
            alert.orderId
          ))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground text-right", children: [
      "Last updated: ",
      new Date(data.generatedAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    ] })
  ] });
}
function DSSAdvancedSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "h-8 w-64 bg-muted rounded animate-pulse" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-80 bg-muted rounded-2xl animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "h-80 bg-muted rounded-2xl animate-pulse" })
    ] })
  ] });
}
function ReorderPointCard({ data }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/30";
      case "warning":
        return "bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30";
      case "overstocked":
        return "bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30";
      default:
        return "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30";
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "critical":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Kritis" });
      case "warning":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-amber-500 text-white", children: "Perlu Pesan" });
      case "overstocked":
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Stok Berlebih" });
      default:
        return /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-500 text-white", children: "Aman" });
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "critical":
        return /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "w-5 h-5 text-red-500" });
      case "warning":
        return /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "w-5 h-5 text-amber-500" });
      case "overstocked":
        return /* @__PURE__ */ jsx(SafeIcon, { name: "PackagePlus", className: "w-5 h-5 text-blue-500" });
      default:
        return /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle2", className: "w-5 h-5 text-emerald-500" });
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "bg-card shadow-lg rounded-2xl border-0 overflow-hidden h-[520px] flex flex-col", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 border-b shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Calculator", className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Reorder Point" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Kapan harus pesan ulang?" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        data.summary.criticalCount > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "destructive", className: "animate-pulse", children: [
          data.summary.criticalCount,
          " kritis"
        ] }),
        data.summary.warningCount > 0 && /* @__PURE__ */ jsxs(Badge, { className: "bg-amber-500 text-white", children: [
          data.summary.warningCount,
          " perlu pesan"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3 flex-1 overflow-y-auto scrollbar-hide", children: [
      data.data.map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `p-4 rounded-xl border transition-all hover:shadow-md ${getStatusColor(item.status)}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                getStatusIcon(item.status),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: item.productName }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Stok: ",
                    item.currentStock,
                    " unit | ROP: ",
                    item.reorderPoint,
                    " unit"
                  ] })
                ] })
              ] }),
              getStatusBadge(item.status)
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `h-full transition-all duration-500 ${item.status === "critical" ? "bg-red-500" : item.status === "warning" ? "bg-amber-500" : item.status === "overstocked" ? "bg-blue-500" : "bg-emerald-500"}`,
                style: {
                  width: `${Math.min(item.currentStock / (item.reorderPoint * 2) * 100, 100)}%`
                }
              }
            ) }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs text-center mb-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Avg/Hari" }),
                /* @__PURE__ */ jsx("p", { className: "font-semibold", children: item.avgDailyDemand })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Habis Dalam" }),
                /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
                  item.daysUntilStockout,
                  " hari"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Saran Pesan" }),
                /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
                  item.suggestedOrderQty,
                  " unit"
                ] })
              ] })
            ] }),
            item.needsReorder && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-xs bg-muted/50 p-2 rounded-lg", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Lightbulb", className: "w-4 h-4 shrink-0 text-primary mt-0.5" }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: item.recommendation })
            ] })
          ]
        },
        item.productId
      )),
      data.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "w-12 h-12 mb-2 opacity-50" }),
        /* @__PURE__ */ jsx("p", { children: "Tidak ada produk untuk dianalisis" })
      ] })
    ] })
  ] });
}
function SalesTrendCard({ data }) {
  const formatCurrency2 = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  const formatShortCurrency = (value) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}jt`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}rb`;
    return value.toString();
  };
  const getGrowthColor = (rate) => {
    if (rate > 0) return "text-emerald-500";
    if (rate < 0) return "text-red-500";
    return "text-muted-foreground";
  };
  const getGrowthIcon = (rate) => {
    if (rate > 0) return "TrendingUp";
    if (rate < 0) return "TrendingDown";
    return "Minus";
  };
  return /* @__PURE__ */ jsxs(Card, { className: "bg-card shadow-lg rounded-2xl border-0 overflow-hidden h-[520px] flex flex-col", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 border-b shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Tren Penjualan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Analisis 4 minggu terakhir" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 ${getGrowthColor(data.statistics.growthRate)}`, children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: getGrowthIcon(data.statistics.growthRate), className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
          data.statistics.growthRate > 0 ? "+" : "",
          data.statistics.growthRate,
          "%"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-4 flex-1 overflow-y-auto scrollbar-hide", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: data.insights.map((insight, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-sm bg-muted/50 p-2 rounded-lg",
          children: insight
        },
        index
      )) }),
      /* @__PURE__ */ jsx("div", { className: "h-48", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: data.weeklyPattern, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", className: "opacity-30" }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            dataKey: "day",
            tick: { fontSize: 11 },
            tickFormatter: (value) => value.slice(0, 3)
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            tick: { fontSize: 10 },
            tickFormatter: formatShortCurrency
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            formatter: (value) => formatCurrency2(value),
            labelFormatter: (label) => `Hari ${label}`
          }
        ),
        /* @__PURE__ */ jsx(
          Bar,
          {
            dataKey: "avgSales",
            name: "Rata-rata Penjualan",
            fill: "#8b5cf6",
            radius: [4, 4, 0, 0],
            isAnimationActive: true,
            animationDuration: 800,
            animationEasing: "ease-out"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "w-4 h-4 text-emerald-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-emerald-700 dark:text-emerald-400", children: "Hari Tersibuk" })
          ] }),
          data.peakDays.slice(0, 2).map((peak, index) => /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: peak.day }),
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
              " • ",
              formatShortCurrency(peak.avgSales),
              "/hari"
            ] })
          ] }, index))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 dark:bg-slate-500/10 p-3 rounded-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Moon", className: "w-4 h-4 text-slate-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-700 dark:text-slate-400", children: "Hari Sepi" })
          ] }),
          data.lowDays.slice(0, 2).map((low, index) => /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: low.day }),
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
              " • ",
              formatShortCurrency(low.avgSales),
              "/hari"
            ] })
          ] }, index))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Penjualan" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: formatShortCurrency(data.statistics.totalSales) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Order" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: data.statistics.totalOrders })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Avg/Hari" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: formatShortCurrency(data.statistics.avgDailySales) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Avg Order/Hari" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: data.statistics.avgDailyOrders })
        ] })
      ] })
    ] })
  ] });
}
function DSSAdvancedSection() {
  const [reorderData, setReorderData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      if (reorderData || trendData) setIsRefreshing(true);
      else setLoading(true);
      setError(null);
      const [reorder, trend] = await Promise.all([
        dashboardApi.getReorderPoint(),
        dashboardApi.getSalesTrend()
      ]);
      setReorderData(reorder);
      setTrendData(trend);
    } catch (err) {
      console.error("Failed to fetch DSS advanced data:", err);
      setError("Gagal memuat data DSS lanjutan");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(DSSAdvancedSkeleton, {});
  }
  if (error) {
    return /* @__PURE__ */ jsx(Card, { className: "bg-card shadow-lg rounded-2xl border-dashed border-2", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "w-12 h-12 text-muted-foreground mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: error }),
      /* @__PURE__ */ jsxs(Button, { onClick: fetchData, variant: "outline", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: "w-4 h-4 mr-2" }),
        "Coba Lagi"
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-fadeInUp", style: { animationDelay: "0.2s" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-1.5 rounded-full bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2", children: "Prediksi Penjualan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/80", children: "Reorder Point & Tren Penjualan" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: fetchData,
          disabled: isRefreshing,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: `w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}` }),
            isRefreshing ? "Loading..." : "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      reorderData && /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp", style: { animationDelay: "0.3s" }, children: /* @__PURE__ */ jsx(ReorderPointCard, { data: reorderData }) }),
      trendData && /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp", style: { animationDelay: "0.4s" }, children: /* @__PURE__ */ jsx(SalesTrendCard, { data: trendData }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground text-right", children: [
      "Last updated: ",
      new Date(reorderData?.generatedAt || trendData?.generatedAt || "").toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    ] })
  ] });
}
const formatRupiah$1 = (value) => {
  if (value >= 1e6) {
    return `Rp ${(value / 1e6).toFixed(1)}Jt`;
  } else if (value >= 1e3) {
    return `Rp ${(value / 1e3).toFixed(0)}K`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
};
const CustomTooltip$3 = ({ active, payload, allData = [] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const currentSales = data.sales;
    const totalSales = allData.reduce((sum, d) => sum + d.sales, 0);
    const avgSales = allData.length > 0 ? totalSales / allData.length : 0;
    const diffFromAvg = currentSales - avgSales;
    const diffPercent = avgSales > 0 ? (diffFromAvg / avgSales * 100).toFixed(1) : "0";
    return /* @__PURE__ */ jsxs("div", { className: "bg-background border border-border rounded-lg shadow-lg p-4 backdrop-blur-sm min-w-[180px]", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground mb-3 border-b pb-2", children: data.day }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Total Penjualan:" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary", children: formatRupiah$1(currentSales) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t pt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Rata-rata Minggu:" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground", children: formatRupiah$1(avgSales) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "vs Rata-rata:" }),
          /* @__PURE__ */ jsxs("span", { className: `text-xs font-semibold ${diffFromAvg >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            diffFromAvg >= 0 ? "+" : "",
            diffPercent,
            "%"
          ] })
        ] })
      ] })
    ] });
  }
  return null;
};
function SalesChart({ isVisible = true }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getSalesChart();
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sales chart:", err);
        setError("Gagal memuat data");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse text-muted-foreground", children: "Memuat data..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-destructive", children: error }) });
  }
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Belum ada data penjualan" }) });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
    AreaChart,
    {
      data,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
      className: "drop-shadow-sm",
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "colorSales", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "hsl(152 100% 35%)", stopOpacity: 0.4 }),
            /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "hsl(152 100% 40%)", stopOpacity: 0.15 }),
            /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "hsl(152 100% 45%)", stopOpacity: 0.02 })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: "strokeSales", x1: "0", y1: "0", x2: "1", y2: "0", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "hsl(152 100% 35%)" }),
            /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "hsl(152 90% 40%)" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "hsl(48 100% 50%)" })
          ] }),
          /* @__PURE__ */ jsxs("filter", { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
            /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
            /* @__PURE__ */ jsxs("feMerge", { children: [
              /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
              /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
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
            axisLine: { stroke: "hsl(var(--border))" },
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            stroke: "hsl(var(--muted-foreground))",
            style: { fontSize: "11px", fontWeight: 500 },
            tickFormatter: (value) => `${(value / 1e6).toFixed(0)}Jt`,
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            content: /* @__PURE__ */ jsx(CustomTooltip$3, { allData: data }),
            cursor: { stroke: "hsl(152 100% 40%)", strokeWidth: 2, strokeDasharray: "5 5", opacity: 0.5 }
          }
        ),
        /* @__PURE__ */ jsx(
          Area,
          {
            type: "monotone",
            dataKey: "sales",
            stroke: "url(#strokeSales)",
            strokeWidth: 3,
            fill: "url(#colorSales)",
            dot: {
              fill: "hsl(152 100% 40%)",
              r: 5,
              strokeWidth: 3,
              stroke: "hsl(var(--background))",
              filter: "url(#glow)"
            },
            activeDot: {
              r: 8,
              strokeWidth: 3,
              stroke: "hsl(var(--background))",
              fill: "hsl(152 100% 35%)",
              filter: "url(#glow)"
            },
            isAnimationActive: isVisible,
            animationBegin: 0,
            animationDuration: 1e3,
            animationEasing: "ease-out"
          }
        )
      ]
    }
  ) });
}
const getUsageLevel = (qty) => {
  if (qty <= 0) return { text: "TIDAK ADA", color: "text-gray-500 bg-gray-100" };
  if (qty >= 50) return { text: "TINGGI", color: "text-green-600 bg-green-100" };
  if (qty >= 20) return { text: "SEDANG", color: "text-blue-600 bg-blue-100" };
  return { text: "RENDAH", color: "text-yellow-600 bg-yellow-100" };
};
const CustomTooltip$2 = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const totalUsage = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "rounded-xl border shadow-2xl p-4 min-w-[240px]",
      style: {
        background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(0,0,0,0.08)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3 pb-2 border-b border-gray-100", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-gray-800", children: [
            "📦 Pemakaian - ",
            label
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-bold", children: [
            totalUsage,
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
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 font-medium truncate max-w-[100px]", children: entry.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", style: { color: entry.color }, children: entry.value || 0 }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-medium ${level.color}`, children: level.text })
            ] })
          ] }, index);
        }) })
      ]
    }
  );
};
const CustomLegend = ({ payload }) => {
  if (!payload) return null;
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-3 pt-4", children: payload.map((entry, index) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/50 shadow-sm hover:shadow-md transition-shadow",
      style: { borderColor: `${entry.color}40` },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-2.5 h-2.5 rounded-full",
            style: { backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}60` }
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-600", children: entry.value })
      ]
    },
    index
  )) });
};
function StockChart({ isVisible = true }) {
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
        console.error("Failed to fetch stock chart:", err);
        setError("Gagal memuat data");
        setChartData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse text-muted-foreground", children: "Memuat data..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-destructive", children: error }) });
  }
  if (!chartData || chartData.data.length === 0 || chartData.products.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Belum ada data stok" }) });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
    AreaChart,
    {
      data: chartData.data,
      margin: { top: 20, right: 20, left: -10, bottom: 0 },
      children: [
        /* @__PURE__ */ jsx("defs", { children: chartData.products.map((product) => /* @__PURE__ */ jsxs("linearGradient", { id: `gradient-dashboard-${product.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
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
            axisLine: { stroke: "hsl(var(--border))" },
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            stroke: "hsl(var(--muted-foreground))",
            style: { fontSize: "11px", fontWeight: 500 },
            tickFormatter: (value) => `${value}`,
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            content: /* @__PURE__ */ jsx(CustomTooltip$2, {}),
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
            fill: `url(#gradient-dashboard-${product.id})`,
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
            isAnimationActive: isVisible,
            animationBegin: index * 100,
            animationDuration: 800,
            animationEasing: "ease-out"
          },
          product.id
        ))
      ]
    }
  ) });
}
const formatRupiah = (value) => {
  if (value >= 1e6) {
    return `Rp ${(value / 1e6).toFixed(1)}Jt`;
  } else if (value >= 1e3) {
    return `Rp ${(value / 1e3).toFixed(0)}K`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
};
const CustomTooltip$1 = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return /* @__PURE__ */ jsxs("div", { className: "bg-background border border-border rounded-lg shadow-lg p-4 backdrop-blur-sm min-w-[200px]", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground mb-3 border-b pb-2", children: data.day }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Total Penjualan:" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-blue-600", children: formatRupiah(data.totalSales) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Total Beli:" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-orange-600", children: formatRupiah(data.totalCost) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-dashed my-2" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground", children: "Keuntungan:" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-green-600", children: formatRupiah(data.profit) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2 pt-2 border-t", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Pesanan Selesai:" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-foreground", children: [
          data.orderCount,
          " pesanan"
        ] })
      ] })
    ] });
  }
  return null;
};
const GRADIENT_COLORS = [
  "hsl(152 100% 35%)",
  "hsl(152 95% 38%)",
  "hsl(152 90% 40%)",
  "hsl(152 85% 38%)",
  "hsl(152 90% 35%)",
  "hsl(152 95% 33%)",
  "hsl(152 100% 30%)"
];
function ProfitChart({ isVisible = true }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getProfitChart();
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profit chart:", err);
        setError("Gagal memuat data");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse text-muted-foreground", children: "Memuat data..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-destructive", children: error }) });
  }
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Belum ada data keuntungan" }) });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 340, children: /* @__PURE__ */ jsxs(
    BarChart,
    {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 30 },
      className: "drop-shadow-sm",
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "colorProfitGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "hsl(152 100% 40%)", stopOpacity: 1 }),
            /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "hsl(152 90% 35%)", stopOpacity: 0.95 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "hsl(152 85% 30%)", stopOpacity: 0.9 })
          ] }),
          /* @__PURE__ */ jsxs("filter", { id: "barGlow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [
            /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
            /* @__PURE__ */ jsxs("feMerge", { children: [
              /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
              /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("filter", { id: "barShadow", x: "-20%", y: "-10%", width: "140%", height: "130%", children: /* @__PURE__ */ jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "4", floodColor: "hsl(152 100% 30%)", floodOpacity: "0.3" }) })
        ] }),
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
            stroke: "hsl(var(--foreground))",
            style: { fontSize: "12px", fontWeight: 600 },
            axisLine: { stroke: "hsl(var(--border))", strokeWidth: 1 },
            tickLine: false,
            interval: 0,
            tick: { fill: "hsl(var(--foreground))", dy: 8 },
            height: 40
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            stroke: "hsl(var(--muted-foreground))",
            style: { fontSize: "11px", fontWeight: 500 },
            tickFormatter: (value) => `${(value / 1e3).toFixed(0)}K`,
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            content: /* @__PURE__ */ jsx(CustomTooltip$1, {}),
            cursor: { fill: "hsl(152 100% 40% / 0.08)", radius: 8 }
          }
        ),
        /* @__PURE__ */ jsx(
          Bar,
          {
            dataKey: "profit",
            fill: "url(#colorProfitGradient)",
            radius: [10, 10, 0, 0],
            isAnimationActive: isVisible,
            animationBegin: 0,
            animationDuration: 1e3,
            animationEasing: "ease-out",
            style: { filter: "url(#barShadow)" },
            children: data.map((entry, index) => /* @__PURE__ */ jsx(
              Cell,
              {
                fill: GRADIENT_COLORS[index % GRADIENT_COLORS.length]
              },
              `cell-${index}`
            ))
          }
        )
      ]
    }
  ) });
}
const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];
const formatCurrency = (value) => {
  if (value >= 1e6) {
    return `Rp ${(value / 1e6).toFixed(1)}jt`;
  }
  if (value >= 1e3) {
    return `Rp ${(value / 1e3).toFixed(0)}rb`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
};
const formatCurrencyFull = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(value);
};
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const index = data.index ?? 0;
    const getRankBadge = (idx) => {
      if (idx === 0) return { emoji: "🥇", text: "Peringkat 1", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
      if (idx === 1) return { emoji: "🥈", text: "Peringkat 2", color: "text-gray-600 bg-gray-50 border-gray-200" };
      if (idx === 2) return { emoji: "🥉", text: "Peringkat 3", color: "text-amber-600 bg-amber-50 border-amber-200" };
      return { emoji: "📊", text: `Peringkat ${idx + 1}`, color: "text-muted-foreground bg-muted border-border" };
    };
    const rankBadge = getRankBadge(index);
    return /* @__PURE__ */ jsxs("div", { className: "bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl p-4 min-w-[220px]", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-3 pb-2 border-b border-border/50", children: /* @__PURE__ */ jsxs("span", { className: `text-xs px-2 py-1 rounded-lg font-medium border ${rankBadge.color}`, children: [
        rankBadge.emoji,
        " ",
        rankBadge.text
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground mb-3 truncate", title: data.name, children: data.name }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-3 w-3" }),
            "Pendapatan"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-green-600", children: formatCurrencyFull(data.totalAmount) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingCart", className: "h-3 w-3" }),
            "Transaksi"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
            data.value,
            " penjualan"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-1 border-t border-border/50 mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Kontribusi" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-primary", children: [
            data.percentage,
            "%"
          ] })
        ] })
      ] })
    ] });
  }
  return null;
};
function PangkalanOrderChart({ isVisible = true }) {
  const [data, setData] = useState([]);
  const [allRankings, setAllRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getTopPangkalan();
        const totalRevenue = response.data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
        const processedData = response.data.map((item, index) => ({
          ...item,
          index,
          percentage: totalRevenue > 0 ? (item.totalAmount / totalRevenue * 100).toFixed(1) : "0"
        }));
        setData(processedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pangkalan chart:", err);
        setError("Gagal memuat data");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleOpenModal = async () => {
    setShowModal(true);
    if (allRankings.length === 0) {
      setIsLoadingMore(true);
      try {
        const response = await dashboardApi.getTopPangkalan(100);
        const totalRevenue = response.data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
        const withPercentage = response.data.map((item, index) => ({
          ...item,
          index,
          percentage: totalRevenue > 0 ? (item.totalAmount / totalRevenue * 100).toFixed(1) : "0"
        }));
        setAllRankings(withPercentage);
      } catch (err) {
        console.error("Failed to fetch all rankings:", err);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }),
      "Memuat data..."
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-destructive text-sm flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
      error
    ] }) });
  }
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm", children: "Belum ada data pangkalan" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
      /* @__PURE__ */ jsx(
        Pie,
        {
          data,
          cx: "50%",
          cy: "50%",
          innerRadius: "40%",
          outerRadius: "70%",
          paddingAngle: 4,
          dataKey: "totalAmount",
          labelLine: false,
          isAnimationActive: isVisible,
          animationBegin: 0,
          animationDuration: 800,
          animationEasing: "ease-in-out",
          children: data.map((entry, index) => /* @__PURE__ */ jsx(
            Cell,
            {
              fill: COLORS[index % COLORS.length],
              style: { filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }
            },
            `cell-${index}`
          ))
        }
      ),
      /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 pt-3 pb-2", children: data.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 text-sm", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-3 h-3 rounded-full shrink-0 shadow-sm",
          style: { backgroundColor: COLORS[index % COLORS.length] }
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "flex-1 truncate text-foreground font-medium", title: item.name, children: item.name }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: formatCurrency(item.totalAmount) }),
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-primary text-sm", children: [
          item.percentage,
          "%"
        ] })
      ] })
    ] }, item.name)) }),
    /* @__PURE__ */ jsxs(Dialog, { open: showModal, onOpenChange: setShowModal, children: [
      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "w-full text-xs mt-1 hover:bg-primary/5 hover:border-primary/30",
          onClick: handleOpenModal,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-3.5 w-3.5 mr-1.5" }),
            "Lihat Semua Ranking"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md max-h-[80vh]", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Award", className: "h-5 w-5 text-primary" }),
            "Ranking Pangkalan"
          ] }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Berdasarkan total pendapatan penjualan" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-y-auto max-h-[55vh] pr-2 -mr-2", children: isLoadingMore ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : allRankings.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: allRankings.map((item, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-3 p-3 rounded-xl transition-colors ${index < 3 ? "bg-gradient-to-r from-muted/80 to-transparent" : "hover:bg-muted/50"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white" : index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" : index === 2 ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white" : "bg-muted text-muted-foreground"}`, children: index + 1 }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold truncate", children: item.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    item.value,
                    " transaksi"
                  ] }),
                  /* @__PURE__ */ jsx("span", { children: "•" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-green-600", children: formatCurrencyFull(item.totalAmount) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-primary shrink-0", children: [
                item.percentage,
                "%"
              ] })
            ]
          },
          item.name
        )) }) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground text-sm", children: "Tidak ada data pangkalan" }) })
      ] })
    ] })
  ] });
}
const formatRelativeTime = (timestamp) => {
  const now = /* @__PURE__ */ new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffMs / 864e5);
  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};
const getActivityIcon = (type, iconName) => {
  if (iconName) return iconName;
  switch (type) {
    case "ORDER_NEW":
      return "ShoppingCart";
    case "ORDER_UPDATED":
      return "Edit";
    case "ORDER_COMPLETED":
      return "CheckCircle";
    case "ORDER_CANCELLED":
      return "XCircle";
    case "PAYMENT_RECEIVED":
      return "CreditCard";
    case "STOCK_IN":
      return "ArrowDownCircle";
    case "STOCK_OUT":
      return "ArrowUpCircle";
    case "USER_LOGIN":
      return "LogIn";
    default:
      return "Activity";
  }
};
const getActivityStyle = (type) => {
  switch (type) {
    case "ORDER_NEW":
      return { bg: "bg-blue-50", text: "text-blue-600", badge: "bg-blue-100 text-blue-700", badgeText: "Baru" };
    case "ORDER_COMPLETED":
      return { bg: "bg-green-50", text: "text-green-600", badge: "bg-green-100 text-green-700", badgeText: "Selesai" };
    case "ORDER_CANCELLED":
      return { bg: "bg-red-50", text: "text-red-600", badge: "bg-red-100 text-red-700", badgeText: "Batal" };
    case "PAYMENT_RECEIVED":
      return { bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", badgeText: "Pembayaran" };
    case "STOCK_IN":
      return { bg: "bg-indigo-50", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700", badgeText: "Stok Masuk" };
    case "STOCK_OUT":
      return { bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-100 text-orange-700", badgeText: "Stok Keluar" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-600", badge: "bg-gray-100 text-gray-700", badgeText: "Lainnya" };
  }
};
function RecentActivitySection() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await activityApi.getRecent(5);
        setActivities(data);
      } catch (err) {
        console.error("Failed to fetch recent activities:", err);
        setError("Gagal memuat aktivitas");
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);
  return /* @__PURE__ */ jsxs(Card, { className: "h-full flex flex-col chart-card-premium border-0", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4 border-b border-border/50", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "Aktivitas Terbaru" })
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-xs sm:text-sm", children: "Pantau aktivitas sistem secara real-time" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 flex-1 flex flex-col pt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto flex-1", children: isLoading ? (
        // Loading skeleton
        Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-3", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-10 rounded-full" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/2" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/4" })
          ] })
        ] }, i))
      ) : error ? (
        // Error state
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-10 w-10 mb-2 opacity-50" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: error })
        ] })
      ) : activities.length === 0 ? (
        // Empty state
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/illustrations/empty-notification.png",
              alt: "Belum ada aktivitas",
              className: "w-24 h-24 object-contain opacity-70 mb-2"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Belum ada aktivitas" })
        ] })
      ) : (
        // Activity list
        activities.map((activity, index) => {
          const style = getActivityStyle(activity.type);
          const icon = getActivityIcon(activity.type, activity.icon_name);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "activity-item-hover p-3 rounded-lg cursor-pointer animate-fadeInUp group",
              style: { animationDelay: `${index * 0.08}s` },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 sm:gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`, children: /* @__PURE__ */ jsx(
                    SafeIcon,
                    {
                      name: icon,
                      className: `h-5 w-5 ${style.text} transition-transform duration-300 group-hover:scale-110`
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-medium", children: activity.title }),
                      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-xs flex-shrink-0 ${style.badge} hover:bg-inherit`, children: style.badgeText })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground line-clamp-2", children: activity.description || activity.pangkalan_name || "Tidak ada detail" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: formatRelativeTime(activity.timestamp) }),
                      activity.detail_numeric && /* @__PURE__ */ jsxs("p", { className: "font-semibold text-primary", children: [
                        activity.detail_numeric.toLocaleString("id-ID"),
                        " tabung"
                      ] })
                    ] })
                  ] })
                ] }),
                index < activities.length - 1 && /* @__PURE__ */ jsx(Separator, { className: "mt-3" })
              ]
            },
            activity.id
          );
        })
      ) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          className: "w-full mt-2 text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out group",
          asChild: true,
          children: /* @__PURE__ */ jsxs("a", { href: "/riwayat-aktivitas", children: [
            "Lihat Semua Aktivitas",
            /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowRight", className: "ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })
          ] })
        }
      )
    ] })
  ] });
}
function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasBeenVisible(true);
      } else {
        setIsVisible(false);
      }
    }, {
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? "0px"
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);
  return { ref, isVisible, hasBeenVisible };
}
function ChartContainer({
  children,
  animationDelay
}) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      style: animationDelay ? { animationDelay } : {},
      children: children(isVisible)
    }
  );
}
function FloatingParticles() {
  return /* @__PURE__ */ jsxs("div", { className: "particles-container", children: [
    /* @__PURE__ */ jsx("div", { className: "particle" }),
    /* @__PURE__ */ jsx("div", { className: "particle" }),
    /* @__PURE__ */ jsx("div", { className: "particle" }),
    /* @__PURE__ */ jsx("div", { className: "particle" }),
    /* @__PURE__ */ jsx("div", { className: "particle" }),
    /* @__PURE__ */ jsx("div", { className: "particle" }),
    /* @__PURE__ */ jsx("div", { className: "particle" }),
    /* @__PURE__ */ jsx("div", { className: "particle" })
  ] });
}
function DashboardContent() {
  return /* @__PURE__ */ jsxs("div", { id: "is6jwg", className: "relative flex-1 space-y-6 p-4 pt-2 sm:p-6 sm:pt-3 lg:p-8 lg:pt-4 mesh-gradient-bg min-h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx(WelcomePopup, {}),
    /* @__PURE__ */ jsx(FloatingParticles, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col gap-3 sm:gap-4 animate-fadeInDown", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent animate-lineGrow" }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gradient-animated", children: "Dashboard" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg text-muted-foreground/80 max-w-2xl pl-6 animate-fadeIn", style: { animationDelay: "0.2s" }, children: "Selamat datang kembali! Berikut adalah ringkasan operasional Anda hari ini." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 animate-fadeInUp", style: { animationDelay: "0.05s" }, children: /* @__PURE__ */ jsx(CreateOrderButton, {}) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(DashboardKPICards, {}) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(DSSAlertSection, {}) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(DSSAdvancedSection, {}) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(ChartContainer, { animationDelay: "0.5s", children: (isVisible) => /* @__PURE__ */ jsx("div", { className: "w-full animate-fadeInUp chart-sales", style: { animationDelay: "0.3s" }, children: /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium border-0", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4 border-b border-border/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }),
          /* @__PURE__ */ jsx(CardTitle, { id: "i1oio5", className: "text-lg sm:text-xl font-semibold", children: "Pesanan Mingguan" })
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { id: "iwkknt", className: "text-xs sm:text-sm", children: "Ringkasan pemesanan gas 7 hari terakhir" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-4 sm:p-6 pt-4", children: /* @__PURE__ */ jsx("div", { className: "w-full h-64 sm:h-72 lg:h-80", children: /* @__PURE__ */ jsx(SalesChart, { isVisible }) }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(ChartContainer, { animationDelay: "0.6s", children: (isVisible) => /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp chart-stock", style: { animationDelay: "0.4s" }, children: /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium border-0", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4 border-b border-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
            /* @__PURE__ */ jsx(CardTitle, { id: "ixkzi5", className: "text-lg font-semibold", children: "Pemakaian LPG" })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { id: "ico6v7", className: "text-xs sm:text-sm", children: "Konsumsi stok per hari minggu ini" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-4 sm:p-6 pt-4", children: /* @__PURE__ */ jsx("div", { className: "w-full h-80 sm:h-96", children: /* @__PURE__ */ jsx(StockChart, { isVisible }) }) })
      ] }) }) }),
      /* @__PURE__ */ jsx(ChartContainer, { animationDelay: "0.65s", children: (isVisible) => /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp chart-profit", style: { animationDelay: "0.45s" }, children: /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium border-0", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4 border-b border-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "Keuntungan" })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs sm:text-sm", children: "Profit harian (Penjualan - Pembelian)" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-4 sm:p-6 pt-4", children: /* @__PURE__ */ jsx("div", { className: "w-full h-80 sm:h-96", children: /* @__PURE__ */ jsx(ProfitChart, { isVisible }) }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx(ChartContainer, { animationDelay: "0.7s", children: (isVisible) => /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp h-full", style: { animationDelay: "0.5s" }, children: /* @__PURE__ */ jsxs(Card, { className: "h-full chart-card-premium border-0 flex flex-col", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3 border-b border-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500 animate-pulse" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "Top Pangkalan" })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs sm:text-sm", children: "3 pangkalan dengan pendapatan tertinggi" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "flex-1 p-4 pt-4 flex flex-col", children: /* @__PURE__ */ jsx("div", { className: "w-full flex-1 min-h-[240px]", children: /* @__PURE__ */ jsx(PangkalanOrderChart, { isVisible }) }) })
      ] }) }) }),
      /* @__PURE__ */ jsx(ChartContainer, { animationDelay: "0.75s", children: (isVisible) => /* @__PURE__ */ jsx("div", { className: "animate-fadeInUp h-full", style: { animationDelay: "0.55s" }, children: /* @__PURE__ */ jsx(RecentActivitySection, {}) }) })
    ] })
  ] });
}
const $$Dashboard = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Dashboard Admin - SIM4LON" }, { default: ($$result2) => renderTemplate`
  
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN", "OPERATOR"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "DashboardContent", DashboardContent, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/dashboard-admin/DashboardContent.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/dashboard.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/dashboard.astro";
const $$url = "/dashboard.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
