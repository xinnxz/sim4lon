import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.DfKLN4S1.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.OIui5EpG.js";
import { u as useConfirmDialog, c as createDeleteConfirmation, A as AdminFooter } from "../../_astro/AdminFooter.B5Ap1SI9.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "../../_astro/card.OLhQVURm.js";
import { S as SafeIcon, B as Button, I as Input, t as consumersApi } from "../../_astro/AuthGuard.Cq_0lvUi.js";
import { D as Dialog, i as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, k as DialogFooter, B as Badge, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { L as Label } from "../../_astro/label.DNnd65zo.js";
import { T as Textarea } from "../../_astro/textarea.Ccrv3kMs.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../../_astro/select.DOfMR1sZ.js";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
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
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    rumahTangga: 0,
    warung: 0,
    withNik: 0
  });
  const { confirm } = useConfirmDialog();
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
    setIsDialogOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Nama konsumen wajib diisi");
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
  const handleDelete = async (consumer) => {
    const confirmed = await confirm(createDeleteConfirmation(consumer.name));
    if (!confirmed) return;
    try {
      await consumersApi.delete(consumer.id);
      toast.success("Konsumen berhasil dihapus", { duration: 4e3 });
      fetchConsumers(true);
    } catch (error) {
      toast.error(error.message || "Gagal menghapus konsumen", { duration: 5e3 });
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
      /* @__PURE__ */ jsxs(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => handleOpenDialog(),
            className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "UserPlus", className: "h-4 w-4 mr-2" }),
              "Tambah Konsumen"
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[500px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: editingConsumer ? "UserCog" : "UserPlus", className: "h-5 w-5 text-blue-600" }) }),
              editingConsumer ? "Edit Konsumen" : "Tambah Konsumen Baru"
            ] }),
            /* @__PURE__ */ jsx(DialogDescription, { children: editingConsumer ? "Perbarui data konsumen" : "Isi data konsumen baru untuk pangkalan Anda" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Jenis Konsumen *" }),
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
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "nik", children: "NIK (16 digit) (Opsional)" }),
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
                /* @__PURE__ */ jsx(Label, { htmlFor: "kk", children: "No. KK (16 digit) (Opsional)" }),
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
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsDialogOpen(false), children: "Batal" }),
            /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isSubmitting, className: "bg-blue-600 hover:bg-blue-700", children: [
              isSubmitting ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 mr-2" }),
              editingConsumer ? "Simpan Perubahan" : "Tambah Konsumen"
            ] })
          ] })
        ] }) })
      ] })
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
      ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: consumers.map((consumer, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center justify-between p-4 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center ${consumer.consumer_type === "WARUNG" ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-blue-400 to-blue-600"}`, children: /* @__PURE__ */ jsx(
                SafeIcon,
                {
                  name: consumer.consumer_type === "WARUNG" ? "Store" : "User",
                  className: "h-6 w-6 text-white"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: consumer.name }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: consumer.consumer_type === "WARUNG" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200", children: consumer.consumer_type === "WARUNG" ? "Warung" : "RT" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-slate-500 mt-1", children: [
                  consumer.phone && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-3 w-3" }),
                    consumer.phone
                  ] }),
                  consumer.nik && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "CreditCard", className: "h-3 w-3" }),
                    "NIK: ***",
                    consumer.nik.slice(-4)
                  ] })
                ] }),
                consumer.address && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "MapPin", className: "h-3 w-3" }),
                  consumer.address.substring(0, 50),
                  consumer.address.length > 50 ? "..." : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              consumer._count?.consumer_orders && consumer._count.consumer_orders > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: [
                consumer._count.consumer_orders,
                " order"
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => handleOpenDialog(consumer),
                  className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                  children: /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => handleDelete(consumer),
                  className: "text-red-600 hover:text-red-700 hover:bg-red-50",
                  children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4" })
                }
              )
            ] })
          ]
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
    ] })
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Daftar Konsumen - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "KonsumenListPage", KonsumenListPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/KonsumenListPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
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
