import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.k-1prjTp.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DVGEP8G7.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useRef } from "react";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "../_astro/card.OLhQVURm.js";
import { p as pangkalanApi, S as SafeIcon, B as Button, I as Input, l as lpgProductsApi, w as penyaluranApi } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.DOfMR1sZ.js";
import { e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, B as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "../_astro/tabs.DZPauEIq.js";
import { L as Label } from "../_astro/label.DNnd65zo.js";
import { T as Textarea } from "../_astro/textarea.Ccrv3kMs.js";
import { toast } from "sonner";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { g as getAgenProfileFromAPI, e as exportPertaminaPDF, a as exportPertaminaExcel } from "../_astro/pertamina-export.rOOl49vm.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { renderers } from "../renderers.mjs";
function PenyaluranPage() {
  const getInitialTab = () => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (["form", "rekapitulasi"].includes(hash)) {
        return hash;
      }
    }
    return "rekapitulasi";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${value}`);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState("SUBSIDI");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [tipePembayaran, setTipePembayaran] = useState("ALL");
  const [kondisi, setKondisi] = useState("ALL");
  const [selectedLpgType, setSelectedLpgType] = useState("kg3");
  const [rekapData, setRekapData] = useState(null);
  const [lpgProducts, setLpgProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFakultatifModal, setShowFakultatifModal] = useState(false);
  const [pangkalanList, setPangkalanList] = useState([]);
  const [isSavingFakultatif, setIsSavingFakultatif] = useState(false);
  const [fakultatifForm, setFakultatifForm] = useState({
    pangkalan_id: "",
    tanggal: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    jumlah: "",
    catatan: ""
  });
  const fetchLpgProducts = async () => {
    try {
      const products = await lpgProductsApi.getAll();
      setLpgProducts(products.filter((p) => p.is_active));
    } catch (error) {
      console.error("Error fetching LPG products:", error);
      setLpgProducts([]);
    }
  };
  const isSubsidi = selectedCategory === "SUBSIDI";
  const lpgTypeOptions = useMemo(() => {
    const sizeToLpgType = (size) => {
      if (size <= 0.3) return "gr220";
      if (Math.abs(size - 3) < 0.1) return "kg3";
      if (Math.abs(size - 5.5) < 0.1 || Math.abs(size - 5) < 0.1) return "kg5";
      if (Math.abs(size - 12) < 0.1) return "kg12";
      if (Math.abs(size - 50) < 0.1) return "kg50";
      return `kg${Math.floor(size)}`;
    };
    if (lpgProducts.length > 0) {
      const filteredProducts = lpgProducts.filter(
        (p) => selectedCategory === "SUBSIDI" ? p.category === "SUBSIDI" : p.category !== "SUBSIDI"
      );
      return filteredProducts.map((p) => {
        const lpgType = sizeToLpgType(Number(p.size_kg));
        return {
          value: lpgType,
          label: p.name,
          description: p.category === "SUBSIDI" ? "Subsidi" : "Non-Subsidi"
        };
      });
    }
    return selectedCategory === "SUBSIDI" ? [{ value: "kg3", label: "LPG 3 KG", description: "Subsidi" }] : [];
  }, [lpgProducts, selectedCategory]);
  useEffect(() => {
    if (lpgTypeOptions.length > 0 && !lpgTypeOptions.find((o) => o.value === selectedLpgType)) {
      setSelectedLpgType(lpgTypeOptions[0].value);
    }
  }, [lpgTypeOptions]);
  const fetchRekapitulasi = async () => {
    setIsLoading(true);
    try {
      const data = await penyaluranApi.getRekapitulasi(selectedMonth, tipePembayaran !== "ALL" ? tipePembayaran : void 0, selectedLpgType);
      setRekapData(data);
    } catch (error) {
      console.error("Error fetching penyaluran rekapitulasi:", error);
      const [year, month] = selectedMonth.split("-").map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      setRekapData({
        bulan: selectedMonth,
        days_in_month: daysInMonth,
        data: []
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLpgProducts();
  }, []);
  useEffect(() => {
    if (showFakultatifModal && pangkalanList.length === 0) {
      pangkalanApi.getAll(1, 100, void 0, true).then((res) => {
        setPangkalanList(res.data);
      }).catch((err) => {
        console.error("Failed to fetch pangkalan:", err);
        toast.error("Gagal memuat daftar pangkalan");
      });
    }
  }, [showFakultatifModal]);
  const handleSaveFakultatif = async () => {
    if (!fakultatifForm.pangkalan_id) {
      toast.error("Pilih pangkalan terlebih dahulu");
      return;
    }
    if (!fakultatifForm.jumlah || parseInt(fakultatifForm.jumlah) <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }
    if (!fakultatifForm.catatan.trim()) {
      toast.error("Catatan/alasan wajib diisi untuk penyaluran fakultatif");
      return;
    }
    setIsSavingFakultatif(true);
    try {
      await penyaluranApi.createFakultatif({
        pangkalan_id: fakultatifForm.pangkalan_id,
        tanggal: fakultatifForm.tanggal,
        lpg_type: selectedLpgType,
        jumlah: parseInt(fakultatifForm.jumlah),
        kondisi: "FAKULTATIF",
        catatan: fakultatifForm.catatan
      });
      toast.success("Penyaluran fakultatif berhasil disimpan");
      setShowFakultatifModal(false);
      setFakultatifForm({ pangkalan_id: "", tanggal: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], jumlah: "", catatan: "" });
      fetchRekapitulasi();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan penyaluran fakultatif");
    } finally {
      setIsSavingFakultatif(false);
    }
  };
  useEffect(() => {
    fetchRekapitulasi();
  }, [selectedMonth, tipePembayaran, selectedLpgType]);
  const handleDownloadPDF = async () => {
    if (!rekapData || rekapData.data.length === 0) {
      toast.error("Tidak ada data untuk di-download");
      return;
    }
    try {
      toast.loading("Generating PDF...", { id: "pdf-export" });
      const exportData = rekapData.data.map((row) => ({
        id_registrasi: row.id_registrasi,
        nama_pangkalan: row.nama_pangkalan,
        alokasi: row.alokasi,
        daily: row.daily,
        total_normal: row.total_normal,
        total_fakultatif: row.total_fakultatif,
        sisa_alokasi: row.sisa_alokasi,
        grand_total: row.grand_total
      }));
      const agenProfile = await getAgenProfileFromAPI();
      await exportPertaminaPDF({
        bulan: selectedMonth,
        data: exportData,
        daysInMonth: rekapData.days_in_month,
        agenProfile,
        tipe: "penyaluran",
        lpgType: selectedLpgType,
        category: selectedCategory
      });
      toast.success("PDF berhasil di-download!", { id: "pdf-export" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Gagal export PDF", { id: "pdf-export" });
    }
  };
  const handleDownloadExcel = async () => {
    if (!rekapData || rekapData.data.length === 0) {
      toast.error("Tidak ada data untuk di-download");
      return;
    }
    try {
      toast.loading("Generating Excel...", { id: "excel-export" });
      const exportData = rekapData.data.map((row) => ({
        id_registrasi: row.id_registrasi,
        nama_pangkalan: row.nama_pangkalan,
        alokasi: row.alokasi,
        daily: row.daily,
        total_normal: row.total_normal,
        total_fakultatif: row.total_fakultatif,
        sisa_alokasi: row.sisa_alokasi,
        grand_total: row.grand_total
      }));
      const agenProfile = await getAgenProfileFromAPI();
      await exportPertaminaExcel({
        bulan: selectedMonth,
        data: exportData,
        daysInMonth: rekapData.days_in_month,
        agenProfile,
        tipe: "penyaluran",
        lpgType: selectedLpgType,
        category: selectedCategory
      });
      toast.success("Excel berhasil di-download!", { id: "excel-export" });
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Gagal export Excel", { id: "excel-export" });
    }
  };
  const tableScrollRef = useRef(null);
  useEffect(() => {
    const container = tableScrollRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      if (e.deltaY === 0) return;
      const atLeftEdge = container.scrollLeft <= 0;
      const atRightEdge = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;
      if (atLeftEdge && scrollingUp || atRightEdge && scrollingDown) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      container.scrollLeft += e.deltaY;
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);
  const monthOptions = useMemo(() => {
    const options = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      options.push({ value, label });
    }
    return options;
  }, []);
  const dayHeaders = useMemo(() => {
    if (!rekapData) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    return Array.from({ length: rekapData.days_in_month }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month - 1, day);
      const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      return { day, dayName: dayNames[date.getDay()], isSunday: date.getDay() === 0 };
    });
  }, [rekapData, selectedMonth]);
  const summaryStats = useMemo(() => {
    if (!rekapData) return { totalPangkalan: 0, totalAlokasi: 0, totalRealisasi: 0, sisaAlokasi: 0, overAlokasi: 0, nearLimit: 0 };
    const overAlokasi = rekapData.data.filter((r) => r.sisa_alokasi < 0).length;
    const nearLimit = rekapData.data.filter((r) => r.sisa_alokasi >= 0 && r.sisa_alokasi <= r.alokasi * 0.2 && r.alokasi > 0).length;
    return {
      totalPangkalan: rekapData.data.length,
      totalAlokasi: rekapData.data.reduce((sum, r) => sum + r.alokasi, 0),
      totalRealisasi: rekapData.data.reduce((sum, r) => sum + r.grand_total, 0),
      sisaAlokasi: rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
      overAlokasi,
      nearLimit
    };
  }, [rekapData]);
  const today = (/* @__PURE__ */ new Date()).getDate();
  const currentMonth = `${(/* @__PURE__ */ new Date()).getFullYear()}-${String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0")}`;
  const isCurrentMonth = selectedMonth === currentMonth;
  const isSunday = (dayInfo) => dayInfo.isSunday;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Penyaluran",
        subtitle: "Input dan rekapitulasi penyaluran harian"
      }
    ),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: handleTabChange, children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "glass-card p-1 mb-4", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "rekapitulasi", className: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Table", className: "w-4 h-4 mr-2" }),
          "Rekapitulasi"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "form", className: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Edit", className: "w-4 h-4 mr-2" }),
          "Input Form"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: selectedCategory === "SUBSIDI" ? "default" : "outline",
            className: selectedCategory === "SUBSIDI" ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg" : "hover:bg-blue-50 dark:hover:bg-blue-900/20",
            onClick: () => setSelectedCategory("SUBSIDI"),
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "w-4 h-4 mr-2" }),
              "LPG Subsidi"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: selectedCategory === "NON_SUBSIDI" ? "default" : "outline",
            className: selectedCategory === "NON_SUBSIDI" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg" : "hover:bg-amber-50 dark:hover:bg-amber-900/20",
            onClick: () => setSelectedCategory("NON_SUBSIDI"),
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Flame", className: "w-4 h-4 mr-2" }),
              "LPG Non-Subsidi"
            ]
          }
        )
      ] }),
      lpgTypeOptions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: lpgTypeOptions.map((opt) => /* @__PURE__ */ jsx(
        Button,
        {
          variant: selectedLpgType === opt.value ? "default" : "outline",
          size: "sm",
          className: selectedLpgType === opt.value ? isSubsidi ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "hover:bg-muted",
          onClick: () => setSelectedLpgType(opt.value),
          children: opt.label
        },
        opt.value
      )) }) : /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg", children: [
        "Tidak ada produk LPG ",
        selectedCategory === "SUBSIDI" ? "Subsidi" : "Non-Subsidi",
        " yang aktif"
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "glass-card mb-6", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: `grid gap-3 ${selectedCategory === "SUBSIDI" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Bulan" }),
            /* @__PURE__ */ jsxs(Select, { value: selectedMonth, onValueChange: setSelectedMonth, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
            ] })
          ] }),
          selectedCategory === "SUBSIDI" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Kondisi" }),
              /* @__PURE__ */ jsxs(Select, { value: kondisi, onValueChange: setKondisi, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "ALL", children: "Semua" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "NORMAL", children: "Normal" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "FAKULTATIF", children: "Fakultatif" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Tipe" }),
              /* @__PURE__ */ jsxs(Select, { value: tipePembayaran, onValueChange: setTipePembayaran, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "ALL", children: "Semua" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "CASHLESS", children: "Cashless" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "CASH", children: "Cash" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:flex sm:flex-row gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              onClick: () => setShowFakultatifModal(true),
              className: "w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "w-4 h-4 mr-1" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Tambah Fakultatif" }),
                /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Fakultatif" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: fetchRekapitulasi, disabled: isLoading, className: "w-full sm:w-auto", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: `w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}` }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Refresh" }),
            /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Muat Ulang" })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "w-full sm:w-auto col-span-2 sm:col-span-1", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Download", className: "w-4 h-4 mr-1" }),
              "Download",
              /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "w-3 h-3 ml-1" })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleDownloadPDF, children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "w-4 h-4 mr-2" }),
                "Download PDF"
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleDownloadExcel, children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "FileSpreadsheet", className: "w-4 h-4 mr-2" }),
                "Download Excel"
              ] })
            ] })
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "rekapitulasi", children: [
        /* @__PURE__ */ jsxs("div", { className: `mb-6 ${isSubsidi ? "grid gap-4 grid-cols-2 lg:grid-cols-5" : "flex flex-wrap gap-4"}`, children: [
          /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-blue-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "w-5 h-5 text-blue-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Pangkalan" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.totalPangkalan, delay: 100 }) })
            ] })
          ] }) }) }),
          isSubsidi && /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-green-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Target", className: "w-5 h-5 text-green-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Alokasi" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.totalAlokasi, delay: 200 }) })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-purple-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "w-5 h-5 text-purple-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Penyaluran" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-purple-600", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.totalRealisasi, delay: 300 }) })
            ] })
          ] }) }) }),
          isSubsidi && /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-orange-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "w-5 h-5 text-orange-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sisa Alokasi" }),
              /* @__PURE__ */ jsx("p", { className: `text-xl font-bold ${summaryStats.sisaAlokasi < 0 ? "text-red-500" : "text-orange-600"}`, children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.sisaAlokasi, delay: 400 }) })
            ] })
          ] }) }) }),
          isSubsidi && /* @__PURE__ */ jsx(Card, { className: `glass-card ${summaryStats.overAlokasi > 0 ? "border-red-500/50 bg-red-500/5" : ""}`, children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `p-2 rounded-xl ${summaryStats.overAlokasi > 0 ? "bg-red-500/20" : "bg-green-500/10"}`, children: /* @__PURE__ */ jsx(SafeIcon, { name: summaryStats.overAlokasi > 0 ? "AlertTriangle" : "CheckCircle", className: `w-5 h-5 ${summaryStats.overAlokasi > 0 ? "text-red-500" : "text-green-500"}` }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Status Alokasi" }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: summaryStats.overAlokasi > 0 ? /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-red-500", children: [
                "⚠️ ",
                summaryStats.overAlokasi,
                " Over"
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-green-500", children: "✅ Aman" }) })
            ] })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-border/50 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "Rekapitulasi Penyaluran" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "ml-auto bg-green-500/10 text-green-600 border-green-500/30", children: tipePembayaran === "ALL" ? "Semua" : tipePembayaran })
          ] }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx(
            "div",
            {
              ref: tableScrollRef,
              className: "overflow-x-auto scrollbar-thin-auto",
              style: { scrollBehavior: "auto" },
              children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 sticky top-0 z-20", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "sticky left-0 z-30 bg-muted px-3 py-3 text-left font-medium min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", children: "ID Registrasi" }),
                  /* @__PURE__ */ jsx("th", { className: "sticky left-[120px] z-30 bg-muted px-3 py-3 text-left font-medium min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", children: "Nama Pangkalan" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium min-w-[60px]", children: "Status" }),
                  isSubsidi && /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium min-w-[70px]", children: "Alokasi" }),
                  dayHeaders.map((dayInfo) => {
                    const weekClass = isSunday(dayInfo) ? "bg-red-100 dark:bg-red-900/30" : "";
                    const todayClass = isCurrentMonth && dayInfo.day === today ? "bg-primary/20 text-primary font-bold" : "";
                    return /* @__PURE__ */ jsxs(
                      "th",
                      {
                        className: `px-2 py-2 text-center font-medium min-w-[45px] ${weekClass} ${todayClass}`,
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "text-xs", children: String(dayInfo.day).padStart(2, "0") }),
                          /* @__PURE__ */ jsx("div", { className: `text-[10px] ${isSunday(dayInfo) ? "text-red-500" : "text-muted-foreground"}`, children: dayInfo.dayName })
                        ]
                      },
                      dayInfo.day
                    );
                  }),
                  isSubsidi && /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-green-500/10 min-w-[80px]", children: "Total Normal" }),
                  isSubsidi && /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-blue-500/10 min-w-[80px]", children: "Total Fakultatif" }),
                  isSubsidi && /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-orange-500/10 min-w-[80px]", children: "Sisa Alokasi" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-purple-500/10 min-w-[80px]", children: isSubsidi ? "Grand Total" : "Total" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: dayHeaders.length + 8, className: "text-center py-8", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "w-6 h-6 animate-spin mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Memuat data..." })
                ] }) }) : rekapData?.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: dayHeaders.length + 8, className: "text-center py-8 text-muted-foreground", children: "Tidak ada data" }) }) : rekapData?.data.map((row) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/30 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "sticky left-0 z-10 bg-background px-3 py-2 font-mono text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", children: row.id_registrasi }),
                  /* @__PURE__ */ jsx("td", { className: "sticky left-[120px] z-10 bg-background px-3 py-2 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", children: row.nama_pangkalan }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-green-500/10 text-green-600 border-green-500/30 text-xs", children: row.status }) }),
                  isSubsidi && /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center font-medium", children: row.alokasi.toLocaleString() }),
                  dayHeaders.map((dayInfo) => {
                    const value = row.daily[dayInfo.day] || 0;
                    const weekClass = isSunday(dayInfo) ? "bg-red-50 dark:bg-red-900/20" : "";
                    const todayClass = isCurrentMonth && dayInfo.day === today ? "bg-primary/10" : "";
                    return /* @__PURE__ */ jsx(
                      "td",
                      {
                        className: `px-2 py-2 text-center ${weekClass} ${todayClass}`,
                        children: value === 0 ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/40", children: "-" }) : /* @__PURE__ */ jsx("span", { className: "font-medium", children: value })
                      },
                      dayInfo.day
                    );
                  }),
                  isSubsidi && /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center font-medium bg-green-500/5", children: row.total_normal.toLocaleString() }),
                  isSubsidi && /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center font-medium bg-blue-500/5", children: row.total_fakultatif.toLocaleString() }),
                  isSubsidi && /* @__PURE__ */ jsxs("td", { className: `px-3 py-2 text-center font-bold ${row.sisa_alokasi < 0 ? "bg-red-500/20 text-red-600 dark:text-red-400" : "bg-orange-500/5"}`, children: [
                    row.sisa_alokasi < 0 && "⚠️ ",
                    row.sisa_alokasi.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center font-bold bg-purple-500/5", children: row.grand_total.toLocaleString() })
                ] }, row.pangkalan_id)) }),
                rekapData && rekapData.data.length > 0 && /* @__PURE__ */ jsx("tfoot", { className: "bg-muted/70 font-bold sticky bottom-0 z-20", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "sticky left-0 z-30 bg-muted px-3 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", colSpan: 2, children: "Total" }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3" }),
                  isSubsidi && /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center", children: rekapData.data.reduce((sum, r) => sum + r.alokasi, 0).toLocaleString() }),
                  dayHeaders.map((dayInfo) => {
                    const weekClass = isSunday(dayInfo) ? "bg-red-100 dark:bg-red-900/30" : "";
                    const todayClass = isCurrentMonth && dayInfo.day === today ? "bg-primary/20" : "";
                    const total = rekapData.data.reduce((sum, r) => sum + (r.daily[dayInfo.day] || 0), 0);
                    return /* @__PURE__ */ jsx("td", { className: `px-2 py-3 text-center ${weekClass} ${todayClass}`, children: total === 0 ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/40", children: "-" }) : total.toLocaleString() }, dayInfo.day);
                  }),
                  isSubsidi && /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-green-500/10", children: rekapData.data.reduce((sum, r) => sum + r.total_normal, 0).toLocaleString() }),
                  isSubsidi && /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-blue-500/10", children: rekapData.data.reduce((sum, r) => sum + r.total_fakultatif, 0).toLocaleString() }),
                  isSubsidi && /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-orange-500/10", children: rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0).toLocaleString() }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-purple-500/10", children: rekapData.data.reduce((sum, r) => sum + r.grand_total, 0).toLocaleString() })
                ] }) })
              ] })
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "form", children: /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-border/50 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "Input Penyaluran" })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Construction", className: "w-12 h-12 mx-auto mb-4 opacity-50" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: "Fitur Input Form" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Coming soon - Kaleum nya lieur keneh. 😭" })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showFakultatifModal, onOpenChange: setShowFakultatifModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "w-5 h-5 text-amber-500" }),
          "Tambah Penyaluran Fakultatif"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Input penyaluran di luar kuota normal. Catatan wajib diisi sebagai alasan." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "fak-pangkalan", children: [
            "Pangkalan ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: fakultatifForm.pangkalan_id,
              onValueChange: (v) => setFakultatifForm({ ...fakultatifForm, pangkalan_id: v }),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { id: "fak-pangkalan", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih pangkalan..." }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: pangkalanList.map((p) => /* @__PURE__ */ jsxs(SelectItem, { value: p.id, children: [
                  p.code,
                  " - ",
                  p.name
                ] }, p.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Jenis LPG" }),
          /* @__PURE__ */ jsx("div", { className: "px-3 py-2 rounded-md border bg-muted/50 text-sm", children: lpgTypeOptions.find((o) => o.value === selectedLpgType)?.label || selectedLpgType })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "fak-tanggal", children: [
            "Tanggal ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "fak-tanggal",
              type: "date",
              value: fakultatifForm.tanggal,
              onChange: (e) => setFakultatifForm({ ...fakultatifForm, tanggal: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "fak-jumlah", children: [
            "Jumlah (Tabung) ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "fak-jumlah",
              type: "number",
              min: "1",
              value: fakultatifForm.jumlah,
              onChange: (e) => setFakultatifForm({ ...fakultatifForm, jumlah: e.target.value }),
              placeholder: "0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "fak-catatan", children: [
            "Catatan/Alasan ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "fak-catatan",
              value: fakultatifForm.catatan,
              onChange: (e) => setFakultatifForm({ ...fakultatifForm, catatan: e.target.value }),
              placeholder: "Contoh: Permintaan darurat untuk event...",
              rows: 3
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Wajib diisi sebagai audit trail" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setShowFakultatifModal(false), children: "Batal" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleSaveFakultatif,
            disabled: isSavingFakultatif || !fakultatifForm.pangkalan_id || !fakultatifForm.jumlah || !fakultatifForm.catatan.trim(),
            className: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
            children: [
              isSavingFakultatif ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "w-4 h-4 mr-2" }),
              "Simpan"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
const $$Penyaluran = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Penyaluran - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col dashboard-gradient-bg min-w-0">
        <div class="flex-1 overflow-y-auto overflow-x-hidden">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[calc(100vw-16rem)]">
            
            <div class="animate-fadeInUp">
              ${renderComponent($$result4, "PenyaluranPage", PenyaluranPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/penyaluran/PenyaluranPage.tsx", "client:component-export": "default" })}
            </div>
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/penyaluran.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/penyaluran.astro";
const $$url = "/penyaluran.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Penyaluran,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
