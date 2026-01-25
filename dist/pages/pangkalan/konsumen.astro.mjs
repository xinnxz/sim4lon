import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.C63pe5Ia.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D7Nub16D.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "../../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, I as Input, B as Button, w as consumersApi, q as consumerOrdersApi } from "../../_astro/AuthGuard.71S_I7hh.js";
import { m as Sheet, n as SheetContent, B as Badge, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { L as Label } from "../../_astro/label.C1We_4rW.js";
import { T as Textarea } from "../../_astro/textarea.F19kpFWl.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../../_astro/select.B8lpUjZQ.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "../../_astro/alert-dialog.DUcjkEK3.js";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
const LPG_IMAGES = {
  "kg3": "/images/products/lpg-3kg.png",
  "3kg": "/images/products/lpg-3kg.png",
  "kg5": "/images/products/lpg-5kg.png",
  "5kg": "/images/products/lpg-5kg.png",
  "kg12": "/images/products/lpg-12kg.png",
  "12kg": "/images/products/lpg-12kg.png",
  "kg50": "/images/products/lpg-50kg.png",
  "50kg": "/images/products/lpg-50kg.png",
  "bright_gas": "/images/products/bright-gas.png",
  "brightgas": "/images/products/bright-gas.png"
};
const getLpgImage = (lpgType) => {
  const normalized = lpgType?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return LPG_IMAGES[normalized] || LPG_IMAGES[lpgType?.toLowerCase()] || "/images/products/lpg-3kg.png";
};
function KonsumenListPage() {
  const [consumers, setConsumers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page2, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConsumer, setEditingConsumer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    kk: "",
    consumer_type: "RUMAH_TANGGA",
    phone: "",
    address: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmConsumer, setDeleteConfirmConsumer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    rumahTangga: 0,
    warung: 0,
    withNik: 0
  });
  const [historyConsumer, setHistoryConsumer] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);
  const [historyStats, setHistoryStats] = useState({ totalQty: 0, totalAmount: 0, totalTransactions: 0 });
  const [historyPage, setHistoryPage] = useState(1);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const HISTORY_PAGE_SIZE = 20;
  const scrollPositionRef = useRef(0);
  const handleDialogOpenChange = (open) => {
    {
      scrollPositionRef.current = window.scrollY;
    }
    setIsDialogOpen(open);
  };
  const fetchConsumers = async (silentRefresh = false) => {
    const scrollPosition = window.scrollY;
    try {
      if (!silentRefresh) {
        setIsLoading(true);
      }
      const [response, statsData] = await Promise.all([
        consumersApi.getAll(page2, 10, search || void 0),
        consumersApi.getStats()
      ]);
      let filtered = response.data;
      if (typeFilter !== "all") {
        filtered = response.data.filter((c) => c.consumer_type === typeFilter);
      }
      setConsumers(filtered);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
      setStats(statsData);
      if (silentRefresh) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      }
    } catch (error) {
      console.error("Failed to fetch consumers:", error);
      toast.error("Gagal memuat data konsumen");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchConsumers();
  }, [page2, search, typeFilter]);
  const handleOpenDialog = (consumer) => {
    if (consumer) {
      setEditingConsumer(consumer);
      setFormData({
        name: consumer.name,
        nik: consumer.nik || "",
        kk: consumer.kk || "",
        consumer_type: consumer.consumer_type || "RUMAH_TANGGA",
        phone: consumer.phone || "",
        address: consumer.address || "",
        note: consumer.note || ""
      });
    } else {
      setEditingConsumer(null);
      setFormData({
        name: "",
        nik: "",
        kk: "",
        consumer_type: "RUMAH_TANGGA",
        phone: "",
        address: "",
        note: ""
      });
    }
    handleDialogOpenChange(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Nama konsumen wajib diisi");
      return;
    }
    if (!formData.nik) {
      toast.error("NIK wajib diisi");
      return;
    }
    if (!formData.kk) {
      toast.error("Nomor KK wajib diisi");
      return;
    }
    if (formData.nik && formData.nik.length !== 16) {
      toast.error("NIK harus 16 digit");
      return;
    }
    if (formData.kk && formData.kk.length !== 16) {
      toast.error("Nomor KK harus 16 digit");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        nik: formData.nik || void 0,
        kk: formData.kk || void 0,
        consumer_type: formData.consumer_type,
        phone: formData.phone || void 0,
        address: formData.address || void 0,
        note: formData.note || void 0
      };
      if (editingConsumer) {
        await consumersApi.update(editingConsumer.id, payload);
        toast.success("Konsumen berhasil diperbarui");
      } else {
        await consumersApi.create(payload);
        toast.success("Konsumen berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      fetchConsumers(true);
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan konsumen");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!deleteConfirmConsumer) return;
    try {
      setIsDeleting(true);
      await consumersApi.delete(deleteConfirmConsumer.id);
      toast.success("Konsumen berhasil dihapus", { duration: 4e3 });
      setDeleteConfirmConsumer(null);
      fetchConsumers(true);
    } catch (error) {
      toast.error(error.message || "Gagal menghapus konsumen", { duration: 5e3 });
    } finally {
      setIsDeleting(false);
    }
  };
  const fetchConsumerHistory = async (consumer) => {
    setHistoryConsumer(consumer);
    setHistoryLoading(true);
    setHistoryData([]);
    setHistoryPage(1);
    setHistoryStats({ totalQty: 0, totalAmount: 0, totalTransactions: 0 });
    try {
      const response = await consumerOrdersApi.getAll(1, HISTORY_PAGE_SIZE, { consumerId: consumer.id });
      const orders = response.data || [];
      const meta = response.meta;
      setHistoryData(orders);
      setHistoryHasMore(meta.page < meta.totalPages);
      setHistoryStats((prev) => ({ ...prev, totalTransactions: meta.total }));
      const totals = orders.reduce((acc, order) => ({
        totalQty: acc.totalQty + order.qty,
        totalAmount: acc.totalAmount + Number(order.total_amount),
        totalTransactions: meta.total
        // Use server's total count
      }), { totalQty: 0, totalAmount: 0, totalTransactions: meta.total });
      if (meta.totalPages > 1) {
        const allPagesPromises = [];
        for (let p = 2; p <= meta.totalPages; p++) {
          allPagesPromises.push(consumerOrdersApi.getAll(p, HISTORY_PAGE_SIZE, { consumerId: consumer.id }));
        }
        const allPagesResults = await Promise.all(allPagesPromises);
        const allOrders = [...orders];
        allPagesResults.forEach((res) => {
          allOrders.push(...res.data || []);
        });
        const completeTotals = allOrders.reduce((acc, order) => ({
          totalQty: acc.totalQty + order.qty,
          totalAmount: acc.totalAmount + Number(order.total_amount),
          totalTransactions: meta.total
        }), { totalQty: 0, totalAmount: 0, totalTransactions: meta.total });
        setHistoryStats(completeTotals);
      } else {
        setHistoryStats(totals);
      }
    } catch (error) {
      toast.error("Gagal memuat riwayat pembelian");
      setHistoryConsumer(null);
    } finally {
      setHistoryLoading(false);
    }
  };
  const loadMoreHistory = async () => {
    if (!historyConsumer || historyLoadingMore || !historyHasMore) return;
    setHistoryLoadingMore(true);
    const nextPage = historyPage + 1;
    try {
      const response = await consumerOrdersApi.getAll(nextPage, HISTORY_PAGE_SIZE, { consumerId: historyConsumer.id });
      const newOrders = response.data || [];
      const meta = response.meta;
      setHistoryData((prev) => [...prev, ...newOrders]);
      setHistoryPage(nextPage);
      setHistoryHasMore(meta.page < meta.totalPages);
    } catch (error) {
      toast.error("Gagal memuat data lebih lanjut");
    } finally {
      setHistoryLoadingMore(false);
    }
  };
  if (isLoading && consumers.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-6 w-6 text-blue-600" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-4 font-medium", children: "Memuat data konsumen..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fadeInDown", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 animate-lineGrow" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight", children: "Konsumen" }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-4 w-4 animate-pulse" }),
            "Kelola data pelanggan pangkalan Anda"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Sheet, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsx(
        SheetContent,
        {
          side: "right",
          hideCloseButton: true,
          className: "w-full sm:max-w-[480px] overflow-y-auto p-0 border-l border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950",
          children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col h-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative shrink-0 min-h-[70px] px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: editingConsumer ? "UserCog" : "UserPlus", className: "h-5 w-5 sm:h-6 sm:w-6 text-white" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center min-w-0", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-bold tracking-tight leading-tight truncate", children: editingConsumer ? "Edit Konsumen" : "Tambah Konsumen" }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-xs sm:text-sm leading-tight truncate", children: editingConsumer ? "Perbarui data konsumen" : "Isi data konsumen baru" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Tag", className: "h-4 w-4 text-blue-500" }),
                  "Jenis Konsumen"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFormData({ ...formData, consumer_type: "RUMAH_TANGGA" }),
                      className: `flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.consumer_type === "RUMAH_TANGGA" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300"}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${formData.consumer_type === "RUMAH_TANGGA" ? "bg-blue-100" : "bg-slate-100"}`, children: /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: `h-5 w-5 ${formData.consumer_type === "RUMAH_TANGGA" ? "text-blue-600" : "text-slate-500"}` }) }),
                        /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Rumah Tangga" }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Konsumen perorangan" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFormData({ ...formData, consumer_type: "WARUNG" }),
                      className: `flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.consumer_type === "WARUNG" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-slate-200 hover:border-slate-300"}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${formData.consumer_type === "WARUNG" ? "bg-amber-100" : "bg-slate-100"}`, children: /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: `h-5 w-5 ${formData.consumer_type === "WARUNG" ? "text-amber-600" : "text-slate-500"}` }) }),
                        /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Warung" }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Usaha mikro" })
                        ] })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nama Konsumen *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "name",
                    value: formData.name,
                    onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                    placeholder: "Contoh: Bu Tini / Warung Berkah",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "nik", children: [
                    "NIK (16 digit) ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "nik",
                      value: formData.nik,
                      onChange: (e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "").slice(0, 16) }),
                      placeholder: "3201234567890123",
                      maxLength: 16
                    }
                  ),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
                    formData.nik.length,
                    "/16 digit"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "kk", children: [
                    "No. KK (16 digit) ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "kk",
                      value: formData.kk,
                      onChange: (e) => setFormData({ ...formData, kk: e.target.value.replace(/\D/g, "").slice(0, 16) }),
                      placeholder: "3201234567890123",
                      maxLength: 16
                    }
                  ),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
                    formData.kk.length,
                    "/16 digit"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "No. Telepon (Opsional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "phone",
                    value: formData.phone,
                    onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                    placeholder: "08123456789"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "address", children: "Alamat (Opsional)" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    id: "address",
                    value: formData.address,
                    onChange: (e) => setFormData({ ...formData, address: e.target.value }),
                    placeholder: "Jl. Contoh No. 123, RT 01/02",
                    rows: 2
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "note", children: "Catatan" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "note",
                    value: formData.note,
                    onChange: (e) => setFormData({ ...formData, note: e.target.value }),
                    placeholder: "Catatan tambahan..."
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "sticky bottom-0 px-4 sm:px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setIsDialogOpen(false),
                  className: "flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200",
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "h-4 w-4 mr-2 text-slate-500" }),
                    "Batal"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  disabled: isSubmitting,
                  className: "flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5",
                  children: [
                    isSubmitting ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-5 w-5 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-5 w-5 mr-2" }),
                    editingConsumer ? "Simpan" : "Tambah"
                  ]
                }
              )
            ] }) })
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => handleOpenDialog(),
          className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "UserPlus", className: "h-4 w-4 mr-2" }),
            "Tambah Konsumen"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-1", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-4 w-4" }) }),
          "Total Konsumen"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold tracking-tight", children: total }),
          /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-sm mt-2", children: "Pelanggan terdaftar" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-2", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "h-4 w-4 text-green-600 dark:text-green-400" }) }),
          "Rumah Tangga"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: stats.rumahTangga }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: "Konsumen RT" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-3", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-4 w-4 text-amber-600 dark:text-amber-400" }) }),
          "Warung"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: stats.warung }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: "Usaha mikro" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-4", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CreditCard", className: "h-4 w-4 text-purple-600 dark:text-purple-400" }) }),
          "Terverifikasi NIK"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: stats.withNik }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: "Sudah input NIK" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Search", className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Cari nama, NIK, atau telepon...",
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(1);
            },
            className: "pl-10 rounded-xl"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: typeFilter, onValueChange: (v) => {
        setTypeFilter(v);
        setPage(1);
      }, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px] rounded-xl", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter Jenis" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Semua Jenis" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "RUMAH_TANGGA", children: "Rumah Tangga" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "WARUNG", children: "Warung" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-4 w-4 text-blue-600" }) }),
          "Daftar Konsumen"
        ] }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          consumers.length,
          " konsumen ditampilkan"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: consumers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "UserX", className: "h-16 w-16 text-slate-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-700 mb-2", children: "Belum Ada Konsumen" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 mb-6", children: "Tambahkan konsumen untuk mulai mencatat penjualan" }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => handleOpenDialog(), className: "bg-blue-600 hover:bg-blue-700", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "UserPlus", className: "h-4 w-4 mr-2" }),
          "Tambah Konsumen Pertama"
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: consumers.map((consumer, index) => /* @__PURE__ */ jsx(
        "div",
        {
          onClick: () => fetchConsumerHistory(consumer),
          className: `p-3 sm:p-4 hover:bg-blue-50/50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center ${consumer.consumer_type === "WARUNG" ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-blue-400 to-blue-600"}`, children: /* @__PURE__ */ jsx(
              SafeIcon,
              {
                name: consumer.consumer_type === "WARUNG" ? "Store" : "User",
                className: "h-5 w-5 sm:h-6 sm:w-6 text-white"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 text-sm sm:text-base truncate max-w-[140px] sm:max-w-none", children: consumer.name }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] sm:text-xs shrink-0 ${consumer.consumer_type === "WARUNG" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`, children: consumer.consumer_type === "WARUNG" ? "Warung" : "RT" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 text-xs sm:text-sm text-slate-500 mt-1", children: [
                consumer.phone && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 truncate", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-3 w-3 shrink-0" }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: consumer.phone })
                ] }),
                consumer.nik && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "CreditCard", className: "h-3 w-3 shrink-0" }),
                  "NIK: ***",
                  consumer.nik.slice(-4)
                ] })
              ] }),
              consumer.address && /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs text-slate-400 mt-1 flex items-center gap-1 truncate", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "MapPin", className: "h-3 w-3 shrink-0" }),
                /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                  consumer.address.substring(0, 40),
                  consumer.address.length > 40 ? "..." : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              consumer._count?.consumer_orders && consumer._count.consumer_orders > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700 text-[10px] sm:text-xs px-1.5 sm:px-2", children: [
                consumer._count.consumer_orders,
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline ml-1", children: "order" })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    handleOpenDialog(consumer);
                  },
                  className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0",
                  children: /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    setDeleteConfirmConsumer(consumer);
                  },
                  className: "text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0",
                  children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4" })
                }
              )
            ] })
          ] })
        },
        consumer.id
      )) }) })
    ] }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setPage((p) => Math.max(1, p - 1)),
          disabled: page2 === 1,
          className: "rounded-xl",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4 mr-1" }),
            "Sebelumnya"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-slate-500", children: [
        "Halaman ",
        page2,
        " dari ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
          disabled: page2 === totalPages,
          className: "rounded-xl",
          children: [
            "Selanjutnya",
            /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 ml-1" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: !!historyConsumer, onOpenChange: (open) => !open && setHistoryConsumer(null), children: /* @__PURE__ */ jsxs(SheetContent, { side: "right", className: "w-full sm:max-w-[500px] overflow-y-auto p-0", children: [
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "History", className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Riwayat Pembelian" }),
          /* @__PURE__ */ jsx("p", { className: "text-green-100 text-sm", children: historyConsumer?.name })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 uppercase font-medium", children: "Total Volume" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: historyStats.totalQty.toLocaleString("id-ID") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "tabung" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 uppercase font-medium", children: "Total Pembelian" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-slate-900", children: [
            "Rp ",
            historyStats.totalAmount.toLocaleString("id-ID")
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
            historyStats.totalTransactions.toLocaleString("id-ID"),
            " transaksi"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4" }),
          "Daftar Transaksi"
        ] }),
        historyLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-green-500" }) }) : historyData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "ShoppingBag", className: "h-12 w-12 text-slate-300 mx-auto mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Belum ada riwayat pembelian" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: historyData.map((order) => /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 p-1 flex-shrink-0 border border-slate-200", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: getLpgImage(order.lpg_type || ""),
              alt: order.lpg_type || "LPG",
              className: "w-full h-full object-contain",
              onError: (e) => {
                e.currentTarget.src = "/images/products/lpg-3kg.png";
              }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Badge, { className: "bg-green-100 text-green-700 text-xs mb-1", children: order.lpg_type?.toUpperCase() || "LPG" }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900", children: [
                  order.qty,
                  " tabung × Rp ",
                  Number(order.price_per_unit).toLocaleString("id-ID")
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-green-600 whitespace-nowrap", children: [
                "Rp ",
                Number(order.total_amount).toLocaleString("id-ID")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-500 mt-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Calendar", className: "h-3 w-3" }),
                new Date(order.sale_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] ${order.payment_status === "LUNAS" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`, children: order.payment_status })
            ] }),
            order.note && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-2 italic", children: [
              '"',
              order.note,
              '"'
            ] })
          ] })
        ] }) }, order.id)) }),
        historyHasMore && !historyLoading && /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "w-full rounded-xl",
            onClick: loadMoreHistory,
            disabled: historyLoadingMore,
            children: historyLoadingMore ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 mr-2 animate-spin" }),
              "Memuat..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronDown", className: "h-4 w-4 mr-2" }),
              "Muat Lebih Banyak (",
              historyStats.totalTransactions - historyData.length,
              " lagi)"
            ] })
          }
        ) }),
        historyData.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-slate-400 pt-4", children: [
          "Menampilkan ",
          historyData.length,
          " dari ",
          historyStats.totalTransactions,
          " transaksi"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteConfirmConsumer, onOpenChange: (open) => !open && setDeleteConfirmConsumer(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-6 w-6 text-red-600" }) }),
          /* @__PURE__ */ jsx(AlertDialogTitle, { className: "text-lg font-semibold", children: "Hapus Konsumen?" })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "text-slate-600", children: [
          "Apakah Anda yakin ingin menghapus konsumen ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-900", children: deleteConfirmConsumer?.name }),
          "? Tindakan ini tidak dapat dibatalkan."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsx(
          AlertDialogCancel,
          {
            disabled: isDeleting,
            className: "rounded-xl",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: isDeleting,
            className: "rounded-xl bg-red-600 hover:bg-red-700 text-white",
            children: isDeleting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 mr-2 animate-spin" }),
              "Menghapus..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4 mr-2" }),
              "Hapus"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Daftar Konsumen - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "KonsumenListPage", KonsumenListPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/KonsumenListPage.tsx", "client:component-export": "default" })}
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/konsumen/index.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/konsumen/index.astro";
const $$url = "/pangkalan/konsumen.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
