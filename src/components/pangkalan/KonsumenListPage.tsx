/**
 * KonsumenListPage - Daftar Konsumen Pangkalan
 * 
 * PENJELASAN:
 * Halaman untuk melihat, mencari, menambah, dan mengelola konsumen pangkalan.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import SafeIcon from '@/components/common/SafeIcon'
import { consumersApi, type Consumer } from '@/lib/api'
import { toast } from 'sonner'

export default function KonsumenListPage() {
    const [consumers, setConsumers] = useState<Consumer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingConsumer, setEditingConsumer] = useState<Consumer | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchConsumers = async () => {
        try {
            setIsLoading(true)
            const response = await consumersApi.getAll(page, 10, search || undefined)
            setConsumers(response.data)
            setTotalPages(response.meta.totalPages)
        } catch (error) {
            console.error('Failed to fetch consumers:', error)
            toast.error('Gagal memuat data konsumen')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchConsumers()
    }, [page, search])

    const handleOpenDialog = (consumer?: Consumer) => {
        if (consumer) {
            setEditingConsumer(consumer)
            setFormData({
                name: consumer.name,
                phone: consumer.phone || '',
                address: consumer.address || '',
                note: consumer.note || '',
            })
        } else {
            setEditingConsumer(null)
            setFormData({ name: '', phone: '', address: '', note: '' })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error('Nama konsumen wajib diisi')
            return
        }

        try {
            setIsSubmitting(true)
            if (editingConsumer) {
                await consumersApi.update(editingConsumer.id, formData)
                toast.success('Konsumen berhasil diperbarui')
            } else {
                await consumersApi.create(formData)
                toast.success('Konsumen berhasil ditambahkan')
            }
            setIsDialogOpen(false)
            fetchConsumers()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan konsumen')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (consumer: Consumer) => {
        if (!confirm(`Hapus konsumen "${consumer.name}"?`)) return

        try {
            await consumersApi.delete(consumer.id)
            toast.success('Konsumen berhasil dihapus')
            fetchConsumers()
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus konsumen')
        }
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Daftar Konsumen</h1>
                    <p className="text-muted-foreground">Kelola data pelanggan pangkalan Anda</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
                            <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                            Tambah Konsumen
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingConsumer ? 'Edit Konsumen' : 'Tambah Konsumen Baru'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingConsumer ? 'Perbarui data konsumen' : 'Isi data konsumen baru'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Warung Bu Tini"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">No. Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="08123456789"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Jl. Merdeka No. 123"
                                        rows={2}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="note">Catatan</Label>
                                    <Textarea
                                        id="note"
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        placeholder="Catatan tambahan..."
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

            {/* Search */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari konsumen..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Consumer List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : consumers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <SafeIcon name="Users" className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {search ? 'Tidak ada konsumen ditemukan' : 'Belum ada konsumen'}
                            </p>
                            {!search && (
                                <Button
                                    onClick={() => handleOpenDialog()}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                                >
                                    <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                                    Tambah Konsumen Pertama
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {consumers.map((consumer) => (
                                <div
                                    key={consumer.id}
                                    className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <SafeIcon name="User" className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{consumer.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {consumer.phone || 'Tidak ada telepon'}
                                                {consumer._count?.consumer_orders ? (
                                                    <span className="ml-2">• {consumer._count.consumer_orders} pesanan</span>
                                                ) : null}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={consumer.is_active ? 'default' : 'secondary'}>
                                            {consumer.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDialog(consumer)}
                                        >
                                            <SafeIcon name="Pencil" className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(consumer)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <SafeIcon name="Trash2" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Halaman {page} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        <SafeIcon name="ChevronRight" className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
