import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DMB591cw.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.B0qA0Ni6.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DJv7CO6O.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { C as Card, a as CardContent, b as CardHeader, d as CardTitle } from "../_astro/card.CnUj7wdc.js";
import { B as Button, S as SafeIcon, I as Input, g as penerimaanApi, l as lpgProductsApi, k as companyProfileApi } from "../_astro/AuthGuard.BLl0uVB7.js";
import { L as Label } from "../_astro/label.C1We_4rW.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, B as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.igvMWLOj.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "../_astro/alert-dialog.CFdgBlIH.js";
import { toast } from "sonner";
import { c as createFooterRow, a as exportToExcel } from "../_astro/export-utils.DDLmg-WW.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { p as pertaminaLogo } from "../_astro/logo-pertamina.CdNcSRGD.js";
import { g as getAgenProfileFromAPI } from "../_astro/pertamina-export.IMbMNiWv.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { renderers } from "../renderers.mjs";
const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Cannot get canvas context"));
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
};
function PenerimaanPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page2, setPage] = useState(1);
  const [sortField, setSortField] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState({ so_exists: false, lo_exists: false });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const getLocalDateString = () => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };
  const [headerData, setHeaderData] = useState({
    no_so: "",
    // Sales Order - dari Agen (shared)
    no_lo: "",
    // Loading Order - dari SPBE (shared)
    tanggal: getLocalDateString()
  });
  const [items, setItems] = useState([
    { id: crypto.randomUUID(), lpg_product_id: "", qty_pcs: "" }
  ]);
  const totals = useMemo(() => {
    let totalPcs = 0;
    let totalKg = 0;
    items.forEach((item) => {
      if (item.lpg_product_id && item.qty_pcs) {
        const product = products.find((p) => p.id === item.lpg_product_id);
        const pcs = parseInt(item.qty_pcs) || 0;
        totalPcs += pcs;
        totalKg += product ? pcs * Number(product.size_kg) : 0;
      }
    });
    return { totalPcs, totalKg };
  }, [items, products]);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await penerimaanApi.getAll({ bulan: selectedMonth, page: page2, limit: 25 });
      setData(result);
    } catch (error) {
      toast.error("Gagal memuat data penerimaan");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const prods = await lpgProductsApi.getAll();
      setProducts(prods);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedMonth, page2]);
  useEffect(() => {
    if (showAddModal && products.length === 0) {
      fetchProducts();
    }
  }, [showAddModal]);
  useEffect(() => {
    const checkDuplicates = async () => {
      if (!showAddModal) return;
      const shouldCheckLo = headerData.no_lo.length === 10;
      if (!shouldCheckLo) {
        setDuplicateWarning({ so_exists: false, lo_exists: false });
        return;
      }
      try {
        const result = await penerimaanApi.checkDuplicate(
          void 0,
          // SO tidak perlu dicek
          headerData.no_lo
        );
        setDuplicateWarning({
          so_exists: false,
          // Tidak cek SO
          lo_exists: result.lo_exists
        });
      } catch (error) {
        console.error("Failed to check duplicate:", error);
      }
    };
    const timer = setTimeout(checkDuplicates, 300);
    return () => clearTimeout(timer);
  }, [headerData.no_lo, showAddModal]);
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
  const sortedData = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "tanggal") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      if (sortField === "qty_pcs" || sortField === "qty_kg") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data?.data, sortField, sortOrder]);
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const SortIcon = ({ field }) => /* @__PURE__ */ jsx("span", { className: "ml-1 inline-flex", children: sortField === field ? sortOrder === "asc" ? /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronUp", className: "w-4 h-4" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "w-4 h-4" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronsUpDown", className: "w-4 h-4 opacity-30" }) });
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const resetForm = () => {
    setHeaderData({
      no_so: "",
      no_lo: "",
      tanggal: getLocalDateString()
    });
    setItems([{ id: crypto.randomUUID(), lpg_product_id: "", qty_pcs: "" }]);
  };
  const handleDelete = async () => {
    if (!deleteConfirm.item) return;
    setIsDeleting(true);
    try {
      await penerimaanApi.delete(deleteConfirm.item.id);
      toast.success(`Penerimaan berhasil dibatalkan. Stok telah dikurangi ${deleteConfirm.item.qty_pcs} tabung.`);
      setDeleteConfirm({ show: false, item: null });
      fetchData();
    } catch (error) {
      toast.error(error.message || "Gagal membatalkan penerimaan");
    } finally {
      setIsDeleting(false);
    }
  };
  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), lpg_product_id: "", qty_pcs: "" }]);
  };
  const removeItem = (id) => {
    if (items.length === 1) {
      toast.error("Minimal harus ada 1 item");
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };
  const updateItem = (id, field, value) => {
    setItems(items.map(
      (item) => item.id === id ? { ...item, [field]: value } : item
    ));
  };
  const getAvailableProducts = (currentItemId) => {
    const selectedIds = items.filter((item) => item.id !== currentItemId && item.lpg_product_id).map((item) => item.lpg_product_id);
    return products.filter((p) => !selectedIds.includes(p.id));
  };
  const handleSubmit = async () => {
    if (!headerData.no_so || headerData.no_so.length !== 10) {
      toast.error("No. SO harus 10 digit");
      return;
    }
    if (!headerData.no_lo || headerData.no_lo.length !== 10) {
      toast.error("No. LO harus 10 digit");
      return;
    }
    const validItems = items.filter((item) => item.lpg_product_id && parseInt(item.qty_pcs) > 0);
    if (validItems.length === 0) {
      toast.error("Tambahkan minimal 1 item dengan jumlah valid");
      return;
    }
    setIsSaving(true);
    try {
      let sumberName = "SPBE";
      try {
        const profile = await companyProfileApi.get();
        sumberName = profile.spbe_supplier_name || "SPBE";
      } catch {
      }
      for (const item of validItems) {
        const product = products.find((p) => p.id === item.lpg_product_id);
        const qtyPcs = parseInt(item.qty_pcs);
        const qtyKg = product ? qtyPcs * Number(product.size_kg) : 0;
        const sizeKg = product ? Number(product.size_kg) : 3;
        const sizeLabel = sizeKg < 1 ? `${Math.round(sizeKg * 1e3)}GR` : `${sizeKg}KG`;
        const namaMaterial = `REFILL/ISI LPG @${sizeLabel} (NET)`;
        await penerimaanApi.create({
          no_so: headerData.no_so,
          no_lo: headerData.no_lo,
          nama_material: namaMaterial,
          qty_pcs: qtyPcs,
          qty_kg: qtyKg,
          tanggal: headerData.tanggal,
          sumber: sumberName,
          lpg_product_id: item.lpg_product_id
        });
      }
      toast.success(`${validItems.length} penerimaan berhasil dicatat (Total: ${totals.totalPcs} tabung)`);
      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan penerimaan");
    } finally {
      setIsSaving(false);
    }
  };
  const exportColumns = [
    { header: "Tanggal", key: "tanggal_formatted", width: 12, align: "center" },
    { header: "No SO", key: "no_so", width: 15, align: "left" },
    { header: "No LO", key: "no_lo", width: 15, align: "left" },
    { header: "Nama Material", key: "nama_material", width: 20, align: "left" },
    { header: "Qty Tabung", key: "qty_pcs", width: 12, align: "center" },
    { header: "Qty Kg", key: "qty_kg", width: 12, align: "center" }
  ];
  const handleDownloadPDF = async () => {
    if (!data || data.data.length === 0) {
      toast.error("Tidak ada data untuk di-download");
      return;
    }
    try {
      toast.loading("Generating PDF...", { id: "pdf-export" });
      const doc = new jsPDF({ orientation: "portrait" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const agenProfile = await getAgenProfileFromAPI();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PT. Pertamina (Persero)", margin, 15);
      doc.setFontSize(8);
      doc.text("Jl.Medan Merdeka Timur No. 1A Jakarta 10110", margin, 20);
      doc.text("Telp: 021 3815111 FAX: 021 3633585", margin, 25);
      try {
        const logoData = pertaminaLogo;
        const logoUrl = typeof logoData === "string" ? logoData : logoData.src;
        const logoBase64 = await loadImageAsBase64(logoUrl);
        doc.addImage(logoBase64, "PNG", pageWidth - 55, 10, 40, 10);
      } catch (logoError) {
        console.warn("[PDF Export] Could not load Pertamina logo:", logoError);
      }
      const [year, month] = selectedMonth.split("-");
      const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("id-ID", { month: "long" }).toUpperCase();
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("REKAPITULASI SURAT PENGANTAR PENGIRIMAN PRODUK", pageWidth / 2, 40, { align: "center" });
      doc.text(`PSO PERIODE BULAN ${monthName} ${year}`, pageWidth / 2, 46, { align: "center" });
      let yPos = 58;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const agenFields = [
        { label: "SP(P)BE", value: "-" },
        { label: "Kode Plant", value: "-" },
        { label: "Nama Agen", value: agenProfile.nama_agen },
        { label: "Alamat Agen", value: agenProfile.alamat_agen },
        { label: "Email", value: agenProfile.email },
        { label: "No. Sold To", value: agenProfile.no_siid },
        { label: "Wilayah", value: agenProfile.wilayah }
      ];
      agenFields.forEach((field) => {
        doc.text(`${field.label}`, margin, yPos);
        doc.text(`:`, margin + 25, yPos);
        doc.text(field.value, margin + 28, yPos);
        yPos += 4;
      });
      yPos += 5;
      const headers = ["NO", "Tanggal", "No SO", "No LO", "Nama Material", "Qty Pcs", "Qty Kg"];
      const totalPcs = sortedData.reduce((sum, item) => sum + item.qty_pcs, 0);
      const totalKg = sortedData.reduce((sum, item) => sum + Number(item.qty_kg), 0);
      const tableData = sortedData.map((item, index) => [
        String(index + 1),
        formatDate(item.tanggal),
        item.no_so,
        item.no_lo,
        item.nama_material,
        item.qty_pcs.toLocaleString(),
        Number(item.qty_kg).toLocaleString()
      ]);
      tableData.push(["Total", "", "", "", "", totalPcs.toLocaleString(), totalKg.toLocaleString()]);
      autoTable(doc, {
        startY: yPos,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 2,
          halign: "center",
          lineColor: [0, 0, 0],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          lineColor: [0, 0, 0],
          lineWidth: 0.2
        },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 22 },
          4: { halign: "left", cellWidth: 45 },
          5: { cellWidth: 18 },
          6: { cellWidth: 18 }
        },
        alternateRowStyles: { fillColor: [255, 255, 255] }
      });
      const finalY = doc.lastAutoTable?.finalY || yPos + 50;
      const signY = finalY + 15;
      if (signY + 50 > pageHeight) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos = signY;
      }
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const col1X = margin;
      const col2X = pageWidth / 2 - 20;
      const col3X = pageWidth - 60;
      doc.text("Pengirim", col1X, yPos);
      doc.text("SP(P)BE :", col1X, yPos + 40);
      doc.text("Nama :", col1X, yPos + 46);
      doc.text("Jabatan :", col1X, yPos + 52);
      doc.text("Mengetahui", col2X, yPos);
      doc.text("PT.Pertamina(Persero)", col2X, yPos + 6);
      doc.text("Nama :", col2X, yPos + 46);
      doc.text("Jabatan :", col2X, yPos + 52);
      doc.text("Penerima", col3X, yPos);
      doc.text("Agen :", col3X, yPos + 40);
      doc.text("Nama :", col3X, yPos + 46);
      doc.text("Jabatan :", col3X, yPos + 52);
      doc.save(`Laporan_Penerimaan_${selectedMonth}.pdf`);
      toast.success("PDF berhasil di-download!", { id: "pdf-export" });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Gagal export PDF", { id: "pdf-export" });
    }
  };
  const handleDownloadExcel = () => {
    if (!data || data.data.length === 0) {
      toast.error("Tidak ada data untuk di-download");
      return;
    }
    try {
      toast.loading("Generating Excel...", { id: "excel-export" });
      const exportData = sortedData.map((item) => ({
        ...item,
        tanggal_formatted: formatDate(item.tanggal),
        qty_pcs: item.qty_pcs,
        qty_kg: Number(item.qty_kg)
      }));
      const totalPcs = sortedData.reduce((sum, item) => sum + item.qty_pcs, 0);
      const totalKg = sortedData.reduce((sum, item) => sum + Number(item.qty_kg), 0);
      const summary = [
        { label: "Total Entries", value: data.data.length },
        { label: "Total Tabung", value: totalPcs },
        { label: "Total Kg", value: totalKg }
      ];
      const footerRow = createFooterRow("TOTAL", {
        qty_pcs: totalPcs,
        qty_kg: totalKg
      }, "tanggal_formatted");
      const [year, month] = selectedMonth.split("-");
      const monthLabel = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      exportToExcel(exportData, exportColumns, summary, {
        title: "Laporan Penerimaan LPG",
        period: monthLabel,
        filename: `Laporan_Penerimaan_${selectedMonth}`
      }, [footerRow]);
      toast.success("Excel berhasil di-download!", { id: "excel-export" });
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Gagal export Excel", { id: "excel-export" });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Penerimaan",
        subtitle: "Catat dan kelola penerimaan stok LPG dari SPBE"
      }
    ),
    /* @__PURE__ */ jsx(Card, { className: "glass-card mb-4", children: /* @__PURE__ */ jsx(CardContent, { className: "p-3 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsxs(Select, { value: selectedMonth, onValueChange: setSelectedMonth, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full lg:w-48 h-10 sm:h-9", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsx(SelectContent, { children: monthOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: fetchData, disabled: isLoading, className: "h-10 sm:h-9", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "RefreshCw", className: `w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}` }),
          /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm", children: "Refresh" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { onClick: () => setShowAddModal(true), className: "h-10 gap-1 bg-gradient-to-r from-primary to-primary/80 text-xs sm:text-sm", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Tambah Penerimaan" }),
          /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Tambah" })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "h-10 text-xs sm:text-sm", children: [
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
    /* @__PURE__ */ jsxs(Card, { className: "chart-card-premium overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-border/50 pb-3 sm:pb-4 px-3 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-purple-500 animate-pulse" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-sm sm:text-lg font-semibold", children: "Rekapitulasi Penerimaan" }),
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "ml-auto text-xs", children: [
          data?.meta.total || 0,
          " Entries"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-0 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto max-w-full", style: { WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsxs("table", { className: "w-full text-[10px] sm:text-xs lg:text-sm min-w-[500px] sm:min-w-[700px]", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors", onClick: () => handleSort("tanggal"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              "Tanggal",
              /* @__PURE__ */ jsx(SortIcon, { field: "tanggal" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors", onClick: () => handleSort("no_so"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              "No SO",
              /* @__PURE__ */ jsx(SortIcon, { field: "no_so" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors", onClick: () => handleSort("no_lo"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              "No LO",
              /* @__PURE__ */ jsx(SortIcon, { field: "no_lo" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors", onClick: () => handleSort("nama_material"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              "Nama Material",
              /* @__PURE__ */ jsx(SortIcon, { field: "nama_material" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center font-medium cursor-pointer hover:bg-muted/80 transition-colors", onClick: () => handleSort("qty_pcs"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center", children: [
              "Qty Tabung",
              /* @__PURE__ */ jsx(SortIcon, { field: "qty_pcs" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center font-medium cursor-pointer hover:bg-muted/80 transition-colors", onClick: () => handleSort("qty_kg"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center", children: [
              "Qty Kg",
              /* @__PURE__ */ jsx(SortIcon, { field: "qty_kg" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center font-medium", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 7, className: "text-center py-8", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "w-6 h-6 animate-spin mx-auto mb-2" }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Memuat data..." })
          ] }) }) : data?.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "text-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/images/illustrations/warehouse-lpg.png",
                alt: "Tidak ada data",
                className: "w-32 h-32 object-contain opacity-80"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium", children: "Tidak ada data penerimaan" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Belum ada penerimaan untuk bulan ini" })
          ] }) }) }) : sortedData.map((item) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: formatDate(item.tanggal) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs", children: item.no_so }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs", children: item.no_lo }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-medium", children: item.nama_material }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center font-bold", children: item.qty_pcs.toLocaleString() }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center text-muted-foreground", children: Number(item.qty_kg).toLocaleString() }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => setDeleteConfirm({ show: true, item }),
                title: "Batalkan penerimaan",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4" })
              }
            ) })
          ] }, item.id)) })
        ] }) }),
        data && data.meta.totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border/50", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "Halaman ",
            page2,
            " dari ",
            data.meta.totalPages
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPage((p) => Math.max(1, p - 1)),
                disabled: page2 === 1,
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm px-2", children: [
              page2,
              " / ",
              data.meta.totalPages
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPage((p) => Math.min(data.meta.totalPages, p + 1)),
                disabled: page2 === data.meta.totalPages,
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "w-4 h-4" })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showAddModal, onOpenChange: setShowAddModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "PackagePlus", className: "h-5 w-5 text-primary" }),
          "Tambah Penerimaan LPG"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Catat penerimaan LPG dari SPBE. Bisa tambah beberapa produk sekaligus dengan SO/LO yang sama." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-muted/50 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-4 w-4" }),
            "Dokumen Penerimaan"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "no_so", className: "text-xs font-semibold", children: [
                "No. SO (10 digit) ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "no_so",
                  value: headerData.no_so,
                  onChange: (e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setHeaderData({ ...headerData, no_so: val });
                  },
                  maxLength: 10,
                  className: `h-10 font-mono tracking-wider ${headerData.no_so && headerData.no_so.length === 10 ? "border-green-500" : ""}`
                }
              ),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                headerData.no_so.length,
                "/10 digit"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "no_lo", className: "text-xs font-semibold", children: [
                "No. LO (10 digit) ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "no_lo",
                  value: headerData.no_lo,
                  onChange: (e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setHeaderData({ ...headerData, no_lo: val });
                  },
                  maxLength: 10,
                  className: `h-10 font-mono tracking-wider ${headerData.no_lo && headerData.no_lo.length === 10 ? "border-green-500" : ""}`
                }
              ),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                headerData.no_lo.length,
                "/10 digit"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "tanggal", className: "text-xs font-semibold", children: [
                "Tanggal ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "tanggal",
                  type: "date",
                  value: headerData.tanggal,
                  onChange: (e) => setHeaderData({ ...headerData, tanggal: e.target.value }),
                  className: "h-10"
                }
              )
            ] })
          ] }),
          duplicateWarning.lo_exists && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-5 w-5 text-amber-600 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-amber-700 dark:text-amber-400", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Nomor DO sudah pernah dicatat!" }),
              /* @__PURE__ */ jsxs("p", { children: [
                "No. LO ",
                /* @__PURE__ */ jsx("span", { className: "font-mono font-bold", children: headerData.no_lo }),
                " sudah ada di database"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs opacity-75", children: "Pastikan nomor sudah benar sebelum menyimpan." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Daftar Produk" }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: addItem,
                disabled: items.length >= products.length,
                className: "gap-1",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-3 w-3" }),
                  "Tambah Produk"
                ]
              }
            )
          ] }),
          items.map((item, index) => {
            const product = products.find((p) => p.id === item.lpg_product_id);
            const qtyPcs = parseInt(item.qty_pcs) || 0;
            const qtyKg = product ? qtyPcs * Number(product.size_kg) : 0;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-3 p-3 rounded-xl border bg-card",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-muted-foreground w-6", children: [
                    index + 1,
                    "."
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-[180px]", children: /* @__PURE__ */ jsxs(
                    Select,
                    {
                      value: item.lpg_product_id,
                      onValueChange: (v) => updateItem(item.id, "lpg_product_id", v),
                      children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-10", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih produk" }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: getAvailableProducts(item.id).map((p) => /* @__PURE__ */ jsxs(SelectItem, { value: p.id, children: [
                          p.name,
                          " (",
                          p.size_kg,
                          " kg)"
                        ] }, p.id)) })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-32", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        min: "1",
                        value: item.qty_pcs,
                        onChange: (e) => updateItem(item.id, "qty_pcs", e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter" && !isSaving && headerData.no_so && headerData.no_lo && totals.totalPcs > 0) {
                            e.preventDefault();
                            handleSubmit();
                          }
                        },
                        placeholder: "0",
                        className: "h-10 text-center font-bold"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "tbg" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "w-24 text-right", children: qtyKg > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-green-600", children: [
                    qtyKg,
                    " kg"
                  ] }) }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      onClick: () => removeItem(item.id),
                      className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4" })
                    }
                  )
                ]
              },
              item.id
            );
          })
        ] }),
        totals.totalPcs > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-5 w-5 text-green-600" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-green-700 dark:text-green-400", children: "Total Penerimaan" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-700 dark:text-green-400", children: [
              totals.totalPcs.toLocaleString(),
              " tabung"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-green-600", children: [
              totals.totalKg.toLocaleString(),
              " kg"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
          setShowAddModal(false);
          resetForm();
        }, children: "Batal" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleSubmit,
            disabled: isSaving || !headerData.no_so || !headerData.no_lo || totals.totalPcs === 0,
            className: "gap-2 bg-gradient-to-r from-primary to-primary/80",
            children: [
              isSaving ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4" }),
              "Simpan ",
              items.filter((i) => i.lpg_product_id && i.qty_pcs).length > 1 ? `(${items.filter((i) => i.lpg_product_id && i.qty_pcs).length} item)` : ""
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteConfirm.show, onOpenChange: (open) => !open && setDeleteConfirm({ show: false, item: null }), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-5 w-5 text-destructive" }),
          "Batalkan Penerimaan?"
        ] }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { children: "Anda akan membatalkan penerimaan berikut:" }),
          deleteConfirm.item && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-muted rounded-lg space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "No. SO:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-mono", children: deleteConfirm.item.no_so })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "No. LO:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-mono", children: deleteConfirm.item.no_lo })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Material:" }),
              " ",
              deleteConfirm.item.nama_material
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Jumlah:" }),
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-red-600 font-semibold", children: [
                deleteConfirm.item.qty_pcs,
                " tabung"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-destructive font-medium", children: [
            "⚠️ Stok akan otomatis dikurangi ",
            deleteConfirm.item?.qty_pcs || 0,
            " tabung. Aksi ini tidak dapat dibatalkan!"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: isDeleting, children: "Batal" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: isDeleting,
            className: "bg-destructive hover:bg-destructive/90",
            children: isDeleting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 mr-2 animate-spin" }),
              "Menghapus..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4 mr-2" }),
              "Ya, Batalkan"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
const $$Penerimaan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Penerimaan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col dashboard-gradient-bg">
        <div class="flex-1 overflow-auto">
          <div class="w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 lg:max-w-[calc(100vw-16rem)] lg:mx-auto">
            
            <div class="animate-fadeInUp">
              ${renderComponent($$result4, "PenerimaanPage", PenerimaanPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/penerimaan/PenerimaanPage.tsx", "client:component-export": "default" })}
            </div>
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/penerimaan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/penerimaan.astro";
const $$url = "/penerimaan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Penerimaan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
