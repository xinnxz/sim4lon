import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.k-1prjTp.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DVGEP8G7.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { S as SafeIcon, B as Button, I as Input, e as authApi, f as uploadApi } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { L as Label } from "../_astro/label.DNnd65zo.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "../_astro/card.OLhQVURm.js";
import { S as Separator, A as Avatar, m as AvatarImage, l as AvatarFallback, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { toast } from "sonner";
import { A as AvatarCropperModal } from "../_astro/AvatarCropperModal.Dl2gnPlO.js";
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
      newErrors.phone = "Format nomor telepon tidak valid (contoh: 08xxx atau +62xxx)";
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
      toast.error("Gambar kudu wajib JPEG, PNG, WebP.");
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
    console.log("handleCropComplete called with blob:", croppedBlob.size, "bytes");
    const localPreviewUrl = URL.createObjectURL(croppedBlob);
    console.log("Local preview URL created:", localPreviewUrl);
    setAvatarPreview(localPreviewUrl);
    setIsUploading(true);
    try {
      const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      console.log("File created:", file.name, file.size, "bytes");
      const result = await uploadApi.uploadAvatar(file);
      console.log("Upload result:", result);
      setFormData((prev) => ({ ...prev, avatar_url: result.url }));
      toast.success("Foto profil berhasil diupload");
    } catch (error) {
      console.error("Upload error:", error);
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
    return /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto min-h-[400px] flex items-center justify-center", children: /* @__PURE__ */ jsx(Card, { className: "shadow-card w-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) }) });
  }
  if (!profile) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto min-h-[400px] flex items-center justify-center", children: /* @__PURE__ */ jsx(Card, { className: "shadow-card w-full", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-12 w-12 mx-auto mb-4 text-destructive" }),
      /* @__PURE__ */ jsx("p", { className: "text-destructive", children: "Gagal memuat profil" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", className: "mt-4", onClick: () => window.location.reload(), children: "Coba Lagi" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto space-y-6 animate-fadeInUp", children: [
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
const $$EditProfilAdmin = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Edit Profil Admin - SIM4LON" }, { default: ($$result2) => renderTemplate`
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
