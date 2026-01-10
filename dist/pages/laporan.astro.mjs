import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BOBS5-gD.js";
import { A as AdminFooter } from "../_astro/AdminFooter.B5Ap1SI9.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "../_astro/card.OLhQVURm.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "../_astro/tabs.DZPauEIq.js";
import { S as SafeIcon, B as Button, I as Input, r as reportsApi } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.DOfMR1sZ.js";
import { B as Badge, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { T as Tilt3DCard } from "../_astro/Tilt3DCard.kuKNoQnp.js";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { toast } from "sonner";
import { f as formatCurrencyExport, c as createFooterRow, e as exportToPDF, a as exportToExcel, b as formatDateExport } from "../_astro/export-utils.JoWvmrkT.js";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { renderers } from "../renderers.mjs";
const formatCurrency$1 = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
const formatDate$1 = (dateString) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${dateStr}, ${timeStr}`;
};
function PangkalanTabContent({ dateRange, isLoading: initialLoading, onSummaryLoad }) {
  const getInitialSubTab = () => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash === "pangkalan-nonsubsidi") return "nonsubsidi";
    }
    return "subsidi";
  };
  const [pangkalanData, setPangkalanData] = useState(null);
  const [consumersData, setConsumersData] = useState(null);
  const [selectedPangkalanId, setSelectedPangkalanId] = useState("");
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isLoadingConsumers, setIsLoadingConsumers] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(getInitialSubTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const rowsPerPageOptions = [10, 25, 50];
  const [pangkalanRowsPerPage, setPangkalanRowsPerPage] = useState(10);
  const [pangkalanCurrentPage, setPangkalanCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("tabung");
  const [sortOrder, setSortOrder] = useState("desc");
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPangkalanCurrentPage(1);
  };
  const getSortIcon = (field) => {
    if (sortBy !== field) return "ArrowUpDown";
    return sortOrder === "asc" ? "ArrowUp" : "ArrowDown";
  };
  const handleSubTabChange = (value) => {
    setActiveSubTab(value);
    setPangkalanCurrentPage(1);
    if (typeof window !== "undefined") {
      const newHash = value === "nonsubsidi" ? "#pangkalan-nonsubsidi" : "#pangkalan";
      window.history.replaceState(null, "", newHash);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getPangkalanReport(dateRange.start, dateRange.end);
        setPangkalanData(data);
        setSelectedPangkalanId("");
        setConsumersData(null);
        if (onSummaryLoad && data?.summary?.total_pangkalan) {
          onSummaryLoad(data.summary.total_pangkalan);
        }
      } catch (error) {
        toast.error(error.message || "Gagal memuat data pangkalan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dateRange.start, dateRange.end, onSummaryLoad]);
  const fetchConsumers = async (pangkalanId) => {
    if (!pangkalanId) {
      setConsumersData(null);
      return;
    }
    setIsLoadingConsumers(true);
    try {
      const data = await reportsApi.getSubsidiConsumers(pangkalanId, dateRange.start, dateRange.end);
      setConsumersData(data);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data konsumen");
    } finally {
      setIsLoadingConsumers(false);
    }
  };
  const handlePangkalanSelect = (pangkalanId) => {
    setSelectedPangkalanId(pangkalanId);
    fetchConsumers(pangkalanId);
  };
  const extractKabupaten = (region) => {
    const kabMatch = region.match(/Kab(?:upaten)?\.?\s*([^\,]+)/i);
    if (kabMatch) return `Kab. ${kabMatch[1].trim()}`;
    const kotaMatch = region.match(/Kota\.?\s*([^\,]+)/i);
    if (kotaMatch) return `Kota ${kotaMatch[1].trim()}`;
    return region;
  };
  const kabupatenList = useMemo(() => {
    if (!pangkalanData?.data) return [];
    const kabupatenSet = /* @__PURE__ */ new Set();
    pangkalanData.data.forEach((p) => {
      if (p.region && p.region !== "-") {
        kabupatenSet.add(extractKabupaten(p.region));
      }
    });
    return Array.from(kabupatenSet).sort();
  }, [pangkalanData]);
  const filteredData = useMemo(() => {
    if (!pangkalanData?.data) return [];
    let filtered = [...pangkalanData.data];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query) || p.region.toLowerCase().includes(query)
      );
    }
    if (regionFilter !== "ALL") {
      filtered = filtered.filter((p) => extractKabupaten(p.region) === regionFilter);
    }
    const multiplier = sortOrder === "asc" ? 1 : -1;
    filtered.sort((a, b) => {
      const aTransactions = activeSubTab === "subsidi" ? a.total_consumer_orders : a.total_nonsubsidi_orders;
      const bTransactions = activeSubTab === "subsidi" ? b.total_consumer_orders : b.total_nonsubsidi_orders;
      const aTabung = activeSubTab === "subsidi" ? a.total_tabung_to_consumers : a.total_nonsubsidi_tabung;
      const bTabung = activeSubTab === "subsidi" ? b.total_tabung_to_consumers : b.total_nonsubsidi_tabung;
      const aRevenue = activeSubTab === "subsidi" ? a.total_revenue : a.total_nonsubsidi_revenue;
      const bRevenue = activeSubTab === "subsidi" ? b.total_revenue : b.total_nonsubsidi_revenue;
      switch (sortBy) {
        case "name":
          return multiplier * a.name.localeCompare(b.name);
        case "region":
          return multiplier * (a.region || "").localeCompare(b.region || "");
        case "transactions":
          return multiplier * (aTransactions - bTransactions);
        case "tabung":
          return multiplier * (aTabung - bTabung);
        case "revenue":
          return multiplier * (aRevenue - bRevenue);
        default:
          return 0;
      }
    });
    return filtered;
  }, [pangkalanData, searchQuery, regionFilter, activeSubTab, sortBy, sortOrder]);
  const paginatedData = useMemo(() => {
    const start = (pangkalanCurrentPage - 1) * pangkalanRowsPerPage;
    return filteredData.slice(start, start + pangkalanRowsPerPage);
  }, [filteredData, pangkalanCurrentPage, pangkalanRowsPerPage]);
  const totalPages = Math.ceil(filteredData.length / pangkalanRowsPerPage);
  const getPeriodLabel = () => {
    const start = new Date(dateRange.start).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const end = new Date(dateRange.end).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    return `${start} - ${end}`;
  };
  const handleExportPDF = async () => {
    try {
      const subTabLabel = activeSubTab === "subsidi" ? "Subsidi (3kg)" : "Non-Subsidi (5.5kg+)";
      const title = `Laporan Pangkalan - ${subTabLabel}`;
      const period = getPeriodLabel();
      const filename = `laporan-pangkalan-${activeSubTab}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
      const columns = [
        { header: "Kode", key: "code", width: 12 },
        { header: "Pangkalan", key: "name", width: 25 },
        { header: "Wilayah", key: "region", width: 25 },
        { header: "Transaksi", key: "transactions", width: 12, align: "center" },
        { header: "Tabung", key: "tabung", width: 12, align: "center" },
        { header: "Pendapatan", key: "revenue", width: 18, align: "right" }
      ];
      const data = filteredData.map((item) => ({
        code: item.code,
        name: item.name,
        region: item.region || "-",
        transactions: activeSubTab === "subsidi" ? item.total_consumer_orders : item.total_nonsubsidi_orders,
        tabung: activeSubTab === "subsidi" ? item.total_tabung_to_consumers : item.total_nonsubsidi_tabung,
        revenue: formatCurrencyExport(activeSubTab === "subsidi" ? item.total_revenue : item.total_nonsubsidi_revenue)
      }));
      const summary = activeSubTab === "subsidi" ? [
        { label: "Total Pangkalan", value: pangkalanData?.summary.total_pangkalan || 0 },
        { label: "Total Transaksi Subsidi", value: pangkalanData?.summary.total_orders_subsidi || 0 },
        { label: "Total Tabung Subsidi", value: pangkalanData?.summary.total_tabung_subsidi || 0 },
        { label: "Total Pendapatan Subsidi", value: formatCurrencyExport(pangkalanData?.summary.total_revenue_subsidi || 0) }
      ] : [
        { label: "Total Pangkalan", value: pangkalanData?.summary.total_pangkalan || 0 },
        { label: "Total Transaksi Non-Subsidi", value: pangkalanData?.summary.total_nonsubsidi_orders || 0 },
        { label: "Total Tabung Non-Subsidi", value: pangkalanData?.summary.total_nonsubsidi_tabung || 0 },
        { label: "Total Pendapatan Non-Subsidi", value: formatCurrencyExport(pangkalanData?.summary.total_nonsubsidi_revenue || 0) }
      ];
      const footerRows = activeSubTab === "subsidi" ? [
        createFooterRow("TOTAL", {
          name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
          region: "",
          transactions: pangkalanData?.summary.total_orders_subsidi || 0,
          tabung: pangkalanData?.summary.total_tabung_subsidi || 0,
          revenue: formatCurrencyExport(pangkalanData?.summary.total_revenue_subsidi || 0)
        }, "code")
      ] : [
        createFooterRow("TOTAL", {
          name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
          region: "",
          transactions: pangkalanData?.summary.total_nonsubsidi_orders || 0,
          tabung: pangkalanData?.summary.total_nonsubsidi_tabung || 0,
          revenue: formatCurrencyExport(pangkalanData?.summary.total_nonsubsidi_revenue || 0)
        }, "code")
      ];
      console.log("[PangkalanExport] Starting PDF export...");
      console.log("[PangkalanExport] Data count:", data.length);
      await exportToPDF(data, columns, summary, { title, period, filename }, footerRows);
      console.log("[PangkalanExport] exportToPDF completed");
      toast.success("PDF berhasil diexport!");
    } catch (error) {
      console.error("[PangkalanExport] Export PDF error:", error);
      toast.error("Gagal export PDF");
    }
  };
  const handleExportExcel = () => {
    try {
      const subTabLabel = activeSubTab === "subsidi" ? "Subsidi (3kg)" : "Non-Subsidi (5.5kg+)";
      const title = `Laporan Pangkalan - ${subTabLabel}`;
      const period = getPeriodLabel();
      const filename = `laporan-pangkalan-${activeSubTab}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
      const columns = [
        { header: "Kode", key: "code", width: 12 },
        { header: "Pangkalan", key: "name", width: 25 },
        { header: "Wilayah", key: "region", width: 25 },
        { header: "Transaksi", key: "transactions", width: 12 },
        { header: "Tabung", key: "tabung", width: 12 },
        { header: "Pendapatan", key: "revenue", width: 18 }
      ];
      const data = filteredData.map((item) => ({
        code: item.code,
        name: item.name,
        region: item.region || "-",
        transactions: activeSubTab === "subsidi" ? item.total_consumer_orders : item.total_nonsubsidi_orders,
        tabung: activeSubTab === "subsidi" ? item.total_tabung_to_consumers : item.total_nonsubsidi_tabung,
        revenue: activeSubTab === "subsidi" ? item.total_revenue : item.total_nonsubsidi_revenue
      }));
      const summary = activeSubTab === "subsidi" ? [
        { label: "Total Pangkalan", value: pangkalanData?.summary.total_pangkalan || 0 },
        { label: "Total Transaksi Subsidi", value: pangkalanData?.summary.total_orders_subsidi || 0 },
        { label: "Total Tabung Subsidi", value: pangkalanData?.summary.total_tabung_subsidi || 0 },
        { label: "Total Pendapatan Subsidi", value: pangkalanData?.summary.total_revenue_subsidi || 0 }
      ] : [
        { label: "Total Pangkalan", value: pangkalanData?.summary.total_pangkalan || 0 },
        { label: "Total Transaksi Non-Subsidi", value: pangkalanData?.summary.total_nonsubsidi_orders || 0 },
        { label: "Total Tabung Non-Subsidi", value: pangkalanData?.summary.total_nonsubsidi_tabung || 0 },
        { label: "Total Pendapatan Non-Subsidi", value: pangkalanData?.summary.total_nonsubsidi_revenue || 0 }
      ];
      const footerRows = activeSubTab === "subsidi" ? [
        createFooterRow("TOTAL", {
          name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
          region: "",
          transactions: pangkalanData?.summary.total_orders_subsidi || 0,
          tabung: pangkalanData?.summary.total_tabung_subsidi || 0,
          revenue: pangkalanData?.summary.total_revenue_subsidi || 0
        }, "code")
      ] : [
        createFooterRow("TOTAL", {
          name: `${pangkalanData?.summary.total_pangkalan || 0} Pangkalan`,
          region: "",
          transactions: pangkalanData?.summary.total_nonsubsidi_orders || 0,
          tabung: pangkalanData?.summary.total_nonsubsidi_tabung || 0,
          revenue: pangkalanData?.summary.total_nonsubsidi_revenue || 0
        }, "code")
      ];
      exportToExcel(data, columns, summary, { title, period, filename }, footerRows);
      toast.success("Excel berhasil diexport!");
    } catch (error) {
      console.error("Export Excel error:", error);
      toast.error("Gagal export Excel");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-gradient-to-r from-primary to-emerald-500" }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Overview Pangkalan" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Pangkalan" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-primary mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_pangkalan || 0, delay: 100 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pangkalan aktif" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30", style: { boxShadow: "0 4px 12px -2px hsl(152 100% 30% / 0.3)" }, children: /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-5 w-5 text-primary" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-primary to-emerald-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Transaksi" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-teal-600 dark:text-teal-400 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_all_orders || 0, delay: 200 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Semua tipe LPG" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30", style: { boxShadow: "0 4px 12px -2px rgba(20,184,166,0.3)" }, children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingCart", className: "h-5 w-5 text-teal-600 dark:text-teal-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Tabung" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_all_tabung || 0, delay: 300 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Keseluruhan jenis tabung" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30", style: { boxShadow: "0 4px 12px -2px rgba(16,185,129,0.3)" }, children: /* @__PURE__ */ jsx(SafeIcon, { name: "Boxes", className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Pendapatan" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_all_revenue || 0, delay: 400, isCurrency: true }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Revenue keseluruhan" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30", style: { boxShadow: "0 4px 12px -2px hsl(48 100% 50% / 0.3)" }, children: /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: activeSubTab === "subsidi" ? "default" : "outline",
          className: activeSubTab === "subsidi" ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg" : "hover:bg-green-50 dark:hover:bg-green-900/20",
          onClick: () => handleSubTabChange("subsidi"),
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "w-4 h-4 mr-2" }),
            "LPG Subsidi (3kg)",
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-2 bg-white/20 text-inherit", children: pangkalanData?.summary.total_tabung_subsidi || 0 })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: activeSubTab === "nonsubsidi" ? "default" : "outline",
          className: activeSubTab === "nonsubsidi" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg" : "hover:bg-amber-50 dark:hover:bg-amber-900/20",
          onClick: () => handleSubTabChange("nonsubsidi"),
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "w-4 h-4 mr-2" }),
            "LPG Non-Subsidi",
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-2 bg-white/20 text-inherit", children: pangkalanData?.summary.total_nonsubsidi_tabung || 0 })
          ]
        }
      )
    ] }),
    activeSubTab === "subsidi" ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-green-500" }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Distribusi Subsidi (3kg)" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-green-50 text-green-700 border-green-200 text-xs dark:bg-green-900/30 dark:text-green-400 dark:border-green-700", children: "Audit Focus" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-1", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Transaksi Subsidi" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-green-600 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_orders_subsidi || 0, delay: 100 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Transaksi 3kg" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingBag", className: "h-5 w-5 text-green-600 dark:text-green-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-2", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Tabung Subsidi" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-teal-600 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_tabung_subsidi || 0, delay: 200 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Tabung 3kg terdistribusi" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-5 w-5 text-teal-600 dark:text-teal-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-3", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Pendapatan Subsidi" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-lime-600 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_revenue_subsidi || 0, delay: 300, isCurrency: true }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Revenue 3kg" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-lime-100 to-lime-200 dark:from-lime-900/30 dark:to-lime-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CircleDollarSign", className: "h-5 w-5 text-lime-600 dark:text-lime-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-300 via-lime-500 to-lime-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-4", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Konsumen Aktif" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-purple-600 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.active_consumers || 0, delay: 400 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pembeli subsidi" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-5 w-5 text-purple-600 dark:text-purple-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300" })
        ] }) })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-amber-500" }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "LPG Non-Subsidi (5.5kg+)" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-amber-50 text-amber-700 border-amber-200 text-xs dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700", children: "Business" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-1", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Transaksi Non-Subsidi" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-amber-600 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_nonsubsidi_orders || 0, delay: 100 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Tabung Non-Subsidi" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingBag", className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-2", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Tabung Non-Subsidi" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-orange-600 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_nonsubsidi_tabung || 0, delay: 200 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Tabung terjual" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "h-5 w-5 text-orange-600 dark:text-orange-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-3", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Pendapatan Non-Subsidi" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: pangkalanData?.summary.total_nonsubsidi_revenue || 0, delay: 300, isCurrency: true }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Revenue non-3kg" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CircleDollarSign", className: "h-5 w-5 text-yellow-600 dark:text-yellow-400" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300" })
        ] }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden card-hover-glow animate-scaleIn stagger-4", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Top Pangkalan" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-primary mt-2 truncate max-w-[120px]", children: isLoading ? "..." : (() => {
                const sorted = [...pangkalanData?.data || []].sort((a, b) => b.total_nonsubsidi_tabung - a.total_nonsubsidi_tabung);
                return sorted[0]?.name || "-";
              })() }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Penjualan terbanyak" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trophy", className: "h-5 w-5 text-primary" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-primary to-emerald-300" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Cari pangkalan...",
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setPangkalanCurrentPage(1);
            },
            className: "pl-9"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground whitespace-nowrap", children: "Wilayah:" }),
        /* @__PURE__ */ jsxs(Select, { value: regionFilter, onValueChange: (v) => {
          setRegionFilter(v);
          setPangkalanCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "ALL", children: "Semua" }),
            kabupatenList.map((r) => /* @__PURE__ */ jsx(SelectItem, { value: r, children: r }, r))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground whitespace-nowrap", children: "Tampilkan:" }),
        /* @__PURE__ */ jsxs(Select, { value: pangkalanRowsPerPage.toString(), onValueChange: (v) => {
          setPangkalanRowsPerPage(Number(v));
          setPangkalanCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[80px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsx(SelectContent, { children: rowsPerPageOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.toString(), children: opt }, opt)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            disabled: isLoading || !pangkalanData?.data?.length,
            onClick: handleExportPDF,
            className: "border-red-300 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 hover:border-red-400 transition-all shadow-sm hover:shadow-md",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-4 w-4 mr-2" }),
              "Export PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            disabled: isLoading || !pangkalanData?.data?.length,
            onClick: handleExportExcel,
            className: "border-green-300 text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:border-green-400 transition-all shadow-sm hover:shadow-md",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileSpreadsheet", className: "h-4 w-4 mr-2" }),
              "Export Excel"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 border-b border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full animate-pulse ${activeSubTab === "subsidi" ? "bg-green-500" : "bg-amber-500"}` }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: activeSubTab === "subsidi" ? "Ranking Pangkalan (Subsidi)" : "Ranking Pangkalan (Non-Subsidi)" })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: activeSubTab === "subsidi" ? "Performa distribusi LPG 3kg bersubsidi per pangkalan" : "Performa penjualan LPG non-subsidi per pangkalan" })
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: activeSubTab === "subsidi" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Trophy", className: "h-3 w-3 mr-1" }),
          "Top: ",
          pangkalanData?.summary.top_pangkalan || "-"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
        isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-48", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }) : filteredData.length > 0 ? /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 bg-muted/30", children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "#" }),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none",
                onClick: () => handleSort("name"),
                children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  "Pangkalan",
                  /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("name"), className: "h-3.5 w-3.5" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none",
                onClick: () => handleSort("region"),
                children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  "Wilayah",
                  /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("region"), className: "h-3.5 w-3.5" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none",
                onClick: () => handleSort("transactions"),
                children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                  "Transaksi",
                  /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("transactions"), className: "h-3.5 w-3.5" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none",
                onClick: () => handleSort("tabung"),
                children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                  "Tabung",
                  /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("tabung"), className: "h-3.5 w-3.5" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none",
                onClick: () => handleSort("revenue"),
                children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-end gap-1", children: [
                  "Pendapatan",
                  /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("revenue"), className: "h-3.5 w-3.5" })
                ] })
              }
            ),
            activeSubTab === "subsidi" && /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Konsumen" }),
            activeSubTab === "subsidi" && /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: paginatedData.map((item, index) => {
            const globalIndex = (pangkalanCurrentPage - 1) * pangkalanRowsPerPage + index;
            const orders = activeSubTab === "subsidi" ? item.total_consumer_orders : item.total_nonsubsidi_orders;
            const tabung = activeSubTab === "subsidi" ? item.total_tabung_to_consumers : item.total_nonsubsidi_tabung;
            const revenue = activeSubTab === "subsidi" ? item.total_revenue : item.total_nonsubsidi_revenue;
            return /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/20 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${globalIndex === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : globalIndex === 1 ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" : globalIndex === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-muted text-muted-foreground"}`, children: globalIndex + 1 }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: item.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: item.code })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: item.region || "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: activeSubTab === "subsidi" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", children: orders }) }),
              /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-center font-semibold ${activeSubTab === "subsidi" ? "text-teal-600 dark:text-teal-400" : "text-orange-600 dark:text-orange-400"}`, children: tabung }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-medium", children: formatCurrency$1(revenue) }),
              activeSubTab === "subsidi" && /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-purple-600 dark:text-purple-400 font-medium", children: item.active_consumers }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "/" }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: item.total_registered_consumers })
              ] }) }),
              activeSubTab === "subsidi" && /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => handlePangkalanSelect(item.id),
                  className: `h-8 px-3 ${selectedPangkalanId === item.id ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}`,
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Eye", className: "h-4 w-4 mr-1" }),
                    "Audit"
                  ]
                }
              ) })
            ] }, item.id);
          }) })
        ] }) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-48 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-12 w-12 mb-3 opacity-30" }),
          /* @__PURE__ */ jsx("p", { children: "Tidak ada data pangkalan" }),
          searchQuery && /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: "Coba ubah filter pencarian" })
        ] }),
        filteredData.length > pangkalanRowsPerPage && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-t border-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Menampilkan ",
            (pangkalanCurrentPage - 1) * pangkalanRowsPerPage + 1,
            " - ",
            Math.min(pangkalanCurrentPage * pangkalanRowsPerPage, filteredData.length),
            " dari ",
            filteredData.length
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPangkalanCurrentPage((p) => Math.max(1, p - 1)),
                disabled: pangkalanCurrentPage <= 1,
                className: "h-8 px-2",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground min-w-[80px] text-center", children: [
              "Hal ",
              pangkalanCurrentPage,
              " / ",
              totalPages
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPangkalanCurrentPage((p) => Math.min(totalPages, p + 1)),
                disabled: pangkalanCurrentPage >= totalPages,
                className: "h-8 px-2",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    activeSubTab === "subsidi" && /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 border-b border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-purple-500 animate-pulse" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "Audit Konsumen Subsidi" })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Data pembeli gas subsidi 3kg untuk verifikasi" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Pilih Pangkalan:" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedPangkalanId, onValueChange: handlePangkalanSelect, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[200px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih pangkalan..." }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: pangkalanData?.data.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: !selectedPangkalanId ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-48 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "h-12 w-12 mb-3 opacity-30" }),
        /* @__PURE__ */ jsx("p", { children: "Pilih pangkalan untuk melihat data konsumen" })
      ] }) : isLoadingConsumers ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-48", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }) : consumersData && consumersData.data.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 border-b border-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-600", children: consumersData.summary.total_consumers }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Konsumen" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: consumersData.summary.registered_consumers }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Terdaftar" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-orange-600", children: consumersData.summary.total_transactions }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Transaksi" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-600", children: consumersData.summary.total_tabung }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Tabung" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 bg-muted/30", children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Nama" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "NIK" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "No. HP" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Tipe" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Pembelian" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Tabung" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Terakhir" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: consumersData.data.map((consumer) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/20 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${consumer.consumer_type === "WARUNG" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`, children: consumer.name.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: consumer.name })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm font-mono text-muted-foreground", children: consumer.nik || "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: consumer.phone || "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: consumer.consumer_type === "WARUNG" ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400" : consumer.consumer_type === "RUMAH_TANGGA" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300", children: consumer.consumer_type === "WARUNG" ? "Warung" : consumer.consumer_type === "RUMAH_TANGGA" ? "RT" : "Walk-in" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400", children: [
              consumer.total_purchases,
              "x"
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center font-semibold text-teal-600 dark:text-teal-400", children: consumer.total_tabung }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: formatDate$1(consumer.last_purchase) })
          ] }, consumer.id)) })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-48 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-12 w-12 mb-3 opacity-30" }),
        /* @__PURE__ */ jsx("p", { children: "Tidak ada data konsumen subsidi" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: "di pangkalan ini dalam periode yang dipilih" })
      ] }) })
    ] })
  ] });
}
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${dateStr}, ${timeStr}`;
};
const getDateRange = (preset) => {
  const now = /* @__PURE__ */ new Date();
  let start;
  let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  switch (preset) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      break;
    case "7days":
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      break;
    case "30days":
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};
function ReportsPage() {
  const getInitialTab = () => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (["sales", "pangkalan", "stock"].includes(hash)) {
        return hash;
      }
    }
    return "sales";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [datePreset, setDatePreset] = useState("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${value}`);
    }
  };
  const rowsPerPageOptions = [10, 25, 50];
  const [salesRowsPerPage, setSalesRowsPerPage] = useState(10);
  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const [stockRowsPerPage, setStockRowsPerPage] = useState(10);
  const [stockCurrentPage, setStockCurrentPage] = useState(1);
  const [salesSortBy, setSalesSortBy] = useState("date");
  const [salesSortOrder, setSalesSortOrder] = useState("desc");
  const [stockSortBy, setStockSortBy] = useState("date");
  const [stockSortOrder, setStockSortOrder] = useState("desc");
  const handleSalesSort = (field) => {
    if (salesSortBy === field) {
      setSalesSortOrder((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSalesSortBy(field);
      setSalesSortOrder("desc");
    }
    setSalesCurrentPage(1);
  };
  const handleStockSort = (field) => {
    if (stockSortBy === field) {
      setStockSortOrder((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setStockSortBy(field);
      setStockSortOrder("desc");
    }
    setStockCurrentPage(1);
  };
  const getSortIcon = (currentField, sortBy, sortOrder) => {
    if (currentField !== sortBy) return "ArrowUpDown";
    return sortOrder === "asc" ? "ArrowUp" : "ArrowDown";
  };
  const [salesData, setSalesData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [totalPangkalan, setTotalPangkalan] = useState(0);
  const sortedSalesData = useMemo(() => {
    if (!salesData?.data) return [];
    return [...salesData.data].sort((a, b) => {
      const multiplier = salesSortOrder === "asc" ? 1 : -1;
      switch (salesSortBy) {
        case "date":
          return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case "code":
          return multiplier * a.code.localeCompare(b.code);
        case "pangkalan":
          return multiplier * a.pangkalan.localeCompare(b.pangkalan);
        case "total":
          return multiplier * (a.total - b.total);
        case "status":
          return multiplier * a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [salesData, salesSortBy, salesSortOrder]);
  const sortedStockData = useMemo(() => {
    if (!stockData?.data) return [];
    return [...stockData.data].sort((a, b) => {
      const multiplier = stockSortOrder === "asc" ? 1 : -1;
      switch (stockSortBy) {
        case "date":
          return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case "product":
          return multiplier * a.product.localeCompare(b.product);
        case "type":
          return multiplier * a.type.localeCompare(b.type);
        case "qty":
          return multiplier * (a.qty - b.qty);
        default:
          return 0;
      }
    });
  }, [stockData, stockSortBy, stockSortOrder]);
  const [dailySalesTarget, setDailySalesTarget] = useState(35e6);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState("");
  useEffect(() => {
    const savedTarget = localStorage.getItem("dailySalesTarget");
    if (savedTarget) {
      setDailySalesTarget(Number(savedTarget));
    }
  }, []);
  const handleSaveTarget = () => {
    const newTarget = Number(tempTarget.replace(/\D/g, ""));
    if (newTarget > 0) {
      setDailySalesTarget(newTarget);
      localStorage.setItem("dailySalesTarget", String(newTarget));
      setIsEditingTarget(false);
      toast.success("Target penjualan berhasil disimpan!");
    } else {
      toast.error("Masukkan nilai target yang valid");
    }
  };
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const range = datePreset === "custom" && customStart && customEnd ? { start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() } : getDateRange(datePreset);
      const [sales, stock, pangkalan] = await Promise.all([
        reportsApi.getSalesReport(range.start, range.end),
        reportsApi.getStockMovementReport(range.start, range.end),
        reportsApi.getPangkalanReport(range.start, range.end)
      ]);
      setSalesData(sales);
      setStockData(stock);
      if (pangkalan?.summary?.total_pangkalan) {
        setTotalPangkalan(pangkalan.summary.total_pangkalan);
      }
    } catch (error) {
      toast.error(error.message || "Gagal memuat laporan");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReports();
  }, [datePreset]);
  const handlePresetChange = (value) => {
    setDatePreset(value);
  };
  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      fetchReports();
    }
  };
  const statusLabels = {
    DRAFT: "DRAFT",
    MENUNGGU_PEMBAYARAN: "MENUNGGU PEMBAYARAN",
    DIPROSES: "DIPROSES",
    DIKIRIM: "DIKIRIM",
    SELESAI: "SELESAI",
    DIBATALKAN: "BATAL"
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "SELESAI":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case "DIKIRIM":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "DIPROSES":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "MENUNGGU_PEMBAYARAN":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
      case "DIBATALKAN":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  const PIE_COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];
  const salesChartData = useMemo(() => {
    if (!salesData?.data) return [];
    const groupedByDate = {};
    salesData.data.forEach((item) => {
      const dateKey = new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { date: dateKey, total: 0, count: 0, target: dailySalesTarget };
      }
      groupedByDate[dateKey].total += item.total;
      groupedByDate[dateKey].count += 1;
    });
    return Object.values(groupedByDate).reverse();
  }, [salesData, dailySalesTarget]);
  const growthPercentage = useMemo(() => {
    if (!salesData?.data || salesData.data.length === 0) return 0;
    const totalRevenue = salesData.summary.total_revenue || 0;
    const daysInPeriod = salesChartData.length || 1;
    const dailyAverage = totalRevenue / daysInPeriod;
    const growth = (dailyAverage - dailySalesTarget) / dailySalesTarget * 100;
    return growth;
  }, [salesData, salesChartData, dailySalesTarget]);
  const salesByStatusData = useMemo(() => {
    if (!salesData?.summary.status_breakdown) return [];
    return Object.entries(salesData.summary.status_breakdown).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count
    }));
  }, [salesData]);
  const stockChartData = useMemo(() => {
    if (!stockData?.data) return [];
    const groupedByDate = {};
    stockData.data.forEach((item) => {
      const dateKey = new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { date: dateKey, masuk: 0, keluar: 0 };
      }
      if (item.type === "MASUK") {
        groupedByDate[dateKey].masuk += item.qty;
      } else {
        groupedByDate[dateKey].keluar += item.qty;
      }
    });
    return Object.values(groupedByDate).reverse();
  }, [stockData]);
  const stockByProductData = useMemo(() => {
    if (!stockData?.data) return [];
    const groupedByProduct = {};
    stockData.data.forEach((item) => {
      const product = item.product;
      if (!groupedByProduct[product]) {
        groupedByProduct[product] = { product, masuk: 0, keluar: 0 };
      }
      if (item.type === "MASUK") {
        groupedByProduct[product].masuk += item.qty;
      } else {
        groupedByProduct[product].keluar += item.qty;
      }
    });
    return Object.values(groupedByProduct);
  }, [stockData]);
  const getPeriodLabel = () => {
    if (salesData?.period) {
      return `${formatDateExport(salesData.period.start)} - ${formatDateExport(salesData.period.end)}`;
    }
    return "Bulan Ini";
  };
  const handleExportPDF = async () => {
    try {
      const tabTitles = { sales: "Penjualan", payments: "Pembayaran", stock: "Stok" };
      const title = `Laporan ${tabTitles[activeTab]}`;
      const period = getPeriodLabel();
      const filename = `laporan-${activeTab}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
      if (activeTab === "sales" && salesData) {
        const columns = [
          { header: "Tanggal", key: "date", width: 15 },
          { header: "Kode", key: "code", width: 12 },
          { header: "Pangkalan", key: "pangkalan", width: 25 },
          { header: "Pendapatan", key: "total", width: 18, align: "right" },
          { header: "Status", key: "status", width: 15 }
        ];
        const data = salesData.data.map((item) => ({
          ...item,
          date: formatDateExport(item.date),
          total: formatCurrencyExport(item.total),
          status: statusLabels[item.status] || item.status
        }));
        const summary = [
          { label: "Total Pesanan", value: salesData.summary.total_orders },
          { label: "Total Pendapatan", value: formatCurrencyExport(salesData.summary.total_revenue) },
          { label: "Rata-rata Pesanan", value: formatCurrencyExport(salesData.summary.average_order) },
          { label: "Pesanan Selesai", value: salesData.summary.status_breakdown?.SELESAI || 0 }
        ];
        const footerRows = [
          createFooterRow("TOTAL", {
            code: "",
            pangkalan: "",
            total: formatCurrencyExport(salesData.summary.total_revenue),
            status: ""
          }, "date")
        ];
        await exportToPDF(data, columns, summary, { title, period, filename }, footerRows);
      } else if (activeTab === "stock" && stockData) {
        const columns = [
          { header: "Tanggal", key: "date", width: 15 },
          { header: "Produk", key: "product", width: 20 },
          { header: "Tipe", key: "type", width: 10 },
          { header: "Qty", key: "qty", width: 10, align: "right" },
          { header: "Keterangan", key: "note", width: 25 },
          { header: "Dicatat Oleh", key: "recorded_by", width: 15 }
        ];
        const data = stockData.data.map((item) => ({
          ...item,
          date: formatDateExport(item.date),
          note: item.note || "-"
        }));
        const summary = [
          { label: "Total Masuk", value: `+${stockData.summary.total_in}` },
          { label: "Total Keluar", value: `-${stockData.summary.total_out}` },
          { label: "Perubahan Bersih", value: stockData.summary.net_change },
          { label: "Saldo Akhir", value: stockData.summary.current_balance }
        ];
        const footerRows = [
          createFooterRow("TOTAL", {
            product: `Masuk: +${stockData.summary.total_in}`,
            type: `Keluar: -${stockData.summary.total_out}`,
            qty: stockData.summary.net_change,
            note: `Saldo Akhir: ${stockData.summary.current_balance}`,
            recorded_by: ""
          }, "date")
        ];
        await exportToPDF(data, columns, summary, { title, period, filename }, footerRows);
      }
      toast.success("PDF berhasil diexport!");
    } catch (error) {
      toast.error("Gagal export PDF");
    }
  };
  const handleExportExcel = () => {
    try {
      const tabTitles = { sales: "Penjualan", payments: "Pembayaran", stock: "Stok" };
      const title = `Laporan ${tabTitles[activeTab]}`;
      const period = getPeriodLabel();
      const filename = `laporan-${activeTab}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
      if (activeTab === "sales" && salesData) {
        const columns = [
          { header: "Tanggal", key: "date", width: 12 },
          { header: "Kode", key: "code", width: 15 },
          { header: "Pangkalan", key: "pangkalan", width: 25 },
          { header: "Subtotal", key: "subtotal", width: 15 },
          { header: "Pajak", key: "tax", width: 12 },
          { header: "Pendapatan", key: "total", width: 15 },
          { header: "Status", key: "status", width: 15 }
        ];
        const data = salesData.data.map((item) => ({
          ...item,
          date: formatDateExport(item.date),
          status: statusLabels[item.status] || item.status
        }));
        const summary = [
          { label: "Total Pesanan", value: salesData.summary.total_orders },
          { label: "Total Pendapatan", value: salesData.summary.total_revenue },
          { label: "Rata-rata Pesanan", value: salesData.summary.average_order }
        ];
        const footerRows = [
          createFooterRow("TOTAL", {
            code: "",
            pangkalan: "",
            subtotal: salesData.summary.total_revenue,
            tax: "",
            total: salesData.summary.total_revenue,
            status: ""
          }, "date")
        ];
        exportToExcel(data, columns, summary, { title, period, filename }, footerRows);
      } else if (activeTab === "stock" && stockData) {
        const columns = [
          { header: "Tanggal", key: "date", width: 12 },
          { header: "Produk", key: "product", width: 20 },
          { header: "Tipe", key: "type", width: 10 },
          { header: "Qty", key: "qty", width: 10 },
          { header: "Keterangan", key: "note", width: 25 },
          { header: "Dicatat Oleh", key: "recorded_by", width: 15 }
        ];
        const data = stockData.data.map((item) => ({
          ...item,
          date: formatDateExport(item.date)
        }));
        const summary = [
          { label: "Total Masuk", value: stockData.summary.total_in },
          { label: "Total Keluar", value: stockData.summary.total_out },
          { label: "Perubahan Bersih", value: stockData.summary.net_change },
          { label: "Saldo Akhir", value: stockData.summary.current_balance }
        ];
        const footerRows = [
          createFooterRow("TOTAL", {
            product: `Masuk: +${stockData.summary.total_in}`,
            type: `Keluar: -${stockData.summary.total_out}`,
            qty: stockData.summary.net_change,
            note: `Saldo Akhir: ${stockData.summary.current_balance}`,
            recorded_by: ""
          }, "date")
        ];
        exportToExcel(data, columns, summary, { title, period, filename }, footerRows);
      }
      toast.success("Excel berhasil diexport!");
    } catch (error) {
      toast.error("Gagal export Excel");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "glass-card rounded-2xl p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Periode" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: datePreset, onValueChange: handlePresetChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px] bg-background border-border/50 hover:border-primary/50 transition-colors", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih periode" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "today", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Clock", className: "h-3.5 w-3.5 text-muted-foreground" }),
              "Hari Ini"
            ] }) }),
            /* @__PURE__ */ jsx(SelectItem, { value: "7days", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-3.5 w-3.5 text-muted-foreground" }),
              "7 Hari Terakhir"
            ] }) }),
            /* @__PURE__ */ jsx(SelectItem, { value: "30days", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-3.5 w-3.5 text-muted-foreground" }),
              "30 Hari Terakhir"
            ] }) }),
            /* @__PURE__ */ jsx(SelectItem, { value: "month", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "CalendarDays", className: "h-3.5 w-3.5 text-muted-foreground" }),
              "Bulan Ini"
            ] }) }),
            /* @__PURE__ */ jsx(SelectItem, { value: "year", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "CalendarRange", className: "h-3.5 w-3.5 text-muted-foreground" }),
              "Tahun Ini"
            ] }) }),
            /* @__PURE__ */ jsx(SelectItem, { value: "custom", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Settings2", className: "h-3.5 w-3.5 text-muted-foreground" }),
              "Custom"
            ] }) })
          ] })
        ] }),
        datePreset === "custom" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center bg-muted/30 p-2 rounded-lg border border-border/50", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              value: customStart,
              onChange: (e) => setCustomStart(e.target.value),
              className: "w-[140px] h-9 bg-background"
            }
          ),
          /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowRight", className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              value: customEnd,
              onChange: (e) => setCustomEnd(e.target.value),
              className: "w-[140px] h-9 bg-background"
            }
          ),
          /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleCustomDateApply, className: "h-9", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 mr-1" }),
            "Terapkan"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: fetchReports,
            disabled: isLoading,
            className: "h-9 w-9 hover:bg-primary/10 hover:text-primary",
            children: /* @__PURE__ */ jsx(
              SafeIcon,
              {
                name: "RefreshCw",
                className: `h-4 w-4 ${isLoading ? "animate-spin" : ""}`
              }
            )
          }
        )
      ] }),
      activeTab !== "pangkalan" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            disabled: isLoading,
            onClick: handleExportPDF,
            className: "border-red-300 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 hover:border-red-400 transition-all shadow-sm hover:shadow-md",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-4 w-4 mr-2" }),
              "Export PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            disabled: isLoading,
            onClick: handleExportExcel,
            className: "border-green-300 text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:border-green-400 transition-all shadow-sm hover:shadow-md",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "FileSpreadsheet", className: "h-4 w-4 mr-2" }),
              "Export Excel"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: handleTabChange, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "inline-flex h-auto gap-1.5 rounded-2xl glass-card p-2 shadow-lg", children: [
        /* @__PURE__ */ jsxs(
          TabsTrigger,
          {
            value: "sales",
            className: "relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingCart", className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Penjualan" }),
              salesData && salesData.summary.total_orders > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: `ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs font-medium ${activeTab === "sales" ? "bg-white/20 text-white" : "bg-primary/10 text-primary dark:bg-primary/20"}`, children: salesData.summary.total_orders })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          TabsTrigger,
          {
            value: "pangkalan",
            className: "relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent/80 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-accent/10 hover:text-accent dark:hover:bg-accent/20",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Pangkalan" }),
              totalPangkalan > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: `ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs font-medium ${activeTab === "pangkalan" ? "bg-white/20 text-white" : "bg-accent/10 text-accent dark:bg-accent/20"}`, children: totalPangkalan })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          TabsTrigger,
          {
            value: "stock",
            className: "relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 text-muted-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/20 dark:hover:text-amber-400",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Stok" }),
              stockData && stockData.summary.current_balance !== void 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: `ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs font-medium ${activeTab === "stock" ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"}`, children: stockData.summary.current_balance })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "sales", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Pesanan" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-primary mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: salesData?.summary.total_orders || 0, delay: 100 }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pesanan dalam periode" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-200/50 dark:from-primary/30 dark:to-emerald-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingCart", className: "h-5 w-5 text-primary" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" })
          ] }) }),
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Pendapatan" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: salesData?.summary.total_revenue || 0, delay: 200, isCurrency: true }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Revenue keseluruhan" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Rata-rata Pesanan" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-teal-600 dark:text-teal-400 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: salesData?.summary.average_order || 0, delay: 300, isCurrency: true }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Per transaksi" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Calculator", className: "h-5 w-5 text-teal-600 dark:text-teal-400" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Pertumbuhan" }),
                /* @__PURE__ */ jsx("p", { className: `text-3xl font-bold mt-2 ${growthPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: isLoading ? "..." : `${growthPercentage >= 0 ? "+" : ""}${growthPercentage.toFixed(1)}%` }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Vs target harian" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `p-3 rounded-xl shadow-lg bg-gradient-to-br ${growthPercentage >= 0 ? "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" : "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30"}`, children: /* @__PURE__ */ jsx(SafeIcon, { name: growthPercentage >= 0 ? "TrendingUp" : "TrendingDown", className: `h-5 w-5 ${growthPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}` }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${growthPercentage >= 0 ? "from-green-300 via-green-500 to-green-300" : "from-red-300 via-red-500 to-red-300"}` })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp", style: { animationDelay: "0.4s" }, children: [
            /* @__PURE__ */ jsx("div", { className: "p-5 border-b border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Tren Penjualan" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Total pendapatan per hari dalam periode ini" })
              ] }),
              !isEditingTarget ? /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "text-xs gap-1 border-primary/30 hover:border-primary/50 hover:bg-primary/5",
                  onClick: () => {
                    setTempTarget(String(dailySalesTarget));
                    setIsEditingTarget(true);
                  },
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Settings2", className: "h-3 w-3" }),
                    "Target: ",
                    formatCurrency(dailySalesTarget)
                  ]
                }
              ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "text",
                    value: tempTarget,
                    onChange: (e) => setTempTarget(e.target.value.replace(/\D/g, "")),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        handleSaveTarget();
                      } else if (e.key === "Escape") {
                        setIsEditingTarget(false);
                      }
                    },
                    className: "w-32 h-8 text-sm",
                    placeholder: "Rp",
                    autoFocus: true
                  }
                ),
                /* @__PURE__ */ jsx(Button, { size: "sm", className: "h-8 px-2", onClick: handleSaveTarget, children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 px-2", onClick: () => setIsEditingTarget(false), children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4" }) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "p-5", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : salesChartData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-[300px] flex flex-col items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "LineChart", className: "h-12 w-12 text-muted-foreground/40" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tidak ada data trend" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah filter periode" })
            ] }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: salesChartData, children: [
              /* @__PURE__ */ jsxs("defs", { children: [
                /* @__PURE__ */ jsxs("linearGradient", { id: "salesGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#22c55e", stopOpacity: 0.3 }),
                  /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#22c55e", stopOpacity: 0 })
                ] }),
                /* @__PURE__ */ jsxs("filter", { id: "salesGlow", height: "300%", children: [
                  /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
                  /* @__PURE__ */ jsxs("feMerge", { children: [
                    /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
                    /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb", strokeOpacity: 0.5 }),
              /* @__PURE__ */ jsx(
                XAxis,
                {
                  dataKey: "date",
                  tick: { fontSize: 12, fill: "#6b7280" },
                  axisLine: { stroke: "#e5e7eb" },
                  tickLine: { stroke: "#e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsx(
                YAxis,
                {
                  tickFormatter: (value) => `${(value / 1e6).toFixed(1)}Jt`,
                  tick: { fontSize: 12, fill: "#6b7280" },
                  axisLine: { stroke: "#e5e7eb" },
                  tickLine: { stroke: "#e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsx(
                Tooltip,
                {
                  formatter: (value, name) => [formatCurrency(value), name],
                  labelFormatter: (label) => `Tanggal: ${label}`,
                  contentStyle: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px"
                  },
                  labelStyle: { fontWeight: 600, marginBottom: "4px" }
                }
              ),
              /* @__PURE__ */ jsx(
                Legend,
                {
                  wrapperStyle: { paddingTop: "20px" },
                  iconType: "circle"
                }
              ),
              /* @__PURE__ */ jsx(
                Line,
                {
                  type: "monotone",
                  dataKey: "total",
                  name: "Penjualan Aktual",
                  stroke: "#22c55e",
                  strokeWidth: 3,
                  dot: { fill: "#22c55e", strokeWidth: 2, r: 4, stroke: "#fff" },
                  activeDot: { r: 6, fill: "#22c55e", stroke: "#fff", strokeWidth: 3, filter: "url(#salesGlow)" }
                }
              ),
              /* @__PURE__ */ jsx(
                Line,
                {
                  type: "monotone",
                  dataKey: "target",
                  name: "Target Penjualan",
                  stroke: "#f59e0b",
                  strokeWidth: 2,
                  strokeDasharray: "8 4",
                  dot: { fill: "#f59e0b", strokeWidth: 2, r: 3, stroke: "#fff" },
                  activeDot: { r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }
                }
              )
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp", style: { animationDelay: "0.5s" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-border/50", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-purple-500 animate-pulse" }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Status Pesanan" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Distribusi pesanan berdasarkan status" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-5", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : salesByStatusData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-[300px] flex flex-col items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "PieChart", className: "h-12 w-12 text-muted-foreground/40" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tidak ada data status" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah filter periode" })
            ] }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(PieChart, { children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("filter", { id: "pieShadow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: /* @__PURE__ */ jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodOpacity: "0.2" }) }) }),
              /* @__PURE__ */ jsx(
                Pie,
                {
                  data: salesByStatusData,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 65,
                  outerRadius: 105,
                  paddingAngle: 3,
                  dataKey: "value",
                  label: ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`,
                  labelLine: { stroke: "#94a3b8", strokeWidth: 1 },
                  style: { filter: "url(#pieShadow)" },
                  children: salesByStatusData.map((_, index) => /* @__PURE__ */ jsx(
                    Cell,
                    {
                      fill: PIE_COLORS[index % PIE_COLORS.length],
                      stroke: "#fff",
                      strokeWidth: 2
                    },
                    `cell-${index}`
                  ))
                }
              ),
              /* @__PURE__ */ jsx(
                Tooltip,
                {
                  formatter: (value) => [value, "Pesanan"],
                  contentStyle: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px"
                  }
                }
              )
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-border/50", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "List", className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Detail Penjualan" })
            ] }),
            salesData && salesData.data.length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-muted px-2 py-1", children: [
              salesData.data.length,
              " transaksi"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 border-t border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleSalesSort("date"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      "Tanggal",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("date", salesSortBy, salesSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleSalesSort("code"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      "Kode",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("code", salesSortBy, salesSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleSalesSort("pangkalan"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      "Pangkalan",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("pangkalan", salesSortBy, salesSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleSalesSort("total"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-end gap-1", children: [
                      "Pendapatan",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("total", salesSortBy, salesSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-center text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleSalesSort("status"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                      "Status",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("status", salesSortBy, salesSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-8 text-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" }) }) }) : sortedSalesData.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingCart", className: "h-10 w-10 text-muted-foreground/50" }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tidak ada data penjualan" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah filter periode" })
              ] }) }) }) : sortedSalesData.slice((salesCurrentPage - 1) * salesRowsPerPage, salesCurrentPage * salesRowsPerPage).map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm", children: formatDate(item.date) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm font-medium font-mono text-green-600", children: item.code }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm", children: item.pangkalan }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-right font-medium", children: formatCurrency(item.total) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(Badge, { className: `${getStatusColor(item.status)} hover:bg-inherit`, children: statusLabels[item.status] || item.status }) })
              ] }, item.id)) })
            ] }) }),
            salesData && salesData.data.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { children: "Tampilkan" }),
                /* @__PURE__ */ jsxs(Select, { value: String(salesRowsPerPage), onValueChange: (v) => {
                  setSalesRowsPerPage(Number(v));
                  setSalesCurrentPage(1);
                }, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[70px] h-8", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: rowsPerPageOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: String(opt), children: opt }, opt)) })
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "dari ",
                  salesData.data.length,
                  " data"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setSalesCurrentPage((p) => Math.max(1, p - 1)),
                    disabled: salesCurrentPage === 1,
                    className: "h-8 px-2",
                    children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground min-w-[80px] text-center", children: [
                  "Hal ",
                  salesCurrentPage,
                  " / ",
                  Math.ceil(salesData.data.length / salesRowsPerPage)
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setSalesCurrentPage((p) => Math.min(Math.ceil(salesData.data.length / salesRowsPerPage), p + 1)),
                    disabled: salesCurrentPage >= Math.ceil(salesData.data.length / salesRowsPerPage),
                    className: "h-8 px-2",
                    children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "pangkalan", className: "space-y-4", children: /* @__PURE__ */ jsx(
        PangkalanTabContent,
        {
          dateRange: datePreset === "custom" && customStart && customEnd ? { start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() } : getDateRange(datePreset),
          isLoading,
          onSummaryLoad: setTotalPangkalan
        }
      ) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "stock", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3 lg:grid-cols-5", children: [
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-1 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Saldo Akhir" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-primary mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: stockData?.summary.current_balance || 0, delay: 100 }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Stok saat ini" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-200/50 dark:from-primary/30 dark:to-emerald-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-5 w-5 text-primary" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" })
          ] }) }),
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-2 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Masuk" }),
                /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2", children: [
                  "+",
                  isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: stockData?.summary.total_in || 0, delay: 200 })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Stok masuk" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowDownCircle", className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-3 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Keluar" }),
                /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold text-red-600 dark:text-red-400 mt-2", children: [
                  "-",
                  isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: stockData?.summary.total_out || 0, delay: 300 })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Stok keluar" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowUpCircle", className: "h-5 w-5 text-red-600 dark:text-red-400" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-300 via-red-500 to-red-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-4 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Perubahan Bersih" }),
                /* @__PURE__ */ jsx("p", { className: `text-3xl font-bold mt-2 ${(stockData?.summary.net_change || 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: isLoading ? "..." : /* @__PURE__ */ jsxs(Fragment, { children: [
                  (stockData?.summary.net_change || 0) >= 0 ? "+" : "",
                  /* @__PURE__ */ jsx(AnimatedNumber, { value: stockData?.summary.net_change || 0, delay: 400 })
                ] }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Selisih masuk/keluar" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "h-5 w-5 text-teal-600 dark:text-teal-400" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" })
          ] }) }),
          /* @__PURE__ */ jsx(Tilt3DCard, { className: "glass-card rounded-2xl overflow-hidden animate-slideInBlur stagger-5 card-hover-glow", children: /* @__PURE__ */ jsxs("div", { className: "p-5 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Jumlah Transaksi" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2", children: isLoading ? "..." : /* @__PURE__ */ jsx(AnimatedNumber, { value: stockData?.summary.movement_count || 0, delay: 500 }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pergerakan stok" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-800/30 shadow-lg", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Activity", className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp", style: { animationDelay: "0.5s" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-border/50", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Grafik Pergerakan Stok" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Stok masuk dan keluar per hari dalam periode ini" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-5", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : stockChartData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-[300px] flex flex-col items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "LineChart", className: "h-12 w-12 text-muted-foreground/40" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tidak ada data pergerakan" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah filter periode" })
            ] }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: stockChartData, children: [
              /* @__PURE__ */ jsxs("defs", { children: [
                /* @__PURE__ */ jsxs("filter", { id: "stockGlowGreen", height: "300%", children: [
                  /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
                  /* @__PURE__ */ jsxs("feMerge", { children: [
                    /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
                    /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("filter", { id: "stockGlowOrange", height: "300%", children: [
                  /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
                  /* @__PURE__ */ jsxs("feMerge", { children: [
                    /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
                    /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb", strokeOpacity: 0.5 }),
              /* @__PURE__ */ jsx(
                XAxis,
                {
                  dataKey: "date",
                  tick: { fontSize: 12, fill: "#6b7280" },
                  axisLine: { stroke: "#e5e7eb" },
                  tickLine: { stroke: "#e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsx(
                YAxis,
                {
                  tick: { fontSize: 12, fill: "#6b7280" },
                  axisLine: { stroke: "#e5e7eb" },
                  tickLine: { stroke: "#e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsx(
                Tooltip,
                {
                  contentStyle: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                Legend,
                {
                  wrapperStyle: { paddingTop: "20px" },
                  iconType: "circle"
                }
              ),
              /* @__PURE__ */ jsx(
                Line,
                {
                  type: "monotone",
                  dataKey: "masuk",
                  name: "Masuk",
                  stroke: "#22c55e",
                  strokeWidth: 3,
                  dot: { fill: "#22c55e", strokeWidth: 2, r: 4, stroke: "#fff" },
                  activeDot: { r: 6, fill: "#22c55e", stroke: "#fff", strokeWidth: 3, filter: "url(#stockGlowGreen)" }
                }
              ),
              /* @__PURE__ */ jsx(
                Line,
                {
                  type: "monotone",
                  dataKey: "keluar",
                  name: "Keluar",
                  stroke: "#f59e0b",
                  strokeWidth: 3,
                  dot: { fill: "#f59e0b", strokeWidth: 2, r: 4, stroke: "#fff" },
                  activeDot: { r: 6, fill: "#f59e0b", stroke: "#fff", strokeWidth: 3, filter: "url(#stockGlowOrange)" }
                }
              )
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "chart-card-premium rounded-2xl overflow-hidden animate-fadeInUp", style: { animationDelay: "0.6s" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-border/50", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-cyan-500 animate-pulse" }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Pemakaian Berdasarkan Jenis" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Distribusi stok masuk/keluar per produk" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-5", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : stockByProductData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-[300px] flex flex-col items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "BarChart", className: "h-12 w-12 text-muted-foreground/40" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tidak ada data produk" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah filter periode" })
            ] }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: stockByProductData, layout: "vertical", children: [
              /* @__PURE__ */ jsxs("defs", { children: [
                /* @__PURE__ */ jsxs("linearGradient", { id: "stockBarGreen", x1: "0", y1: "0", x2: "1", y2: "0", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#22c55e", stopOpacity: 0.8 }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#16a34a", stopOpacity: 1 })
                ] }),
                /* @__PURE__ */ jsxs("linearGradient", { id: "stockBarOrange", x1: "0", y1: "0", x2: "1", y2: "0", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#f59e0b", stopOpacity: 0.8 }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#d97706", stopOpacity: 1 })
                ] })
              ] }),
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb", strokeOpacity: 0.5 }),
              /* @__PURE__ */ jsx(
                XAxis,
                {
                  type: "number",
                  tick: { fontSize: 12, fill: "#6b7280" },
                  axisLine: { stroke: "#e5e7eb" },
                  tickLine: { stroke: "#e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsx(
                YAxis,
                {
                  dataKey: "product",
                  type: "category",
                  tick: { fontSize: 11, fill: "#6b7280" },
                  width: 100,
                  axisLine: { stroke: "#e5e7eb" },
                  tickLine: { stroke: "#e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsx(
                Tooltip,
                {
                  contentStyle: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                Legend,
                {
                  wrapperStyle: { paddingTop: "20px" },
                  iconType: "circle"
                }
              ),
              /* @__PURE__ */ jsx(Bar, { dataKey: "masuk", name: "Masuk", fill: "url(#stockBarGreen)", radius: [0, 4, 4, 0] }),
              /* @__PURE__ */ jsx(Bar, { dataKey: "keluar", name: "Keluar", fill: "url(#stockBarOrange)", radius: [0, 4, 4, 0] })
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-border/50", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "PackageOpen", className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Riwayat Pergerakan Stok" })
            ] }),
            stockData && stockData.data.length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-muted px-2 py-1", children: [
              stockData.data.length,
              " pergerakan"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 border-t border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleStockSort("date"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      "Tanggal",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("date", stockSortBy, stockSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleStockSort("product"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      "Produk",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("product", stockSortBy, stockSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-center text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleStockSort("type"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                      "Tipe",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("type", stockSortBy, stockSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "px-4 py-3 text-right text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/70 select-none",
                    onClick: () => handleStockSort("qty"),
                    children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-end gap-1", children: [
                      "Qty",
                      /* @__PURE__ */ jsx(SafeIcon, { name: getSortIcon("qty", stockSortBy, stockSortOrder), className: "h-3.5 w-3.5" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-muted-foreground", children: "Keterangan" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-muted-foreground", children: "Dicatat Oleh" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-4 py-8 text-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" }) }) }) : sortedStockData.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-4 py-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-10 w-10 text-muted-foreground/50" }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tidak ada data pergerakan stok" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah filter periode" })
              ] }) }) }) : sortedStockData.slice((stockCurrentPage - 1) * stockRowsPerPage, stockCurrentPage * stockRowsPerPage).map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm", children: formatDate(item.date) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm font-medium text-orange-600", children: item.product }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(Badge, { className: `${item.type === "MASUK" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} hover:bg-inherit`, children: item.type }) }),
                /* @__PURE__ */ jsxs("td", { className: `px-4 py-3 text-sm text-right font-medium font-mono ${item.type === "MASUK" ? "text-green-600" : "text-red-600"}`, children: [
                  item.type === "MASUK" ? "+" : "-",
                  item.qty
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: item.note || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: item.recorded_by })
              ] }, item.id)) })
            ] }) }),
            stockData && stockData.data.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { children: "Tampilkan" }),
                /* @__PURE__ */ jsxs(Select, { value: String(stockRowsPerPage), onValueChange: (v) => {
                  setStockRowsPerPage(Number(v));
                  setStockCurrentPage(1);
                }, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[70px] h-8", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: rowsPerPageOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: String(opt), children: opt }, opt)) })
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "dari ",
                  stockData.data.length,
                  " data"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setStockCurrentPage((p) => Math.max(1, p - 1)),
                    disabled: stockCurrentPage === 1,
                    className: "h-8 px-2",
                    children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground min-w-[80px] text-center", children: [
                  "Hal ",
                  stockCurrentPage,
                  " / ",
                  Math.ceil(stockData.data.length / stockRowsPerPage)
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setStockCurrentPage((p) => Math.min(Math.ceil(stockData.data.length / stockRowsPerPage), p + 1)),
                    disabled: stockCurrentPage >= Math.ceil(stockData.data.length / stockRowsPerPage),
                    className: "h-8 px-2",
                    children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const $$Laporan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Laporan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col dashboard-gradient-bg">
        <div class="flex-1 overflow-auto">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div class="mb-6 flex items-center gap-3">
              <div class="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent"></div>
              <div>
                <h1 class="text-3xl font-bold text-gradient-primary">Laporan</h1>
                <p class="text-muted-foreground/80 mt-1">Laporan penjualan, pembayaran, dan stok</p>
              </div>
            </div>

            
            <div class="animate-fadeInUp">
              ${renderComponent($$result4, "ReportsPage", ReportsPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/laporan/ReportsPage.tsx", "client:component-export": "default" })}
            </div>
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/laporan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/laporan.astro";
const $$url = "/laporan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Laporan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
