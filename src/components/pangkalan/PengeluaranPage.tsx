/**
 * PengeluaranPage - Enhanced Pengeluaran Management Page
 * 
 * Features:
 * - Full CRUD operations for expenses
 * - Clickable category chips in form
 * - Stats cards with gradients
 * - Month filter
 * - Category breakdown cards
 * - Consistent styling with Dashboard/Laporan
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import SafeIcon from '@/components/common/SafeIcon'
import { expensesApi, type Expense, type ExpenseCategory } from '@/lib/api'
import { toast } from 'sonner'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'

// Kategori dengan label, icon, dan color - Vibrant colors matching dashboard
const CATEGORIES: { value: ExpenseCategory; label: string; icon: string; color: string; gradient: string }[] = [
    { value: 'OPERASIONAL', label: 'Operasional', icon: 'Settings', color: 'bg-violet-500', gradient: 'from-violet-500 to-violet-600' },
    { value: 'TRANSPORT', label: 'Transport', icon: 'Truck', color: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
    { value: 'SEWA', label: 'Sewa', icon: 'Home', color: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600' },
    { value: 'LISTRIK', label: 'Listrik/Air', icon: 'Zap', color: 'bg-yellow-500', gradient: 'from-yellow-500 to-amber-600' },
    { value: 'GAJI', label: 'Gaji', icon: 'Users', color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
    { value: 'LAINNYA', label: 'Lain-lain', icon: 'MoreHorizontal', color: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600' },
]

// Map legacy categories to valid ones
const LEGACY_CATEGORY_MAP: Record<string, ExpenseCategory> = {
    'maintenance': 'OPERASIONAL',
    'lain-lain': 'LAINNYA',
}

export default function PengeluaranPage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<{
        show: boolean;
        expense: Expense | null;
    }>({ show: false, expense: null })
    const [formData, setFormData] = useState({
        category: 'OPERASIONAL' as ExpenseCategory,
        amount: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0],
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [filterMonth, setFilterMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'ALL'>('ALL')

    const fetchExpenses = async () => {
        try {
            setIsLoading(true)
            const [year, month] = filterMonth.split('-')
            const startDate = `${year}-${month}-01`
            const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
            const data = await expensesApi.getAll(startDate, endDate)
            setExpenses(data)
        } catch (error) {
            console.error('Failed to fetch expenses:', error)
            toast.error('Gagal memuat data pengeluaran')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [filterMonth])

    const handleOpenDialog = (expense?: Expense) => {
        if (expense) {
            setEditingExpense(expense)
            setFormData({
                category: expense.category,
                amount: expense.amount.toString(),
                description: expense.description || '',
                expense_date: new Date(expense.expense_date).toISOString().split('T')[0],
            })
        } else {
            setEditingExpense(null)
            setFormData({
                category: 'OPERASIONAL',
                amount: '',
                description: '',
                expense_date: new Date().toISOString().split('T')[0],
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Jumlah pengeluaran wajib diisi')
            return
        }

        try {
            setIsSubmitting(true)
            const data = {
                category: formData.category,
                amount: parseFloat(formData.amount),
                description: formData.description || undefined,
                expense_date: formData.expense_date,
            }

            if (editingExpense) {
                await expensesApi.update(editingExpense.id, data)
                toast.success('Pengeluaran berhasil diperbarui')
            } else {
                await expensesApi.create(data)
                toast.success('Pengeluaran berhasil ditambahkan')
            }
            setIsDialogOpen(false)
            fetchExpenses()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan pengeluaran')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = (expense: Expense) => {
        setDeleteConfirm({ show: true, expense })
    }

    const confirmDelete = async () => {
        const expense = deleteConfirm.expense
        if (!expense) return

        try {
            await expensesApi.delete(expense.id)
            toast.success('Pengeluaran berhasil dihapus')
            fetchExpenses()
            setDeleteConfirm({ show: false, expense: null })
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus pengeluaran')
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Case-insensitive category matching for legacy data
    const findCategory = (cat: string) => {
        const catLower = cat?.toLowerCase()
        // Check legacy map first
        const mappedValue = LEGACY_CATEGORY_MAP[catLower]
        if (mappedValue) {
            return CATEGORIES.find(c => c.value === mappedValue)
        }
        // Then try direct match
        return CATEGORIES.find(c =>
            c.value.toLowerCase() === catLower ||
            c.label.toLowerCase() === catLower
        )
    }
    const getCCategory = (cat: string) => findCategory(cat) || CATEGORIES.find(c => c.value === 'OPERASIONAL')!

    const getCategoryLabel = (cat: string) => findCategory(cat)?.label || cat
    const getCategoryColor = (cat: string) => getCCategory(cat).color
    const getCategoryGradient = (cat: string) => getCCategory(cat).gradient
    const getCategoryIcon = (cat: string) => getCCategory(cat).icon

    // Calculate summary - group by normalized category
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

    // Build custom category breakdown for legacy data
    const categoryMap = new Map<string, { total: number; count: number; label: string; icon: string; gradient: string; color: string }>()
    expenses.forEach(e => {
        const cat = getCCategory(e.category)
        const existing = categoryMap.get(cat.value)
        if (existing) {
            existing.total += Number(e.amount)
            existing.count += 1
        } else {
            categoryMap.set(cat.value, {
                total: Number(e.amount),
                count: 1,
                label: cat.label,
                icon: cat.icon,
                gradient: cat.gradient,
                color: cat.color,
            })
        }
    })


    // Filter expenses based on selected category
    const filteredExpenses = filterCategory === 'ALL'
        ? expenses
        : expenses.filter(e => e.category === filterCategory)

    // Calculate total for filtered view
    const filteredTotal = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

    // For chart data - use ALL expenses for context, or filter? 
    // Usually chart shows breakdown of CURRENT list if possible, or stays consistent.
    // Let's make chart reflect current Month data (all categories) to show composition
    // regardless of filter, OR we can show 100% if single category selected.
    // Better: Chart always shows breakdown of ALL expenses in this month (for context)
    // while the list shows filtered items.

    // BUT user request says: "Sistem akan menampilkan chart pengeluaran per kategori dengan persentase"
    // So let's use the categories data we already prepared map for.
    const expensesByCategory = Array.from(categoryMap.entries()).map(([value, data]) => ({
        value,
        name: data.label, // Recharts uses 'name' by default
        ...data,
    })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total)

    // Pre-defined colors matching tailwind classes for the chart
    const CHART_COLORS = {
        'OPERASIONAL': '#8b5cf6', // violet-500
        'TRANSPORT': '#f97316',   // orange-500
        'SEWA': '#ec4899',        // pink-500
        'LISTRIK': '#eab308',     // yellow-500
        'GAJI': '#3b82f6',        // blue-500
        'LAINNYA': '#10b981',     // emerald-500
    }

    if (isLoading && expenses.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SafeIcon name="Wallet" className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 mt-4 font-medium">Memuat data pengeluaran...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header - Animated */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fadeInDown">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-red-500 via-red-400 to-orange-500 animate-lineGrow" />
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Pengeluaran</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <SafeIcon name="Wallet" className="h-4 w-4 animate-pulse" />
                            Catat biaya operasional pangkalan
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Month Filter */}
                    <Input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-[160px] rounded-xl"
                    />

                    {/* Category Filter */}
                    <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as ExpenseCategory | 'ALL')}>
                        <SelectTrigger className="w-[180px] rounded-xl bg-white dark:bg-slate-900 border-slate-200">
                            <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Semua Kategori</SelectItem>
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                                        {cat.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Add Button */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => handleOpenDialog()}
                                className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg shadow-red-500/25 active:scale-95"
                            >
                                <SafeIcon name="Plus" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                                Tambah Pengeluaran
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                            <SafeIcon name="Wallet" className="h-5 w-5 text-red-600" />
                                        </div>
                                        {editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingExpense ? 'Perbarui data pengeluaran' : 'Isi data pengeluaran baru'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {/* Category Selection */}
                                    <div className="space-y-2">
                                        <Label>Kategori *</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, category: cat.value })}
                                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.category === cat.value
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                                                        <SafeIcon name={cat.icon} className="h-5 w-5 text-white" />
                                                    </div>
                                                    <span className={`text-xs font-medium ${formData.category === cat.value ? 'text-red-700' : 'text-slate-600'}`}>
                                                        {cat.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Jumlah (Rp) *</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            placeholder="50000"
                                            min="0"
                                            required
                                            className="text-lg font-bold"
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="expense_date">Tanggal</Label>
                                        <Input
                                            id="expense_date"
                                            type="date"
                                            value={formData.expense_date}
                                            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Keterangan</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="BBM motor untuk antar gas..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                                        {isSubmitting ? (
                                            <SafeIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <SafeIcon name="Check" className="h-4 w-4 mr-2" />
                                        )}
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Summary Cards - Staggered Entry */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Total Pengeluaran */}
                <div className="animate-slideInBlur stagger-1" style={{ opacity: 0 }}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-floatOrb-delayed" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <SafeIcon name="TrendingDown" className="h-4 w-4" />
                                </div>
                                Total Pengeluaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(totalExpenses)}</p>
                            <p className="text-red-100 text-sm mt-2">{expenses.length} transaksi bulan ini</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top 3 Categories */}
                {expensesByCategory.slice(0, 3).map((cat, index) => (
                    <div key={cat.value} className={`animate-slideInBlur stagger-${index + 2}`} style={{ opacity: 0 }}>
                        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full -translate-y-1/2 translate-x-1/2 animate-floatOrb" />
                            <CardHeader className="pb-2 relative">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                                        <SafeIcon name={cat.icon} className="h-4 w-4 text-white" />
                                    </div>
                                    {cat.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(cat.total)}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{cat.count} transaksi</p>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Category Breakdown Chart */}
            {expensesByCategory.length > 0 && (
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <SafeIcon name="PieChart" className="h-4 w-4 text-purple-600" />
                            </div>
                            Statistik Pengeluaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            {/* Chart */}
                            <div className="h-[300px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expensesByCategory}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="total"
                                        >
                                            {expensesByCategory.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CHART_COLORS[entry.value as keyof typeof CHART_COLORS] || '#cbd5e1'}
                                                    strokeWidth={0}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: number) => [formatCurrency(value), 'Jumlah']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-sm text-slate-500 font-medium">Total</span>
                                    <span className="text-xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</span>
                                </div>
                            </div>

                            {/* Detail List */}
                            <div className="space-y-4">
                                {expensesByCategory.map(cat => {
                                    const percentage = totalExpenses > 0 ? ((cat.total / totalExpenses) * 100).toFixed(1) : '0'
                                    return (
                                        <div key={cat.value} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0`}>
                                                <SafeIcon name={cat.icon} className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-900">{cat.label}</span>
                                                    <Badge variant="secondary" className="bg-white shadow-sm border">{percentage}%</Badge>
                                                </div>
                                                <div className="mt-1 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full ${cat.color}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-slate-500 font-bold mt-1 text-right">{formatCurrency(cat.total)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Expense List */}
            <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <SafeIcon name="Receipt" className="h-4 w-4 text-red-600" />
                        </div>
                        Daftar Pengeluaran
                    </CardTitle>
                    <CardDescription>Riwayat pengeluaran bulan ini</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {expenses.length === 0 ? (
                        <div className="text-center py-16">
                            <SafeIcon name="Wallet" className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Pengeluaran</h3>
                            <p className="text-slate-400 mb-6">Catat pengeluaran operasional Anda</p>
                            <Button onClick={() => handleOpenDialog()} className="bg-red-600 hover:bg-red-700">
                                <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
                                Catat Pengeluaran Pertama
                            </Button>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="text-center py-16">
                            <SafeIcon name="Filter" className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Tidak Ada Data</h3>
                            <p className="text-slate-400 mb-6">Tidak ada pengeluaran pada kategori ini</p>
                            <Button onClick={() => setFilterCategory('ALL')} variant="outline">
                                Hapus Filter
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredExpenses.map((expense, index) => (
                                <div
                                    key={expense.id}
                                    className={`p-3 sm:p-4 hover:bg-red-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-gradient-to-br ${getCategoryGradient(expense.category)} flex items-center justify-center`}>
                                            <SafeIcon name={getCategoryIcon(expense.category)} className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            {/* Category + Date */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-sm sm:text-base text-slate-900">{getCategoryLabel(expense.category)}</p>
                                                <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0">
                                                    {formatDate(expense.expense_date)}
                                                </Badge>
                                            </div>

                                            {/* Description */}
                                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                                                {expense.description || 'Tidak ada keterangan'}
                                            </p>

                                            {/* Amount - visible on mobile below */}
                                            <p className="font-bold text-red-600 text-sm sm:hidden mt-1">
                                                {formatCurrency(expense.amount)}
                                            </p>
                                        </div>

                                        {/* Actions + Amount on right */}
                                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                            {/* Amount - hidden on mobile, shown on larger screens */}
                                            <span className="hidden sm:block font-bold text-red-600 text-base lg:text-lg mr-2">
                                                {formatCurrency(expense.amount)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenDialog(expense)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                            >
                                                <SafeIcon name="Pencil" className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(expense)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                            >
                                                <SafeIcon name="Trash2" className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({ show: false, expense: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <SafeIcon name="AlertTriangle" className="h-5 w-5 text-destructive" />
                            Hapus Pengeluaran?
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                <p>Apakah Anda yakin ingin menghapus pengeluaran ini?</p>
                                {deleteConfirm.expense && (
                                    <div className="p-3 bg-muted rounded-lg space-y-1 text-sm border border-border/50">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Kategori:</span>
                                            <span className="font-medium">{getCategoryLabel(deleteConfirm.expense.category)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Jumlah:</span>
                                            <span className="font-bold text-red-600">{formatCurrency(deleteConfirm.expense.amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tanggal:</span>
                                            <span>{formatDate(deleteConfirm.expense.expense_date)}</span>
                                        </div>
                                        {deleteConfirm.expense.description && (
                                            <div className="pt-1 mt-1 border-t border-border/50">
                                                <span className="text-muted-foreground block text-xs mb-0.5">Keterangan:</span>
                                                <span className="italic text-slate-700">{deleteConfirm.expense.description}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive hover:bg-destructive/90 transition-colors"
                        >
                            <SafeIcon name="Trash2" className="h-4 w-4 mr-2" />
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
