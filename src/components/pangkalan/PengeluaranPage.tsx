/**
 * PengeluaranPage - Halaman Pengeluaran Pangkalan
 * 
 * PENJELASAN:
 * Halaman untuk mencatat dan mengelola pengeluaran operasional pangkalan.
 * Terintegrasi dengan Laporan untuk menghitung laba bersih.
 * 
 * Kategori Pengeluaran:
 * - OPERASIONAL: Biaya operasional umum
 * - TRANSPORT: BBM, ojek, transportasi
 * - SEWA: Sewa tempat, alat
 * - LISTRIK: Listrik, air
 * - GAJI: Gaji karyawan
 * - LAINNYA: Pengeluaran lainnya
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import SafeIcon from '@/components/common/SafeIcon'
import { expensesApi, type Expense, type ExpenseCategory } from '@/lib/api'
import { toast } from 'sonner'

// Kategori dengan label dan icon
const CATEGORIES: { value: ExpenseCategory; label: string; icon: string; color: string }[] = [
    { value: 'OPERASIONAL', label: 'Operasional', icon: 'Settings', color: 'bg-slate-500' },
    { value: 'TRANSPORT', label: 'Transport', icon: 'Fuel', color: 'bg-orange-500' },
    { value: 'SEWA', label: 'Sewa', icon: 'Home', color: 'bg-purple-500' },
    { value: 'LISTRIK', label: 'Listrik/Air', icon: 'Zap', color: 'bg-yellow-500' },
    { value: 'GAJI', label: 'Gaji', icon: 'Users', color: 'bg-blue-500' },
    { value: 'LAINNYA', label: 'Lainnya', icon: 'MoreHorizontal', color: 'bg-gray-500' },
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

    // Filter state
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
        if (!confirm(`Hapus pengeluaran "${getCategoryLabel(expense.category)}" Rp ${formatNumber(expense.amount)}?`)) return

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

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getCategoryLabel = (cat: string) => {
        return CATEGORIES.find(c => c.value === cat)?.label || cat
    }

    const getCategoryColor = (cat: string) => {
        return CATEGORIES.find(c => c.value === cat)?.color || 'bg-gray-500'
    }

    const getCategoryIcon = (cat: string) => {
        return CATEGORIES.find(c => c.value === cat)?.icon || 'Circle'
    }

    // Calculate summary
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const expensesByCategory = CATEGORIES.map(cat => ({
        ...cat,
        total: expenses.filter(e => e.category === cat.value).reduce((sum, e) => sum + Number(e.amount), 0),
    })).filter(cat => cat.total > 0)

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pengeluaran</h1>
                    <p className="text-muted-foreground">Catat biaya operasional pangkalan</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
                            <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                            Tambah Pengeluaran
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingExpense ? 'Perbarui data pengeluaran' : 'Isi data pengeluaran baru'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(v: ExpenseCategory) => setFormData({ ...formData, category: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                                                        {cat.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Jumlah (Rp) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="50000"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="expense_date">Tanggal</Label>
                                    <Input
                                        id="expense_date"
                                        type="date"
                                        value={formData.expense_date}
                                        onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Keterangan</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="BBM motor untuk antar..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                                    {isSubmitting ? (
                                        <>
                                            <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter */}
            <div className="flex gap-4 items-center">
                <div>
                    <Label>Bulan</Label>
                    <Input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-[180px]"
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                        <p className="text-red-100 text-sm mt-1">{expenses.length} transaksi</p>
                    </CardContent>
                </Card>

                {expensesByCategory.slice(0, 3).map(cat => (
                    <Card key={cat.value} className="bg-white dark:bg-slate-800 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                                {cat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{formatCurrency(cat.total)}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Expense List */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pengeluaran</CardTitle>
                    <CardDescription>Riwayat pengeluaran bulan ini</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : expenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <SafeIcon name="Wallet" className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Belum ada pengeluaran bulan ini</p>
                            <Button
                                onClick={() => handleOpenDialog()}
                                className="mt-4 bg-blue-600 hover:bg-blue-700"
                            >
                                <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                                Catat Pengeluaran Pertama
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {expenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full ${getCategoryColor(expense.category)} flex items-center justify-center`}>
                                            <SafeIcon name={getCategoryIcon(expense.category)} className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{getCategoryLabel(expense.category)}</p>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDate(expense.expense_date)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {expense.description || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-red-600">
                                            -{formatCurrency(expense.amount)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDialog(expense)}
                                            >
                                                <SafeIcon name="Pencil" className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(expense)}
                                                className="text-destructive hover:text-destructive"
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
