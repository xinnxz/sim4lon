import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.C63pe5Ia.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.BreR4teh.js";
import { A as AdminFooter } from "../_astro/AdminFooter.CHtO5w8Z.js";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { S as SafeIcon, B as Button, I as Input, f as authApi, u as uploadApi } from "../_astro/AuthGuard.71S_I7hh.js";
import { L as Label } from "../_astro/label.C1We_4rW.js";
import { C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "../_astro/card.CnUj7wdc.js";
import { j as Skeleton, A as Avatar, l as AvatarImage, k as AvatarFallback, S as Separator, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.TvdlGC6x.js";
import { toast } from "sonner";
import { A as AvatarCropperModal } from "../_astro/AvatarCropperModal.DsjTzd58.js";
import { renderers } from "../renderers.mjs";
const API_BASE_URL = "http://localhost:3000";
function EditProfilAdminForm() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", avatar_url: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await authApi.getProfile();
        setProfile(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          avatar_url: data.avatar_url
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi";
    } else if (formData.name.length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }
    if (formData.phone && !/^(\+62|0)[0-9]{9,12}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: void 0 }));
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
      setFormData((prev) => ({ ...prev, avatar_url: result.url }));
      toast.success("Foto profil berhasil diupload");
    } catch (error) {
      toast.error(error.message || "Gagal mengupload foto");
      setAvatarPreview(null);
    } finally {
      setIsUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Mohon periksa kembali data yang Anda masukkan");
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.updateProfile({
        name: formData.name,
        phone: formData.phone || void 0,
        avatar_url: formData.avatar_url === null ? null : formData.avatar_url || void 0
      });
      toast.success("Profil berhasil diperbarui");
      setTimeout(() => {
        window.location.href = "/profil";
      }, 1e3);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui profil");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    window.location.href = "/profil";
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };
  const getAvatarUrl = (url) => {
    if (!url) return void 0;
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}/api${url}`;
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:hidden px-4", children: [
        /* @__PURE__ */ jsx("div", { className: "glass-card rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-20 rounded-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-32 rounded-lg" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full rounded-lg" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full rounded-lg" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full rounded-lg" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden sm:block max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) }) })
    ] });
  }
  if (!profile) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-0", children: /* @__PURE__ */ jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 sm:p-8 text-center", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-10 w-10 mx-auto mb-3 text-destructive" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mb-3", children: "Gagal memuat profil" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => window.location.reload(), children: "Coba Lagi" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "sm:hidden space-y-3 animate-fadeInUp", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "px-3 py-1.5 bg-muted/30 -mx-4 -mt-4 mb-3 border-b border-border/50", children: /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Foto Profil" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-20 w-20 ring-2 ring-primary/20", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: avatarPreview || getAvatarUrl(formData.avatar_url), alt: formData.name }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-lg font-bold", children: getInitials(formData.name || "U") })
            ] }),
            isUploading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50 rounded-full", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin text-white" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/jpeg,image/png,image/webp",
                onChange: handleFileSelect,
                className: "hidden"
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => fileInputRef.current?.click(),
                disabled: isUploading || isSubmitting,
                className: "h-8 text-xs",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Camera", className: "mr-1.5 h-3.5 w-3.5" }),
                  "Pilih Foto"
                ]
              }
            ),
            formData.avatar_url && /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => {
                  setFormData((prev) => ({ ...prev, avatar_url: null }));
                  setAvatarPreview(null);
                },
                disabled: isSubmitting || isUploading,
                className: "h-8 text-xs text-destructive hover:text-destructive",
                children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "glass-card rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "px-4 py-2 bg-muted/30 border-b border-border/50", children: /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Informasi Profil" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name-mobile", className: "text-xs font-medium", children: "Nama Lengkap *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name-mobile",
                name: "name",
                type: "text",
                placeholder: "Nama lengkap",
                value: formData.name,
                onChange: handleChange,
                disabled: isSubmitting,
                className: `h-9 text-sm ${errors.name ? "border-destructive" : ""}`
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-destructive", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Email" }),
            /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground", children: profile.email }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Email tidak dapat diubah" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone-mobile", className: "text-xs font-medium", children: "Nomor Telepon" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone-mobile",
                name: "phone",
                type: "tel",
                placeholder: "08123456789",
                value: formData.phone,
                onChange: handleChange,
                disabled: isSubmitting,
                className: `h-9 text-sm ${errors.phone ? "border-destructive" : ""}`
              }
            ),
            errors.phone && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-destructive", children: errors.phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Role" }),
            /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-muted/50 rounded-md text-sm", children: profile.role === "ADMIN" ? "Administrator" : "Operator" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-4 pt-0", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: handleCancel,
              disabled: isSubmitting,
              className: "flex-1 h-9 text-xs",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "X", className: "mr-1.5 h-3.5 w-3.5" }),
                "Batal"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              disabled: isSubmitting || isUploading,
              size: "sm",
              className: "flex-1 h-9 text-xs bg-primary hover:bg-primary/90",
              children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
                "Menyimpan..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-1.5 h-3.5 w-3.5" }),
                "Simpan"
              ] })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hidden sm:block max-w-2xl mx-auto space-y-6 animate-fadeInUp", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(
            SafeIcon,
            {
              name: "ArrowLeft",
              className: "h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground",
              onClick: handleCancel
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Edit Profil" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Perbarui informasi dan foto profil Anda" })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Foto Profil" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Pilih dan crop foto profil Anda (maks. 5MB, format: JPEG, PNG, WebP)" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-28 w-28 border-4 border-primary/20", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: avatarPreview || getAvatarUrl(formData.avatar_url), alt: formData.name }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-2xl font-bold", children: getInitials(formData.name || "U") })
            ] }),
            isUploading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50 rounded-full", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-white" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/jpeg,image/png,image/webp",
                onChange: handleFileSelect,
                className: "hidden"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => fileInputRef.current?.click(),
                  disabled: isUploading || isSubmitting,
                  className: "w-full sm:w-auto",
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Camera", className: "mr-2 h-4 w-4" }),
                    "Pilih Foto"
                  ]
                }
              ),
              formData.avatar_url && /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    setFormData((prev) => ({ ...prev, avatar_url: null }));
                    setAvatarPreview(null);
                  },
                  disabled: isSubmitting || isUploading,
                  className: "text-destructive hover:text-destructive ml-2",
                  children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "mr-1 h-4 w-4" }),
                    "Hapus"
                  ]
                }
              )
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Profil" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Ubah data pribadi Anda di bawah ini" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "name", className: "text-sm font-medium", children: [
              "Nama Lengkap ",
              /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                name: "name",
                type: "text",
                placeholder: "Masukkan nama lengkap",
                value: formData.name,
                onChange: handleChange,
                disabled: isSubmitting,
                className: errors.name ? "border-destructive" : ""
              }
            ),
            errors.name && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
              errors.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Email" }),
            /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground", children: profile.email }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Email tidak dapat diubah" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", className: "text-sm font-medium", children: "Nomor Telepon" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone",
                name: "phone",
                type: "tel",
                placeholder: "Contoh: 08123456789 atau +6281234567890",
                value: formData.phone,
                onChange: handleChange,
                disabled: isSubmitting,
                className: errors.phone ? "border-destructive" : ""
              }
            ),
            errors.phone && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
              errors.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Role" }),
              /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-muted rounded-md text-sm", children: profile.role === "ADMIN" ? "Administrator" : "Operator" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Bergabung" }),
              /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-muted rounded-md text-sm", children: formatDate(profile.created_at) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-6 border-t", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleCancel,
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
                disabled: isSubmitting || isUploading,
                className: "flex-1 bg-primary hover:bg-primary/90",
                children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
                  "Menyimpan..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-4 w-4" }),
                  "Simpan Perubahan"
                ] })
              }
            )
          ] })
        ] }) })
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
    )
  ] });
}
const $$EditProfilAdmin = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Edit Profil Akun - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            ${renderComponent($$result4, "EditProfilAdminForm", EditProfilAdminForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/edit-profil-admin/EditProfilAdminForm.tsx", "client:component-export": "default" })}
          </div>
        </div>
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/edit-profil-admin.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/edit-profil-admin.astro";
const $$url = "/edit-profil-admin.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$EditProfilAdmin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
