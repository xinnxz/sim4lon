import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SafeIcon from "@/components/common/SafeIcon";
import DriverTable from "./DriverTable";
import AddDriverModal from "./AddDriverModal";
import DeleteDriverModal from "./DeleteDriverModal";
import type { Driver } from "./types";

const mockDrivers: Driver[] = [
  {
    id: 1,
    name: "Luthfi Alfaridz",
    phone: "081234567890",
    status: "active",
    notes: "Driver berpengalaman, sering mengangkut ke area Jabodetabek",
  },
  {
    id: 2,
    name: "Ahmad Wijaya",
    phone: "082345678901",
    status: "active",
    notes: "Spesialis pengiriman ke area Bandung dan sekitarnya",
  },
  {
    id: 3,
    name: "Rudi Hermawan",
    phone: "083456789012",
    status: "inactive",
    notes: "Sedang cuti panjang",
  },
  {
    id: 4,
    name: "Eka Prasetya",
    phone: "084567890123",
    status: "active",
    notes: "Driver muda, responsif dan cepat",
  },
  {
    id: 5,
    name: "Slamet Riyanto",
    phone: "085678901234",
    status: "active",
    notes: "Pengalaman 10 tahun di bidang distribusi",
  },
  {
    id: 6,
    name: "Hendra Gunawan",
    phone: "086789012345",
    status: "inactive",
    notes: "Pensiun per akhir tahun",
  },
];

export default function DriverListPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm)
  );

  const handleAddDriver = (newDriver: Omit<Driver, "id">) => {
    const driver: Driver = {
      ...newDriver,
      id: Math.max(...drivers.map((d) => d.id), 0) + 1,
    };
    setDrivers([...drivers, driver]);
    setShowAddModal(false);
  };

  const handleEditDriver = (updatedDriver: Driver) => {
    setDrivers(
      drivers.map((d) => (d.id === updatedDriver.id ? updatedDriver : d))
    );
    setEditingDriver(null);
    setShowAddModal(false);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (driverId: number) => {
    setDrivers(drivers.filter((d) => d.id !== driverId));
    setShowDeleteModal(false);
    setDriverToDelete(null);
  };

  const handleOpenAddModal = () => {
    setEditingDriver(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setShowAddModal(true);
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Daftar Supir
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data driver dan status ketersediaan mereka
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
        >
          <SafeIcon name="Plus" className="h-4 w-4" />
          Tambah Supir
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <SafeIcon
          name="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          placeholder="Cari berdasarkan nama atau nomor telepon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Driver Table */}
      <DriverTable
        drivers={filteredDrivers}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteDriver}
      />

      {/* Add/Edit Driver Modal */}
      <AddDriverModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        driver={editingDriver}
        onSave={editingDriver ? handleEditDriver : handleAddDriver}
      />

      {/* Delete Driver Modal */}
      <DeleteDriverModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        driver={driverToDelete || undefined}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
