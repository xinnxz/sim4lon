/**
 * DriverListPage - Daftar Driver dengan Data Real dari API
 * 
 * PENJELASAN:
 * Component ini menampilkan daftar driver/supir dengan fitur:
 * - Fetch data dari API (bukan mock data)
 * - Search dan filter
 * - Pagination
 * - Create, Edit, Delete driver
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
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { driversApi, type Driver } from '@/lib/api'
import { toast } from 'sonner'
import AddDriverModal from './AddDriverModal'

export default function DriverListPage() {
  // State untuk data
  const [driverList, setDriverList] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'semua' | 'aktif' | 'nonaktif'>('semua')

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  /**
   * Fetch data driver dari API
   */
  const fetchDrivers = async () => {
    try {
      setIsLoading(true)
      const isActive = statusFilter === 'semua' ? undefined : statusFilter === 'aktif'
      const response = await driversApi.getAll(currentPage, 10, searchTerm || undefined, isActive)

      setDriverList(response.data)
      setTotalItems(response.meta.total)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
      toast.error('Gagal memuat data driver')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data saat component mount atau filter berubah
  useEffect(() => {
    fetchDrivers()
  }, [currentPage, statusFilter])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchDrivers()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  /**
   * Handle status toggle
   */
  const handleStatusToggleClick = (driver: Driver) => {
    setSelectedDriver(driver)
    setShowStatusModal(true)
  }

  const handleConfirmStatusToggle = async () => {
    if (!selectedDriver) return

    try {
      const newStatus = !selectedDriver.is_active
      await driversApi.update(selectedDriver.id, { is_active: newStatus })

      toast.success(`Driver berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
      fetchDrivers()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Gagal mengubah status driver')
    } finally {
      setShowStatusModal(false)
      setSelectedDriver(null)
    }
  }

  /**
   * Handle delete driver
   */
  const handleDeleteClick = (driver: Driver) => {
    setSelectedDriver(driver)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedDriver) return

    try {
      await driversApi.delete(selectedDriver.id)
      toast.success('Driver berhasil dihapus')
      fetchDrivers()
    } catch (error) {
      console.error('Failed to delete driver:', error)
      toast.error('Gagal menghapus driver')
    } finally {
      setShowDeleteModal(false)
      setSelectedDriver(null)
    }
  }

  /**
   * Handle add/edit success
   */
  const handleSaveSuccess = () => {
    setShowAddModal(false)
    setEditingDriver(null)
    fetchDrivers()
  }

  // Hitung summary stats
  const aktivCount = driverList.filter(d => d.is_active).length
  const nonaktifCount = driverList.filter(d => !d.is_active).length

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Daftar Supir</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data driver dan status ketersediaan mereka
          </p>
        </div>
        <Button
          onClick={() => { setEditingDriver(null); setShowAddModal(true) }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
        >
          <SafeIcon name="Plus" className="h-4 w-4" />
          Tambah Supir
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Tilt3DCard className="animate-fadeInUp">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Supir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
        </Tilt3DCard>
        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Supir Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{aktivCount}</div>
            </CardContent>
          </Card>
        </Tilt3DCard>
        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Supir Nonaktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{nonaktifCount}</div>
            </CardContent>
          </Card>
        </Tilt3DCard>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cari Supir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Supir</CardTitle>
          <CardDescription>
            Menampilkan {driverList.length} dari {totalItems} supir
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
                    <TableHead className="font-semibold">Nama</TableHead>
                    <TableHead className="font-semibold">Telepon</TableHead>
                    <TableHead className="font-semibold">Kendaraan</TableHead>
                    <TableHead className="font-semibold">Catatan</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverList.length > 0 ? (
                    driverList.map((driver) => (
                      <TableRow key={driver.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.phone || '-'}</TableCell>
                        <TableCell>{driver.vehicle_id || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{driver.note || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={driver.is_active ? 'default' : 'secondary'}>
                            {driver.is_active ? 'Aktif' : 'Nonaktif'}
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
                              <DropdownMenuItem
                                onClick={() => { setEditingDriver(driver); setShowAddModal(true) }}
                              >
                                <SafeIcon name="Edit" className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {driver.is_active ? (
                                <DropdownMenuItem
                                  className="text-orange-600"
                                  onClick={() => handleStatusToggleClick(driver)}
                                >
                                  <SafeIcon name="Ban" className="mr-2 h-4 w-4" />
                                  Nonaktifkan
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleStatusToggleClick(driver)}
                                >
                                  <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                                  Aktifkan
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteClick(driver)}
                              >
                                <SafeIcon name="Trash2" className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <SafeIcon name="Users" className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">Tidak ada supir ditemukan</p>
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

      {/* Add/Edit Driver Modal */}
      <AddDriverModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        driver={editingDriver}
        onSuccess={handleSaveSuccess}
      />

      {/* Status Toggle Confirmation */}
      {selectedDriver && showStatusModal && (
        <ConfirmationModal
          open={showStatusModal}
          onOpenChange={setShowStatusModal}
          title={selectedDriver.is_active ? 'Nonaktifkan Supir' : 'Aktifkan Supir'}
          description={
            selectedDriver.is_active
              ? `Apakah Anda yakin ingin menonaktifkan "${selectedDriver.name}"?`
              : `Apakah Anda yakin ingin mengaktifkan "${selectedDriver.name}"?`
          }
          confirmText={selectedDriver.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          cancelText="Batal"
          icon={selectedDriver.is_active ? 'AlertTriangle' : 'CheckCircle'}
          isDangerous={selectedDriver.is_active}
          onConfirm={handleConfirmStatusToggle}
        />
      )}

      {/* Delete Confirmation */}
      {selectedDriver && showDeleteModal && (
        <ConfirmationModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Hapus Supir"
          description={`Apakah Anda yakin ingin menghapus "${selectedDriver.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          icon="Trash2"
          isDangerous={true}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
