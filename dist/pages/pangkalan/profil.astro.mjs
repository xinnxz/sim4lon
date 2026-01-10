import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.DfKLN4S1.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.D1CatXxQ.js";
import { A as AdminFooter } from "../../_astro/AdminFooter.DVGEP8G7.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "../../_astro/card.OLhQVURm.js";
import { e as authApi, S as SafeIcon, I as Input, B as Button, f as uploadApi } from "../../_astro/AuthGuard.Cq_0lvUi.js";
import { L as Label } from "../../_astro/label.DNnd65zo.js";
import { A as Avatar, m as AvatarImage, l as AvatarFallback, S as Separator, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, k as DialogFooter, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { A as AvatarCropperModal } from "../../_astro/AvatarCropperModal.Dl2gnPlO.js";
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
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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
  const handleChangePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Semua field harus diisi");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    try {
      setIsChangingPassword(true);
      await authApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Password berhasil diubah");
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.message || "Gagal mengubah password");
    } finally {
      setIsChangingPassword(false);
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
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Profil" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Kelola informasi akun Anda" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Akun" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Data akun login Anda" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(Avatar, { className: "h-20 w-20", children: [
                /* @__PURE__ */ jsx(AvatarImage, { src: getAvatarUrl() }),
                /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-100 text-blue-700 text-xl", children: profile ? getInitials(profile.name) : "P" })
              ] }),
              isUploading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50 rounded-full", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-6 w-6 animate-spin text-white" }) }),
              isEditing && /* @__PURE__ */ jsxs("label", { className: "absolute bottom-0 right-0 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors", children: [
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
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: profile?.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: profile?.email })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          isEditing ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nama" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  value: formData.name,
                  onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                  placeholder: "Masukkan nama"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "No. Telepon" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "phone",
                  value: formData.phone,
                  onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                  placeholder: "Contoh: 081234567890"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs(Button, { onClick: handleSave, disabled: isSubmitting, className: "bg-blue-600 hover:bg-blue-700", children: [
                isSubmitting ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }) : null,
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
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Nama" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Email" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No. Telepon" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.phone || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setIsEditing(true), children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "mr-2 h-4 w-4" }),
                "Edit Profil"
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setShowPasswordModal(true), children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "mr-2 h-4 w-4" }),
                "Ubah Password"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Pangkalan" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Data pangkalan Anda" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Kode" }),
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.pangkalans?.code || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Nama Pangkalan" }),
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.pangkalans?.name || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Alamat" }),
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: profile?.pangkalans?.address || "-" })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Untuk mengubah informasi pangkalan, silakan hubungi administrator." })
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
    /* @__PURE__ */ jsx(Dialog, { open: showPasswordModal, onOpenChange: setShowPasswordModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Ubah Password" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Masukkan password lama dan password baru Anda" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "oldPassword", children: "Password Lama" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "oldPassword",
              type: "password",
              value: passwordForm.oldPassword,
              onChange: (e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value }),
              placeholder: "Masukkan password lama"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "newPassword", children: "Password Baru" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "newPassword",
              type: "password",
              value: passwordForm.newPassword,
              onChange: (e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value }),
              placeholder: "Minimal 6 karakter"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Konfirmasi Password Baru" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "confirmPassword",
              type: "password",
              value: passwordForm.confirmPassword,
              onChange: (e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value }),
              placeholder: "Ulangi password baru"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
          setShowPasswordModal(false);
          setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        }, children: "Batal" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleChangePassword,
            disabled: isChangingPassword,
            className: "bg-blue-600 hover:bg-blue-700",
            children: [
              isChangingPassword && /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
              "Ubah Password"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
const $$Profil = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Profil - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "ProfilPangkalanPage", ProfilPangkalanPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/ProfilPangkalanPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
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
