import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DMB591cw.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.B0qA0Ni6.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DJv7CO6O.js";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "../_astro/tabs.DCLuprNz.js";
import { C as Card, b as CardHeader, d as CardTitle, e as CardDescription, a as CardContent } from "../_astro/card.CnUj7wdc.js";
import { k as companyProfileApi, S as SafeIcon, B as Button, I as Input } from "../_astro/AuthGuard.BLl0uVB7.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { L as Label } from "../_astro/label.C1We_4rW.js";
import { T as Textarea } from "../_astro/textarea.F19kpFWl.js";
import { toast } from "sonner";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.B8lpUjZQ.js";
import { S as Switch } from "../_astro/switch.Q6Vgrz6u.js";
import { c as clearAppSettingsCache } from "../_astro/useAppSettings.CMGuxe4k.js";
import { P as ProtectedDashboard } from "../_astro/ProtectedDashboard.igvMWLOj.js";
import { renderers } from "../renderers.mjs";
const initialProfile = {
  companyName: "",
  address: "",
  phone: "",
  email: "",
  picName: "",
  sppbeNumber: "",
  spbeSupplierName: "",
  region: "",
  logo: null
};
function CompanyProfileSettings() {
  const [profile, setProfile] = useState(initialProfile);
  const [agenId, setAgenId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await companyProfileApi.get();
      setProfile({
        companyName: data.company_name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        picName: data.pic_name || "",
        sppbeNumber: data.sppbe_number || "",
        spbeSupplierName: data.spbe_supplier_name || "",
        region: data.region || "",
        logo: data.logo_url || null
      });
      setAgenId(data.id || null);
      if (data.logo_url) {
        setLogoPreview(data.logo_url);
      }
    } catch (error) {
      console.error("Failed to load company profile:", error);
      toast.error("Gagal memuat profil perusahaan");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setProfile((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    if (!profile.companyName.trim()) {
      toast.error("Nama perusahaan wajib diisi");
      return;
    }
    if (!profile.address.trim()) {
      toast.error("Alamat wajib diisi");
      return;
    }
    setIsSaving(true);
    try {
      await companyProfileApi.update({
        company_name: profile.companyName,
        address: profile.address,
        phone: profile.phone || void 0,
        email: profile.email || void 0,
        pic_name: profile.picName || void 0,
        sppbe_number: profile.sppbeNumber || void 0,
        spbe_supplier_name: profile.spbeSupplierName || void 0,
        region: profile.region || void 0,
        logo_url: profile.logo || void 0
      });
      toast.success("Profil perusahaan berhasil disimpan");
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "ml-3 text-muted-foreground", children: "Memuat profil..." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Informasi Perusahaan" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Data distributor yang muncul di invoice dan laporan PDF" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
        agenId && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Key", className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 font-medium", children: "ID Agen (Kode Koneksi)" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-800 tracking-wider", children: agenId })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "border-blue-300 text-blue-600 hover:bg-blue-100",
              onClick: () => {
                navigator.clipboard.writeText(agenId);
                toast.success("ID Agen disalin!");
              },
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Copy", className: "h-4 w-4 mr-1" }),
                "Salin"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-6 p-4 rounded-xl bg-muted/30 border border-dashed", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: logoPreview ? /* @__PURE__ */ jsx(
            "img",
            {
              src: logoPreview,
              alt: "Logo Preview",
              className: "w-24 h-24 rounded-xl object-cover border-2 border-primary/20"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Image", className: "h-8 w-8 text-muted-foreground/50" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "Logo Perusahaan" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Upload logo untuk ditampilkan di header dan invoice. Format: JPG, PNG. Maks 2MB." }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "file",
                accept: "image/jpeg,image/png",
                onChange: handleLogoChange,
                className: "max-w-xs h-9 text-sm cursor-pointer"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "companyName", className: "text-sm font-medium", children: [
              "Nama Distributor/Agen ",
              /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "companyName",
                value: profile.companyName,
                onChange: (e) => handleChange("companyName", e.target.value),
                placeholder: "PT. Sigap Elpiji Nusantara",
                className: "h-10"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "sppbeNumber", className: "text-sm font-medium", children: "Nomor SPBE/SIID" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "sppbeNumber",
                value: profile.sppbeNumber,
                onChange: (e) => handleChange("sppbeNumber", e.target.value),
                placeholder: "997904",
                className: "h-10"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nomor Surat Penunjukan / SIID To" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "spbeSupplierName", className: "text-sm font-medium", children: "Nama Supplier SPBE" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "spbeSupplierName",
              value: profile.spbeSupplierName,
              onChange: (e) => handleChange("spbeSupplierName", e.target.value),
              placeholder: "PT. RENATA PUTRA SENTOSA",
              className: "h-10"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nama perusahaan SPBE untuk sumber penerimaan stok" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "address", className: "text-sm font-medium", children: [
            "Alamat Lengkap ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "address",
              value: profile.address,
              onChange: (e) => handleChange("address", e.target.value),
              placeholder: "Jl. HR Rasuna Said Kav. X-8, No. 5E, Jakarta Selatan",
              className: "min-h-[80px] resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "region", className: "text-sm font-medium", children: "Wilayah/Region" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "region",
              value: profile.region,
              onChange: (e) => handleChange("region", e.target.value),
              placeholder: "JAWA BARAT, KABUPATEN CIANJUR",
              className: "h-10"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Wilayah operasional untuk laporan Pertamina" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-5 w-5 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Kontak" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Informasi kontak untuk keperluan komunikasi" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", className: "text-sm font-medium", children: "Nomor Telepon" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone",
                type: "tel",
                value: profile.phone,
                onChange: (e) => handleChange("phone", e.target.value),
                placeholder: "021-98765432",
                className: "h-10"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-sm font-medium", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: profile.email,
                onChange: (e) => handleChange("email", e.target.value),
                placeholder: "info@distributor.com",
                className: "h-10"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "picName", className: "text-sm font-medium", children: "Nama PIC (Person In Charge)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "picName",
              value: profile.picName,
              onChange: (e) => handleChange("picName", e.target.value),
              placeholder: "Nama penanggung jawab",
              className: "h-10"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          onClick: loadProfile,
          className: "gap-2",
          disabled: isLoading,
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RotateCcw", className: "h-4 w-4" }),
            "Reset"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleSave,
          disabled: isSaving,
          className: "gap-2 bg-primary hover:bg-primary/90 min-w-[140px]",
          children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }),
            "Menyimpan..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "h-4 w-4" }),
            "Simpan Profil"
          ] })
        }
      )
    ] })
  ] });
}
const initialSettings$1 = {
  theme: "system",
  language: "id",
  dateFormat: "DD/MM/YYYY",
  accentColor: "green"
};
const themeOptions = [
  { value: "light", label: "Terang", icon: "Sun", description: "Mode terang untuk penggunaan siang hari" },
  { value: "dark", label: "Gelap", icon: "Moon", description: "Mode gelap untuk penggunaan malam hari" },
  { value: "system", label: "Sistem", icon: "Monitor", description: "Ikuti pengaturan sistem operasi" }
];
const accentColors = [
  { value: "green", label: "Hijau", color: "bg-emerald-600", description: "Default Pertamina" },
  { value: "blue", label: "Biru", color: "bg-blue-600", description: "Professional Blue" },
  { value: "red", label: "Merah", color: "bg-red-600", description: "Bold & Modern" }
];
function AppearanceSettings() {
  const [settings, setSettings] = useState(initialSettings$1);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedAccent = localStorage.getItem("accentColor");
    if (savedTheme) {
      setSettings((prev) => ({ ...prev, theme: savedTheme }));
    }
    if (savedAccent) {
      setSettings((prev) => ({ ...prev, accentColor: savedAccent }));
      document.documentElement.setAttribute("data-accent", savedAccent);
    }
  }, []);
  const handleThemeChange = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
    const root = document.documentElement;
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  };
  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (field === "accentColor") {
      document.documentElement.setAttribute("data-accent", value);
    }
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem("theme", settings.theme);
      localStorage.setItem("accentColor", settings.accentColor);
      localStorage.setItem("appearance_settings", JSON.stringify(settings));
      toast.success("Pengaturan tampilan berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-3 px-3 sm:px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Palette", className: "h-4 w-4 text-amber-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm sm:text-base", children: "Tema Aplikasi" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs hidden sm:block", children: "Pilih tampilan yang nyaman untuk mata Anda" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "px-3 pb-3 sm:px-4 sm:pb-4", children: /* @__PURE__ */ jsx("div", { className: "grid gap-2 grid-cols-3", children: themeOptions.map((option) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleThemeChange(option.value),
          className: `relative flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:border-primary/50 hover:bg-muted/50
                  ${settings.theme === option.value ? "border-primary bg-primary/5 shadow-sm" : "border-muted-foreground/20"}`,
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg transition-all duration-200
                  ${settings.theme === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
                children: /* @__PURE__ */ jsx(SafeIcon, { name: option.icon, className: "h-4 w-4 sm:h-5 sm:w-5" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: `text-xs sm:text-sm font-medium ${settings.theme === option.value ? "text-primary" : "text-foreground"}`, children: option.label }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 hidden sm:block line-clamp-1", children: option.description })
            ] }),
            settings.theme === option.value && /* @__PURE__ */ jsx("div", { className: "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-2.5 w-2.5" }) })
          ]
        },
        option.value
      )) }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-3 px-3 sm:px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Brush", className: "h-4 w-4 text-purple-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm sm:text-base", children: "Warna Aksen" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs hidden sm:block", children: "Pilih warna utama untuk tombol dan elemen interaktif" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "px-3 pb-3 sm:px-4 sm:pb-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: accentColors.map((color) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleChange("accentColor", color.value),
          className: `flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all duration-200
                  ${settings.accentColor === color.value ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded-full ${color.color}` }),
            /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm font-medium", children: color.label }),
            settings.accentColor === color.value && /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-3.5 w-3.5 text-primary" })
          ]
        },
        color.value
      )) }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-3 px-3 sm:px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Globe", className: "h-4 w-4 text-cyan-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm sm:text-base", children: "Regional" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs hidden sm:block", children: "Pengaturan bahasa dan format tanggal" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "px-3 pb-3 sm:px-4 sm:pb-4", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "language", className: "text-xs font-medium", children: "Bahasa" }),
          /* @__PURE__ */ jsxs(Select, { value: settings.language, onValueChange: (v) => handleChange("language", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "language", className: "h-8 text-xs sm:text-sm", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "id", children: "🇮🇩 Indonesia" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "en", children: "🇺🇸 English" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "dateFormat", className: "text-xs font-medium", children: "Format Tanggal" }),
          /* @__PURE__ */ jsxs(Select, { value: settings.dateFormat, onValueChange: (v) => handleChange("dateFormat", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "dateFormat", className: "h-8 text-xs sm:text-sm", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "DD/MM/YYYY", children: "DD/MM/YYYY" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "YYYY-MM-DD", children: "YYYY-MM-DD" })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setSettings(initialSettings$1),
          className: "gap-1.5 h-8 text-xs",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RotateCcw", className: "h-3.5 w-3.5" }),
            "Reset"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleSave,
          disabled: isSaving,
          size: "sm",
          className: "gap-1.5 h-8 text-xs bg-primary hover:bg-primary/90 min-w-[100px]",
          children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-3.5 w-3.5 animate-spin" }),
            "Menyimpan..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "h-3.5 w-3.5" }),
            "Simpan"
          ] })
        }
      )
    ] })
  ] });
}
const initialSettings = {
  criticalStockLimit: 10,
  ppnPercentage: 12,
  paymentDueDays: 7,
  minOrderQuantity: 1,
  emailNotifications: true,
  stockAlerts: true
};
function ApplicationSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const profile = await companyProfileApi.get();
        const savedStockAlerts = localStorage.getItem("app_stockAlerts");
        const savedEmailNotifications = localStorage.getItem("app_emailNotifications");
        setSettings((prev) => ({
          ...prev,
          ppnPercentage: Number(profile.ppn_rate) || 12,
          criticalStockLimit: profile.critical_stock_limit || 10,
          paymentDueDays: Number(profile.payment_due_days) || 7,
          minOrderQuantity: Number(profile.min_order_quantity) || 1,
          // Client-side preferences from localStorage
          stockAlerts: savedStockAlerts !== null ? savedStockAlerts === "true" : true,
          emailNotifications: savedEmailNotifications !== null ? savedEmailNotifications === "true" : true
        }));
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);
  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await companyProfileApi.update({
        ppn_rate: settings.ppnPercentage,
        critical_stock_limit: settings.criticalStockLimit,
        payment_due_days: settings.paymentDueDays,
        min_order_quantity: settings.minOrderQuantity
      });
      localStorage.setItem("app_stockAlerts", String(settings.stockAlerts));
      localStorage.setItem("app_emailNotifications", String(settings.emailNotifications));
      clearAppSettingsCache();
      toast.success("Pengaturan aplikasi berhasil disimpan");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Package", className: "h-5 w-5 text-orange-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Pengaturan Stok" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Konfigurasi batas stok dan notifikasi" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "criticalStockLimit", className: "text-sm font-medium", children: "Batas Stok Kritis (Tabung)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "criticalStockLimit",
              type: "number",
              min: "1",
              max: "1000",
              value: settings.criticalStockLimit,
              onChange: (e) => handleChange("criticalStockLimit", parseInt(e.target.value) || 0),
              className: "h-10"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Notifikasi akan muncul jika stok di bawah angka ini" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-muted/30 border", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: "Peringatan Stok Menipis" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Tampilkan notifikasi saat stok di bawah batas kritis" })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: settings.stockAlerts,
              onCheckedChange: (checked) => handleChange("stockAlerts", checked)
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-5 w-5 text-green-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Harga & Pembayaran" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Pengaturan pajak, pembayaran, dan biaya pengiriman" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "ppnPercentage", className: "text-sm font-medium", children: "Persentase PPN (%)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "ppnPercentage",
                type: "number",
                min: "0",
                max: "100",
                value: settings.ppnPercentage,
                onChange: (e) => handleChange("ppnPercentage", parseFloat(e.target.value) || 0),
                className: "h-10"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Tarif PPN untuk produk non-subsidi" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "paymentDueDays", className: "text-sm font-medium", children: "Jatuh Tempo Pembayaran (Hari)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "paymentDueDays",
                type: "number",
                min: "1",
                max: "90",
                value: settings.paymentDueDays,
                onChange: (e) => handleChange("paymentDueDays", parseInt(e.target.value) || 7),
                className: "h-10"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Batas hari untuk pembayaran pesanan (default: 7 hari)" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "minOrderQuantity", className: "text-sm font-medium", children: "Minimum Order (Tabung)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "minOrderQuantity",
              type: "number",
              min: "1",
              max: "100",
              value: settings.minOrderQuantity,
              onChange: (e) => handleChange("minOrderQuantity", parseInt(e.target.value) || 1),
              className: "h-10"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Jumlah minimum tabung per pesanan (default: 1)" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-primary mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Konfigurasi Pembayaran & Order" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'Pesanan yang melewati jatuh tempo akan ditandai sebagai "overdue" di daftar pesanan. Pesanan dengan jumlah tabung kurang dari minimum akan ditolak.' })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Bell", className: "h-5 w-5 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Notifikasi" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Pengaturan pemberitahuan sistem" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-muted/30 border", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: "Notifikasi Email" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Kirim email notifikasi untuk pesanan baru dan pembayaran" })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: settings.emailNotifications,
              onCheckedChange: (checked) => handleChange("emailNotifications", checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-primary mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Konfigurasi Email" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Untuk mengaktifkan notifikasi email, pastikan email perusahaan sudah dikonfigurasi di tab Profil Perusahaan." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => setSettings(initialSettings),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "RotateCcw", className: "h-4 w-4" }),
            "Reset"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleSave,
          disabled: isSaving,
          className: "gap-2 bg-primary hover:bg-primary/90 min-w-[140px]",
          children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 animate-spin" }),
            "Menyimpan..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "h-4 w-4" }),
            "Simpan Pengaturan"
          ] })
        }
      )
    ] })
  ] });
}
const PROFILE_CACHE_KEY = "sim4lon_user_profile";
function getUserRole() {
  if (typeof window === "undefined") return "OPERATOR";
  try {
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY);
    if (cached) {
      const profile = JSON.parse(cached);
      return profile.role || "OPERATOR";
    }
  } catch {
  }
  return "OPERATOR";
}
function SettingsPage() {
  const [userRole, setUserRole] = useState("ADMIN");
  const allTabs = [
    { id: "profile", label: "Profil Perusahaan", icon: "Building2", adminOnly: true },
    { id: "appearance", label: "Tampilan", icon: "Palette" },
    { id: "application", label: "Aplikasi", icon: "Settings2", adminOnly: true }
  ];
  const visibleTabs = userRole === "ADMIN" ? allTabs : allTabs.filter((tab) => !tab.adminOnly);
  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || "appearance");
  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    const tabs = role === "ADMIN" ? allTabs : allTabs.filter((t) => !t.adminOnly);
    if (!tabs.find((t) => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id || "appearance");
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-secondary/5", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Pengaturan",
        subtitle: userRole === "ADMIN" ? "Kelola konfigurasi dan preferensi aplikasi SIM4LON" : "Atur tampilan dan preferensi Anda"
      }
    ),
    /* @__PURE__ */ jsx(Card, { className: "border-0 shadow-lg animate-fadeInUp overflow-hidden", style: { animationDelay: "0.1s" }, children: /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b bg-gradient-to-r from-muted/50 to-muted/30", children: /* @__PURE__ */ jsx(TabsList, { className: "w-full justify-start gap-0 bg-transparent border-0 h-auto p-0 rounded-none", children: visibleTabs.map((tab) => /* @__PURE__ */ jsxs(
        TabsTrigger,
        {
          value: tab.id,
          className: "relative flex items-center gap-2 px-6 py-4 text-sm font-medium rounded-none border-0 transition-all duration-300 \r\n                    data-[state=active]:bg-background data-[state=active]:shadow-sm\r\n                    data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-background/50",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: tab.icon, className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: tab.label }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 transition-transform duration-300 data-[state=active]:scale-x-100",
                "data-state": activeTab === tab.id ? "active" : "inactive"
              }
            )
          ]
        },
        tab.id
      )) }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        visibleTabs.some((t) => t.id === "profile") && /* @__PURE__ */ jsx(TabsContent, { value: "profile", className: "mt-0 animate-fadeIn", children: /* @__PURE__ */ jsx(CompanyProfileSettings, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "appearance", className: "mt-0 animate-fadeIn", children: /* @__PURE__ */ jsx(AppearanceSettings, {}) }),
        visibleTabs.some((t) => t.id === "application") && /* @__PURE__ */ jsx(TabsContent, { value: "application", className: "mt-0 animate-fadeIn", children: /* @__PURE__ */ jsx(ApplicationSettings, {}) })
      ] })
    ] }) })
  ] });
}
const $$Pengaturan = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Pengaturan - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "SettingsPage", SettingsPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pengaturan/SettingsPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pengaturan.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pengaturan.astro";
const $$url = "/pengaturan.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Pengaturan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
