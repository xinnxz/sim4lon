
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { lpgProductsApi, type LpgProduct, type LpgCategory } from '@/lib/api'
import { toast } from 'sonner'

// Format currency for display
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

// Parse currency string to number
const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, '')
    return parseInt(cleaned) || 0
}

// Format number with thousand separators for input display
const formatPriceInput = (value: string): string => {
    const number = parseCurrency(value)
    if (number === 0) return ''
    return new Intl.NumberFormat('id-ID').format(number)
}

export default function LpgProductsManager() {
    const [products, setProducts] = useState<LpgProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<LpgProduct | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        size_kg: '',
        category: 'NON_SUBSIDI' as LpgCategory,
        color: '',
        description: '',
        priceLabel: 'Harga Retail',
        priceValue: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<LpgProduct | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const data = await lpgProductsApi.getAll(false) // Only active products
            setProducts(data)
            setError(null)
        } catch (err: any) {
            console.error('Failed to fetch products:', err)
            setError(err?.message || 'Gagal memuat data produk')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const resetForm = () => {
        setFormData({
            name: '',
            size_kg: '',
            category: 'NON_SUBSIDI',
            color: '',
            description: '',
            priceLabel: 'Harga Retail',
            priceValue: '',
        })
        setEditingProduct(null)
    }

    const openAddForm = () => {
        resetForm()
        setShowForm(true)
    }

    const openEditForm = (product: LpgProduct) => {
        setEditingProduct(product)
        const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
        setFormData({
            name: product.name,
            size_kg: String(product.size_kg),
            category: product.category,
            color: product.color || '',
            description: product.description || '',
            priceLabel: defaultPrice?.label || 'Harga Retail',
            priceValue: defaultPrice ? formatPriceInput(String(defaultPrice.price)) : '',
        })
        setShowForm(true)
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPriceInput(e.target.value)
        setFormData({ ...formData, priceValue: formatted })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.size_kg) {
            toast.error('Nama dan ukuran wajib diisi')
            return
        }

        // Validate price is required for new products
        const priceNumber = parseCurrency(formData.priceValue)
        if (!editingProduct && priceNumber <= 0) {
            toast.error('Harga wajib diisi dan harus lebih dari 0')
            return
        }

        setIsSubmitting(true)
        try {
            if (editingProduct) {
                await lpgProductsApi.update(editingProduct.id, {
                    name: formData.name,
                    size_kg: parseFloat(formData.size_kg),
                    category: formData.category,
                    color: formData.color || undefined,
                    description: formData.description || undefined,
                })
                toast.success(`Produk "${formData.name}" berhasil diperbarui`)
            } else {
                await lpgProductsApi.create({
                    name: formData.name,
                    size_kg: parseFloat(formData.size_kg),
                    category: formData.category,
                    color: formData.color || undefined,
                    description: formData.description || undefined,
                    prices: [{
                        label: formData.priceLabel || 'Harga Retail',
                        price: priceNumber,
                        is_default: true,
                    }],
                })
                toast.success(`Produk "${formData.name}" berhasil ditambahkan`)
            }

            setShowForm(false)
            fetchProducts()
        } catch (err: any) {
            console.error('Failed to save product:', err)
            toast.error(err?.message || 'Gagal menyimpan produk')
        } finally {
            setIsSubmitting(false)
        }
    }

    const openDeleteDialog = (product: LpgProduct) => {
        setProductToDelete(product)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return

        setIsDeleting(true)
        try {
            await lpgProductsApi.delete(productToDelete.id)
            toast.success(`Produk "${productToDelete.name}" berhasil dihapus`)
            setDeleteDialogOpen(false)
            setProductToDelete(null)
            fetchProducts()
        } catch (err: any) {
            toast.error(err?.message || 'Gagal menghapus produk')
        } finally {
            setIsDeleting(false)
        }
    }

    const getCategoryBadge = (category: LpgCategory) => {
        if (category === 'SUBSIDI') {
            return <Badge className="bg-green-100 text-green-700 border-green-200">Subsidi</Badge>
        }
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Non-Subsidi</Badge>
    }

    if (isLoading) {
        return (
            <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-center h-64">
                    <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Produk LPG</h1>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan hapus jenis produk LPG beserta harganya.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.location.href = '/ringkasan-stok'}>
                        <SafeIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                        Kembali
                    </Button>
                    {!showForm && (
                        <Button onClick={openAddForm}>
                            <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
                            Tambah Produk
                        </Button>
                    )}
                </div>
            </div>

            {/* Add/Edit Form Card */}
            {showForm && (
                <Card className="border-2 border-primary/50">
                    <CardHeader>
                        <CardTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</CardTitle>
                        <CardDescription>
                            {editingProduct
                                ? 'Perbarui informasi produk LPG.'
                                : 'Isi informasi produk LPG baru.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Nama Produk *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Contoh: Elpiji 3kg"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="size_kg">Ukuran (kg) *</Label>
                                    <Input
                                        id="size_kg"
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={formData.size_kg}
                                        onChange={(e) => setFormData({ ...formData, size_kg: e.target.value })}
                                        placeholder="3"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="category">Kategori *</Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as LpgCategory })}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                    >
                                        <option value="SUBSIDI">Subsidi</option>
                                        <option value="NON_SUBSIDI">Non-Subsidi</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="color">Warna Tabung</Label>
                                    <Input
                                        id="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="hijau, biru, pink, merah"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Keterangan produk (opsional)"
                                />
                            </div>

                            {/* Price fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="priceLabel">
                                        Label Harga {!editingProduct && '*'}
                                    </Label>
                                    <Input
                                        id="priceLabel"
                                        value={formData.priceLabel}
                                        onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                                        placeholder="Harga Retail"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="priceValue">
                                        Harga (Rp) {!editingProduct && '*'}
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                            Rp
                                        </span>
                                        <Input
                                            id="priceValue"
                                            type="text"
                                            value={formData.priceValue}
                                            onChange={handlePriceChange}
                                            placeholder="18.000"
                                            className="pl-10"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {editingProduct
                                            ? 'Kosongkan untuk tidak mengubah harga.'
                                            : 'Contoh: 18.000 atau 180.000'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <SafeIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />}
                                    {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Products Grid */}
            {error ? (
                <Card className="border-destructive">
                    <CardContent className="p-6 text-center text-destructive">
                        <SafeIcon name="AlertCircle" className="h-10 w-10 mx-auto mb-2" />
                        <p>{error}</p>
                        <Button variant="link" onClick={fetchProducts}>Coba lagi</Button>
                    </CardContent>
                </Card>
            ) : products.length === 0 ? (
                <Card className="border-2 border-dashed">
                    <CardContent className="p-12 text-center">
                        <SafeIcon name="Package" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Belum Ada Produk LPG</h3>
                        <p className="text-muted-foreground mb-4">Tambahkan produk LPG pertama Anda untuk mulai mengelola stok.</p>
                        <Button onClick={openAddForm}>
                            <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
                            Tambah Produk Pertama
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Card key={product.id} className="border-2 flex flex-col h-full">
                            <CardHeader className="pb-2 flex-shrink-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-base truncate">{product.name}</CardTitle>
                                        <CardDescription className="text-xs mt-1">
                                            {product.size_kg} kg • {product.color || 'Standard'}
                                        </CardDescription>
                                    </div>
                                    {getCategoryBadge(product.category)}
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1 pt-0">
                                {/* Description - fixed height area */}
                                <div className="h-10 mb-3">
                                    {product.description ? (
                                        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground/50 italic">Tidak ada deskripsi</p>
                                    )}
                                </div>

                                {/* Prices - fixed height area */}
                                <div className="h-14 mb-3">
                                    {product.prices.length > 0 ? (
                                        <div className="space-y-1">
                                            {product.prices.slice(0, 2).map((price) => (
                                                <div key={price.id} className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground text-xs truncate max-w-[100px]">{price.label}</span>
                                                    <span className="font-semibold">{formatCurrency(Number(price.price))}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-amber-600 italic">Belum ada harga</p>
                                    )}
                                </div>

                                {/* Actions - always at bottom */}
                                <div className="flex gap-2 pt-3 border-t mt-auto">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditForm(product)}>
                                        <SafeIcon name="Pencil" className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive hover:text-white"
                                        onClick={() => openDeleteDialog(product)}
                                    >
                                        <SafeIcon name="Trash2" className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk LPG?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan menghapus produk <strong>"{productToDelete?.name}"</strong>.
                            <br /><br />
                            Data stok yang terkait dengan produk ini tidak akan dihapus,
                            tetapi produk tidak akan muncul lagi di daftar.
                            <br /><br />
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <SafeIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <SafeIcon name="Trash2" className="h-4 w-4 mr-2" />
                                    Ya, Hapus
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
