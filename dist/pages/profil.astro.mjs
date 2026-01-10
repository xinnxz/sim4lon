import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.k-1prjTp.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DVGEP8G7.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "../_astro/card.OLhQVURm.js";
import { B as Badge, S as Separator, A as Avatar, m as AvatarImage, l as AvatarFallback, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { S as SafeIcon, B as Button, e as authApi, I as Input } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { L as Label } from "../_astro/label.DNnd65zo.js";
import { A as Alert, a as AlertDescription } from "../_astro/alert.2NW-baqQ.js";
import { toast } from "sonner";
import { renderers } from "../renderers.mjs";
const API_BASE_URL = "http://localhost:3000";
const getAvatarUrl = (url) => {
  if (!url) return void 0;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/api${url}`;
};
function ProfileCard() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await authApi.getProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Card, { className: "border shadow-card", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-muted-foreground" }) }) });
  }
  if (error || !profile) {
    return /* @__PURE__ */ jsx(Card, { className: "border shadow-card", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-12 w-12 mx-auto mb-4 text-destructive" }),
      /* @__PURE__ */ jsx("p", { className: "text-destructive", children: error || "Profil tidak ditemukan" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          className: "mt-4",
          onClick: () => window.location.reload(),
          children: "Coba Lagi"
        }
      )
    ] }) });
  }
  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Profil" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Detail akun Anda" })
      ] }),
      /* @__PURE__ */ jsxs(
        Badge,
        {
          variant: "outline",
          className: `${profile.is_active ? "bg-green-50 text-primary border-primary/30" : "bg-gray-50"}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full mr-2 ${profile.is_active ? "bg-primary" : "bg-gray-400"}` }),
            profile.is_active ? "Aktif" : "Tidak Aktif"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-6 mb-8", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "h-24 w-24 shrink-0", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: getAvatarUrl(profile.avatar_url), alt: profile.name }),
          /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-lg font-bold", children: initials })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: profile.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-primary font-medium mt-1", children: profile.role === "ADMIN" ? "Administrator" : "Operator" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Separator, { className: "my-6" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Informasi Kontak" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Mail", className: "h-5 w-5 text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Email" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground break-all", children: profile.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Phone", className: "h-5 w-5 text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Telepon" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: profile.phone || "-" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Separator, { className: "my-6" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Detail Akun" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "ID User" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-mono font-medium text-foreground", children: profile.code || "USR-001" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Tanggal Bergabung" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: formatDate(profile.created_at) })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function ChangePasswordModal({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const validateForm = () => {
    const newErrors = {};
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Kata sandi lama harus diisi";
    }
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Kata sandi baru harus diisi";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Kata sandi baru minimal 8 karakter";
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = "Kata sandi harus mengandung huruf kecil";
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = "Kata sandi harus mengandung huruf besar";
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = "Kata sandi harus mengandung angka";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi kata sandi harus diisi";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Kata sandi tidak cocok";
    }
    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = "Kata sandi baru harus berbeda dengan kata sandi lama";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: void 0
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      await authApi.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      toast.success("Kata sandi berhasil diubah");
      setTimeout(() => {
        onOpenChange(false);
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setErrors({});
        setShowPasswords({ old: false, new: false, confirm: false });
      }, 500);
    } catch (error) {
      const message = error.message || "Terjadi kesalahan saat mengubah kata sandi";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setErrors({});
    setShowPasswords({ old: false, new: false, confirm: false });
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md sm:max-w-lg", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "h-5 w-5 text-primary" }),
        "Ubah Kata Sandi"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Masukkan kata sandi lama dan baru Anda. Kata sandi harus minimal 8 karakter." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 max-h-[70vh] overflow-y-auto pr-4", children: [
      errors.general && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: errors.general })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "oldPassword", className: "text-sm font-medium", children: [
          "Kata Sandi Lama ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "oldPassword",
              name: "oldPassword",
              type: showPasswords.old ? "text" : "password",
              placeholder: "Masukkan kata sandi lama Anda",
              value: formData.oldPassword,
              onChange: handleChange,
              disabled: isLoading,
              className: errors.oldPassword ? "border-destructive" : "",
              autoComplete: "current-password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPasswords((prev) => ({ ...prev, old: !prev.old })),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              tabIndex: -1,
              children: /* @__PURE__ */ jsx(
                SafeIcon,
                {
                  name: showPasswords.old ? "EyeOff" : "Eye",
                  className: "h-4 w-4"
                }
              )
            }
          )
        ] }),
        errors.oldPassword && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-3 w-3" }),
          errors.oldPassword
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "newPassword", className: "text-sm font-medium", children: [
          "Kata Sandi Baru ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "newPassword",
              name: "newPassword",
              type: showPasswords.new ? "text" : "password",
              placeholder: "Masukkan kata sandi baru Anda",
              value: formData.newPassword,
              onChange: handleChange,
              disabled: isLoading,
              className: errors.newPassword ? "border-destructive" : "",
              autoComplete: "new-password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPasswords((prev) => ({ ...prev, new: !prev.new })),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              tabIndex: -1,
              children: /* @__PURE__ */ jsx(
                SafeIcon,
                {
                  name: showPasswords.new ? "EyeOff" : "Eye",
                  className: "h-4 w-4"
                }
              )
            }
          )
        ] }),
        errors.newPassword && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-3 w-3" }),
          errors.newPassword
        ] }),
        formData.newPassword && /* @__PURE__ */ jsxs("div", { className: "mt-2 p-2 bg-secondary rounded text-xs space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Persyaratan:" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxs("li", { className: `flex items-center gap-1 ${formData.newPassword.length >= 8 ? "text-primary" : "text-muted-foreground"}`, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: formData.newPassword.length >= 8 ? "Check" : "X", className: "h-3 w-3" }),
              "Minimal 8 karakter"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: `flex items-center gap-1 ${/(?=.*[a-z])/.test(formData.newPassword) ? "text-primary" : "text-muted-foreground"}`, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: /(?=.*[a-z])/.test(formData.newPassword) ? "Check" : "X", className: "h-3 w-3" }),
              "Huruf kecil"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: `flex items-center gap-1 ${/(?=.*[A-Z])/.test(formData.newPassword) ? "text-primary" : "text-muted-foreground"}`, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: /(?=.*[A-Z])/.test(formData.newPassword) ? "Check" : "X", className: "h-3 w-3" }),
              "Huruf besar"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: `flex items-center gap-1 ${/(?=.*\d)/.test(formData.newPassword) ? "text-primary" : "text-muted-foreground"}`, children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: /(?=.*\d)/.test(formData.newPassword) ? "Check" : "X", className: "h-3 w-3" }),
              "Angka"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "confirmPassword", className: "text-sm font-medium", children: [
          "Konfirmasi Kata Sandi ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "confirmPassword",
              name: "confirmPassword",
              type: showPasswords.confirm ? "text" : "password",
              placeholder: "Konfirmasi kata sandi baru Anda",
              value: formData.confirmPassword,
              onChange: handleChange,
              disabled: isLoading,
              className: errors.confirmPassword ? "border-destructive" : "",
              autoComplete: "new-password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm })),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              tabIndex: -1,
              children: /* @__PURE__ */ jsx(
                SafeIcon,
                {
                  name: showPasswords.confirm ? "EyeOff" : "Eye",
                  className: "h-4 w-4"
                }
              )
            }
          )
        ] }),
        errors.confirmPassword && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-3 w-3" }),
          errors.confirmPassword
        ] }),
        formData.newPassword && formData.confirmPassword && /* @__PURE__ */ jsxs("div", { className: `text-xs flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? "text-primary" : "text-destructive"}`, children: [
          /* @__PURE__ */ jsx(
            SafeIcon,
            {
              name: formData.newPassword === formData.confirmPassword ? "Check" : "X",
              className: "h-3 w-3"
            }
          ),
          formData.newPassword === formData.confirmPassword ? "Kata sandi cocok" : "Kata sandi tidak cocok"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4 border-t mt-6", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleCancel,
            disabled: isLoading,
            className: "flex-1",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isLoading,
            className: "flex-1 bg-primary hover:bg-primary/90",
            children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
              "Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-4 w-4" }),
              "Simpan Kata Sandi"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function ProfileActions() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Edit Profil" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Perbarui informasi pribadi Anda" })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Ubah nama, email, nomor telepon, dan informasi profil lainnya." }),
        /* @__PURE__ */ jsx("a", { href: "/edit-profil-admin", children: /* @__PURE__ */ jsxs(Button, { className: "w-full bg-primary hover:bg-primary/90 text-primary-foreground", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-4 w-4 mr-2" }),
          "Edit Profil"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Keamanan" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Kelola kata sandi akun Anda" })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Ubah kata sandi untuk menjaga keamanan akun Anda." }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => setIsChangePasswordOpen(true),
            variant: "outline",
            className: "w-full border-primary/30 hover:bg-primary/5",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Lock", className: "h-4 w-4 mr-2" }),
              "Ubah Password"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "h-5 w-5 text-primary" }),
        "Status Akun"
      ] }) }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full ${profile?.is_active ? "bg-primary" : "bg-gray-400"}` }),
            profile?.is_active ? "Aktif" : "Tidak Aktif"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Terakhir Login" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Sesi saat ini" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(ChangePasswordModal, { open: isChangePasswordOpen, onOpenChange: setIsChangePasswordOpen })
  ] });
}
const $$Profil = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Profil Admin - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        <div class="flex-1 overflow-auto">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div class="mb-8 animate-fadeInDown">
              <h1 class="text-3xl font-bold text-foreground">Profil Admin</h1>
              <p class="text-muted-foreground mt-2">Kelola informasi profil dan keamanan akun Anda</p>
            </div>

            
            <div class="grid gap-8 lg:grid-cols-3">
              
              <div class="lg:col-span-2 animate-fadeInUp">
                ${renderComponent($$result4, "ProfileCard", ProfileCard, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/profil-admin/ProfileCard.tsx", "client:component-export": "default" })}
              </div>

              
              <div class="animate-fadeInUp" style="animation-delay: 0.2s">
                ${renderComponent($$result4, "ProfileActions", ProfileActions, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/profil-admin/ProfileActions.tsx", "client:component-export": "default" })}
              </div>
            </div>
          </div>
        </div>

        
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/profil.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/profil.astro";
const $$url = "/profil.html";
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
