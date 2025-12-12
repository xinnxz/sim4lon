/**
 * PangkalanListPage - Daftar Pangkalan dengan Data Real dari API
 * 
 * PENJELASAN:
 * Component ini menampilkan daftar pangkalan dengan fitur:
 * - Fetch data dari API (bukan mock data)
 * - Search dan filter
 * - Pagination
 * - Create, Edit, Delete pangkalan
 * - Toggle status aktif/nonaktif
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Tilt3DCard from '@/components/dashboard-admin/Tilt3DCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TambahPangkalanForm from '@/components/tambah-pangkalan/TambahPangkalanForm'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { pangkalanApi, type Pangkalan } from '@/lib/api'
import { toast } from 'sonner'

export default function PangkalanListPage() {
  // State untuk data
  const [pangkalanList, setPangkalanList] = useState<Pangkalan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'semua' | 'aktif' | 'nonaktif'>('semua')

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPangkalan, setSelectedPangkalan] = useState<Pangkalan | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  /**
   * Fetch data pangkalan dari API
   */
  const fetchPangkalan = async () => {
    try {
      setIsLoading(true)
      const isActive = statusFilter === 'semua' ? undefined : statusFilter === 'aktif'
      const response = await pangkalanApi.getAll(currentPage, 10, searchTerm || undefined, isActive)

      setPangkalanList(response.data)
      setTotalItems(response.meta.total)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch pangkalan:', error)
      toast.error('Gagal memuat data pangkalan')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data saat component mount atau filter berubah
  useEffect(() => {
    fetchPangkalan()
  }, [currentPage, statusFilter])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset ke page 1 saat search
      fetchPangkalan()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  /**
   * Handle status toggle (aktif/nonaktif)
   */
  const handleStatusToggleClick = (pangkalan: Pangkalan) => {
    setSelectedPangkalan(pangkalan)
    setShowConfirmModal(true)
  }

  const handleConfirmStatusToggle = async () => {
    if (!selectedPangkalan) return

    try {
      const newStatus = !selectedPangkalan.is_active
      await pangkalanApi.update(selectedPangkalan.id, { is_active: newStatus })

      toast.success(`Pangkalan berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
      fetchPangkalan() // Refresh data
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Gagal mengubah status pangkalan')
    } finally {
      setShowConfirmModal(false)
      setSelectedPangkalan(null)
    }
  }

  /**
   * Handle add pangkalan success
   */
  const handleAddSuccess = () => {
    setShowAddModal(false)
    fetchPangkalan()
    toast.success('Pangkalan berhasil ditambahkan')
  }

  // Hitung summary stats
  const aktivCount = pangkalanList.filter(p => p.is_active).length
  const nonaktifCount = pangkalanList.filter(p => !p.is_active).length

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pangkalan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pangkalan distribusi LPG Anda
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
        >
          <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
          Tambah Pangkalan
        </Button>
      </div>

      {/* Summary Stats */}
      <div id="ikyt24" className="grid gap-4 md:grid-cols-3">
        <Tilt3DCard className="animate-fadeInUp">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pangkalan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Semua pangkalan terdaftar
              </p>
            </CardContent>
          </Card>
        </Tilt3DCard>
        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pangkalan Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{aktivCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Siap beroperasi
              </p>
            </CardContent>
          </Card>
        </Tilt3DCard>
        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pangkalan Nonaktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{nonaktifCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Memerlukan perhatian
              </p>
            </CardContent>
          </Card>
        </Tilt3DCard>
      </div>

      {/* Search and Filter Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cari Pangkalan</CardTitle>
          <CardDescription>
            Cari berdasarkan nama, alamat, atau wilayah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Cari pangkalan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <SafeIcon name="Search" className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'semua' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('semua')}
                className="flex-1 sm:flex-none"
              >
                Semua
              </Button>
              <Button
                variant={statusFilter === 'aktif' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('aktif')}
                className="flex-1 sm:flex-none"
              >
                Aktif
              </Button>
              <Button
                variant={statusFilter === 'nonaktif' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('nonaktif')}
                className="flex-1 sm:flex-none"
              >
                Nonaktif
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pangkalan</CardTitle>
          <CardDescription>
            Menampilkan {pangkalanList.length} dari {totalItems} pangkalan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Memuat data...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Nama Pangkalan</TableHead>
                    <TableHead className="font-semibold">Alamat</TableHead>
                    <TableHead className="font-semibold">Wilayah</TableHead>
                    <TableHead className="font-semibold">Telepon</TableHead>
                    <TableHead className="font-semibold">PIC</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pangkalanList.length > 0 ? (
                    pangkalanList.map((pangkalan) => (
                      <TableRow key={pangkalan.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {pangkalan.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {pangkalan.address}
                        </TableCell>
                        <TableCell className="text-sm">
                          {pangkalan.region}
                        </TableCell>
                        <TableCell className="text-sm">
                          {pangkalan.phone}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {pangkalan.pic_name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={pangkalan.is_active ? 'default' : 'secondary'}
                            className={
                              pangkalan.is_active
                                ? 'bg-primary/20 text-primary hover:bg-primary/30'
                                : ''
                            }
                          >
                            {pangkalan.is_active ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <SafeIcon name="MoreVertical" className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a
                                  href={`/detail-edit-pangkalan?id=${pangkalan.id}`}
                                  className="cursor-pointer"
                                >
                                  <SafeIcon name="Eye" className="mr-2 h-4 w-4" />
                                  <span>Lihat Detail</span>
                                </a>
                              </DropdownMenuItem>
                              {pangkalan.is_active ? (
                                <DropdownMenuItem
                                  className="text-destructive cursor-pointer"
                                  onClick={() => handleStatusToggleClick(pangkalan)}
                                >
                                  <SafeIcon name="Ban" className="mr-2 h-4 w-4" />
                                  <span>Nonaktifkan</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600 cursor-pointer"
                                  onClick={() => handleStatusToggleClick(pangkalan)}
                                >
                                  <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                                  <span>Aktifkan</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <SafeIcon name="Search" className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Tidak ada pangkalan ditemukan
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <SafeIcon name="ChevronLeft" className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                  <SafeIcon name="ChevronRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for Adding Pangkalan */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Pangkalan Baru</DialogTitle>
            <DialogDescription>
              Daftarkan pangkalan LPG baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <TambahPangkalanForm
              isModal={true}
              onSuccess={handleAddSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Status Toggle */}
      {selectedPangkalan && (
        <ConfirmationModal
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          title={selectedPangkalan.is_active ? 'Nonaktifkan Pangkalan' : 'Aktifkan Pangkalan'}
          description={
            selectedPangkalan.is_active
              ? `Apakah Anda yakin ingin menonaktifkan pangkalan "${selectedPangkalan.name}"? Pangkalan ini tidak akan dapat menerima pesanan sampai diaktifkan kembali.`
              : `Apakah Anda yakin ingin mengaktifkan pangkalan "${selectedPangkalan.name}"? Pangkalan ini akan dapat menerima pesanan kembali.`
          }
          confirmText={selectedPangkalan.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          cancelText="Batal"
          icon={selectedPangkalan.is_active ? 'AlertTriangle' : 'CheckCircle'}
          isDangerous={selectedPangkalan.is_active}
          onConfirm={handleConfirmStatusToggle}
        />
      )}
    </div>
  )
}
