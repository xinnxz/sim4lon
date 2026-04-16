import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./ProtectedDashboard.igvMWLOj.js";
import { S as SafeIcon, I as Input, B as Button, f as authApi } from "./AuthGuard.BLl0uVB7.js";
import { L as Label } from "./label.C1We_4rW.js";
import { A as Alert, a as AlertDescription } from "./alert.Cid2FoHJ.js";
import { toast } from "sonner";
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
        "Ubah Password"
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
          "Password Lama ",
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
          "Password Baru ",
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
          "Konfirmasi Password ",
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
              "Simpan Password"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  ChangePasswordModal as C
};
