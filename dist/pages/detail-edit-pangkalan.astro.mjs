import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C63pe5Ia.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as SafeIcon, I as Input, B as Button, p as pangkalanApi, o as ordersApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { B as Badge, j as Skeleton, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "../_astro/card.CnUj7wdc.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "../_astro/table.OJLE4Veh.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { T as Textarea } from "../_astro/textarea.F19kpFWl.js";
import { S as Switch } from "../_astro/switch.Q6Vgrz6u.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { g as getKecamatanByKabupaten, F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, f as FormMessage, e as FormDescription, K as KABUPATEN_DATA } from "../_astro/regions.BfWhU3Us.js";
import { f as formatCurrency, C as ConfirmationModal } from "../_astro/currency.CHcHKzei.js";
import { toast } from "sonner";
import { renderers } from "../renderers.mjs";
function PangkalanInfoCard({ pangkalan }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-5 w-5 text-primary" }),
        "Informasi Utama"
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Nama Pangkalan" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground mt-1 font-semibold", children: pangkalan.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Kode Pangkalan" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground mt-1 font-mono", children: pangkalan.code })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Wilayah" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground mt-1", children: pangkalan.region || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx(
              Badge,
              {
                variant: "status",
                className: pangkalan.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                children: pangkalan.is_active ? "Aktif" : "Nonaktif"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Kapasitas" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground mt-1", children: pangkalan.capacity ? `${pangkalan.capacity} unit` : "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Alokasi Bulanan" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-foreground mt-1 font-semibold", children: pangkalan.alokasi_bulanan ? `${pangkalan.alokasi_bulanan.toLocaleString()} tabung` : "-" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-5 w-5 text-primary" }),
        "Kontak"
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Nama PIC" }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-foreground mt-1 font-semibold", children: pangkalan.pic_name || "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-5 w-5 text-muted-foreground mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Nomor Telepon" }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: `tel:${pangkalan.phone}`,
                  className: "text-base text-primary mt-1 hover:underline",
                  children: pangkalan.phone || "-"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Mail", className: "h-5 w-5 text-muted-foreground mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Email" }),
              pangkalan.email ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: `mailto:${pangkalan.email}`,
                  className: "text-base text-primary mt-1 hover:underline",
                  children: pangkalan.email
                }
              ) : /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground mt-1 italic", children: "Tidak ada email" })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "MapPin", className: "h-5 w-5 text-primary" }),
        "Alamat Lengkap"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-base text-foreground", children: pangkalan.address }) })
    ] }),
    pangkalan.note && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "FileText", className: "h-5 w-5 text-primary" }),
        "Catatan"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-base text-foreground", children: pangkalan.note }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Dibuat" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Tanggal Pembuatan" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-foreground mt-1", children: formatDate(pangkalan.created_at) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Diperbarui" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Terakhir Diperbarui" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-foreground mt-1", children: formatDate(pangkalan.updated_at) })
        ] })
      ] })
    ] })
  ] });
}
function parseRegion(region) {
  if (!region) return { kabupaten: "", kecamatan: "" };
  const parts = region.split(",");
  if (parts.length >= 2) {
    const kecamatan = parts[0].trim();
    const kabupatenName = parts[1].trim();
    const kabupaten = KABUPATEN_DATA.find(
      (k) => k.name === kabupatenName || kabupatenName.includes(k.name.replace("Kabupaten ", ""))
    );
    if (kabupaten) {
      return { kabupaten: kabupaten.id, kecamatan };
    }
  }
  for (const kab of KABUPATEN_DATA) {
    if (kab.kecamatan.includes(region)) {
      return { kabupaten: kab.id, kecamatan: region };
    }
  }
  return { kabupaten: "", kecamatan: region };
}
const pangkalanSchema = z.object({
  name: z.string().min(3, "Nama pangkalan minimal 3 karakter").max(100, "Nama pangkalan maksimal 100 karakter"),
  address: z.string().min(10, "Alamat minimal 10 karakter").max(255, "Alamat maksimal 255 karakter"),
  kabupaten: z.string().min(1, "Kabupaten harus dipilih"),
  kecamatan: z.string().min(1, "Kecamatan harus dipilih"),
  pic_name: z.string().min(2, "Nama PIC minimal 2 karakter").max(100, "Nama PIC maksimal 100 karakter"),
  phone: z.string().regex(/^(\+62|0)[0-9]{9,12}$/, "Nomor telepon tidak valid (contoh: 08xx atau +62xx)"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  capacity: z.string().optional(),
  alokasi_bulanan: z.string().optional(),
  note: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
  is_active: z.boolean()
});
function PangkalanEditForm({
  pangkalan,
  onSave,
  onCancel,
  isSaving
}) {
  const parsedRegion = parseRegion(pangkalan.region);
  const [selectedKabupaten, setSelectedKabupaten] = useState(parsedRegion.kabupaten);
  const form = useForm({
    resolver: zodResolver(pangkalanSchema),
    defaultValues: {
      name: pangkalan.name || "",
      address: pangkalan.address || "",
      kabupaten: parsedRegion.kabupaten,
      kecamatan: parsedRegion.kecamatan,
      pic_name: pangkalan.pic_name || "",
      phone: pangkalan.phone || "",
      email: pangkalan.email || "",
      capacity: pangkalan.capacity?.toString() || "",
      alokasi_bulanan: pangkalan.alokasi_bulanan?.toString() || "",
      note: pangkalan.note || "",
      is_active: pangkalan.is_active
    }
  });
  const kecamatanList = getKecamatanByKabupaten(selectedKabupaten);
  const onSubmit = async (values) => {
    const kabupatenName = KABUPATEN_DATA.find((k) => k.id === values.kabupaten)?.name || values.kabupaten;
    const region = `${values.kecamatan}, ${kabupatenName}`;
    const data = {
      name: values.name,
      address: values.address,
      region,
      pic_name: values.pic_name,
      phone: values.phone,
      is_active: values.is_active
    };
    if (values.email) data.email = values.email;
    if (values.capacity) data.capacity = parseInt(values.capacity, 10);
    if (values.alokasi_bulanan) data.alokasi_bulanan = parseInt(values.alokasi_bulanan, 10);
    if (values.note) data.note = values.note;
    await onSave(data);
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Edit Informasi Pangkalan" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Perbarui data pangkalan sesuai kebutuhan" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Nama Pangkalan *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: Pangkalan Maju Jaya",
                  ...field,
                  disabled: isSaving
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Email *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "email@example.com",
                  ...field,
                  disabled: isSaving,
                  type: "email"
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Untuk kirim invoice/nota" }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "address",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Alamat Lengkap *" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "Masukkan alamat lengkap...",
                ...field,
                disabled: isSaving,
                rows: 3
              }
            ) }),
            /* @__PURE__ */ jsx(FormDescription, { children: "Alamat lengkap pangkalan" }),
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
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Kabupaten *" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  onValueChange: (value) => {
                    field.onChange(value);
                    setSelectedKabupaten(value);
                    form.setValue("kecamatan", "");
                  },
                  defaultValue: field.value,
                  disabled: isSaving,
                  children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih Kabupaten" }) }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: KABUPATEN_DATA.map((kab) => /* @__PURE__ */ jsx(SelectItem, { value: kab.id, children: kab.name }, kab.id)) })
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
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Kecamatan *" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  onValueChange: field.onChange,
                  defaultValue: field.value,
                  disabled: isSaving || !selectedKabupaten,
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
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "pic_name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Nama PIC *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Nama penanggung jawab",
                  ...field,
                  disabled: isSaving
                }
              ) }),
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
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "No. Telepon *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "08xx atau +62xx",
                  ...field,
                  disabled: isSaving,
                  type: "tel"
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "capacity",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Kapasitas" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: 500",
                  ...field,
                  disabled: isSaving,
                  type: "number",
                  onWheel: (e) => e.target.blur()
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Kapasitas penyimpanan (unit)" }),
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
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Alokasi Bulanan *" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: 500",
                  ...field,
                  disabled: isSaving,
                  type: "number",
                  min: 0,
                  onWheel: (e) => e.target.blur()
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Tabung/bulan untuk auto-generate" }),
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
            /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Catatan (Opsional)" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "Catatan tambahan...",
                ...field,
                disabled: isSaving,
                rows: 3
              }
            ) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "is_active",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "text-base font-semibold", children: "Status Aktif" }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Pangkalan aktif dapat menerima pesanan" })
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Switch,
              {
                checked: field.value,
                onCheckedChange: field.onChange,
                disabled: isSaving
              }
            ) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onCancel,
            disabled: isSaving,
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
            disabled: isSaving,
            className: "min-w-[140px]",
            children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
              "Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-4 w-4" }),
              "Simpan Perubahan"
            ] })
          }
        )
      ] })
    ] }) }) })
  ] });
}
const statusLabels = {
  DRAFT: "Draft",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  DIPROSES: "Diproses",
  SIAP_KIRIM: "Siap Kirim",
  DIKIRIM: "Sedang Dikirim",
  SELESAI: "Selesai",
  BATAL: "Dibatalkan"
};
const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700",
  MENUNGGU_PEMBAYARAN: "bg-amber-100 text-amber-700",
  DIPROSES: "bg-blue-100 text-blue-700",
  SIAP_KIRIM: "bg-purple-100 text-purple-700",
  DIKIRIM: "bg-indigo-100 text-indigo-700",
  SELESAI: "bg-green-100 text-green-700",
  BATAL: "bg-red-100 text-red-700"
};
function DetailEditPangkalanContent() {
  const [pangkalan, setPangkalan] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const getPangkalanId = () => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  };
  useEffect(() => {
    const fetchData = async () => {
      const id = getPangkalanId();
      if (!id) {
        toast.error("ID Pangkalan tidak ditemukan");
        setIsLoading(false);
        return;
      }
      try {
        const [pangkalanData, ordersData] = await Promise.all([
          pangkalanApi.getById(id),
          ordersApi.getAll(1, 10, void 0, id)
          // Get last 10 orders for this pangkalan
        ]);
        setPangkalan(pangkalanData);
        setOrders(ordersData.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Gagal memuat data pangkalan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleSave = async (formData) => {
    if (!pangkalan) return;
    setIsSaving(true);
    try {
      console.log("Updating pangkalan with data:", formData);
      await pangkalanApi.update(pangkalan.id, formData);
      const refreshedData = await pangkalanApi.getById(pangkalan.id);
      console.log("Refreshed pangkalan data:", refreshedData);
      setPangkalan(refreshedData);
      setIsEditing(false);
      toast.success("Data pangkalan berhasil diperbarui");
    } catch (error) {
      console.error("Failed to update pangkalan:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Gagal memperbarui data pangkalan";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
  };
  const handleResetPassword = async () => {
    if (!pangkalan || !pangkalan.users || pangkalan.users.length === 0) {
      toast.error("Pangkalan ini belum memiliki akun login");
      return;
    }
    setIsResettingPassword(true);
    try {
      const token = localStorage.getItem("sim4lon_token");
      const response = await fetch(`${"http://localhost:3000/api"}/users/${pangkalan.users[0].id}/reset-password`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }
      const result = await response.json();
      setNewPassword(result.newPassword);
      toast.success("Password berhasil direset!");
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast.error("Gagal reset password");
    } finally {
      setIsResettingPassword(false);
    }
  };
  const handleDelete = async () => {
    if (!pangkalan) return;
    setIsDeleting(true);
    try {
      await pangkalanApi.delete(pangkalan.id);
      toast.success("Pangkalan berhasil dihapus");
      window.location.href = "/daftar-pangkalan";
    } catch (error) {
      console.error("Failed to delete pangkalan:", error);
      const errorMessage = error?.message || "Gagal menghapus pangkalan";
      toast.error(errorMessage);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-4 sm:p-6 lg:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-48" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-64" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-96 w-full" })
    ] });
  }
  if (!pangkalan) {
    return /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 sm:p-6 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Pangkalan Tidak Ditemukan" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Data pangkalan yang Anda cari tidak ditemukan." }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx("a", { href: "/daftar-pangkalan", children: "Kembali ke Daftar Pangkalan" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-4 sm:p-6 lg:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("a", { href: "/daftar-pangkalan", className: "text-muted-foreground hover:text-foreground transition-colors", children: "Pangkalan" }),
        /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("span", { className: "text-foreground font-semibold text-lg", children: pangkalan.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Detail Pangkalan" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-mono text-sm", children: pangkalan.code })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("a", { href: "/daftar-pangkalan", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-1 h-8 px-2",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "ArrowLeft", className: "h-3.5 w-3.5" }),
                "Kembali"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: isEditing ? "outline" : "ghost",
              onClick: () => setIsEditing(!isEditing),
              size: "sm",
              className: "gap-1 h-8 px-2",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: isEditing ? "X" : "Pencil", className: "h-3.5 w-3.5" }),
                isEditing ? "Batal" : "Edit"
              ]
            }
          ),
          pangkalan.users && pangkalan.users.length > 0 && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "gap-1 h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50",
              onClick: () => setShowResetPasswordModal(true),
              title: "Reset password akun pangkalan",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "KeyRound", className: "h-3.5 w-3.5" }),
                "Reset Password"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "gap-1 h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50",
              onClick: () => setShowDeleteModal(true),
              title: "Hapus pangkalan (soft delete)",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-3.5 w-3.5" }),
                "Hapus"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PangkalanInfoCard, { pangkalan }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "History", className: "h-5 w-5 text-primary" }),
            "Riwayat Pesanan"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: orders.length > 0 ? `${orders.length} pesanan terakhir` : "Belum ada riwayat pesanan" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: orders.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "overflow-auto max-h-[480px] border rounded-lg", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 bg-background z-10", children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "min-w-[100px]", children: "Kode" }),
              /* @__PURE__ */ jsx(TableHead, { className: "min-w-[110px]", children: "Tanggal" }),
              /* @__PURE__ */ jsx(TableHead, { className: "min-w-[150px]", children: "Item" }),
              /* @__PURE__ */ jsx(TableHead, { className: "min-w-[130px] text-right", children: "Total" }),
              /* @__PURE__ */ jsx(TableHead, { className: "min-w-[110px]", children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { className: "min-w-[80px]", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: orders.slice(0, 10).map((order) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium font-mono text-primary", children: order.code || `ORD-${order.id.slice(0, 4).toUpperCase()}` }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-foreground text-sm", children: formatDate(order.created_at) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: order.order_items && order.order_items.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: order.order_items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "text-foreground", children: [
                item.label || item.lpg_type,
                " × ",
                item.qty
              ] }, idx)) }) : "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right font-semibold text-foreground", children: formatCurrency(order.total_amount) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: "status",
                  className: statusColors[order.current_status] || "bg-gray-100 text-gray-700",
                  children: statusLabels[order.current_status] || order.current_status
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("a", { href: `/detail-pesanan?code=${order.code}`, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Eye", className: "h-4 w-4" }) }) }) })
            ] }, order.id)) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Menampilkan ",
              Math.min(orders.length, 10),
              " pesanan terbaru"
            ] }),
            /* @__PURE__ */ jsx("a", { href: `/daftar-pesanan?pangkalan_id=${pangkalan.id}`, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "List", className: "h-3.5 w-3.5" }),
              "Lihat Semua Pesanan"
            ] }) })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-12 w-12 mx-auto mb-3 opacity-50" }),
          /* @__PURE__ */ jsx("p", { children: "Belum ada pesanan dari pangkalan ini" })
        ] }) })
      ] })
    ] }) : /* @__PURE__ */ jsx(
      PangkalanEditForm,
      {
        pangkalan,
        onSave: handleSave,
        onCancel: handleCancel,
        isSaving
      }
    ) }),
    /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        open: showDeleteModal,
        onOpenChange: setShowDeleteModal,
        onConfirm: handleDelete,
        title: "Hapus Pangkalan",
        description: `Apakah Anda yakin ingin menghapus pangkalan "${pangkalan?.name}"? Tindakan ini tidak dapat dikembalikan!`,
        confirmText: "Ya, Hapus",
        cancelText: "Batal",
        isDangerous: true,
        isLoading: isDeleting
      }
    ),
    showResetPasswordModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white/20 rounded-lg p-2", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-white", children: "Reset Password" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-100", children: pangkalan?.name })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: !newPassword ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-amber-600 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100 mb-1", children: "Password akan direset" }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: [
              "Sistem akan generate password baru untuk akun ",
              /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold", children: pangkalan?.users?.[0]?.email }),
              ". Password lama tidak dapat dipulihkan."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Langkah selanjutnya:" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400", children: [
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium", children: "1" }),
              'Klik "Generate Password"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400", children: [
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium", children: "2" }),
              "Copy password yang muncul"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400", children: [
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium", children: "3" }),
              "Berikan ke pangkalan melalui WhatsApp"
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-green-500 rounded-full p-1", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-800", children: "Password berhasil direset!" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Password Baru" }),
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-mono text-lg tracking-wider", children: [
            /* @__PURE__ */ jsx("span", { className: "flex-1 select-all break-all", children: newPassword }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: () => {
                  navigator.clipboard.writeText(newPassword);
                  toast.success("Password disalin ke clipboard!");
                },
                className: "bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Copy", className: "h-4 w-4 mr-1" }),
                  "Copy"
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertTriangle", className: "h-5 w-5 text-amber-600 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-800", children: [
            /* @__PURE__ */ jsx("strong", { children: "Penting:" }),
            " Salin password ini sekarang. Setelah modal ditutup, password tidak akan ditampilkan lagi."
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3 justify-end", children: !newPassword ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: () => setShowResetPasswordModal(false),
            disabled: isResettingPassword,
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            className: "bg-amber-600 hover:bg-amber-700 text-white",
            onClick: handleResetPassword,
            disabled: isResettingPassword,
            children: isResettingPassword ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
              "Generating..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Key", className: "mr-2 h-4 w-4" }),
              "Generate Password"
            ] })
          }
        )
      ] }) : /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          className: "bg-green-600 hover:bg-green-700 text-white px-8",
          onClick: () => {
            setShowResetPasswordModal(false);
            setNewPassword(null);
          },
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "mr-2 h-4 w-4" }),
            "Selesai"
          ]
        }
      ) })
    ] }) })
  ] });
}
const $$DetailEditPangkalan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Detail & Edit Pangkalan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "DetailEditPangkalanContent", DetailEditPangkalanContent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/detail-edit-pangkalan/DetailEditPangkalanContent.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/detail-edit-pangkalan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/detail-edit-pangkalan.astro";
const $$url = "/detail-edit-pangkalan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DetailEditPangkalan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
