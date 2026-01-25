import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C7j8yK_x.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { I as Input, S as SafeIcon, B as Button, d as driversApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { C as Card, a as CardContent } from "../_astro/card.CnUj7wdc.js";
import { T as Tilt3DCard } from "../_astro/Tilt3DCard.DHI-RZXC.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "../_astro/table.OJLE4Veh.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, B as Badge, e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { C as ConfirmationModal } from "../_astro/currency.CHcHKzei.js";
import { toast } from "sonner";
import { L as Label } from "../_astro/label.C1We_4rW.js";
import { T as Textarea } from "../_astro/textarea.F19kpFWl.js";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { renderers } from "../renderers.mjs";
function AddDriverModal({
  open,
  onOpenChange,
  driver,
  onSuccess
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicle_id: "",
    note: ""
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (open) {
      if (driver) {
        setFormData({
          name: driver.name,
          phone: driver.phone || "",
          vehicle_id: driver.vehicle_id || "",
          note: driver.note || ""
        });
      } else {
        setFormData({
          name: "",
          phone: "",
          vehicle_id: "",
          note: ""
        });
      }
      setErrors({});
    }
  }, [driver, open]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nama supir harus diisi";
    } else if (formData.name.length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.phone)) {
      newErrors.phone = "Nomor telepon tidak valid (contoh: 08xx atau +62xx)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (driver) {
        await driversApi.update(driver.id, {
          name: formData.name,
          phone: formData.phone,
          vehicle_id: formData.vehicle_id || null,
          note: formData.note || null
        });
        toast.success("Data supir berhasil diperbarui");
      } else {
        await driversApi.create({
          name: formData.name,
          phone: formData.phone,
          vehicle_id: formData.vehicle_id || null,
          note: formData.note || null
        });
        toast.success("Supir baru berhasil ditambahkan");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save driver:", error);
      toast.error("Gagal menyimpan data supir");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: driver ? "Edit Supir" : "Tambah Supir Baru" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: driver ? "Perbarui informasi supir di bawah ini" : "Isi formulir untuk menambahkan supir baru ke sistem" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-sm font-medium", children: "Nama Supir *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "name",
            placeholder: "Masukkan nama supir",
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value }),
            disabled: isSubmitting,
            className: errors.name ? "border-destructive" : ""
          }
        ),
        errors.name && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-3 w-3" }),
          errors.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "phone", className: "text-sm font-medium", children: "Nomor Telepon *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "phone",
            placeholder: "08xxxxxxxxxx",
            value: formData.phone,
            onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
            disabled: isSubmitting,
            className: errors.phone ? "border-destructive" : ""
          }
        ),
        errors.phone && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-3 w-3" }),
          errors.phone
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "vehicle_id", className: "text-sm font-medium", children: "Plat Kendaraan (Opsional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "vehicle_id",
            placeholder: "Contoh: B 1234 ABC",
            value: formData.vehicle_id,
            onChange: (e) => setFormData({ ...formData, vehicle_id: e.target.value }),
            disabled: isSubmitting
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "note", className: "text-sm font-medium", children: "Catatan (Opsional)" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "note",
            placeholder: "Tambahkan catatan tentang supir ini...",
            value: formData.note,
            onChange: (e) => setFormData({ ...formData, note: e.target.value }),
            disabled: isSubmitting,
            className: "resize-none",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            disabled: isSubmitting,
            className: "flex-1",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2",
            children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }),
              "Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "h-4 w-4" }),
              driver ? "Simpan Perubahan" : "Tambah Supir"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function DriverListPage() {
  const [driverList, setDriverList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [aktivCount, setAktivCount] = useState(0);
  const [busyCount, setBusyCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const sortedDriverList = useMemo(() => {
    if (!sortField) return driverList;
    return [...driverList].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [driverList, sortField, sortDirection]);
  const SortableHeader = ({ field, children, className = "", align = "left" }) => /* @__PURE__ */ jsx(
    TableHead,
    {
      className: `font-semibold text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors select-none ${className}`,
      onClick: () => handleSort(field),
      children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 ${align === "center" ? "justify-center" : "justify-start"}`, children: [
        children,
        sortField === field ? sortDirection === "asc" ? /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronUp", className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronsUpDown", className: "w-4 h-4 text-muted-foreground/50" })
      ] })
    }
  );
  const fetchDrivers = async () => {
    try {
      setIsLoading(true);
      const isActive = statusFilter === "semua" ? void 0 : statusFilter === "aktif";
      const response = await driversApi.getAll(currentPage, 10, searchTerm || void 0, isActive);
      setDriverList(response.data);
      setTotalItems(response.meta.totalAll || response.meta.total);
      setTotalPages(response.meta.totalPages);
      setAktivCount(response.meta.totalActive || 0);
      const busyDrivers = response.data.filter((d) => d.is_busy).length;
      setBusyCount(busyDrivers);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
      toast.error("Gagal memuat data driver");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDrivers();
  }, [currentPage, statusFilter]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchDrivers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const handleStatusToggleClick = (driver) => {
    setSelectedDriver(driver);
    setShowStatusModal(true);
  };
  const handleConfirmStatusToggle = async () => {
    if (!selectedDriver) return;
    try {
      const newStatus = !selectedDriver.is_active;
      await driversApi.update(selectedDriver.id, { is_active: newStatus });
      toast.success(`Driver berhasil ${newStatus ? "diaktifkan" : "dinonaktifkan"}`);
      fetchDrivers();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Gagal mengubah status driver");
    } finally {
      setShowStatusModal(false);
      setSelectedDriver(null);
    }
  };
  const handleDeleteClick = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedDriver) return;
    try {
      await driversApi.delete(selectedDriver.id);
      toast.success("Driver berhasil dihapus");
      fetchDrivers();
    } catch (error) {
      console.error("Failed to delete driver:", error);
      toast.error("Gagal menghapus driver");
    } finally {
      setShowDeleteModal(false);
      setSelectedDriver(null);
    }
  };
  const handleSaveSuccess = () => {
    setShowAddModal(false);
    setEditingDriver(null);
    fetchDrivers();
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Daftar Supir",
          subtitle: "Kelola data driver dan status ketersediaan mereka"
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => {
            setEditingDriver(null);
            setShowAddModal(true);
          },
          className: "w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "mr-2 h-4 w-4" }),
            "Tambah Supir"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-3", children: isLoading ? (
      // Skeleton Cards during loading
      /* @__PURE__ */ jsx(Fragment, { children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { className: "animate-pulse", style: { animationDelay: `${i * 100}ms` }, children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-muted w-10 h-10 animate-shimmer" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "h-3 w-16 bg-muted rounded animate-shimmer" }),
          /* @__PURE__ */ jsx("div", { className: "h-7 w-12 bg-muted rounded animate-shimmer" })
        ] })
      ] }) }) }) }, i)) })
    ) : (
      // Actual Cards
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-primary/10 dark:bg-primary/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Supir" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: totalItems, delay: 100 }) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", style: { animationDelay: "0.1s" }, children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "w-5 h-5 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Aktif" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-emerald-600 dark:text-emerald-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: aktivCount, delay: 200 }) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", style: { animationDelay: "0.2s" }, children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "w-5 h-5 text-orange-600 dark:text-orange-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sedang Mengantar" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-orange-600 dark:text-orange-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: busyCount, delay: 300 }) })
          ] })
        ] }) }) }) })
      ] })
    ) }),
    /* @__PURE__ */ jsx(Card, { className: "glass-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Cari nama atau telepon...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10 bg-transparent border-border focus:border-primary focus:ring-primary/20"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-1 rounded-lg bg-muted/30", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setStatusFilter("semua"),
            className: statusFilter === "semua" ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md" : "bg-transparent hover:bg-muted/50 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "LayoutGrid", className: "w-4 h-4 mr-1.5" }),
              "Semua"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setStatusFilter("aktif"),
            className: statusFilter === "aktif" ? "bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white shadow-md" : "bg-transparent hover:bg-muted/50 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "w-4 h-4 mr-1.5" }),
              "Aktif"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setStatusFilter("nonaktif"),
            className: statusFilter === "nonaktif" ? "bg-gradient-to-r from-rose-600/90 to-rose-500/90 text-white shadow-md" : "bg-transparent hover:bg-muted/50 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "XCircle", className: "w-4 h-4 mr-1.5" }),
              "Nonaktif"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "glass-card overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Table", className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Data Supir" }),
          /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-red-500/10 text-red-600", children: [
            driverList.length,
            " data"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Total: ",
          totalItems,
          " supir"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-red-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Memuat data supir..." })
      ] }) }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-transparent border-border focus:border-primary", children: [
          /* @__PURE__ */ jsx(SortableHeader, { field: "code", className: "w-24", children: "Kode" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "name", children: "Nama" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "phone", align: "center", children: "Telepon" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "vehicle_id", align: "center", children: "Kendaraan" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "note", children: "Catatan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-semibold text-muted-foreground text-center", children: "Pengiriman" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "is_active", align: "center", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center font-semibold text-slate-700", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sortedDriverList.length > 0 ? sortedDriverList.map((driver) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm text-primary", children: driver.code || "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-foreground", children: driver.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center text-foreground", children: driver.phone || "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center text-foreground", children: driver.vehicle_id || "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "max-w-xs truncate text-foreground/80", children: driver.note || "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: driver.is_busy ? /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/15 to-amber-500/15 border border-orange-200/50 dark:border-orange-700/50", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Truck", className: "h-3.5 w-3.5 text-orange-500 animate-bounce", style: { animationDuration: "1.5s" } }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-orange-600 dark:text-orange-400", children: driver.active_order?.code || "Mengantar" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-700/50", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "CircleCheck", className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-emerald-600 dark:text-emerald-400", children: "Tersedia" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            Badge,
            {
              className: driver.is_active ? "bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white shadow-sm" : "bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/50 text-white shadow-sm",
              children: driver.is_active ? "✓ Aktif" : "Nonaktif"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(SafeIcon, { name: "MoreVertical", className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onClick: () => {
                    setEditingDriver(driver);
                    setShowAddModal(true);
                  },
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Edit", className: "mr-2 h-4 w-4" }),
                    "Edit"
                  ]
                }
              ),
              driver.is_active ? /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  className: "text-orange-600",
                  onClick: () => handleStatusToggleClick(driver),
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Ban", className: "mr-2 h-4 w-4" }),
                    "Nonaktifkan"
                  ]
                }
              ) : /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  className: "text-green-600",
                  onClick: () => handleStatusToggleClick(driver),
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "mr-2 h-4 w-4" }),
                    "Aktifkan"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  className: "text-destructive",
                  onClick: () => handleDeleteClick(driver),
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "mr-2 h-4 w-4" }),
                    "Hapus"
                  ]
                }
              )
            ] })
          ] }) })
        ] }, driver.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/illustrations/delivery-truck.png",
              alt: "Tidak ada supir",
              className: "w-32 h-32 object-contain opacity-80"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium", children: "Tidak ada supir ditemukan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah kata kunci pencarian atau filter" })
        ] }) }) }) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-t border-border/50", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Halaman ",
          currentPage,
          " dari ",
          totalPages,
          " • Total ",
          totalItems,
          " supir"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: currentPage === 1,
              onClick: () => setCurrentPage((p) => p - 1),
              className: "hover:bg-red-50",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4 mr-1" }),
                "Prev"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return /* @__PURE__ */ jsx(
              Button,
              {
                variant: currentPage === pageNum ? "default" : "ghost",
                size: "sm",
                onClick: () => setCurrentPage(pageNum),
                className: currentPage === pageNum ? "bg-red-500 hover:bg-red-600" : "",
                children: pageNum
              },
              pageNum
            );
          }) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: currentPage === totalPages,
              onClick: () => setCurrentPage((p) => p + 1),
              className: "hover:bg-red-50",
              children: [
                "Next",
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 ml-1" })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      AddDriverModal,
      {
        open: showAddModal,
        onOpenChange: setShowAddModal,
        driver: editingDriver,
        onSuccess: handleSaveSuccess
      }
    ),
    selectedDriver && showStatusModal && /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        open: showStatusModal,
        onOpenChange: setShowStatusModal,
        title: selectedDriver.is_active ? "Nonaktifkan Supir" : "Aktifkan Supir",
        description: selectedDriver.is_active ? `Apakah Anda yakin ingin menonaktifkan "${selectedDriver.name}"?` : `Apakah Anda yakin ingin mengaktifkan "${selectedDriver.name}"?`,
        confirmText: selectedDriver.is_active ? "Nonaktifkan" : "Aktifkan",
        cancelText: "Batal",
        icon: selectedDriver.is_active ? "AlertTriangle" : "CheckCircle",
        isDangerous: selectedDriver.is_active,
        onConfirm: handleConfirmStatusToggle
      }
    ),
    selectedDriver && showDeleteModal && /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        open: showDeleteModal,
        onOpenChange: setShowDeleteModal,
        title: "Hapus Supir",
        description: `Apakah Anda yakin ingin menghapus "${selectedDriver.name}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Hapus",
        cancelText: "Batal",
        icon: "Trash2",
        isDangerous: true,
        onConfirm: handleConfirmDelete
      }
    )
  ] });
}
const $$DaftarDriver = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Daftar Supir - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "DriverListPage", DriverListPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/daftar-driver/DriverListPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/daftar-driver.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/daftar-driver.astro";
const $$url = "/daftar-driver.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DaftarDriver,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
