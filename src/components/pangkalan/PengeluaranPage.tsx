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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon'
import { expensesApi, type Expense, type ExpenseCategory } from '@/lib/api'
import { toast } from 'sonner'

// Kategori dengan label, icon, dan color
const CATEGORIES: { value: ExpenseCategory; label: string; icon: string; color: string; gradient: string }[] = [
    { value: 'OPERASIONAL', label: 'Operasional', icon: 'Settings', color: 'bg-slate-500', gradient: 'from-slate-500 to-slate-600' },
    { value: 'TRANSPORT', label: 'Transport', icon: 'Truck', color: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
    { value: 'SEWA', label: 'Sewa', icon: 'Home', color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
    { value: 'LISTRIK', label: 'Listrik/Air', icon: 'Zap', color: 'bg-yellow-500', gradient: 'from-yellow-500 to-amber-600' },
    { value: 'GAJI', label: 'Gaji', icon: 'Users', color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
    { value: 'LAINNYA', label: 'Lainnya', icon: 'MoreHorizontal', color: 'bg-gray-500', gradient: 'from-gray-500 to-gray-600' },
]

export default function PengeluaranPage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
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

    const handleDelete = async (expense: Expense) => {
        if (!confirm(`Hapus pengeluaran "${getCategoryLabel(expense.category)}" ${formatCurrency(expense.amount)}?`)) return

        try {
            await expensesApi.delete(expense.id)
            toast.success('Pengeluaran berhasil dihapus')
            fetchExpenses()
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

    const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat
    const getCategoryColor = (cat: string) => CATEGORIES.find(c => c.value === cat)?.color || 'bg-gray-500'
    const getCategoryGradient = (cat: string) => CATEGORIES.find(c => c.value === cat)?.gradient || 'from-gray-500 to-gray-600'
    const getCategoryIcon = (cat: string) => CATEGORIES.find(c => c.value === cat)?.icon || 'Circle'

    // Calculate summary
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const expensesByCategory = CATEGORIES.map(cat => ({
        ...cat,
        total: expenses.filter(e => e.category === cat.value).reduce((sum, e) => sum + Number(e.amount), 0),
        count: expenses.filter(e => e.category === cat.value).length,
    })).filter(cat => cat.total > 0)

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
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Pengeluaran</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <SafeIcon name="Wallet" className="h-4 w-4" />
                        Catat biaya operasional pangkalan
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Month Filter */}
                    <Input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-[160px] rounded-xl"
                    />

                    {/* Add Button */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => handleOpenDialog()}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg shadow-red-500/25"
                            >
                                <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
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

            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Total Pengeluaran */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2 relative">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <SafeIcon name="TrendingDown" className="h-4 w-4" />
                            Total Pengeluaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(totalExpenses)}</p>
                        <p className="text-red-100 text-sm mt-2">{expenses.length} transaksi bulan ini</p>
                    </CardContent>
                </Card>

                {/* Top 3 Categories */}
                {expensesByCategory.slice(0, 3).map(cat => (
                    <Card key={cat.value} className="relative overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                                    <SafeIcon name={cat.icon} className="h-4 w-4 text-white" />
                                </div>
                                {cat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(cat.total)}</p>
                            <p className="text-slate-500 text-sm mt-2">{cat.count} transaksi</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Category Breakdown */}
            {expensesByCategory.length > 0 && (
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <SafeIcon name="PieChart" className="h-4 w-4 text-purple-600" />
                            </div>
                            Breakdown Kategori
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                                                <Badge variant="secondary" className="bg-slate-200">{percentage}%</Badge>
                                            </div>
                                            <p className="text-sm text-slate-500 font-bold">{formatCurrency(cat.total)}</p>
                                        </div>
                                    </div>
                                )
                            })}
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
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {expenses.map((expense, index) => (
                                <div
                                    key={expense.id}
                                    className={`flex items-center justify-between p-4 hover:bg-red-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryGradient(expense.category)} flex items-center justify-center`}>
                                            <SafeIcon name={getCategoryIcon(expense.category)} className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-900">{getCategoryLabel(expense.category)}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {formatDate(expense.expense_date)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {expense.description || 'Tidak ada keterangan'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-red-600 text-lg">
                                            -{formatCurrency(expense.amount)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenDialog(expense)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <SafeIcon name="Pencil" className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(expense)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        </div>
    )
}
