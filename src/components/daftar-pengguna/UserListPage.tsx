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
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pengguna</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola semua pengguna sistem SIM4LON
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          <SafeIcon name="Plus" className="h-4 w-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Tilt3DCard className="animate-fadeInUp">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
        </Tilt3DCard>
        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Administrator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{adminCount}</div>
            </CardContent>
          </Card>
        </Tilt3DCard>
        <Tilt3DCard className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Operator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{operatorCount}</div>
            </CardContent>
          </Card>
        </Tilt3DCard>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cari Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan nama, email, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Peran</SelectItem>
                <SelectItem value="ADMIN">Administrator</SelectItem>
                <SelectItem value="OPERATOR">Operator Lapangan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Menampilkan {userList.length} dari {totalItems} pengguna
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
                    <TableHead className="font-semibold w-24">Kode</TableHead>
                    <TableHead className="font-semibold">Nama</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Telepon</TableHead>
                    <TableHead className="font-semibold">Peran</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userList.length > 0 ? (
                    userList.map((user) => {
                      const isCurrentUser = user.id === currentUserId
                      return (
                        <TableRow
                          key={user.id}
                          className={`hover:bg-muted/50 ${isCurrentUser ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                        >
                          <TableCell className="font-mono text-sm text-primary">
                            {(user as any).code || '-'}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {user.name}
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                  Anda
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          <TableCell>
                            <Badge className={roleBadgeColors[user.role]}>
                              {roleLabels[user.role]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.is_active ? 'default' : 'secondary'}>
                              {user.is_active ? 'Aktif' : 'Nonaktif'}
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