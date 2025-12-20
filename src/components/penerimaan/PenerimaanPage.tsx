import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { penerimaanApi, lpgProductsApi, type PenerimaanStok, type PaginatedResponse, type LpgProduct } from '@/lib/api'
import { toast } from 'sonner'

// Type for each item in the receipt
interface PenerimaanItem {
    id: string
    lpg_product_id: string
    qty_pcs: string
}

export default function PenerimaanPage() {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [data, setData] = useState<PaginatedResponse<PenerimaanStok> | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)

    // Sort state
    const [sortField, setSortField] = useState<'tanggal' | 'no_so' | 'no_lo' | 'nama_material' | 'qty_pcs' | 'qty_kg'>('tanggal')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false)
    const [products, setProducts] = useState<LpgProduct[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // Form state - Multi-item support
    const [headerData, setHeaderData] = useState({
        no_so: '',           // Sales Order - dari Agen (shared)
        no_lo: '',           // Loading Order - dari SPBE (shared)
        tanggal: new Date().toISOString().split('T')[0],
    })

    // Dynamic items array
    const [items, setItems] = useState<PenerimaanItem[]>([
        { id: crypto.randomUUID(), lpg_product_id: '', qty_pcs: '' }
    ])

    // Calculate totals for all items
    const totals = useMemo(() => {
        let totalPcs = 0
        let totalKg = 0

        items.forEach(item => {
            if (item.lpg_product_id && item.qty_pcs) {
                const product = products.find(p => p.id === item.lpg_product_id)
                const pcs = parseInt(item.qty_pcs) || 0
                totalPcs += pcs
                totalKg += product ? pcs * Number(product.size_kg) : 0
            }
        })

        return { totalPcs, totalKg }
    }, [items, products])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const result = await penerimaanApi.getAll({ bulan: selectedMonth, page, limit: 25 })
            setData(result)
        } catch (error) {
            toast.error('Gagal memuat data penerimaan')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProducts = async () => {
        try {
            const prods = await lpgProductsApi.getAll()
            setProducts(prods)
        } catch (error) {
            console.error('Failed to fetch products:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedMonth, page])

    useEffect(() => {
        if (showAddModal && products.length === 0) {
            fetchProducts()
        }
    }, [showAddModal])

    const monthOptions = useMemo(() => {
        const options = []
        const now = new Date()
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            options.push({ value, label })
        }
        return options
    }, [])

    // Sorted data
    const sortedData = useMemo(() => {
        if (!data?.data) return []
        return [...data.data].sort((a, b) => {
            let aVal: any = a[sortField]
            let bVal: any = b[sortField]

            // Handle date comparison
            if (sortField === 'tanggal') {
                aVal = new Date(aVal).getTime()
                bVal = new Date(bVal).getTime()
            }
            // Handle numeric comparison
            if (sortField === 'qty_pcs' || sortField === 'qty_kg') {
                aVal = Number(aVal) || 0
                bVal = Number(bVal) || 0
            }
            // String comparison
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase()
                bVal = bVal.toLowerCase()
            }

            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
            return 0
        })
    }, [data?.data, sortField, sortOrder])

    // Toggle sort
    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    // Sort icon component
    const SortIcon = ({ field }: { field: typeof sortField }) => (
        <span className="ml-1 inline-flex">
            {sortField === field ? (
                sortOrder === 'asc' ? (
                    <SafeIcon name="ChevronUp" className="w-4 h-4" />
                ) : (
                    <SafeIcon name="ChevronDown" className="w-4 h-4" />
                )
            ) : (
                <SafeIcon name="ChevronsUpDown" className="w-4 h-4 opacity-30" />
            )}
        </span>
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const resetForm = () => {
        setHeaderData({
            no_so: '',
            no_lo: '',
            tanggal: new Date().toISOString().split('T')[0],
        })
        setItems([{ id: crypto.randomUUID(), lpg_product_id: '', qty_pcs: '' }])
    }

    // Add new empty item row
    const addItem = () => {
        setItems([...items, { id: crypto.randomUUID(), lpg_product_id: '', qty_pcs: '' }])
    }

    // Remove item row
    const removeItem = (id: string) => {
        if (items.length === 1) {
            toast.error('Minimal harus ada 1 item')
            return
        }
        setItems(items.filter(item => item.id !== id))
    }

    // Update item field
    const updateItem = (id: string, field: keyof PenerimaanItem, value: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ))
    }

    // Get available products (not already selected)
    const getAvailableProducts = (currentItemId: string) => {
        const selectedIds = items
            .filter(item => item.id !== currentItemId && item.lpg_product_id)
            .map(item => item.lpg_product_id)
        return products.filter(p => !selectedIds.includes(p.id))
    }

    const handleSubmit = async () => {
        if (!headerData.no_so || headerData.no_so.length !== 10) {
            toast.error('No. SO harus 10 digit')
            return
        }
        if (!headerData.no_lo || headerData.no_lo.length !== 10) {
            toast.error('No. LO harus 10 digit')
            return
        }

        const validItems = items.filter(item => item.lpg_product_id && parseInt(item.qty_pcs) > 0)
        if (validItems.length === 0) {
            toast.error('Tambahkan minimal 1 item dengan jumlah valid')
            return
        }

        setIsSaving(true)
        try {
            // Create one penerimaan per item (same SO/LO)
            for (const item of validItems) {
                const product = products.find(p => p.id === item.lpg_product_id)
                const qtyPcs = parseInt(item.qty_pcs)
                const qtyKg = product ? qtyPcs * Number(product.size_kg) : 0

                await penerimaanApi.create({
                    no_so: headerData.no_so,
                    no_lo: headerData.no_lo,
                    nama_material: product?.name || 'LPG',
                    qty_pcs: qtyPcs,
                    qty_kg: qtyKg,
                    tanggal: headerData.tanggal,
                    sumber: 'SPBE',
                    lpg_product_id: item.lpg_product_id,
                })
            }

            toast.success(`${validItems.length} penerimaan berhasil dicatat (Total: ${totals.totalPcs} tabung)`)
            setShowAddModal(false)
            resetForm()
            fetchData()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan penerimaan')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="glass-card">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Bulan:</span>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                            <SafeIcon name="RefreshCw" className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>

                        <div className="flex-1" />

                        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                            <SafeIcon name="Plus" className="w-4 h-4" />
                            Tambah Penerimaan
                        </Button>

                        <Button variant="outline">
                            <SafeIcon name="Download" className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="chart-card-premium">
                <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <CardTitle className="text-lg font-semibold">Rekapitulasi Penerimaan</CardTitle>
                        <Badge variant="outline" className="ml-auto">
                            {data?.meta.total || 0} Entries
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('tanggal')}>
                                        <span className="flex items-center">Tanggal<SortIcon field="tanggal" /></span>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('no_so')}>
                                        <span className="flex items-center">No SO<SortIcon field="no_so" /></span>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('no_lo')}>
                                        <span className="flex items-center">No LO<SortIcon field="no_lo" /></span>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('nama_material')}>
                                        <span className="flex items-center">Nama Material<SortIcon field="nama_material" /></span>
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('qty_pcs')}>
                                        <span className="flex items-center justify-center">Qty Tabung<SortIcon field="qty_pcs" /></span>
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('qty_kg')}>
                                        <span className="flex items-center justify-center">Qty Kg<SortIcon field="qty_kg" /></span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8">
                                            <SafeIcon name="Loader2" className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            <span className="text-muted-foreground">Memuat data...</span>
                                        </td>
                                    </tr>
                                ) : data?.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data penerimaan untuk bulan ini
                                        </td>
                                    </tr>
                                ) : (
                                    sortedData.map((item) => (
                                        <tr key={item.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">{formatDate(item.tanggal)}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{item.no_so}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{item.no_lo}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-blue-600 font-medium">{item.nama_material}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold">{item.qty_pcs.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center text-muted-foreground">{Number(item.qty_kg).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data && data.meta.totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                            <span className="text-sm text-muted-foreground">
                                Halaman {page} dari {data.meta.totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <SafeIcon name="ChevronLeft" className="w-4 h-4" />
                                </Button>
                                <span className="text-sm px-2">{page} / {data.meta.totalPages}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(data.meta.totalPages, p + 1))}
                                    disabled={page === data.meta.totalPages}
                                >
                                    <SafeIcon name="ChevronRight" className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Modal - Multi-Item Support */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <SafeIcon name="PackagePlus" className="h-5 w-5 text-primary" />
                            Tambah Penerimaan LPG
                        </DialogTitle>
                        <DialogDescription>
                            Catat penerimaan LPG dari SPBE. Bisa tambah beberapa produk sekaligus dengan SO/LO yang sama.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        {/* Header: SO, LO, Date */}
                        <div className="p-4 rounded-xl bg-muted/50 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <SafeIcon name="FileText" className="h-4 w-4" />
                                Dokumen Penerimaan
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="no_so" className="text-xs font-semibold">
                                        No. SO (10 digit) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="no_so"
                                        value={headerData.no_so}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                                            setHeaderData({ ...headerData, no_so: val })
                                        }}
                                        maxLength={10}
                                        className={`h-10 font-mono tracking-wider ${headerData.no_so && headerData.no_so.length === 10 ? 'border-green-500' : ''}`}
                                    />
                                    <p className="text-xs text-muted-foreground">{headerData.no_so.length}/10 digit</p>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="no_lo" className="text-xs font-semibold">
                                        No. LO (10 digit) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="no_lo"
                                        value={headerData.no_lo}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                                            setHeaderData({ ...headerData, no_lo: val })
                                        }}
                                        maxLength={10}
                                        className={`h-10 font-mono tracking-wider ${headerData.no_lo && headerData.no_lo.length === 10 ? 'border-green-500' : ''}`}
                                    />
                                    <p className="text-xs text-muted-foreground">{headerData.no_lo.length}/10 digit</p>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal" className="text-xs font-semibold">
                                        Tanggal <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="tanggal"
                                        type="date"
                                        value={headerData.tanggal}
                                        onChange={(e) => setHeaderData({ ...headerData, tanggal: e.target.value })}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">Daftar Produk</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addItem}
                                    disabled={items.length >= products.length}
                                    className="gap-1"
                                >
                                    <SafeIcon name="Plus" className="h-3 w-3" />
                                    Tambah Produk
                                </Button>
                            </div>

                            {items.map((item, index) => {
                                const product = products.find(p => p.id === item.lpg_product_id)
                                const qtyPcs = parseInt(item.qty_pcs) || 0
                                const qtyKg = product ? qtyPcs * Number(product.size_kg) : 0

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 rounded-xl border bg-card"
                                    >
                                        <span className="text-xs font-bold text-muted-foreground w-6">{index + 1}.</span>

                                        {/* Product Select */}
                                        <div className="flex-1 min-w-[180px]">
                                            <Select
                                                value={item.lpg_product_id}
                                                onValueChange={(v) => updateItem(item.id, 'lpg_product_id', v)}
                                            >
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Pilih produk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getAvailableProducts(item.id).map(p => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.name} ({p.size_kg} kg)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Qty Input */}
                                        <div className="flex items-center gap-2 w-32">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.qty_pcs}
                                                onChange={(e) => updateItem(item.id, 'qty_pcs', e.target.value)}
                                                placeholder="0"
                                                className="h-10 text-center font-bold"
                                            />
                                            <span className="text-xs text-muted-foreground">tbg</span>
                                        </div>

                                        {/* Auto Kg */}
                                        <div className="w-24 text-right">
                                            {qtyKg > 0 && (
                                                <span className="text-sm font-medium text-green-600">{qtyKg} kg</span>
                                            )}
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            <SafeIcon name="X" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Totals Summary */}
                        {totals.totalPcs > 0 && (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2">
                                    <SafeIcon name="Package" className="h-5 w-5 text-green-600" />
                                    <span className="font-medium text-green-700 dark:text-green-400">Total Penerimaan</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">{totals.totalPcs.toLocaleString()} tabung</div>
                                    <div className="text-sm text-green-600">{totals.totalKg.toLocaleString()} kg</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSaving || !headerData.no_so || !headerData.no_lo || totals.totalPcs === 0}
                            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                        >
                            {isSaving ? (
                                <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                            ) : (
                                <SafeIcon name="Check" className="h-4 w-4" />
                            )}
                            Simpan {items.filter(i => i.lpg_product_id && i.qty_pcs).length > 1 ? `(${items.filter(i => i.lpg_product_id && i.qty_pcs).length} item)` : ''}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
