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

import { useState, useEffect, useMemo } from 'react'
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
import AnimatedNumber from '@/components/common/AnimatedNumber'
import PageHeader from '@/components/common/PageHeader'

export default function DriverListPage() {
  // State untuk data
  const [driverList, setDriverList] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  // Stats counts (dari backend - selalu menampilkan total sebenarnya)
  const [aktivCount, setAktivCount] = useState(0)
  const [nonaktifCount, setNonaktifCount] = useState(0)

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'semua' | 'aktif' | 'nonaktif'>('semua')

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  // State untuk sorting
  type SortField = 'code' | 'name' | 'phone' | 'vehicle_id' | 'note' | 'is_active'
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Handle header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sorted data using useMemo
  const sortedDriverList = useMemo(() => {
    if (!sortField) return driverList

    return [...driverList].sort((a, b) => {
      let aVal: any = (a as any)[sortField]
      let bVal: any = (b as any)[sortField]

      // Handle null/undefined
      if (aVal == null) aVal = ''
      if (bVal == null) bVal = ''

      // String comparison
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [driverList, sortField, sortDirection])

  // Sortable Header Component
  const SortableHeader = ({ field, children, className = '', align = 'left' }: { field: SortField; children: React.ReactNode; className?: string; align?: 'left' | 'center' }) => (
    <TableHead
      className={`font-semibold text-slate-700 cursor-pointer hover:bg-slate-200/50 transition-colors select-none ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className={`flex items-center gap-1.5 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {children}
        {sortField === field ? (
          sortDirection === 'asc'
            ? <SafeIcon name="ChevronUp" className="w-4 h-4 text-red-500" />
            : <SafeIcon name="ChevronDown" className="w-4 h-4 text-red-500" />
        ) : (
          <SafeIcon name="ChevronsUpDown" className="w-4 h-4 text-slate-400 opacity-50" />
        )}
      </div>
    </TableHead>
  )

  /**
   * Fetch data driver dari API
   */
  const fetchDrivers = async () => {
    try {
      setIsLoading(true)
      const isActive = statusFilter === 'semua' ? undefined : statusFilter === 'aktif'
      const response = await driversApi.getAll(currentPage, 10, searchTerm || undefined, isActive)

      setDriverList(response.data)
      setTotalItems(response.meta.totalAll || response.meta.total)
      setTotalPages(response.meta.totalPages)
      // Set stats from backend meta (true totals, not affected by filter)
      setAktivCount(response.meta.totalActive || 0)
      setNonaktifCount(response.meta.totalInactive || 0)
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

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen">
      {/* Header - Theme-Aware PageHeader + Action Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Daftar Supir"
          subtitle="Kelola data driver dan status ketersediaan mereka"
        />
        <Button
          onClick={() => { setEditingDriver(null); setShowAddModal(true) }}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
          Tambah Supir
        </Button>
      </div>

      {/* Gradient Divider Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Summary Stats - Modern Glass Card Style with 3D Tilt */}
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          // Skeleton Cards during loading
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <Card className="border-0 glass-card h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-200 w-10 h-10 animate-shimmer" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-16 bg-slate-200 rounded animate-shimmer" />
                        <div className="h-7 w-12 bg-slate-200 rounded animate-shimmer" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </>
        ) : (
          // Actual Cards
          <>
            <Tilt3DCard>
              <Card className="border-0 glass-card animate-fadeInUp h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10">
                      <SafeIcon name="Truck" className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Supir</p>
                      <p className="text-2xl font-bold"><AnimatedNumber value={totalItems} delay={100} /></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Tilt3DCard>

            <Tilt3DCard>
              <Card className="border-0 glass-card animate-fadeInUp h-full" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-green-500/10">
                      <SafeIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Aktif</p>
                      <p className="text-2xl font-bold text-green-600"><AnimatedNumber value={aktivCount} delay={200} /></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Tilt3DCard>

            <Tilt3DCard>
              <Card className="border-0 glass-card animate-fadeInUp h-full" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10">
                      <SafeIcon name="XCircle" className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nonaktif</p>
                      <p className="text-2xl font-bold text-red-600"><AnimatedNumber value={nonaktifCount} delay={300} /></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Tilt3DCard>
          </>
        )}
      </div>

      {/* Search and Filter - Inline Modern Design */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20 focus:border-red-400 focus:ring-red-400/20"
              />
            </div>

            {/* Filter Buttons - Gradient Active */}
            <div className="flex gap-2 p-1 rounded-lg bg-muted/30">
              <Button
                size="sm"
                onClick={() => setStatusFilter('semua')}
                className={statusFilter === 'semua'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md'
                  : 'bg-transparent hover:bg-white/50 text-muted-foreground'}
              >
                <SafeIcon name="LayoutGrid" className="w-4 h-4 mr-1.5" />
                Semua
              </Button>
              <Button
                size="sm"
                onClick={() => setStatusFilter('aktif')}
                className={statusFilter === 'aktif'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                  : 'bg-transparent hover:bg-white/50 text-muted-foreground'}
              >
                <SafeIcon name="CheckCircle" className="w-4 h-4 mr-1.5" />
                Aktif
              </Button>
              <Button
                size="sm"
                onClick={() => setStatusFilter('nonaktif')}
                className={statusFilter === 'nonaktif'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md'
                  : 'bg-transparent hover:bg-white/50 text-muted-foreground'}
              >
                <SafeIcon name="XCircle" className="w-4 h-4 mr-1.5" />
                Nonaktif
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card - Enhanced */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          {/* Inline Header Row */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <SafeIcon name="Table" className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">Data Supir</span>
              <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                {driverList.length} data
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {totalItems} supir
            </p>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-red-500" />
                  <span className="text-muted-foreground">Memuat data supir...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <SortableHeader field="code" className="w-24">Kode</SortableHeader>
                    <SortableHeader field="name">Nama</SortableHeader>
                    <SortableHeader field="phone" align="center">Telepon</SortableHeader>
                    <SortableHeader field="vehicle_id" align="center">Kendaraan</SortableHeader>
                    <SortableHeader field="note">Catatan</SortableHeader>
                    <SortableHeader field="is_active" align="center">Status</SortableHeader>
                    <TableHead className="text-center font-semibold text-slate-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDriverList.length > 0 ? (
                    sortedDriverList.map((driver) => (
                      <TableRow key={driver.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-mono text-sm text-primary">
                          {(driver as any).code || '-'}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{driver.name}</TableCell>
                        <TableCell className="text-center text-foreground">{driver.phone || '-'}</TableCell>
                        <TableCell className="text-center text-foreground">{driver.vehicle_id || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate text-foreground/80">{driver.note || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              driver.is_active
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                                : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm'
                            }
                          >
                            {driver.is_active ? '✓ Aktif' : 'Nonaktif'}
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
            <div className="flex items-center justify-between p-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages} • Total {totalItems} supir
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="hover:bg-red-50"
                >
                  <SafeIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? 'bg-red-500 hover:bg-red-600' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="hover:bg-red-50"
                >
                  Next
                  <SafeIcon name="ChevronRight" className="h-4 w-4 ml-1" />
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
