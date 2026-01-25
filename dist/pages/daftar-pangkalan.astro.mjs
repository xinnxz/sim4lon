import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.Bvdpe0CJ.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { S as SafeIcon, I as Input, B as Button, p as pangkalanApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { C as Card, a as CardContent } from "../_astro/card.CnUj7wdc.js";
import { T as Tilt3DCard } from "../_astro/Tilt3DCard.DHI-RZXC.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "../_astro/table.OJLE4Veh.js";
import { B as Badge, e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { T as Textarea } from "../_astro/textarea.F19kpFWl.js";
import { g as getKecamatanByKabupaten, F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage, K as KABUPATEN_DATA } from "../_astro/regions.BfWhU3Us.js";
import { toast } from "sonner";
import { C as ConfirmationModal } from "../_astro/currency.CHcHKzei.js";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { renderers } from "../renderers.mjs";
const pangkalanSchema = z.object({
  name: z.string().min(3, "Nama pangkalan minimal 3 karakter").max(100, "Nama pangkalan maksimal 100 karakter"),
  address: z.string().min(10, "Alamat minimal 10 karakter").max(255, "Alamat maksimal 255 karakter"),
  kabupaten: z.string().min(1, "Kabupaten harus dipilih"),
  kecamatan: z.string().min(1, "Kecamatan harus dipilih"),
  pic_name: z.string().min(2, "Nama PIC minimal 2 karakter").max(100, "Nama PIC maksimal 100 karakter"),
  phone: z.string().regex(/^(\+62|0)[0-9]{9,12}$/, "Nomor telepon tidak valid (contoh: 08xx atau +62xx)"),
  capacity: z.string().optional(),
  alokasi_bulanan: z.string().optional(),
  note: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
  // Field untuk akun login (sekaligus email untuk invoice)
  login_email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  login_password: z.string().min(6, "Password minimal 6 karakter"),
  confirm_password: z.string().min(6, "Konfirmasi password harus diisi")
}).refine((data) => data.login_password === data.confirm_password, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirm_password"]
});
function TambahPangkalanForm({ onSuccess, isModal = false }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(pangkalanSchema),
    defaultValues: {
      name: "",
      address: "",
      kabupaten: "",
      kecamatan: "",
      pic_name: "",
      phone: "",
      capacity: "",
      alokasi_bulanan: "",
      note: "",
      login_email: "",
      login_password: "",
      confirm_password: ""
    }
  });
  const kecamatanList = getKecamatanByKabupaten(selectedKabupaten);
  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const capacityNum = values.capacity ? parseInt(values.capacity, 10) : 0;
      const kabupatenName = KABUPATEN_DATA.find((k) => k.id === values.kabupaten)?.name || values.kabupaten;
      const region = `${values.kecamatan}, ${kabupatenName}`;
      await pangkalanApi.create({
        name: values.name,
        address: values.address,
        region,
        pic_name: values.pic_name,
        phone: values.phone,
        email: values.login_email,
        // Use login email for invoice too
        capacity: capacityNum,
        alokasi_bulanan: values.alokasi_bulanan ? parseInt(values.alokasi_bulanan, 10) : 0,
        note: values.note || "",
        // Akun login
        login_email: values.login_email,
        login_password: values.login_password
      });
      toast.success("Pangkalan berhasil ditambahkan!");
      if (isModal && onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          window.location.href = "/daftar-pangkalan";
        }, 1e3);
      }
    } catch (error) {
      toast.error("Gagal menambahkan pangkalan. Silakan coba lagi.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: isModal ? "" : "max-w-2xl mx-auto", children: [
    !isModal && /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Tambah Pangkalan" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Daftarkan pangkalan LPG baru ke dalam sistem" })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: isModal ? "border-0 shadow-none" : "shadow-card", children: /* @__PURE__ */ jsx(CardContent, { className: isModal ? "px-0" : "", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: isModal ? "space-y-3" : "space-y-6", children: [
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "name",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Nama Pangkalan *" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Contoh: Pangkalan Maju Jaya",
                ...field,
                disabled: isSubmitting
              }
            ) }),
            !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Nama resmi pangkalan LPG" }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "address",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Alamat Lengkap *" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "Contoh: Jl. Merdeka No. 123, Kelurahan Sukamaju",
                ...field,
                disabled: isSubmitting,
                rows: isModal ? 2 : 3
              }
            ) }),
            !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Alamat lengkap pangkalan" }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "kabupaten",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Kabupaten *" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  onValueChange: (value) => {
                    field.onChange(value);
                    setSelectedKabupaten(value);
                    form.setValue("kecamatan", "");
                  },
                  defaultValue: field.value,
                  disabled: isSubmitting,
                  children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih Kabupaten" }) }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: KABUPATEN_DATA.map((kab) => /* @__PURE__ */ jsx(SelectItem, { value: kab.id, children: kab.displayName }, kab.id)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "kecamatan",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Kecamatan *" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  onValueChange: field.onChange,
                  defaultValue: field.value,
                  disabled: isSubmitting || !selectedKabupaten,
                  children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: selectedKabupaten ? "Pilih Kecamatan" : "Pilih Kabupaten dulu" }) }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: kecamatanList.map((kec) => /* @__PURE__ */ jsx(SelectItem, { value: kec, children: kec }, kec)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: isModal ? "grid gap-3 sm:grid-cols-2" : "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "pic_name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Nama PIC *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: Budi Santoso",
                  ...field,
                  disabled: isSubmitting
                }
              ) }),
              !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Nama penanggung jawab pangkalan" }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "phone",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Nomor Telepon *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: 081234567890",
                  ...field,
                  disabled: isSubmitting,
                  type: "tel"
                }
              ) }),
              !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Nomor telepon yang dapat dihubungi" }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "capacity",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Kapasitas (Opsional)" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: 500",
                  ...field,
                  disabled: isSubmitting,
                  type: "number",
                  onWheel: (e) => e.target.blur()
                }
              ) }),
              !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Kapasitas penyimpanan LPG dalam unit" }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "alokasi_bulanan",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Alokasi Bulanan (Opsional)" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: 500",
                  ...field,
                  disabled: isSubmitting,
                  type: "number",
                  min: 0,
                  onWheel: (e) => e.target.blur()
                }
              ) }),
              !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Jumlah alokasi tabung LPG (3kg) per bulan" }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "note",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Catatan (Opsional)" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "Contoh: Lokasi strategis, akses jalan mudah",
                ...field,
                disabled: isSubmitting,
                rows: isModal ? 1 : 2
              }
            ) }),
            !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Informasi tambahan tentang pangkalan" }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: isModal ? "pt-3 mt-3 border-t" : "pt-6 mt-6 border-t", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Key", className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Akun Login Pangkalan" })
        ] }),
        !isModal && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Buat akun untuk login ke dashboard pangkalan. Email ini juga digunakan untuk invoice." }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "login_email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "mb-3", children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Email Login *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: pangkalan@email.com",
                  ...field,
                  disabled: isSubmitting,
                  type: "email"
                }
              ) }),
              !isModal && /* @__PURE__ */ jsx(FormDescription, { children: "Email untuk login ke dashboard pangkalan" }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "login_password",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Password *" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: "Minimal 6 karakter",
                      ...field,
                      disabled: isSubmitting,
                      type: showPassword ? "text" : "password",
                      className: "pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      tabIndex: -1,
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: showPassword ? "EyeOff" : "Eye", className: "h-4 w-4" })
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "confirm_password",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Konfirmasi Password *" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: "Ulangi password",
                      ...field,
                      disabled: isSubmitting,
                      type: showConfirmPassword ? "text" : "password",
                      className: "pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowConfirmPassword(!showConfirmPassword),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      tabIndex: -1,
                      children: /* @__PURE__ */ jsx(SafeIcon, { name: showConfirmPassword ? "EyeOff" : "Eye", className: "h-4 w-4" })
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex gap-3 ${isModal ? "pt-3 border-t" : "pt-6 border-t"}`, children: [
        !isModal && /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => window.location.href = "/daftar-pangkalan",
            disabled: isSubmitting,
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "mr-2 h-4 w-4" }),
              "Batal"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: isModal ? "w-full" : "flex-1 bg-primary hover:bg-primary/90",
            children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
              "Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-4 w-4" }),
              "Simpan Pangkalan"
            ] })
          }
        )
      ] })
    ] }) }) }) })
  ] });
}
const PAGE_SIZE_OPTIONS = [10, 25, 50];
function PangkalanListPage() {
  const [pangkalanList, setPangkalanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [aktivCount, setAktivCount] = useState(0);
  const [totalAlokasi, setTotalAlokasi] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPangkalan, setSelectedPangkalan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
  const sortedPangkalanList = useMemo(() => {
    if (!sortField) return pangkalanList;
    return [...pangkalanList].sort((a, b) => {
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
  }, [pangkalanList, sortField, sortDirection]);
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
  const fetchPangkalan = async () => {
    try {
      setIsLoading(true);
      const isActive = statusFilter === "semua" ? void 0 : statusFilter === "aktif";
      const response = await pangkalanApi.getAll(currentPage, pageSize, searchTerm || void 0, isActive);
      setPangkalanList(response.data);
      setTotalItems(response.meta.totalAll || response.meta.total);
      setTotalPages(response.meta.totalPages);
      setAktivCount(response.meta.totalActive || 0);
      setTotalAlokasi(response.meta.totalAlokasi || 0);
    } catch (error) {
      console.error("Failed to fetch pangkalan:", error);
      toast.error("Gagal memuat data pangkalan");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPangkalan();
  }, [currentPage, statusFilter, pageSize]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPangkalan();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const handleStatusToggleClick = (pangkalan) => {
    setSelectedPangkalan(pangkalan);
    setShowConfirmModal(true);
  };
  const handleConfirmStatusToggle = async () => {
    if (!selectedPangkalan) return;
    try {
      const newStatus = !selectedPangkalan.is_active;
      await pangkalanApi.update(selectedPangkalan.id, { is_active: newStatus });
      toast.success(`Pangkalan berhasil ${newStatus ? "diaktifkan" : "dinonaktifkan"}`);
      fetchPangkalan();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Gagal mengubah status pangkalan");
    } finally {
      setShowConfirmModal(false);
      setSelectedPangkalan(null);
    }
  };
  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchPangkalan();
    toast.success("Pangkalan berhasil ditambahkan");
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3 sm:space-y-4 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Daftar Pangkalan",
          subtitle: "Kelola semua pangkalan distribusi LPG"
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => setShowAddModal(true),
          className: "w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "mr-2 h-4 w-4" }),
            "Tambah Pangkalan"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 sm:gap-4", children: isLoading ? (
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
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-2 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-1 sm:gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 sm:p-2.5 rounded-xl bg-primary/10 dark:bg-primary/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "w-4 h-4 sm:w-5 sm:h-5 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Total Pangkalan" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: totalItems, delay: 100 }) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", style: { animationDelay: "0.1s" }, children: /* @__PURE__ */ jsx(CardContent, { className: "p-2 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-1 sm:gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 sm:p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "CheckCircle", className: "w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Aktif" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: aktivCount, delay: 200 }) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", style: { animationDelay: "0.2s" }, children: /* @__PURE__ */ jsx(CardContent, { className: "p-2 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-1 sm:gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 sm:p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Total Alokasi" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: totalAlokasi, delay: 300 }) })
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
            placeholder: "Cari berdasarkan nama, alamat, atau wilayah...",
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
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Data Pangkalan" }),
          /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-primary/10 text-primary", children: [
            pangkalanList.length,
            " data"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Total: ",
          totalItems,
          " pangkalan"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-blue-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Memuat data pangkalan..." })
      ] }) }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-transparent border-border focus:border-primary", children: [
          /* @__PURE__ */ jsx(SortableHeader, { field: "code", className: "w-24  ", children: "Kode" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "name", children: "Nama" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "email", children: "Email" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "address", children: "Alamat" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "region", children: "Wilayah" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "phone", align: "center", children: "Telepon" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "pic_name", children: "PIC" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "alokasi_bulanan", align: "center", children: "Alokasi" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "is_active", align: "center", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center font-semibold text-slate-700", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sortedPangkalanList.length > 0 ? sortedPangkalanList.map((pangkalan) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/50 transition-colors", children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm text-primary", children: pangkalan.code || "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-foreground", children: pangkalan.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: pangkalan.email ? /* @__PURE__ */ jsx("span", { className: "text-primary", children: pangkalan.email }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground italic", children: "-" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-foreground/80 max-w-xs truncate", children: pangkalan.address }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-foreground", children: pangkalan.region }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-center text-foreground", children: pangkalan.phone }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm font-medium text-foreground", children: pangkalan.pic_name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center text-sm font-semibold text-primary", children: pangkalan.alokasi_bulanan ? pangkalan.alokasi_bulanan.toLocaleString() : "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            Badge,
            {
              className: pangkalan.is_active ? "bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white shadow-sm" : "bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/50 text-white shadow-sm",
              children: pangkalan.is_active ? "✓ Aktif" : "Nonaktif"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(SafeIcon, { name: "MoreVertical", className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `/detail-edit-pangkalan?id=${pangkalan.id}`,
                  className: "cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Eye", className: "mr-2 h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { children: "Lihat Detail" })
                  ]
                }
              ) }),
              pangkalan.is_active ? /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  className: "text-destructive cursor-pointer",
                  onClick: () => handleStatusToggleClick(pangkalan),
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Ban", className: "mr-2 h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { children: "Nonaktifkan" })
                  ]
                }
              ) : /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  className: "text-green-600 cursor-pointer",
                  onClick: () => handleStatusToggleClick(pangkalan),
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "mr-2 h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { children: "Aktifkan" })
                  ]
                }
              )
            ] })
          ] }) })
        ] }, pangkalan.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 10, className: "text-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/illustrations/empty-pangkalan.png",
              alt: "Tidak ada pangkalan",
              className: "w-32 h-32 object-contain opacity-80"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium", children: "Tidak ada pangkalan ditemukan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70", children: "Coba ubah kata kunci pencarian atau filter" })
        ] }) }) }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
            "Menampilkan ",
            (currentPage - 1) * pageSize + 1,
            "-",
            Math.min(currentPage * pageSize, totalItems),
            " dari ",
            totalItems
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Tampilkan" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: pageSize.toString(),
                onValueChange: (value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                },
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[70px] h-8", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: PAGE_SIZE_OPTIONS.map((size) => /* @__PURE__ */ jsx(SelectItem, { value: size.toString(), children: size }, size)) })
                ]
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "per halaman" })
          ] })
        ] }),
        totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: currentPage === 1,
              onClick: () => setCurrentPage(1),
              className: "hidden sm:flex h-8 w-8 p-0",
              title: "Halaman Pertama",
              children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronsLeft", className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: currentPage === 1,
              onClick: () => setCurrentPage((p) => p - 1),
              className: "h-8",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4 sm:mr-1" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Prev" })
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
                className: `h-8 w-8 p-0 ${currentPage === pageNum ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"}`,
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
              className: "h-8",
              children: [
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Next" }),
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 sm:ml-1" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: currentPage === totalPages,
              onClick: () => setCurrentPage(totalPages),
              className: "hidden sm:flex h-8 w-8 p-0",
              title: "Halaman Terakhir",
              children: /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronsRight", className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showAddModal, onOpenChange: setShowAddModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Tambah Pangkalan Baru" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Daftarkan pangkalan LPG baru ke dalam sistem" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx(
        TambahPangkalanForm,
        {
          isModal: true,
          onSuccess: handleAddSuccess
        }
      ) })
    ] }) }),
    selectedPangkalan && /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        open: showConfirmModal,
        onOpenChange: setShowConfirmModal,
        title: selectedPangkalan.is_active ? "Nonaktifkan Pangkalan" : "Aktifkan Pangkalan",
        description: selectedPangkalan.is_active ? `Apakah Anda yakin ingin menonaktifkan pangkalan "${selectedPangkalan.name}"? Pangkalan ini tidak akan dapat menerima pesanan sampai diaktifkan kembali.` : `Apakah Anda yakin ingin mengaktifkan pangkalan "${selectedPangkalan.name}"? Pangkalan ini akan dapat menerima pesanan kembali.`,
        confirmText: selectedPangkalan.is_active ? "Nonaktifkan" : "Aktifkan",
        cancelText: "Batal",
        icon: selectedPangkalan.is_active ? "AlertTriangle" : "CheckCircle",
        isDangerous: selectedPangkalan.is_active,
        onConfirm: handleConfirmStatusToggle
      }
    )
  ] });
}
const $$DaftarPangkalan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Daftar Pangkalan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "PangkalanListPage", PangkalanListPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/daftar-pangkalan/PangkalanListPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/daftar-pangkalan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/daftar-pangkalan.astro";
const $$url = "/daftar-pangkalan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DaftarPangkalan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
