import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from "../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../_astro/BaseLayout.DfKLN4S1.js";
import { A as AppSidebarLayout } from "../_astro/AppSidebarLayout.k-1prjTp.js";
import { A as AdminFooter } from "../_astro/AdminFooter.DVGEP8G7.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { S as SafeIcon, I as Input, B as Button, u as usersApi } from "../_astro/AuthGuard.Cq_0lvUi.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "../_astro/card.OLhQVURm.js";
import { T as Tilt3DCard } from "../_astro/Tilt3DCard.kuKNoQnp.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "../_astro/table.CfABLaOl.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, B as Badge, e as DropdownMenu, f as DropdownMenuTrigger, g as DropdownMenuContent, h as DropdownMenuItem, P as ProtectedDashboard } from "../_astro/ProtectedDashboard.DWDsm_1Q.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "../_astro/select.DOfMR1sZ.js";
import { C as ConfirmationModal } from "../_astro/currency._AzJKMQz.js";
import { toast } from "sonner";
import { A as AddUserForm } from "../_astro/AddUserForm.BKGoB8TY.js";
import { L as Label } from "../_astro/label.DNnd65zo.js";
import { A as AnimatedNumber } from "../_astro/AnimatedNumber.BlVX1OvD.js";
import { P as PageHeader } from "../_astro/PageHeader.C8XdTn4w.js";
import { renderers } from "../renderers.mjs";
function AddUserModal({ open, onOpenChange, onSuccess }) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Tambah Pengguna Baru" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Daftarkan pengguna baru ke dalam sistem SIM4LON" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx(AddUserForm, { onClose: () => {
      onOpenChange(false);
      onSuccess?.();
    } }) })
  ] }) });
}
const roleOptions = [
  { value: "ADMIN", label: "Administrator" },
  { value: "OPERATOR", label: "Operator Lapangan" }
];
function EditUserForm({ onClose, userId }) {
  const [formData, setFormData] = useState({
    nama: "",
    telepon: "",
    email: "",
    role: "OPERATOR",
    status: "aktif"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copiedPassword, setCopiedPassword] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setIsFetching(false);
        return;
      }
      try {
        const user = await usersApi.getById(userId);
        setFormData({
          nama: user.name,
          telepon: user.phone || "",
          email: user.email,
          role: user.role,
          status: user.is_active ? "aktif" : "nonaktif"
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Gagal memuat data pengguna");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [userId]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama pengguna harus diisi";
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
      newErrors.role = "Peran pengguna harus dipilih";
    }
    if (!formData.status) {
      newErrors.status = "Status pengguna harus dipilih";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (e) => {
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
  const handleSelectChange = (name, value) => {
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
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Mohon periksa kembali form Anda");
      return;
    }
    if (!userId) {
      toast.error("ID pengguna tidak ditemukan");
      return;
    }
    setIsLoading(true);
    try {
      await usersApi.update(userId, {
        name: formData.nama,
        phone: formData.telepon,
        role: formData.role,
        is_active: formData.status === "aktif"
      });
      toast.success("Data pengguna berhasil diperbarui");
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          window.location.href = "/daftar-pengguna";
        }
      }, 500);
    } catch (error) {
      const message = error?.message || "Gagal memperbarui data pengguna";
      toast.error(message);
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.href = "/daftar-pengguna";
    }
  };
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const generateRandomPassword = async () => {
    if (!userId) {
      toast.error("ID pengguna tidak ditemukan");
      return;
    }
    setIsResettingPassword(true);
    try {
      const response = await usersApi.resetPassword(userId);
      setGeneratedPassword(response.newPassword);
      setCopiedPassword(false);
      toast.success("Password berhasil direset dan disimpan ke database");
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast.error("Gagal mereset password");
    } finally {
      setIsResettingPassword(false);
    }
  };
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2e3);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "border shadow-card", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "border-b bg-gradient-to-r from-primary/5 to-accent/5", children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "UserEdit", className: "h-5 w-5 text-primary" }),
          "Edit Data Pengguna"
        ] }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "ID Pengguna: ",
          /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-foreground", children: userId || "-" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "nama", className: "text-sm font-semibold", children: [
            "Nama Pengguna ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "nama",
              name: "nama",
              placeholder: "Masukkan nama pengguna",
              value: formData.nama,
              onChange: handleInputChange,
              className: `h-10 ${errors.nama ? "border-destructive focus-visible:ring-destructive" : ""}`,
              disabled: isLoading
            }
          ),
          errors.nama && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
            errors.nama
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "telepon", className: "text-sm font-semibold", children: [
            "Nomor Telepon ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "telepon",
              name: "telepon",
              placeholder: "Contoh: 081234567890",
              value: formData.telepon,
              onChange: handleInputChange,
              className: `h-10 ${errors.telepon ? "border-destructive focus-visible:ring-destructive" : ""}`,
              disabled: isLoading
            }
          ),
          errors.telepon && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
            errors.telepon
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "email", className: "text-sm font-semibold flex items-center gap-2", children: [
            "Email",
            /* @__PURE__ */ jsx("span", { className: "text-xs font-normal bg-gray-200 text-gray-600 px-2 py-0.5 rounded", children: "Read-only" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              name: "email",
              type: "email",
              value: formData.email,
              readOnly: true,
              disabled: true,
              className: "h-10 bg-gray-100 text-gray-600 cursor-not-allowed border-gray-200"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "role", className: "text-sm font-semibold", children: [
            "Peran Pengguna ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.role,
              onValueChange: (value) => handleSelectChange("role", value),
              disabled: isLoading,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: `h-10 ${errors.role ? "border-destructive focus-visible:ring-destructive" : ""}`, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih peran pengguna" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: roleOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
              ]
            }
          ),
          errors.role && /* @__PURE__ */ jsxs("p", { className: "text-sm text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "AlertCircle", className: "h-4 w-4" }),
            errors.role
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Key", className: "h-5 w-5 text-blue-600" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: "Reset Password Pengguna" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "Generate password baru untuk pengguna yang lupa kata sandi" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setShowResetPassword(true),
              disabled: isLoading,
              className: "shrink-0 text-blue-600 border-blue-200 hover:bg-blue-50",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "RotateCw", className: "mr-2 h-4 w-4" }),
                "Reset Password"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-foreground", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold mb-1", children: "Catatan Penting" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Perubahan peran pengguna akan langsung berlaku. Pastikan pengguna memiliki akses yang sesuai dengan tanggung jawab mereka." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
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
              onClick: () => setShowConfirm(true),
              disabled: isLoading,
              className: "flex-1 bg-primary hover:bg-primary/90",
              children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
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
      ConfirmationModal,
      {
        open: showConfirm,
        onOpenChange: setShowConfirm,
        title: "Konfirmasi Perubahan",
        description: `Apakah Anda yakin ingin menyimpan perubahan data pengguna ${formData.nama}?`,
        confirmText: "Ya, Simpan",
        cancelText: "Batal",
        icon: "CheckCircle",
        iconColor: "text-primary",
        isLoading,
        isDangerous: false,
        onConfirm: handleSubmit
      }
    ),
    showResetPassword && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white/20 rounded-lg p-2", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-white", children: "Reset Password" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-100", children: formData.nama })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: !generatedPassword ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "h-5 w-5 text-blue-600 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 mb-1", children: "Password akan direset" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Sistem akan generate password baru dan menyimpannya ke database. Password lama tidak dapat dipulihkan." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700", children: "Langkah selanjutnya:" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium", children: "1" }),
              'Klik "Generate Password"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium", children: "2" }),
              "Copy password yang muncul"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium", children: "3" }),
              "Berikan ke pengguna melalui channel aman"
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-green-500 rounded-full p-1", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-800", children: "Password berhasil direset!" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700", children: "Password Baru" }),
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg font-mono text-lg tracking-wider", children: [
            /* @__PURE__ */ jsx("span", { className: "flex-1 select-all break-all", children: generatedPassword }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: copyPasswordToClipboard,
                className: copiedPassword ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white",
                children: [
                  /* @__PURE__ */ jsx(SafeIcon, { name: copiedPassword ? "Check" : "Copy", className: "h-4 w-4 mr-1" }),
                  copiedPassword ? "Copied!" : "Copy"
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
      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 px-6 py-4 bg-gray-50 flex gap-3 justify-end", children: !generatedPassword ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: () => setShowResetPassword(false),
            disabled: isResettingPassword,
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            className: "bg-blue-600 hover:bg-blue-700 text-white",
            onClick: generateRandomPassword,
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
            setShowResetPassword(false);
            setGeneratedPassword("");
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
function EditUserModal({ open, onOpenChange, userId, onSuccess }) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Pengguna" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Perbarui informasi pengguna sistem" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "py-4", children: /* @__PURE__ */ jsx(EditUserForm, { onClose: () => {
      onOpenChange(false);
      onSuccess?.();
    }, userId }) })
  ] }) });
}
const roleLabels = {
  ADMIN: "Administrator",
  OPERATOR: "Operator Lapangan",
  PANGKALAN: "Pangkalan"
};
const roleBadgeColors = {
  ADMIN: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  OPERATOR: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  PANGKALAN: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
};
function UserListPage() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminCount, setAdminCount] = useState(0);
  const [operatorCount, setOperatorCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
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
  const sortedUserList = useMemo(() => {
    if (!sortField) return userList;
    return [...userList].sort((a, b) => {
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
  }, [userList, sortField, sortDirection]);
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
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { authApi } = await import("../_astro/AuthGuard.Cq_0lvUi.js").then((n) => n.D);
        const profile = await authApi.getProfile();
        setCurrentUserId(profile.id);
      } catch (error) {
        console.error("Failed to get current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersApi.getAll(currentPage, 10, searchTerm || void 0, ["PANGKALAN"]);
      let filteredData = response.data;
      if (roleFilter !== "all") {
        filteredData = response.data.filter((u) => u.role === roleFilter);
      }
      setUserList(filteredData);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.totalPages);
      setAdminCount(response.meta.totalAdmin || 0);
      setOperatorCount(response.meta.totalOperator || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const handleStatusToggleClick = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };
  const handleConfirmStatusToggle = async () => {
    if (!selectedUser) return;
    try {
      const newStatus = !selectedUser.is_active;
      await usersApi.update(selectedUser.id, { is_active: newStatus });
      toast.success(`Pengguna berhasil ${newStatus ? "diaktifkan" : "dinonaktifkan"}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Gagal mengubah status pengguna");
    } finally {
      setShowStatusModal(false);
      setSelectedUser(null);
    }
  };
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await usersApi.delete(selectedUser.id);
      toast.success("Pengguna berhasil dihapus");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Gagal menghapus pengguna");
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setShowEditModal(true);
  };
  const handleSuccess = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingUserId("");
    fetchUsers();
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Daftar Pengguna",
          subtitle: "Kelola semua pengguna sistem SIM4LON"
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => setShowAddModal(true),
          className: "w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all",
          children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "mr-2 h-4 w-4" }),
            "Tambah Pengguna"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-3", children: isLoading ? (
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
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-slate-500/10", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "w-5 h-5 text-slate-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total Pengguna" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: totalItems, delay: 100 }) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", style: { animationDelay: "0.1s" }, children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "w-5 h-5 text-purple-600 dark:text-purple-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Administrator" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: adminCount, delay: 200 }) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(Tilt3DCard, { children: /* @__PURE__ */ jsx(Card, { className: "border-0 glass-card animate-fadeInUp h-full", style: { animationDelay: "0.2s" }, children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/15", children: /* @__PURE__ */ jsx(SafeIcon, { name: "UserCog", className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Operator" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: /* @__PURE__ */ jsx(AnimatedNumber, { value: operatorCount, delay: 300 }) })
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
            placeholder: "Cari nama, email, atau telepon...",
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
            onClick: () => setRoleFilter("all"),
            className: roleFilter === "all" ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-md" : "bg-transparent hover:bg-muted/50 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "w-4 h-4 mr-1.5" }),
              "Semua"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setRoleFilter("ADMIN"),
            className: roleFilter === "ADMIN" ? "bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white shadow-md" : "bg-transparent hover:bg-muted/50 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "Shield", className: "w-4 h-4 mr-1.5" }),
              "Admin"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setRoleFilter("OPERATOR"),
            className: roleFilter === "OPERATOR" ? "bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white shadow-md" : "bg-transparent hover:bg-muted/50 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(SafeIcon, { name: "UserCog", className: "w-4 h-4 mr-1.5" }),
              "Operator"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "glass-card overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Table", className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Data Pengguna" }),
          /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-500/10 text-green-600", children: [
            userList.length,
            " data"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Total: ",
          totalItems,
          " pengguna"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-8 w-8 animate-spin text-green-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Memuat data pengguna..." })
      ] }) }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-transparent border-border focus:border-primary", children: [
          /* @__PURE__ */ jsx(SortableHeader, { field: "code", className: "w-24", children: "Kode" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "name", children: "Nama" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "email", children: "Email" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "phone", align: "center", children: "Telepon" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "role", align: "center", children: "Peran" }),
          /* @__PURE__ */ jsx(SortableHeader, { field: "is_active", align: "center", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center font-semibold text-slate-700", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sortedUserList.length > 0 ? sortedUserList.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          return /* @__PURE__ */ jsxs(
            TableRow,
            {
              className: `hover:bg-muted/50 transition-colors ${isCurrentUser ? "bg-purple-500/5 border-l-2 border-l-purple-500" : ""}`,
              children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm text-primary", children: user.code || "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-foreground", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  user.name,
                  isCurrentUser && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs bg-purple-500/10 text-purple-600 border-purple-300", children: "Anda" })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-foreground", children: user.email }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center text-foreground", children: user.phone || "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { className: roleBadgeColors[user.role], children: roleLabels[user.role] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
                  Badge,
                  {
                    className: user.is_active ? "bg-gradient-to-r from-primary-600/90 to-primary-500/90 text-white shadow-sm" : "bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/50 text-white shadow-sm",
                    children: user.is_active ? "✓ Aktif" : "Nonaktif"
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(SafeIcon, { name: "MoreVertical", className: "h-4 w-4" }) }) }),
                  /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: isCurrentUser ? /* @__PURE__ */ jsxs(DropdownMenuItem, { disabled: true, className: "text-muted-foreground cursor-not-allowed", children: [
                    /* @__PURE__ */ jsx(SafeIcon, { name: "ShieldAlert", className: "mr-2 h-4 w-4" }),
                    "Tidak dapat mengubah akun sendiri"
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleEditClick(user), children: [
                      /* @__PURE__ */ jsx(SafeIcon, { name: "Edit", className: "mr-2 h-4 w-4" }),
                      "Edit"
                    ] }),
                    user.is_active ? /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        className: "text-orange-600",
                        onClick: () => handleStatusToggleClick(user),
                        children: [
                          /* @__PURE__ */ jsx(SafeIcon, { name: "Ban", className: "mr-2 h-4 w-4" }),
                          "Nonaktifkan"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        className: "text-green-600",
                        onClick: () => handleStatusToggleClick(user),
                        children: [
                          /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "mr-2 h-4 w-4" }),
                          "Aktifkan"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        className: "text-destructive",
                        onClick: () => handleDeleteClick(user),
                        children: [
                          /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "mr-2 h-4 w-4" }),
                          "Hapus"
                        ]
                      }
                    )
                  ] }) })
                ] }) })
              ]
            },
            user.id
          );
        }) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "text-center py-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Users", className: "h-8 w-8 text-muted-foreground" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tidak ada pengguna ditemukan" })
        ] }) }) }) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-t border-border/50", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Halaman ",
          currentPage,
          " dari ",
          totalPages,
          " • Total ",
          totalItems,
          " pengguna"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: currentPage === 1,
              onClick: () => setCurrentPage((p) => p - 1),
              className: "hover:bg-green-50",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronLeft", className: "h-4 w-4 mr-1" }),
                "Prev"
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
                className: currentPage === pageNum ? "bg-green-500 hover:bg-green-600" : "",
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
              className: "hover:bg-green-50",
              children: [
                "Next",
                /* @__PURE__ */ jsx(SafeIcon, { name: "ChevronRight", className: "h-4 w-4 ml-1" })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      AddUserModal,
      {
        open: showAddModal,
        onOpenChange: setShowAddModal,
        onSuccess: handleSuccess
      }
    ),
    /* @__PURE__ */ jsx(
      EditUserModal,
      {
        open: showEditModal,
        onOpenChange: setShowEditModal,
        userId: editingUserId,
        onSuccess: handleSuccess
      }
    ),
    selectedUser && showStatusModal && /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        open: showStatusModal,
        onOpenChange: setShowStatusModal,
        title: selectedUser.is_active ? "Nonaktifkan Pengguna" : "Aktifkan Pengguna",
        description: selectedUser.is_active ? `Apakah Anda yakin ingin menonaktifkan "${selectedUser.name}"?` : `Apakah Anda yakin ingin mengaktifkan "${selectedUser.name}"?`,
        confirmText: selectedUser.is_active ? "Nonaktifkan" : "Aktifkan",
        cancelText: "Batal",
        icon: selectedUser.is_active ? "AlertTriangle" : "CheckCircle",
        isDangerous: selectedUser.is_active,
        onConfirm: handleConfirmStatusToggle
      }
    ),
    selectedUser && showDeleteModal && /* @__PURE__ */ jsx(
      ConfirmationModal,
      {
        open: showDeleteModal,
        onOpenChange: setShowDeleteModal,
        title: "Hapus Pengguna",
        description: `Apakah Anda yakin ingin menghapus "${selectedUser.name}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Hapus",
        cancelText: "Batal",
        icon: "Trash2",
        isDangerous: true,
        onConfirm: handleConfirmDelete
      }
    )
  ] });
}
const $$DaftarPengguna = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Daftar Pengguna - SIM4LON" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["ADMIN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "AppSidebarLayout", AppSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/common/AppSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${maybeRenderHead()}<main class="flex-1 flex flex-col">
        ${renderComponent($$result4, "UserListPage", UserListPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/daftar-pengguna/UserListPage.tsx", "client:component-export": "default" })}
        ${renderComponent($$result4, "AdminFooter", AdminFooter, {})}
      </main>
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/daftar-pengguna.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/daftar-pengguna.astro";
const $$url = "/daftar-pengguna.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DaftarPengguna,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
