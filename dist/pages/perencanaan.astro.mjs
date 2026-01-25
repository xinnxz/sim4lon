import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C7j8yK_x.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useRef } from "react";
import { C as Card, a as CardContent, b as CardHeader, d as CardTitle } from "../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, B as Button, I as Input, l as lpgProductsApi, z as perencanaanApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, B as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, o as DialogFooter, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "../_astro/tabs.DCLuprNz.js";
import { A as AlertDialog, h as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "../_astro/alert-dialog.DUcjkEK3.js";
import { L as Label } from "../_astro/label.C1We_4rW.js";
import { toast } from "sonner";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { g as getAgenProfileFromAPI, e as exportPertaminaPDF, a as exportPertaminaExcel } from "../_astro/pertamina-export.BAvXOSis.js";
import { renderers } from "../renderers.mjs";
function PerencanaanPage() {
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
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [kondisi, setKondisi] = useState("ALL");
  const [tipePembayaran, setTipePembayaran] = useState("ALL");
  const [selectedLpgType, setSelectedLpgType] = useState("kg3");
  const [rekapData, setRekapData] = useState(null);
  const [lpgProducts, setLpgProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generateOverwrite, setGenerateOverwrite] = useState(false);
  const [editedCells, setEditedCells] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const fetchLpgProducts = async () => {
    try {
      const products = await lpgProductsApi.getAll();
      setLpgProducts(products.filter((p) => p.is_active));
    } catch (error) {
      console.error("Error fetching LPG products:", error);
      setLpgProducts([]);
    }
  };
  const lpgTypeOptions = useMemo(() => {
    const sizeToLpgType = (size) => {
      if (size === 0.22 || size === 0.22) return "gr220";
      if (size === 3) return "kg3";
      if (size === 5.5) return "kg5";
      if (size === 12) return "kg12";
      if (size === 50) return "kg50";
      return `kg${Math.floor(size)}`;
    };
    if (lpgProducts.length > 0) {
      const subsidiTypes = lpgProducts.filter((p) => p.category === "SUBSIDI").map((p) => {
        const lpgType = sizeToLpgType(Number(p.size_kg));
        return {
          value: lpgType,
          label: p.name,
          description: "Subsidi"
        };
      });
      return subsidiTypes.length > 0 ? subsidiTypes : [{ value: "kg3", label: "LPG 3 KG", description: "Subsidi" }];
    }
    return [{ value: "kg3", label: "LPG 3 KG", description: "Subsidi" }];
  }, [lpgProducts]);
  useEffect(() => {
    if (lpgTypeOptions.length > 0 && !lpgTypeOptions.find((o) => o.value === selectedLpgType)) {
      setSelectedLpgType(lpgTypeOptions[0].value);
    }
  }, [lpgTypeOptions]);
  const fetchRekapitulasi = async () => {
    setIsLoading(true);
    try {
      const data = await perencanaanApi.getRekapitulasi(selectedMonth, kondisi !== "ALL" ? kondisi : void 0, selectedLpgType);
      setRekapData(data);
    } catch (error) {
      console.error("Error fetching rekapitulasi:", error);
      setRekapData({
        bulan: selectedMonth,
        days_in_month: new Date(parseInt(selectedMonth.split("-")[0]), parseInt(selectedMonth.split("-")[1]), 0).getDate(),
        data: []
      });
      if (error instanceof Error && !error.message.includes("404")) {
        toast.error("Gagal memuat data rekapitulasi");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleAutoGenerate = async () => {
    setShowGenerateDialog(false);
    setIsGenerating(true);
    try {
      const result = await perencanaanApi.autoGenerate({
        bulan: selectedMonth,
        lpg_type: selectedLpgType,
        kondisi: kondisi !== "ALL" ? kondisi : "NORMAL",
        overwrite: generateOverwrite
      });
      toast.success(result.message, {
        description: `${result.details.created_records} entries dibuat untuk ${result.details.total_pangkalan - result.details.skipped_no_alokasi} pangkalan`
      });
      fetchRekapitulasi();
      setGenerateOverwrite(false);
    } catch (error) {
      toast.error("Gagal generate perencanaan otomatis");
    } finally {
      setIsGenerating(false);
    }
  };
  useEffect(() => {
    fetchLpgProducts();
  }, []);
  const openEditModal = (pangkalanId, pangkalanName, day, originalValue) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split("T")[0];
    const key = `${pangkalanId}_${tanggal}`;
    const existing = editedCells[key];
    setEditModalData({
      pangkalanId,
      pangkalanName,
      day,
      tanggal,
      normal: existing?.normal ?? originalValue,
      fakultatif: existing?.fakultatif ?? 0
    });
    setShowEditModal(true);
  };
  const handleModalSave = () => {
    if (!editModalData) return;
    const key = `${editModalData.pangkalanId}_${editModalData.tanggal}`;
    setEditedCells((prev) => ({
      ...prev,
      [key]: { normal: editModalData.normal, fakultatif: editModalData.fakultatif }
    }));
    setShowEditModal(false);
    setEditModalData(null);
  };
  const handleRemoveEdit = () => {
    if (!editModalData) return;
    const key = `${editModalData.pangkalanId}_${editModalData.tanggal}`;
    setEditedCells((prev) => {
      const newCells = { ...prev };
      delete newCells[key];
      return newCells;
    });
    setShowEditModal(false);
    setEditModalData(null);
  };
  const isCellEdited = (pangkalanId, day) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split("T")[0];
    const key = `${pangkalanId}_${tanggal}`;
    return key in editedCells;
  };
  const getEditedValue = (pangkalanId, day, original) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split("T")[0];
    const key = `${pangkalanId}_${tanggal}`;
    if (key in editedCells) {
      return editedCells[key].normal + editedCells[key].fakultatif;
    }
    return original;
  };
  const getEditedCell = (pangkalanId, day) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const tanggal = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString().split("T")[0];
    const key = `${pangkalanId}_${tanggal}`;
    return editedCells[key] || null;
  };
  const handleSaveChanges = async () => {
    const keys = Object.keys(editedCells);
    if (keys.length === 0) return;
    setIsSaving(true);
    try {
      const updates = {};
      for (const key of keys) {
        const [pangkalanId, tanggal] = key.split("_");
        if (!updates[pangkalanId]) updates[pangkalanId] = [];
        const cellData = editedCells[key];
        updates[pangkalanId].push({
          tanggal,
          jumlah: cellData.normal + cellData.fakultatif,
          jumlah_normal: cellData.normal,
          jumlah_fakultatif: cellData.fakultatif
        });
      }
      for (const [pangkalanId, data] of Object.entries(updates)) {
        await perencanaanApi.bulkUpdate({
          pangkalan_id: pangkalanId,
          tanggal_awal: data[0].tanggal,
          tanggal_akhir: data[data.length - 1].tanggal,
          data: data.map((d) => ({
            tanggal: d.tanggal,
            jumlah: d.jumlah,
            jumlah_normal: d.jumlah_normal,
            jumlah_fakultatif: d.jumlah_fakultatif
          }))
        });
      }
      toast.success(`${keys.length} perubahan berhasil disimpan`);
      setEditedCells({});
      fetchRekapitulasi();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    fetchRekapitulasi();
  }, [selectedMonth, kondisi, selectedLpgType]);
  const handleDownloadPDF = async () => {
    if (!rekapData || rekapData.data.length === 0) {
      toast.error("Tidak ada data untuk di-download");
      return;
    }
    try {
      toast.loading("Generating PDF...", { id: "pdf-export" });
      const exportData = (computedRekapData?.data || rekapData.data).map((row) => ({
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
        daysInMonth,
        agenProfile,
        tipe: "perencanaan",
        lpgType: selectedLpgType,
        category: "SUBSIDI"
        // Perencanaan selalu untuk LPG Subsidi
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
      const exportData = (computedRekapData?.data || rekapData.data).map((row) => ({
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
        daysInMonth,
        agenProfile,
        tipe: "perencanaan",
        lpgType: selectedLpgType,
        category: "SUBSIDI"
        // Perencanaan selalu untuk LPG Subsidi
      });
      toast.success("Excel berhasil di-download!", { id: "excel-export" });
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Gagal export Excel", { id: "excel-export" });
    }
  };
  const { dayHeaders, isCurrentMonth, today, daysInMonth } = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const _daysInMonth = new Date(year, month, 0).getDate();
    const now = /* @__PURE__ */ new Date();
    const _isCurrentMonth = now.getFullYear() === year && now.getMonth() === month - 1;
    const _today = now.getDate();
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const headers = [];
    for (let d = 1; d <= _daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      const dayOfWeek = date.getDay();
      headers.push({
        day: d,
        dayName: dayNames[dayOfWeek],
        isSunday: dayOfWeek === 0
      });
    }
    return { dayHeaders: headers, isCurrentMonth: _isCurrentMonth, today: _today, daysInMonth: _daysInMonth };
  }, [selectedMonth]);
  const computedRekapData = useMemo(() => {
    if (!rekapData) return null;
    return {
      ...rekapData,
      data: rekapData.data.map((row) => {
        let totalNormal = row.total_normal || 0;
        let totalFakultatif = row.total_fakultatif || 0;
        for (const dayInfo of dayHeaders) {
          const [year, month] = selectedMonth.split("-").map(Number);
          const tanggal = new Date(Date.UTC(year, month - 1, dayInfo.day, 12, 0, 0)).toISOString().split("T")[0];
          const key = `${row.pangkalan_id}_${tanggal}`;
          const editedCell = editedCells[key];
          if (editedCell) {
            const originalValue = row.daily[dayInfo.day] || 0;
            totalNormal -= originalValue;
            totalNormal += editedCell.normal;
            totalFakultatif += editedCell.fakultatif;
          }
        }
        const grandTotal = totalNormal + totalFakultatif;
        const sisaAlokasi = row.alokasi - grandTotal;
        return {
          ...row,
          total_normal: totalNormal,
          total_fakultatif: totalFakultatif,
          sisa_alokasi: sisaAlokasi,
          grand_total: grandTotal
        };
      })
    };
  }, [rekapData, editedCells, dayHeaders, selectedMonth]);
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
  const summaryStats = useMemo(() => {
    const data = computedRekapData?.data || rekapData?.data || [];
    if (data.length === 0) return { totalPangkalan: 0, totalAlokasi: 0, totalRealisasi: 0, sisaAlokasi: 0, overAlokasi: 0, nearLimit: 0 };
    const overAlokasi = data.filter((r) => r.sisa_alokasi < 0).length;
    const nearLimit = 0;
    return {
      totalPangkalan: data.length,
      totalAlokasi: data.reduce((sum, r) => sum + r.alokasi, 0),
      totalRealisasi: data.reduce((sum, r) => sum + r.total_normal + r.total_fakultatif, 0),
      sisaAlokasi: data.reduce((sum, r) => sum + r.sisa_alokasi, 0),
      overAlokasi,
      nearLimit
    };
  }, [computedRekapData, rekapData]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Perencanaan",
        subtitle: "Kelola perencanaan distribusi LPG 3KG bulanan ke pangkalan"
      }
    ),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: handleTabChange, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/images/products/lpg-3kg.png",
            alt: "LPG 3kg",
            className: "w-10 h-10 sm:w-12 sm:h-12 object-contain"
          }
        ) }),
        /* @__PURE__ */ jsxs(TabsList, { className: "glass-card p-1 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "rekapitulasi", className: "flex-1 sm:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Table", className: "w-4 h-4 mr-1 sm:mr-2" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm", children: "Rekapitulasi" })
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "form", className: "flex-1 sm:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Edit", className: "w-4 h-4 mr-1 sm:mr-2" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm", children: "Input Form" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "sm:hidden space-y-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(Select, { value: selectedMonth, onValueChange: setSelectedMonth, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full bg-white border-gray-200 h-12", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Bulan" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: kondisi, onValueChange: setKondisi, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full bg-white border-gray-200 h-12", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Kondisi" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "ALL", children: "Semua" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "NORMAL", children: "Normal" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "FAKULTATIF", children: "Fakultatif" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: tipePembayaran, onValueChange: setTipePembayaran, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full bg-white border-gray-200 h-12", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Tipe Pembayaran" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "ALL", children: "Semua" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "CASHLESS", children: "Cashless" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "CASH", children: "Cash" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Download", className: "w-4 h-4 mr-2" }),
            "Download Sebagai",
            /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "w-4 h-4 ml-2" })
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "center", className: "w-56", children: [
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
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "glass-card mb-6 hidden sm:block", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Bulan" }),
            /* @__PURE__ */ jsxs(Select, { value: selectedMonth, onValueChange: setSelectedMonth, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
            ] })
          ] }),
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
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: fetchRekapitulasi, disabled: isLoading, children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: `w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}` }),
            "Refresh"
          ] }),
          /* @__PURE__ */ jsxs(AlertDialog, { open: showGenerateDialog, onOpenChange: setShowGenerateDialog, children: [
            /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "default",
                size: "sm",
                disabled: isGenerating,
                className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Wand2", className: `w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}` }),
                  isGenerating ? "Generating..." : "Generate Otomatis"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(AlertDialogContent, { className: "max-w-lg", children: [
              /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Generate Perencanaan Otomatis" }),
                /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("p", { children: [
                    "Generate perencanaan otomatis untuk bulan ",
                    /* @__PURE__ */ jsx("strong", { children: selectedMonth }),
                    "?"
                  ] }),
                  /* @__PURE__ */ jsx("p", { children: "Ini akan membuat rencana harian berdasarkan alokasi bulanan setiap pangkalan." }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted rounded-lg", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        id: "overwrite-checkbox",
                        checked: generateOverwrite,
                        onChange: (e) => setGenerateOverwrite(e.target.checked),
                        className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      }
                    ),
                    /* @__PURE__ */ jsx("label", { htmlFor: "overwrite-checkbox", className: "text-sm font-medium cursor-pointer", children: "Timpa data yang sudah ada" })
                  ] }),
                  generateOverwrite ? /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm", children: "⚠️ Data yang sudah ada AKAN DITIMPA. Data lama akan dihapus." }) : /* @__PURE__ */ jsx("p", { className: "text-amber-500 text-sm", children: "ℹ️ Data yang sudah ada TIDAK akan ditimpa." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => setGenerateOverwrite(false), children: "Batal" }),
                /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleAutoGenerate, children: "Generate" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Download", className: "w-4 h-4 mr-2" }),
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
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6", children: [
          /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "w-4 h-4 sm:w-5 sm:h-5 text-blue-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Pangkalan" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.totalPangkalan, delay: 100 }) })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-green-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Target", className: "w-4 h-4 sm:w-5 sm:h-5 text-green-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Alokasi" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.totalAlokasi, delay: 200 }) })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingUp", className: "w-4 h-4 sm:w-5 sm:h-5 text-purple-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Realisasi" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl font-bold text-purple-600", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.totalRealisasi, delay: 300 }) })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-orange-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "w-4 h-4 sm:w-5 sm:h-5 text-orange-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Sisa" }),
              /* @__PURE__ */ jsx("p", { className: `text-lg sm:text-xl font-bold ${summaryStats.sisaAlokasi < 0 ? "text-red-500" : "text-orange-600"}`, children: /* @__PURE__ */ jsx(AnimatedNumber, { value: summaryStats.sisaAlokasi, delay: 400 }) })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: `glass-card col-span-2 lg:col-span-1 ${summaryStats.overAlokasi > 0 ? "border-red-500/50 bg-red-500/5" : summaryStats.nearLimit > 0 ? "border-yellow-500/50 bg-yellow-500/5" : ""}`, children: /* @__PURE__ */ jsx(CardContent, { className: "p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${summaryStats.overAlokasi > 0 ? "bg-red-500/20" : "bg-yellow-500/10"}`, children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: `w-4 h-4 sm:w-5 sm:h-5 ${summaryStats.overAlokasi > 0 ? "text-red-500" : "text-yellow-500"}` }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: summaryStats.overAlokasi > 0 ? /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-red-500", children: [
                "⚠️ ",
                summaryStats.overAlokasi,
                " Over"
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-green-500", children: "✅ Aman" }) })
            ] })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium overflow-hidden", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-border/50 pb-3 sm:pb-4 px-3 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500 animate-pulse" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm sm:text-lg font-semibold", children: "Rekapitulasi" })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "w-fit text-xs", children: [
              rekapData?.data.length || 0,
              " Pangkalan"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-0 overflow-hidden", children: /* @__PURE__ */ jsx(
            "div",
            {
              ref: tableScrollRef,
              className: "overflow-x-auto max-w-full",
              style: { scrollBehavior: "auto", WebkitOverflowScrolling: "touch" },
              children: /* @__PURE__ */ jsxs("table", { className: "w-full text-[10px] sm:text-xs lg:text-sm min-w-[600px] sm:min-w-[800px]", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 sticky top-0 z-20", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsxs("th", { className: "sticky left-0 z-30 bg-muted px-1.5 sm:px-3 py-1.5 sm:py-3 text-left font-medium min-w-[70px] sm:min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", children: [
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "ID Registrasi" }),
                    /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "ID" })
                  ] }),
                  /* @__PURE__ */ jsxs("th", { className: "sticky left-[70px] sm:left-[120px] z-30 bg-muted px-1.5 sm:px-3 py-1.5 sm:py-3 text-left font-medium min-w-[100px] sm:min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", children: [
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Nama Pangkalan" }),
                    /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Pangkalan" })
                  ] }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium min-w-[60px]", children: "Status" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium min-w-[70px]", children: "Alokasi" }),
                  dayHeaders.map((dayInfo) => {
                    const weekClass = dayInfo.isSunday ? "bg-red-100 dark:bg-red-900/30" : "";
                    const todayClass = isCurrentMonth && dayInfo.day === today ? "bg-primary/20 text-primary font-bold" : "";
                    return /* @__PURE__ */ jsxs(
                      "th",
                      {
                        className: `px-2 py-2 text-center font-medium min-w-[45px] ${weekClass} ${todayClass}`,
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "text-xs", children: String(dayInfo.day).padStart(2, "0") }),
                          /* @__PURE__ */ jsx("div", { className: `text-[10px] ${dayInfo.isSunday ? "text-red-500" : "text-muted-foreground"}`, children: dayInfo.dayName })
                        ]
                      },
                      dayInfo.day
                    );
                  }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-green-500/10 min-w-[80px]", children: "Total Normal" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-blue-500/10 min-w-[80px]", children: "Total Fakultatif" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-orange-500/10 min-w-[80px]", children: "Sisa Alokasi" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-3 text-center font-medium bg-purple-500/10 min-w-[80px]", children: "Grand Total" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: dayHeaders.length + 8, className: "text-center py-8", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "w-6 h-6 animate-spin mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Memuat data..." })
                ] }) }) : rekapData?.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: dayHeaders.length + 8, className: "text-center py-8 text-muted-foreground", children: "Tidak ada data" }) }) : (computedRekapData?.data || []).map((row, idx) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/30 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "sticky left-0 z-10 bg-background px-1.5 sm:px-3 py-1.5 sm:py-2 font-mono shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[70px] sm:min-w-[120px]", children: row.id_registrasi }),
                  /* @__PURE__ */ jsx("td", { className: "sticky left-[70px] sm:left-[120px] z-10 bg-background px-1.5 sm:px-3 py-1.5 sm:py-2 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[100px] sm:min-w-[180px] truncate max-w-[100px] sm:max-w-none", children: row.nama_pangkalan }),
                  /* @__PURE__ */ jsx("td", { className: "px-1.5 sm:px-3 py-1.5 sm:py-2 text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-green-500/10 text-green-600 border-green-500/30 text-[9px] sm:text-xs", children: row.status }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-1.5 sm:px-3 py-1.5 sm:py-2 text-center font-medium", children: row.alokasi.toLocaleString() }),
                  dayHeaders.map((dayInfo) => {
                    const value = getEditedValue(row.pangkalan_id, dayInfo.day, row.daily[dayInfo.day] || 0);
                    const isEdited = isCellEdited(row.pangkalan_id, dayInfo.day);
                    const weekClass = dayInfo.isSunday ? "bg-red-50 dark:bg-red-900/20" : "";
                    const todayClass = isCurrentMonth && dayInfo.day === today ? "bg-primary/10" : "";
                    const editedClass = isEdited ? "bg-amber-500/20" : "";
                    return /* @__PURE__ */ jsx(
                      "td",
                      {
                        className: `px-2 py-2 text-center ${weekClass} ${todayClass} ${editedClass}`,
                        children: value === 0 ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/40", children: "-" }) : /* @__PURE__ */ jsx("span", { className: `font-medium ${isEdited ? "text-amber-600" : ""}`, children: value })
                      },
                      dayInfo.day
                    );
                  }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center font-medium bg-green-500/5", children: row.total_normal.toLocaleString() }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center font-medium bg-blue-500/5", children: row.total_fakultatif.toLocaleString() }),
                  /* @__PURE__ */ jsxs("td", { className: `px-3 py-2 text-center font-bold ${row.sisa_alokasi < 0 ? "bg-red-500/20 text-red-600 dark:text-red-400" : row.sisa_alokasi <= row.alokasi * 0.2 && row.alokasi > 0 ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" : "bg-orange-500/5"}`, children: [
                    row.sisa_alokasi < 0 && "⚠️ ",
                    row.sisa_alokasi.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-center font-bold bg-purple-500/5", children: row.grand_total.toLocaleString() })
                ] }, row.pangkalan_id)) }),
                rekapData && rekapData.data.length > 0 && /* @__PURE__ */ jsx("tfoot", { className: "bg-muted/70 font-bold sticky bottom-0 z-20", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("td", { className: "sticky left-0 z-30 bg-muted px-3 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", colSpan: 2, children: "Total" }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3" }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center", children: rekapData.data.reduce((sum, r) => sum + r.alokasi, 0).toLocaleString() }),
                  dayHeaders.map((dayInfo) => {
                    const weekClass = dayInfo.isSunday ? "bg-red-100 dark:bg-red-900/30" : "";
                    const todayClass = isCurrentMonth && dayInfo.day === today ? "bg-primary/20" : "";
                    const total = rekapData.data.reduce((sum, r) => sum + (r.daily[dayInfo.day] || 0), 0);
                    return /* @__PURE__ */ jsx("td", { className: `px-2 py-3 text-center ${weekClass} ${todayClass}`, children: total === 0 ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/40", children: "-" }) : total.toLocaleString() }, dayInfo.day);
                  }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-green-500/10", children: rekapData.data.reduce((sum, r) => sum + r.total_normal, 0).toLocaleString() }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-blue-500/10", children: rekapData.data.reduce((sum, r) => sum + r.total_fakultatif, 0).toLocaleString() }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-orange-500/10", children: rekapData.data.reduce((sum, r) => sum + r.sisa_alokasi, 0).toLocaleString() }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-center bg-purple-500/10", children: rekapData.data.reduce((sum, r) => sum + r.grand_total, 0).toLocaleString() })
                ] }) })
              ] })
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "form", children: /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "border-b border-border/50 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: "Edit Perencanaan" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              Object.keys(editedCells).length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-amber-500/10 text-amber-500 border-amber-500/50", children: [
                Object.keys(editedCells).length,
                " perubahan belum disimpan"
              ] }),
              Object.keys(editedCells).length > 0 && /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: () => setEditedCells({}),
                  disabled: isSaving,
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "w-4 h-4 mr-2" }),
                    "Batal"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: handleSaveChanges,
                  disabled: isSaving || Object.keys(editedCells).length === 0,
                  className: "bg-gradient-to-r from-blue-500 to-cyan-500",
                  children: [
                    isSaving ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "w-4 h-4 mr-2" }),
                    "Simpan Perubahan"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "w-4 h-4" }),
            'Klik pada cell untuk mengedit jumlah perencanaan. Perubahan akan disimpan setelah klik tombol "Simpan Perubahan".'
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: !rekapData || rekapData.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/illustrations/dss-analytics.png",
              alt: "Tidak ada data perencanaan",
              className: "w-32 h-32 object-contain mx-auto mb-4 opacity-80"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: "Tidak ada data" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: 'Gunakan "Generate Otomatis" untuk membuat rencana awal' })
        ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b", children: [
            /* @__PURE__ */ jsx("th", { className: "text-left p-2 sticky left-0 bg-background z-10 min-w-[200px]", children: "Pangkalan" }),
            dayHeaders.map((dayInfo) => /* @__PURE__ */ jsxs(
              "th",
              {
                className: `text-center p-1 min-w-[60px] ${dayInfo.isSunday ? "bg-red-500/10 text-red-500" : ""} ${isCurrentMonth && dayInfo.day === today ? "bg-blue-500/20" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs", children: dayInfo.dayName }),
                  /* @__PURE__ */ jsx("div", { children: dayInfo.day })
                ]
              },
              dayInfo.day
            )),
            /* @__PURE__ */ jsx("th", { className: "text-center p-2 min-w-[70px] bg-blue-500/10 text-blue-600 font-semibold", children: "Total Normal" }),
            /* @__PURE__ */ jsx("th", { className: "text-center p-2 min-w-[70px] bg-amber-500/10 text-amber-600 font-semibold", children: "Total Fakultatif" }),
            /* @__PURE__ */ jsx("th", { className: "text-center p-2 min-w-[70px] bg-green-500/10 text-green-600 font-semibold", children: "Sisa Alokasi" }),
            /* @__PURE__ */ jsx("th", { className: "text-center p-2 min-w-[70px] bg-purple-500/10 text-purple-600 font-semibold", children: "Grand Total" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: (computedRekapData?.data || []).map((row) => /* @__PURE__ */ jsxs("tr", { className: "border-b hover:bg-muted/50", children: [
            /* @__PURE__ */ jsxs("td", { className: "p-2 sticky left-0 bg-background z-10 font-medium", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: row.id_registrasi }),
              /* @__PURE__ */ jsx("div", { children: row.nama_pangkalan })
            ] }),
            dayHeaders.map((dayInfo) => {
              const originalValue = row.daily[dayInfo.day] || 0;
              const currentValue = getEditedValue(row.pangkalan_id, dayInfo.day, originalValue);
              const isEdited = isCellEdited(row.pangkalan_id, dayInfo.day);
              const editedCell = getEditedCell(row.pangkalan_id, dayInfo.day);
              const hasFakultatif = editedCell && editedCell.fakultatif > 0;
              const isSunday = dayInfo.isSunday;
              const displayValue = isEdited && editedCell ? editedCell.fakultatif > 0 ? `${editedCell.normal}+${editedCell.fakultatif}F` : editedCell.normal : currentValue === 0 ? "-" : currentValue;
              return /* @__PURE__ */ jsx(
                "td",
                {
                  className: `p-1 text-center ${isSunday ? "bg-red-500/5" : ""} ${isCurrentMonth && dayInfo.day === today ? "bg-blue-500/10" : ""}`,
                  children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => !isSunday && openEditModal(row.pangkalan_id, row.nama_pangkalan, dayInfo.day, originalValue),
                      disabled: isSunday,
                      className: `min-w-14 h-8 px-1 rounded text-center text-xs transition-all ${hasFakultatif ? "bg-amber-500/20 border border-amber-500 text-amber-700 font-semibold" : isEdited ? "bg-blue-500/20 border border-blue-500 text-blue-700 font-semibold" : "bg-transparent hover:bg-muted border border-transparent"} ${isSunday ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-sm"}`,
                      children: displayValue
                    }
                  )
                },
                dayInfo.day
              );
            }),
            /* @__PURE__ */ jsx("td", { className: "text-center p-2 font-semibold bg-blue-500/5 text-blue-600", children: row.total_normal }),
            /* @__PURE__ */ jsx("td", { className: "text-center p-2 font-semibold bg-amber-500/5 text-amber-600", children: row.total_fakultatif }),
            /* @__PURE__ */ jsx("td", { className: `text-center p-2 font-semibold ${row.sisa_alokasi >= 0 ? "bg-green-500/5 text-green-600" : "bg-red-500/10 text-red-600"}`, children: row.sisa_alokasi }),
            /* @__PURE__ */ jsx("td", { className: "text-center p-2 font-bold bg-purple-500/5 text-purple-600", children: row.grand_total })
          ] }, row.pangkalan_id)) })
        ] }) }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showEditModal, onOpenChange: setShowEditModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Edit", className: "w-5 h-5 text-blue-500" }),
        "Input Perencanaan"
      ] }) }),
      editModalData && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-3 space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Pangkalan" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: editModalData.pangkalanName })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Tanggal" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              editModalData.day,
              " ",
              (/* @__PURE__ */ new Date(selectedMonth + "-01")).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm border-t border-border/50 pt-1 mt-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-green-600", children: [
              editModalData.normal + editModalData.fakultatif,
              " tabung"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "edit-normal", className: "text-sm font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
              "Normal"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "edit-normal",
                type: "number",
                min: "0",
                value: editModalData.normal,
                onChange: (e) => setEditModalData((prev) => prev ? { ...prev, normal: parseInt(e.target.value) || 0 } : null),
                className: "w-full text-lg font-semibold border-blue-200 focus:border-blue-500",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Kuota reguler" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "edit-fakultatif", className: "text-sm font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-amber-500 rounded-full" }),
              "Fakultatif"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "edit-fakultatif",
                type: "number",
                min: "0",
                value: editModalData.fakultatif,
                onChange: (e) => setEditModalData((prev) => prev ? { ...prev, fakultatif: parseInt(e.target.value) || 0 } : null),
                className: "w-full text-lg font-semibold border-amber-200 focus:border-amber-500"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Tambahan ekstra" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "flex gap-2 sm:justify-between", children: [
        /* @__PURE__ */ jsx("div", { children: editModalData && isCellEdited(editModalData.pangkalanId, editModalData.day) && /* @__PURE__ */ jsxs(Button, { variant: "destructive", onClick: handleRemoveEdit, className: "bg-red-500 hover:bg-red-600", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "w-4 h-4 mr-2" }),
          "Hapus Perubahan"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setShowEditModal(false), children: "Batal" }),
          /* @__PURE__ */ jsxs(Button, { onClick: handleModalSave, className: "bg-gradient-to-r from-blue-500 to-cyan-500", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "w-4 h-4 mr-2" }),
            "Simpan"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
const $$Perencanaan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Perencanaan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col dashboard-gradient-bg min-w-0">
        <div class="flex-1 overflow-y-auto overflow-x-hidden">
          <div class="w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 lg:max-w-[calc(100vw-16rem)] lg:mx-auto">
            
            <div class="animate-fadeInUp">
              ${renderComponent($$result4, "PerencanaanPage", PerencanaanPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/perencanaan/PerencanaanPage.tsx", "client:component-export": "default" })}
            </div>
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/perencanaan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/perencanaan.astro";
const $$url = "/perencanaan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Perencanaan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
