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

  // State untuk sorting
  type SortField = 'code' | 'name' | 'email' | 'address' | 'region' | 'phone' | 'pic_name' | 'alokasi_bulanan' | 'is_active'
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
  const sortedPangkalanList = useMemo(() => {
    if (!sortField) return pangkalanList

    return [...pangkalanList].sort((a, b) => {
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
  }, [pangkalanList, sortField, sortDirection])

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
            ? <SafeIcon name="ChevronUp" className="w-4 h-4 text-blue-500" />
            : <SafeIcon name="ChevronDown" className="w-4 h-4 text-blue-500" />
        ) : (
          <SafeIcon name="ChevronsUpDown" className="w-4 h-4 text-slate-400 opacity-50" />
        )}
      </div>
    </TableHead>
  )

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
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen">
      {/* Header - with Vertical Gradient Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 via-blue-400 to-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">
              Daftar Pangkalan
            </h1>
            <p className="text-muted-foreground/80 mt-1">
              Kelola semua pangkalan distribusi LPG
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
          Tambah Pangkalan
        </Button>
      </div>

      {/* Gradient Divider Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Summary Stats - Modern Glass Card Style with 3D Tilt */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Tilt3DCard>
          <Card className="border-0 glass-card animate-fadeInUp h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <SafeIcon name="Building2" className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Pangkalan</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
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
                  <p className="text-2xl font-bold text-green-600">{aktivCount}</p>
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
                  <p className="text-2xl font-bold text-red-600">{nonaktifCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tilt3DCard>
      </div>

      {/* Search and Filter - Inline Modern Design */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, alamat, atau wilayah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>

            {/* Filter Buttons - Gradient Active */}
            <div className="flex gap-2 p-1 rounded-lg bg-muted/30">
              <Button
                size="sm"
                onClick={() => setStatusFilter('semua')}
                className={statusFilter === 'semua'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
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
              <span className="font-semibold">Data Pangkalan</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {pangkalanList.length} data
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {totalItems} pangkalan
            </p>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="text-muted-foreground">Memuat data pangkalan...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <SortableHeader field="code" className="w-24">Kode</SortableHeader>
                    <SortableHeader field="name">Nama</SortableHeader>
                    <SortableHeader field="email">Email</SortableHeader>
                    <SortableHeader field="address">Alamat</SortableHeader>
                    <SortableHeader field="region">Wilayah</SortableHeader>
                    <SortableHeader field="phone" align="center">Telepon</SortableHeader>
                    <SortableHeader field="pic_name">PIC</SortableHeader>
                    <SortableHeader field="alokasi_bulanan" align="center">Alokasi</SortableHeader>
                    <SortableHeader field="is_active" align="center">Status</SortableHeader>
                    <TableHead className="text-center font-semibold text-slate-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPangkalanList.length > 0 ? (
                    sortedPangkalanList.map((pangkalan) => (
                      <TableRow key={pangkalan.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-mono text-sm text-primary">
                          {(pangkalan as any).code || '-'}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {pangkalan.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {pangkalan.email ? (
                            <span className="text-blue-600">{pangkalan.email}</span>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-foreground/80 max-w-xs truncate">
                          {pangkalan.address}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {pangkalan.region}
                        </TableCell>
                        <TableCell className="text-sm text-center text-foreground">
                          {pangkalan.phone}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">
                          {pangkalan.pic_name}
                        </TableCell>
                        <TableCell className="text-center text-sm font-semibold text-primary">
                          {pangkalan.alokasi_bulanan ? pangkalan.alokasi_bulanan.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              pangkalan.is_active
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                                : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm'
                            }
                          >
                            {pangkalan.is_active ? '✓ Aktif' : 'Nonaktif'}
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
                      <TableCell colSpan={10} className="text-center py-8">
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
