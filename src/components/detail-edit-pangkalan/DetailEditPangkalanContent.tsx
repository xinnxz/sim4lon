/**
 * DetailEditPangkalanContent - Detail & Edit Pangkalan dengan API Integration
 * 
 * PENJELASAN:
 * Component ini menampilkan detail pangkalan dan memungkinkan editing.
 * Data di-fetch dari API berdasarkan ID di URL params.
 * Includes order history for the pangkalan.
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import SafeIcon from '@/components/common/SafeIcon'
import PangkalanInfoCard from '@/components/detail-edit-pangkalan/PangkalanInfoCard'
import PangkalanEditForm from '@/components/detail-edit-pangkalan/PangkalanEditForm'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { toast } from 'sonner'
import { pangkalanApi, ordersApi, type Pangkalan, type Order } from '@/lib/api'
import { formatCurrency } from '@/lib/currency'

// Status labels and colors
const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  DIPROSES: 'Diproses',
  SIAP_KIRIM: 'Siap Kirim',
  DIKIRIM: 'Sedang Dikirim',
  SELESAI: 'Selesai',
  BATAL: 'Dibatalkan',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  MENUNGGU_PEMBAYARAN: 'bg-amber-100 text-amber-700',
  DIPROSES: 'bg-blue-100 text-blue-700',
  SIAP_KIRIM: 'bg-purple-100 text-purple-700',
  DIKIRIM: 'bg-indigo-100 text-indigo-700',
  SELESAI: 'bg-green-100 text-green-700',
  BATAL: 'bg-red-100 text-red-700',
}

export default function DetailEditPangkalanContent() {
  const [pangkalan, setPangkalan] = useState<Pangkalan | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState<string | null>(null)

  // Get pangkalan ID from URL
  const getPangkalanId = () => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
  }

  // Fetch pangkalan data and orders on mount
  useEffect(() => {
    const fetchData = async () => {
      const id = getPangkalanId()
      if (!id) {
        toast.error('ID Pangkalan tidak ditemukan')
        setIsLoading(false)
        return
      }

      try {
        // Fetch pangkalan and orders in parallel
        const [pangkalanData, ordersData] = await Promise.all([
          pangkalanApi.getById(id),
          ordersApi.getAll(1, 10, undefined, id) // Get last 10 orders for this pangkalan
        ])

        setPangkalan(pangkalanData)
        setOrders(ordersData.data || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Gagal memuat data pangkalan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  /**
   * Handle save - call API to update pangkalan
   * After update, re-fetch complete data to ensure users array is up-to-date
   */
  const handleSave = async (formData: Partial<Pangkalan>) => {
    if (!pangkalan) return

    setIsSaving(true)
    try {
      console.log('Updating pangkalan with data:', formData)
      await pangkalanApi.update(pangkalan.id, formData)

      // Re-fetch complete pangkalan data to get updated users array
      // This ensures the Reset Password modal shows the correct email
      const refreshedData = await pangkalanApi.getById(pangkalan.id)
      console.log('Refreshed pangkalan data:', refreshedData)
      setPangkalan(refreshedData)

      setIsEditing(false)
      toast.success('Data pangkalan berhasil diperbarui')
    } catch (error: any) {
      console.error('Failed to update pangkalan:', error)
      // Show more detailed error message
      const errorMessage = error?.message || error?.response?.data?.message || 'Gagal memperbarui data pangkalan'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  /**
   * Handle reset password untuk akun pangkalan
   */
  const handleResetPassword = async () => {
    if (!pangkalan || !pangkalan.users || pangkalan.users.length === 0) {
      toast.error('Pangkalan ini belum memiliki akun login')
      return
    }

    setIsResettingPassword(true)
    try {
      const token = localStorage.getItem('sim4lon_token')
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api'}/users/${pangkalan.users[0].id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      const result = await response.json()
      setNewPassword(result.newPassword)
      toast.success('Password berhasil direset!')
    } catch (error) {
      console.error('Failed to reset password:', error)
      toast.error('Gagal reset password')
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleDelete = async () => {
    if (!pangkalan) return

    setIsDeleting(true)
    try {
      await pangkalanApi.delete(pangkalan.id)
      toast.success('Pangkalan berhasil dihapus')
      // Redirect to list page
      window.location.href = '/daftar-pangkalan'
    } catch (error: any) {
      console.error('Failed to delete pangkalan:', error)
      const errorMessage = error?.message || 'Gagal menghapus pangkalan'
      toast.error(errorMessage)
      setShowDeleteModal(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  // Not found state
  if (!pangkalan) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <SafeIcon name="AlertCircle" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Pangkalan Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            Data pangkalan yang Anda cari tidak ditemukan.
          </p>
          <Button asChild>
            <a href="/daftar-pangkalan">Kembali ke Daftar Pangkalan</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <a href="/daftar-pangkalan" className="text-muted-foreground hover:text-foreground transition-colors">
            Pangkalan
          </a>
          <SafeIcon name="ChevronRight" className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-semibold text-lg">{pangkalan.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Detail Pangkalan</h1>
            <p className="text-muted-foreground font-mono text-sm">{pangkalan.code}</p>
          </div>
          <div className="flex gap-2">
            <a href="/daftar-pangkalan">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 h-8 px-2"
              >
                <SafeIcon name="ArrowLeft" className="h-3.5 w-3.5" />
                Kembali
              </Button>
            </a>
            <Button
              variant={isEditing ? "outline" : "ghost"}
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
              className="gap-1 h-8 px-2"
            >
              <SafeIcon name={isEditing ? "X" : "Pencil"} className="h-3.5 w-3.5" />
              {isEditing ? 'Batal' : 'Edit'}
            </Button>
            {/* Reset Password button */}
            {pangkalan.users && pangkalan.users.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => setShowResetPasswordModal(true)}
                title="Reset password akun pangkalan"
              >
                <SafeIcon name="KeyRound" className="h-3.5 w-3.5" />
                Reset Password
              </Button>
            )}
            {/* Delete button - soft delete (data tetap tersimpan) */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteModal(true)}
              title="Hapus pangkalan (soft delete)"
            >
              <SafeIcon name="Trash2" className="h-3.5 w-3.5" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {!isEditing ? (
          <>
            <PangkalanInfoCard pangkalan={pangkalan} />

            {/* Order History */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <SafeIcon name="History" className="h-5 w-5 text-primary" />
                  Riwayat Pesanan
                </CardTitle>
                <CardDescription>
                  {orders.length > 0
                    ? `${orders.length} pesanan terakhir`
                    : 'Belum ada riwayat pesanan'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="w-full">
                    {/* Scrollable container with max-height for ~10 rows */}
                    <div className="overflow-auto max-h-[480px] border rounded-lg">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead className="min-w-[100px]">Kode</TableHead>
                            <TableHead className="min-w-[110px]">Tanggal</TableHead>
                            <TableHead className="min-w-[150px]">Item</TableHead>
                            <TableHead className="min-w-[130px] text-right">Total</TableHead>
                            <TableHead className="min-w-[110px]">Status</TableHead>
                            <TableHead className="min-w-[80px]">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.slice(0, 10).map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium font-mono text-primary">
                                {order.code || `ORD-${order.id.slice(0, 4).toUpperCase()}`}
                              </TableCell>
                              <TableCell className="text-foreground text-sm">
                                {formatDate(order.created_at)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {order.order_items && order.order_items.length > 0 ? (
                                  <div className="space-y-0.5">
                                    {order.order_items.map((item, idx) => (
                                      <div key={idx} className="text-foreground">
                                        {item.label || item.lpg_type} × {item.qty}
                                      </div>
                                    ))}
                                  </div>
                                ) : '-'}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-foreground">
                                {formatCurrency(order.total_amount)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="status"
                                  className={statusColors[order.current_status] || 'bg-gray-100 text-gray-700'}
                                >
                                  {statusLabels[order.current_status] || order.current_status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <a href={`/detail-pesanan?code=${order.code}`}>
                                  <Button variant="ghost" size="sm">
                                    <SafeIcon name="Eye" className="h-4 w-4" />
                                  </Button>
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Footer with count and Lihat Semua button */}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">
                        Menampilkan {Math.min(orders.length, 10)} pesanan terbaru
                      </p>
                      <a href={`/daftar-pesanan?pangkalan_id=${pangkalan.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <SafeIcon name="List" className="h-3.5 w-3.5" />
                          Lihat Semua Pesanan
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <SafeIcon name="Package" className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada pesanan dari pangkalan ini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <PangkalanEditForm
            pangkalan={pangkalan}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDelete}
        title="Hapus Pangkalan"
        description={`Apakah Anda yakin ingin menghapus pangkalan "${pangkalan?.name}"? Tindakan ini tidak dapat dikembalikan!`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDangerous={true}
        isLoading={isDeleting}
      />

      {/* Reset Password Modal - Modern Enterprise Design */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <SafeIcon name="Shield" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Reset Password</h2>
                  <p className="text-sm text-amber-100">{pangkalan?.name}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!newPassword ? (
                <div className="space-y-4">
                  {/* Security Info */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100">
                    <SafeIcon name="Info" className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Password akan direset</p>
                      <p className="text-gray-600 dark:text-gray-400">Sistem akan generate password baru untuk akun <span className="font-mono font-semibold">{pangkalan?.users?.[0]?.email}</span>. Password lama tidak dapat dipulihkan.</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Langkah selanjutnya:</p>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium">1</span>
                        Klik "Generate Password"
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium">2</span>
                        Copy password yang muncul
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium">3</span>
                        Berikan ke pangkalan melalui WhatsApp
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Success State */}
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="bg-green-500 rounded-full p-1">
                      <SafeIcon name="Check" className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-green-800">Password berhasil direset!</p>
                  </div>

                  {/* Password Display */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Baru</label>
                    <div className="relative">
                      <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-mono text-lg tracking-wider">
                        <span className="flex-1 select-all break-all">{newPassword}</span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(newPassword)
                            toast.success('Password disalin ke clipboard!')
                          }}
                          className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <SafeIcon name="Copy" className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <SafeIcon name="AlertTriangle" className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                      <strong>Penting:</strong> Salin password ini sekarang. Setelah modal ditutup, password tidak akan ditampilkan lagi.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3 justify-end">
              {!newPassword ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowResetPasswordModal(false)}
                    disabled={isResettingPassword}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? (
                      <>
                        <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <SafeIcon name="Key" className="mr-2 h-4 w-4" />
                        Generate Password
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  onClick={() => {
                    setShowResetPasswordModal(false)
                    setNewPassword(null)
                  }}
                >
                  <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                  Selesai
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
