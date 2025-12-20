/**
 * UserListPage - Daftar Pengguna dengan Data Real dari API
 * 
 * PENJELASAN:
 * Component ini menampilkan daftar pengguna dengan fitur:
 * - Fetch data dari API (bukan mock data)
 * - Search dan filter
 * - Pagination
 * - Create, Edit, Delete user
 * - Toggle status aktif/nonaktif
 * 
 * NOTE: Endpoint /users memerlukan role ADMIN
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { usersApi, type User, type UserRole } from '@/lib/api'
import { toast } from 'sonner'
import AddUserModal from './AddUserModal'
import EditUserModal from './EditUserModal'

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  OPERATOR: 'Operator Lapangan',
  PANGKALAN: 'Pangkalan'
}

const roleBadgeColors: Record<UserRole, string> = {
  ADMIN: 'bg-purple-500/20 text-purple-600',
  OPERATOR: 'bg-blue-500/20 text-blue-600',
  PANGKALAN: 'bg-green-500/20 text-green-600'
}

export default function UserListPage() {
  // State untuk data
  const [userList, setUserList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // State untuk current user (untuk self-protection)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  // State untuk sorting
  type SortField = 'code' | 'name' | 'email' | 'phone' | 'role' | 'is_active'
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
  const sortedUserList = useMemo(() => {
    if (!sortField) return userList

    return [...userList].sort((a, b) => {
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
  }, [userList, sortField, sortDirection])

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
            ? <SafeIcon name="ChevronUp" className="w-4 h-4 text-green-500" />
            : <SafeIcon name="ChevronDown" className="w-4 h-4 text-green-500" />
        ) : (
          <SafeIcon name="ChevronsUpDown" className="w-4 h-4 text-slate-400 opacity-50" />
        )}
      </div>
    </TableHead>
  )

  /**
   * Fetch current user ID saat component mount
   * Ini untuk self-protection: user tidak bisa edit/hapus dirinya sendiri
   */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { authApi } = await import('@/lib/api')
        const profile = await authApi.getProfile()
        setCurrentUserId(profile.id)
      } catch (error) {
        console.error('Failed to get current user:', error)
      }
    }
    fetchCurrentUser()
  }, [])

  /**
   * Fetch data user dari API
   */
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await usersApi.getAll(currentPage, 10, searchTerm || undefined)

      // Filter by role locally (backend doesn't have role filter)
      // Exclude PANGKALAN users - they are managed in Pangkalan page
      let filteredData = response.data.filter(u => u.role !== 'PANGKALAN')
      if (roleFilter !== 'all') {
        filteredData = filteredData.filter(u => u.role === roleFilter)
      }

      setUserList(filteredData)
      setTotalItems(response.meta.total)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Gagal memuat data pengguna')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data saat component mount atau filter berubah
  useEffect(() => {
    fetchUsers()
  }, [currentPage, roleFilter])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchUsers()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  /**
   * Handle status toggle
   */
  const handleStatusToggleClick = (user: User) => {
    setSelectedUser(user)
    setShowStatusModal(true)
  }

  const handleConfirmStatusToggle = async () => {
    if (!selectedUser) return

    try {
      const newStatus = !selectedUser.is_active
      await usersApi.update(selectedUser.id, { is_active: newStatus })

      toast.success(`Pengguna berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
      fetchUsers()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Gagal mengubah status pengguna')
    } finally {
      setShowStatusModal(false)
      setSelectedUser(null)
    }
  }

  /**
   * Handle delete user
   */
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      await usersApi.delete(selectedUser.id)
      toast.success('Pengguna berhasil dihapus')
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Gagal menghapus pengguna')
    } finally {
      setShowDeleteModal(false)
      setSelectedUser(null)
    }
  }

  /**
   * Handle edit user
   */
  const handleEditClick = (user: User) => {
    setEditingUserId(user.id)
    setShowEditModal(true)
  }

  /**
   * Handle success callbacks
   */
  const handleSuccess = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingUserId('')
    fetchUsers()
  }

  // Hitung summary stats
  const adminCount = userList.filter(u => u.role === 'ADMIN').length
  const operatorCount = userList.filter(u => u.role === 'OPERATOR').length

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 dashboard-gradient-bg min-h-screen">
      {/* Header - with Vertical Gradient Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-green-500 via-green-400 to-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">
              Daftar Pengguna
            </h1>
            <p className="text-muted-foreground/80 mt-1">
              Kelola semua pengguna sistem SIM4LON
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Gradient Divider Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Summary Stats - Modern Glass Card Style with 3D Tilt */}
      <div className="grid gap-4 md:grid-cols-3">
        <Tilt3DCard>
          <Card className="border-0 glass-card animate-fadeInUp h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-500/10">
                  <SafeIcon name="Users" className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Pengguna</p>
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
                <div className="p-2.5 rounded-xl bg-purple-500/10">
                  <SafeIcon name="Shield" className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                  <p className="text-2xl font-bold text-purple-600">{adminCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tilt3DCard>

        <Tilt3DCard>
          <Card className="border-0 glass-card animate-fadeInUp h-full" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <SafeIcon name="UserCog" className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Operator</p>
                  <p className="text-2xl font-bold text-blue-600">{operatorCount}</p>
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
                placeholder="Cari nama, email, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20 focus:border-green-400 focus:ring-green-400/20"
              />
            </div>

            {/* Filter Buttons - Gradient Active */}
            <div className="flex gap-2 p-1 rounded-lg bg-muted/30">
              <Button
                size="sm"
                onClick={() => setRoleFilter('all')}
                className={roleFilter === 'all'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                  : 'bg-transparent hover:bg-white/50 text-muted-foreground'}
              >
                <SafeIcon name="Users" className="w-4 h-4 mr-1.5" />
                Semua
              </Button>
              <Button
                size="sm"
                onClick={() => setRoleFilter('ADMIN')}
                className={roleFilter === 'ADMIN'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'bg-transparent hover:bg-white/50 text-muted-foreground'}
              >
                <SafeIcon name="Shield" className="w-4 h-4 mr-1.5" />
                Admin
              </Button>
              <Button
                size="sm"
                onClick={() => setRoleFilter('OPERATOR')}
                className={roleFilter === 'OPERATOR'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-transparent hover:bg-white/50 text-muted-foreground'}
              >
                <SafeIcon name="UserCog" className="w-4 h-4 mr-1.5" />
                Operator
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
              <span className="font-semibold">Data Pengguna</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                {userList.length} data
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {totalItems} pengguna
            </p>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-green-500" />
                  <span className="text-muted-foreground">Memuat data pengguna...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <SortableHeader field="code" className="w-24">Kode</SortableHeader>
                    <SortableHeader field="name">Nama</SortableHeader>
                    <SortableHeader field="email">Email</SortableHeader>
                    <SortableHeader field="phone" align="center">Telepon</SortableHeader>
                    <SortableHeader field="role" align="center">Peran</SortableHeader>
                    <SortableHeader field="is_active" align="center">Status</SortableHeader>
                    <TableHead className="text-center font-semibold text-slate-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUserList.length > 0 ? (
                    sortedUserList.map((user) => {
                      const isCurrentUser = user.id === currentUserId
                      return (
                        <TableRow
                          key={user.id}
                          className={`hover:bg-blue-50/50 transition-colors ${isCurrentUser ? 'bg-purple-50/50 border-l-2 border-l-purple-500' : ''}`}
                        >
                          <TableCell className="font-mono text-sm text-primary">
                            {(user as any).code || '-'}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              {user.name}
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-300">
                                  Anda
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">{user.email}</TableCell>
                          <TableCell className="text-center text-foreground">{user.phone || '-'}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={roleBadgeColors[user.role]}>
                              {roleLabels[user.role]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                user.is_active
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                                  : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm'
                              }
                            >
                              {user.is_active ? '✓ Aktif' : 'Nonaktif'}
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
                                {/* Self-protection: User tidak bisa edit/hapus akun sendiri */}
                                {isCurrentUser ? (
                                  <DropdownMenuItem disabled className="text-muted-foreground cursor-not-allowed">
                                    <SafeIcon name="ShieldAlert" className="mr-2 h-4 w-4" />
                                    Tidak dapat mengubah akun sendiri
                                  </DropdownMenuItem>
                                ) : (
                                  <>
                                    <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                      <SafeIcon name="Edit" className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    {user.is_active ? (
                                      <DropdownMenuItem
                                        className="text-orange-600"
                                        onClick={() => handleStatusToggleClick(user)}
                                      >
                                        <SafeIcon name="Ban" className="mr-2 h-4 w-4" />
                                        Nonaktifkan
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        className="text-green-600"
                                        onClick={() => handleStatusToggleClick(user)}
                                      >
                                        <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                                        Aktifkan
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteClick(user)}
                                    >
                                      <SafeIcon name="Trash2" className="mr-2 h-4 w-4" />
                                      Hapus
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <SafeIcon name="Users" className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">Tidak ada pengguna ditemukan</p>
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

      {/* Add User Modal */}
      <AddUserModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={handleSuccess}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        userId={editingUserId}
        onSuccess={handleSuccess}
      />

      {/* Status Toggle Confirmation */}
      {selectedUser && showStatusModal && (
        <ConfirmationModal
          open={showStatusModal}
          onOpenChange={setShowStatusModal}
          title={selectedUser.is_active ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
          description={
            selectedUser.is_active
              ? `Apakah Anda yakin ingin menonaktifkan "${selectedUser.name}"?`
              : `Apakah Anda yakin ingin mengaktifkan "${selectedUser.name}"?`
          }
          confirmText={selectedUser.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          cancelText="Batal"
          icon={selectedUser.is_active ? 'AlertTriangle' : 'CheckCircle'}
          isDangerous={selectedUser.is_active}
          onConfirm={handleConfirmStatusToggle}
        />
      )}

      {/* Delete Confirmation */}
      {selectedUser && showDeleteModal && (
        <ConfirmationModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Hapus Pengguna"
          description={`Apakah Anda yakin ingin menghapus "${selectedUser.name}"? Tindakan ini tidak dapat dibatalkan.`}
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