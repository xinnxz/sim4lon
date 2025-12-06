import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SafeIcon from "@/components/common/SafeIcon";
import UserListTable from "./UserListTable";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";
import EditUserModal from "./EditUserModal";
import DisableUserModal from "./DisableUserModal";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "admin" | "operator";
  status: "active" | "inactive";
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: "USR001",
    name: "Luthfi Alfaridz",
    phone: "081234567890",
    email: "budi.santoso@sim4lon.id",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "USR002",
    name: "Siti Nurhaliza",
    phone: "082345678901",
    email: "siti.nurhaliza@sim4lon.id",
    role: "operator",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "USR005",
    name: "Hendra Gunawan",
    phone: "085678901234",
    email: "hendra.gunawan@sim4lon.id",
    role: "operator",
    status: "inactive",
    createdAt: "2024-02-10",
  },
  {
    id: "USR007",
    name: "Rudi Hermawan",
    phone: "087890123456",
    email: "rudi.hermawan@sim4lon.id",
    role: "admin",
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "USR008",
    name: "Lina Wijaya",
    phone: "088901234567",
    email: "lina.wijaya@sim4lon.id",
    role: "operator",
    status: "active",
    createdAt: "2024-03-01",
  },
];

const roleLabels = {
  admin: "Administrator",
  operator: "Operator",
};

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string>("");
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablingUser, setDisablingUser] = useState<any>();
  const [isDisabling, setIsDisabling] = useState(false);

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (user: any) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (userId: string) => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Delete user from the list
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      setShowDeleteModal(false);
      setIsDeleting(false);
      // Reset filters
      handleModalSuccess();
    } catch (error) {
      console.error("Error deleting user:", error);
      setIsDeleting(false);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUserId(user.id);
    setShowEditModal(true);
  };

  const handleDisableUser = (user: any) => {
    setDisablingUser(user);
    setShowDisableModal(true);
  };

  const handleConfirmDisable = async (userId: string) => {
    setIsDisabling(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Toggle user status
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        )
      );
      setShowDisableModal(false);
      setIsDisabling(false);
      // Reset filters
      handleModalSuccess();
    } catch (error) {
      console.error("Error disabling user:", error);
      setIsDisabling(false);
    }
  };

  const handleModalSuccess = () => {
    // Refresh or update users list if needed
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedStatus("all");
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div id="ib3eu3" className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola semua pengguna sistem SIM4LON
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/90 shrink-0"
        >
          <SafeIcon name="Plus" className="h-4 w-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Cari Pengguna</label>
          <Input
            placeholder="Cari berdasarkan nama, telepon, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filter Peran</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Peran</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="operator">Operator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filter Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredUsers.length} dari {users.length} pengguna
      </div>

      {/* User Table */}
      <UserListTable
        users={filteredUsers}
        roleLabels={roleLabels}
        onEditUser={handleEditUser}
        onDisableUser={handleDisableUser}
      />

      {/* Add User Modal */}
      <AddUserModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={handleModalSuccess}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        userId={editingUserId}
        onSuccess={handleModalSuccess}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        user={deletingUser}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Disable User Modal */}
      <DisableUserModal
        open={showDisableModal}
        onOpenChange={setShowDisableModal}
        user={disablingUser}
        onConfirmDisable={handleConfirmDisable}
        isDisabling={isDisabling}
      />
    </div>
  );
}
