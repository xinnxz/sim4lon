import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.C7j8yK_x.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D7Nub16D.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { C as Card, b as CardHeader, d as CardTitle, e as CardDescription, a as CardContent } from "../../_astro/card.CnUj7wdc.js";
import { f as authApi, S as SafeIcon, I as Input, B as Button, u as uploadApi } from "../../_astro/AuthGuard.71S_I7hh.js";
import { L as Label } from "../../_astro/label.C1We_4rW.js";
import { A as Avatar, l as AvatarImage, k as AvatarFallback, S as Separator, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { A as AvatarCropperModal } from "../../_astro/AvatarCropperModal.DsjTzd58.js";
import { C as ChangePasswordModal } from "../../_astro/ChangePasswordModal.-vmF2U3N.js";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
const API_BASE_URL = "http://localhost:3000";
function ProfilPangkalanPage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await authApi.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone || ""
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Gagal memuat profil");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }
    try {
      setIsSubmitting(true);
      await authApi.updateProfile(formData);
      await fetchProfile();
      setIsEditing(false);
      setAvatarPreview(null);
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui profil");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error("Format gambar harus JPEG, PNG, atau WebP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleCropComplete = async (croppedBlob) => {
    const localPreviewUrl = URL.createObjectURL(croppedBlob);
    setAvatarPreview(localPreviewUrl);
    setIsUploading(true);
    try {
      const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      const result = await uploadApi.uploadAvatar(file);
      await authApi.updateProfile({ avatar_url: result.url });
      await fetchProfile();
      toast.success("Foto profil berhasil diperbarui");
    } catch (error) {
      toast.error(error.message || "Gagal upload foto");
      setAvatarPreview(null);
    } finally {
      setIsUploading(false);
    }
  };
  const getInitials = (name) => {
    return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
  };
  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (!profile?.avatar_url) return void 0;
    if (profile.avatar_url.startsWith("http")) return profile.avatar_url;
    return `${API_BASE_URL}/api${profile.avatar_url}`;
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-blue-500" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-6 dashboard-gradient-bg min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent", children: "Profil Saya" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Kelola informasi akun dan pangkalan Anda" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "glass-card border-0", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "bg-gradient-to-r from-emerald-600/10 to-emerald-400/5 rounded-t-lg border-b border-emerald-100/50 dark:border-emerald-900/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-emerald-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "UserCircle", className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Informasi Akun" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Data akun login Anda" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxs(Avatar, { className: "h-20 w-20 ring-4 ring-emerald-100 dark:ring-emerald-900/50", children: [
                /* @__PURE__ */ jsx(AvatarImage, { src: getAvatarUrl() }),
                /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xl font-semibold", children: profile ? getInitials(profile.name) : "P" })
              ] }),
              isUploading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50 rounded-full", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin text-white" }) }),
              isEditing && /* @__PURE__ */ jsxs("label", { className: "absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-all shadow-lg hover:scale-110", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Camera", className: "h-4 w-4 text-white" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: fileInputRef,
                    type: "file",
                    accept: "image/jpeg,image/png,image/webp",
                    onChange: handleFileSelect,
                    className: "hidden",
                    disabled: isUploading
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-lg", children: profile?.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: profile?.email }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "h-3 w-3" }),
                "Pangkalan"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          isEditing ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-sm font-medium", children: "Nama" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  value: formData.name,
                  onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                  placeholder: "Masukkan nama",
                  className: "bg-background"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "phone", className: "text-sm font-medium", children: "No. Telepon" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "phone",
                  value: formData.phone,
                  onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                  placeholder: "Contoh: 081234567890",
                  className: "bg-background"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsxs(Button, { onClick: handleSave, disabled: isSubmitting, className: "bg-emerald-600 hover:bg-emerald-700 text-white", children: [
                isSubmitting ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-4 w-4" }),
                "Simpan"
              ] }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
                setIsEditing(false);
                setAvatarPreview(null);
                setFormData({
                  name: profile?.name || "",
                  phone: profile?.phone || ""
                });
              }, children: "Batal" })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800", children: /* @__PURE__ */ jsx(SafeIcon, { name: "User", className: "h-4 w-4 text-gray-500" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nama" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Mail", className: "h-4 w-4 text-gray-500" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Email" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-4 w-4 text-gray-500" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "No. Telepon" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.phone || "-" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setIsEditing(true), className: "hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "mr-2 h-4 w-4" }),
                "Edit Profil"
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setShowPasswordModal(true), className: "hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700", children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "mr-2 h-4 w-4" }),
                "Ubah Password"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "glass-card border-0", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "bg-gradient-to-r from-blue-600/10 to-blue-400/5 rounded-t-lg border-b border-blue-100/50 dark:border-blue-900/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-blue-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Store", className: "h-5 w-5 text-blue-600 dark:text-blue-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Informasi Pangkalan" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Data pangkalan Anda" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Hash", className: "h-4 w-4 text-gray-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Kode Pangkalan" }),
              /* @__PURE__ */ jsx("p", { className: "font-mono font-semibold text-blue-600", children: profile?.pangkalans?.code || "-" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Building2", className: "h-4 w-4 text-gray-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nama Pangkalan" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: profile?.pangkalans?.name || "-" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800", children: /* @__PURE__ */ jsx(SafeIcon, { name: "MapPin", className: "h-4 w-4 text-gray-500" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Alamat Lengkap" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.pangkalans?.address || "-" }),
              profile?.pangkalans?.region && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: profile.pangkalans.region })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, { className: "my-2" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-4 w-4 text-amber-600 shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-700 dark:text-amber-400", children: "Untuk mengubah informasi pangkalan, silakan hubungi administrator." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      AvatarCropperModal,
      {
        open: cropperOpen,
        onOpenChange: setCropperOpen,
        imageSrc: selectedImage,
        onCropComplete: handleCropComplete
      }
    ),
    /* @__PURE__ */ jsx(
      ChangePasswordModal,
      {
        open: showPasswordModal,
        onOpenChange: setShowPasswordModal
      }
    )
  ] });
}
const $$Profil = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Profil - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "ProfilPangkalanPage", ProfilPangkalanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/ProfilPangkalanPage.tsx", "client:component-export": "default" })}
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/profil.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/profil.astro";
const $$url = "/pangkalan/profil.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Profil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
