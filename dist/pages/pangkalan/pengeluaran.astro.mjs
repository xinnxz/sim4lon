import { c as createComponent, r as renderComponent, a as renderTemplate } from "../../_astro/astro/server.mTvgDWEq.js";
import "piccolore";
import "html-escaper";
import { $ as $$BaseLayout } from "../../_astro/BaseLayout.C7j8yK_x.js";
import { P as PangkalanSidebarLayout } from "../../_astro/PangkalanSidebarLayout.BvgbXP5u.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "../../_astro/card.CnUj7wdc.js";
import { S as SafeIcon, I as Input, B as Button, t as expensesApi } from "../../_astro/AuthGuard.71S_I7hh.js";
import { L as Label } from "../../_astro/label.C1We_4rW.js";
import { T as Textarea } from "../../_astro/textarea.F19kpFWl.js";
import { D as Dialog, i as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, o as DialogFooter, B as Badge, P as ProtectedDashboard } from "../../_astro/ProtectedDashboard.TvdlGC6x.js";
import { toast } from "sonner";
import { renderers } from "../../renderers.mjs";
const CATEGORIES = [
  { value: "OPERASIONAL", label: "Operasional", icon: "Settings", color: "bg-violet-500", gradient: "from-violet-500 to-violet-600" },
  { value: "TRANSPORT", label: "Transport", icon: "Truck", color: "bg-orange-500", gradient: "from-orange-500 to-orange-600" },
  { value: "SEWA", label: "Sewa", icon: "Home", color: "bg-pink-500", gradient: "from-pink-500 to-pink-600" },
  { value: "LISTRIK", label: "Listrik/Air", icon: "Zap", color: "bg-yellow-500", gradient: "from-yellow-500 to-amber-600" },
  { value: "GAJI", label: "Gaji", icon: "Users", color: "bg-blue-500", gradient: "from-blue-500 to-blue-600" },
  { value: "LAINNYA", label: "Lain-lain", icon: "MoreHorizontal", color: "bg-emerald-500", gradient: "from-emerald-500 to-emerald-600" }
];
const LEGACY_CATEGORY_MAP = {
  "maintenance": "OPERASIONAL",
  "lain-lain": "LAINNYA"
};
function PengeluaranPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: "OPERASIONAL",
    amount: "",
    description: "",
    expense_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const [year, month] = filterMonth.split("-");
      const startDate = `${year}-${month}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split("T")[0];
      const data = await expensesApi.getAll(startDate, endDate);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast.error("Gagal memuat data pengeluaran");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchExpenses();
  }, [filterMonth]);
  const handleOpenDialog = (expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        category: expense.category,
        amount: expense.amount.toString(),
        description: expense.description || "",
        expense_date: new Date(expense.expense_date).toISOString().split("T")[0]
      });
    } else {
      setEditingExpense(null);
      setFormData({
        category: "OPERASIONAL",
        amount: "",
        description: "",
        expense_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      });
    }
    setIsDialogOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Jumlah pengeluaran wajib diisi");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description || void 0,
        expense_date: formData.expense_date
      };
      if (editingExpense) {
        await expensesApi.update(editingExpense.id, data);
        toast.success("Pengeluaran berhasil diperbarui");
      } else {
        await expensesApi.create(data);
        toast.success("Pengeluaran berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      fetchExpenses();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan pengeluaran");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (expense) => {
    if (!confirm(`Hapus pengeluaran "${getCategoryLabel(expense.category)}" ${formatCurrency(expense.amount)}?`)) return;
    try {
      await expensesApi.delete(expense.id);
      toast.success("Pengeluaran berhasil dihapus");
      fetchExpenses();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus pengeluaran");
    }
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const findCategory = (cat) => {
    const catLower = cat?.toLowerCase();
    const mappedValue = LEGACY_CATEGORY_MAP[catLower];
    if (mappedValue) {
      return CATEGORIES.find((c) => c.value === mappedValue);
    }
    return CATEGORIES.find(
      (c) => c.value.toLowerCase() === catLower || c.label.toLowerCase() === catLower
    );
  };
  const getCCategory = (cat) => findCategory(cat) || CATEGORIES.find((c) => c.value === "OPERASIONAL");
  const getCategoryLabel = (cat) => findCategory(cat)?.label || cat;
  const getCategoryGradient = (cat) => getCCategory(cat).gradient;
  const getCategoryIcon = (cat) => getCCategory(cat).icon;
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const categoryMap = /* @__PURE__ */ new Map();
  expenses.forEach((e) => {
    const cat = getCCategory(e.category);
    const existing = categoryMap.get(cat.value);
    if (existing) {
      existing.total += Number(e.amount);
      existing.count += 1;
    } else {
      categoryMap.set(cat.value, {
        total: Number(e.amount),
        count: 1,
        label: cat.label,
        icon: cat.icon,
        gradient: cat.gradient,
        color: cat.color
      });
    }
  });
  const expensesByCategory = Array.from(categoryMap.entries()).map(([value, data]) => ({
    value,
    ...data
  })).filter((cat) => cat.total > 0);
  if (isLoading && expenses.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[500px]", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-6 w-6 text-red-600" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-4 font-medium", children: "Memuat data pengeluaran..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fadeInDown", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-red-500 via-red-400 to-orange-500 animate-lineGrow" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight", children: "Pengeluaran" }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-4 w-4 animate-pulse" }),
            "Catat biaya operasional pangkalan"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "month",
            value: filterMonth,
            onChange: (e) => setFilterMonth(e.target.value),
            className: "w-[160px] rounded-xl"
          }
        ),
        /* @__PURE__ */ jsxs(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => handleOpenDialog(),
              className: "group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg shadow-red-500/25 active:scale-95",
              children: [
                /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" }),
                "Tambah Pengeluaran"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[500px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-5 w-5 text-red-600" }) }),
                editingExpense ? "Edit Pengeluaran" : "Tambah Pengeluaran"
              ] }),
              /* @__PURE__ */ jsx(DialogDescription, { children: editingExpense ? "Perbarui data pengeluaran" : "Isi data pengeluaran baru" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Kategori *" }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setFormData({ ...formData, category: cat.value }),
                    className: `flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.category === cat.value ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-slate-300"}`,
                    children: [
                      /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsx(SafeIcon, { name: cat.icon, className: "h-5 w-5 text-white" }) }),
                      /* @__PURE__ */ jsx("span", { className: `text-xs font-medium ${formData.category === cat.value ? "text-red-700" : "text-slate-600"}`, children: cat.label })
                    ]
                  },
                  cat.value
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "amount", children: "Jumlah (Rp) *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "amount",
                    type: "number",
                    value: formData.amount,
                    onChange: (e) => setFormData({ ...formData, amount: e.target.value }),
                    placeholder: "50000",
                    min: "0",
                    required: true,
                    className: "text-lg font-bold"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "expense_date", children: "Tanggal" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "expense_date",
                    type: "date",
                    value: formData.expense_date,
                    onChange: (e) => setFormData({ ...formData, expense_date: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Keterangan" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    id: "description",
                    value: formData.description,
                    onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                    placeholder: "BBM motor untuk antar gas...",
                    rows: 2
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsDialogOpen(false), children: "Batal" }),
              /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isSubmitting, className: "bg-red-600 hover:bg-red-700", children: [
                isSubmitting ? /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "h-4 w-4 mr-2" }),
                "Simpan"
              ] })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-slideInBlur stagger-1", style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium opacity-90 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12", children: /* @__PURE__ */ jsx(SafeIcon, { name: "TrendingDown", className: "h-4 w-4" }) }),
          "Total Pengeluaran"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: formatCurrency(totalExpenses) }),
          /* @__PURE__ */ jsxs("p", { className: "text-red-100 text-sm mt-2", children: [
            expenses.length,
            " transaksi bulan ini"
          ] })
        ] })
      ] }) }),
      expensesByCategory.slice(0, 3).map((cat, index) => /* @__PURE__ */ jsx("div", { className: `animate-slideInBlur stagger-${index + 2}`, style: { opacity: 0 }, children: /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 relative", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`, children: /* @__PURE__ */ jsx(SafeIcon, { name: cat.icon, className: "h-4 w-4 text-white" }) }),
          cat.label
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "relative", children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: formatCurrency(cat.total) }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2", children: [
            cat.count,
            " transaksi"
          ] })
        ] })
      ] }) }, cat.value))
    ] }),
    expensesByCategory.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "PieChart", className: "h-4 w-4 text-purple-600" }) }),
        "Breakdown Kategori"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: expensesByCategory.map((cat) => {
        const percentage = totalExpenses > 0 ? (cat.total / totalExpenses * 100).toFixed(1) : "0";
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors", children: [
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0`, children: /* @__PURE__ */ jsx(SafeIcon, { name: cat.icon, className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: cat.label }),
              /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-slate-200", children: [
                percentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 font-bold", children: formatCurrency(cat.total) })
          ] })
        ] }, cat.value);
      }) }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-lg rounded-2xl border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "border-b border-slate-100 bg-slate-50/50", children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(SafeIcon, { name: "Receipt", className: "h-4 w-4 text-red-600" }) }),
          "Daftar Pengeluaran"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Riwayat pengeluaran bulan ini" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: expenses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Wallet", className: "h-16 w-16 text-slate-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-700 mb-2", children: "Belum Ada Pengeluaran" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 mb-6", children: "Catat pengeluaran operasional Anda" }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => handleOpenDialog(), className: "bg-red-600 hover:bg-red-700", children: [
          /* @__PURE__ */ jsx(SafeIcon, { name: "Plus", className: "h-4 w-4 mr-2" }),
          "Catat Pengeluaran Pertama"
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: expenses.map((expense, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `p-3 sm:p-4 hover:bg-red-50/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-gradient-to-br ${getCategoryGradient(expense.category)} flex items-center justify-center`, children: /* @__PURE__ */ jsx(SafeIcon, { name: getCategoryIcon(expense.category), className: "h-5 w-5 sm:h-6 sm:w-6 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm sm:text-base text-slate-900", children: getCategoryLabel(expense.category) }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] sm:text-xs shrink-0", children: formatDate(expense.expense_date) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-slate-500 mt-0.5 truncate", children: expense.description || "Tidak ada keterangan" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-red-600 text-sm sm:hidden mt-1", children: formatCurrency(expense.amount) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 sm:gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx("span", { className: "hidden sm:block font-bold text-red-600 text-base lg:text-lg mr-2", children: formatCurrency(expense.amount) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => handleOpenDialog(expense),
                  className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0",
                  children: /* @__PURE__ */ jsx(SafeIcon, { name: "Pencil", className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => handleDelete(expense),
                  className: "text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0",
                  children: /* @__PURE__ */ jsx(SafeIcon, { name: "Trash2", className: "h-4 w-4" })
                }
              )
            ] })
          ] })
        },
        expense.id
      )) }) })
    ] })
  ] });
}
const $$Pengeluaran = createComponent(($$result, $$props, $$slots) => renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { title: "Pengeluaran - SIM4LON Pangkalan" }, { default: ($$result2) => renderTemplate`
  ${renderComponent($$result2, "ProtectedDashboard", ProtectedDashboard, { "client:load": true, allowedRoles: ["PANGKALAN"], "client:component-hydration": "load", "client:component-path": "@/components/auth/ProtectedDashboard.tsx", "client:component-export": "default" }, { default: ($$result3) => renderTemplate`
    ${renderComponent($$result3, "PangkalanSidebarLayout", PangkalanSidebarLayout, { "client:load": true, headerHeight: "64px", "client:component-hydration": "load", "client:component-path": "@/components/pangkalan/PangkalanSidebarLayout.tsx", "client:component-export": "default" }, { default: ($$result4) => renderTemplate`
      ${renderComponent($$result4, "PengeluaranPage", PengeluaranPage, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/pangkalan/PengeluaranPage.tsx", "client:component-export": "default" })}
    ` })}
  ` })}
` })}`, "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/pengeluaran.astro", void 0);
const $$file = "E:/DATA/Ngoding/sim4lon/src/pages/pangkalan/pengeluaran.astro";
const $$url = "/pangkalan/pengeluaran.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Pengeluaran,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
