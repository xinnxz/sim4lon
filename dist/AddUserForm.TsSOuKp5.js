import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { S as SafeIcon, B as Button, u as usersApi } from "./AuthGuard.Ct_soEsT.js";
import { I as Input } from "./input.7PkTCKY_.js";
import { L as Label } from "./label.D82FCtcQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select.V01nf8e1.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card.CpcqKk8f.js";
import { A as Alert, a as AlertDescription } from "./alert.D7iRxbEJ.js";
import { toast } from "sonner";
const roleOptions = [
  { value: "Admin", label: "Administrator" },
  { value: "Operator", label: "Operator Lapangan" }
];
function AddUserForm({ onClose }) {
  const [formData, setFormData] = useState({
    nama: "",
    telepon: "",
    email: "",
    role: "Operator",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama harus diisi";
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = "Nama minimal 3 karakter";
    }
    if (!formData.telepon.trim()) {
      newErrors.telepon = "Nomor telepon harus diisi";
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.telepon.replace(/\s/g, ""))) {
      newErrors.telepon = "Format nomor telepon tidak valid";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.role) {
      newErrors.role = "Peran harus dipilih";
    }
    if (!formData.password) {
      newErrors.password = "Kata sandi harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Kata sandi tidak cocok";
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
        [name]: ""
      }));
    }
  };
  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value
    }));
    if (errors.role) {
      setErrors((prev) => ({
        ...prev,
        role: ""
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Mohon periksa kembali form Anda");
      return;
    }
    setIsLoading(true);
    try {
      const roleMap = {
        "Admin": "ADMIN",
        "Operator": "OPERATOR"
      };
      await usersApi.create({
        email: formData.email,
        password: formData.password,
        name: formData.nama,
        phone: formData.telepon,
        role: roleMap[formData.role] || "OPERATOR"
      });
      toast.success("Pengguna berhasil ditambahkan");
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          window.location.href = "/daftar-pengguna";
        }
      }, 500);
    } catch (error) {
      const message = error?.message || "Gagal menambahkan pengguna. Silakan coba lagi.";
      toast.error(message);
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.href = "./daftar-pengguna.html";
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "border shadow-card animate-scaleIn", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "border-b bg-gradient-to-r from-primary/5 to-accent/5", children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "UserPlus", className: "h-5 w-5 text-primary" }),
        "Form Pendaftaran Pengguna"
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Isi semua field di bawah untuk mendaftarkan pengguna baru" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, { className: "border-primary/20 bg-primary/5", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsx(AlertDescription, { className: "text-sm text-foreground", children: "Pengguna yang didaftarkan akan langsung aktif dan dapat mengakses sistem sesuai dengan peran yang diberikan." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "nama", className: "text-sm font-medium", children: [
          "Nama Lengkap ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "nama",
            name: "nama",
            type: "text",
            placeholder: "Masukkan nama lengkap",
            value: formData.nama,
            onChange: handleChange,
            disabled: isLoading,
            className: errors.nama ? "border-destructive" : "",
            "aria-invalid": !!errors.nama
          }
        ),
        errors.nama && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
          errors.nama
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "telepon", className: "text-sm font-medium", children: [
          "Nomor Telepon ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "telepon",
            name: "telepon",
            type: "tel",
            placeholder: "Contoh: 08123456789 atau +6281234567890",
            value: formData.telepon,
            onChange: handleChange,
            disabled: isLoading,
            className: errors.telepon ? "border-destructive" : "",
            "aria-invalid": !!errors.telepon
          }
        ),
        errors.telepon && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
          errors.telepon
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "email", className: "text-sm font-medium", children: [
          "Email ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            name: "email",
            type: "email",
            placeholder: "Contoh: user@example.com",
            value: formData.email,
            onChange: handleChange,
            disabled: isLoading,
            className: errors.email ? "border-destructive" : "",
            "aria-invalid": !!errors.email
          }
        ),
        errors.email && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
          errors.email
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "role", className: "text-sm font-medium", children: [
          "Peran ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: formData.role, onValueChange: handleRoleChange, disabled: isLoading, children: [
          /* @__PURE__ */ jsx(
            SelectTrigger,
            {
              id: "role",
              className: errors.role ? "border-destructive" : "",
              "aria-invalid": !!errors.role,
              children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih peran pengguna" })
            }
          ),
          /* @__PURE__ */ jsx(SelectContent, { children: roleOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
        ] }),
        errors.role && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
          errors.role
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Pilih peran yang sesuai dengan tanggung jawab pengguna" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "password", className: "text-sm font-medium", children: [
          "Kata Sandi ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              name: "password",
              type: showPassword ? "text" : "password",
              placeholder: "Masukkan kata sandi minimal 6 karakter",
              value: formData.password,
              onChange: handleChange,
              disabled: isLoading,
              className: `pr-10 ${errors.password ? "border-destructive" : ""}`,
              "aria-invalid": !!errors.password
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              disabled: isLoading,
              "aria-label": showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi",
              children: /* @__PURE__ */ jsx(
                SafeIcon,
                {
                  name: showPassword ? "EyeOff" : "Eye",
                  className: "h-4 w-4"
                }
              )
            }
          )
        ] }),
        errors.password && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
          errors.password
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "confirmPassword", className: "text-sm font-medium", children: [
          "Konfirmasi Kata Sandi ",
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "confirmPassword",
            name: "confirmPassword",
            type: showPassword ? "text" : "password",
            placeholder: "Masukkan ulang kata sandi",
            value: formData.confirmPassword,
            onChange: handleChange,
            disabled: isLoading,
            className: errors.confirmPassword ? "border-destructive" : "",
            "aria-invalid": !!errors.confirmPassword
          }
        ),
        errors.confirmPassword && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
          errors.confirmPassword
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-6 border-t", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleCancel,
            disabled: isLoading,
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
            disabled: isLoading,
            className: "flex-1 bg-primary hover:bg-primary/90",
            children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
              "Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Save", className: "mr-2 h-4 w-4" }),
              "Simpan Pengguna"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AddUserForm as A
};
