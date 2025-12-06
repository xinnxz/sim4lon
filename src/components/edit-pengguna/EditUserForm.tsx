"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SafeIcon from "@/components/common/SafeIcon";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "sonner";

// Mock user data - in real app, this would come from query params or API
const mockUserData = {
  id: "USR-001",
  nama: "Luthfi Alfaridz",
  telepon: "081234567890",
  email: "budi.santoso@sim4lon.id",
  role: "driver",
  status: "aktif",
  createdAt: "2024-01-15",
};

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "operator", label: "Operator" },
  { value: "driver", label: "Driver" },
  { value: "viewer", label: "Viewer" },
];

const statusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

export default function EditUserForm() {
  const [formData, setFormData] = useState({
    nama: mockUserData.nama,
    telepon: mockUserData.telepon,
    email: mockUserData.email,
    role: mockUserData.role,
    status: mockUserData.status,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama pengguna harus diisi";
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = "Nomor telepon harus diisi";
    } else if (
      !/^(\+62|0)[0-9]{9,12}$/.test(formData.telepon.replace(/\s/g, ""))
    ) {
      newErrors.telepon = "Format nomor telepon tidak valid";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.role) {
      newErrors.role = "Peran pengguna harus dipilih";
    }

    if (!formData.status) {
      newErrors.status = "Status pengguna harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Mohon periksa kembali form Anda");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Data pengguna berhasil diperbarui");

      // Redirect after success
      setTimeout(() => {
        window.location.href = "./daftar-pengguna.html";
      }, 1000);
    } catch (error) {
      toast.error("Gagal memperbarui data pengguna");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "./daftar-pengguna.html";
  };

  return (
    <>
      <Card className="border shadow-card">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="UserEdit" className="h-5 w-5 text-primary" />
            Edit Data Pengguna
          </CardTitle>
          <CardDescription>
            ID Pengguna:{" "}
            <span className="font-mono font-semibold text-foreground">
              {mockUserData.id}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Nama Pengguna */}
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm font-semibold">
                Nama Pengguna <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama pengguna"
                value={formData.nama}
                onChange={handleInputChange}
                className={`h-10 ${errors.nama ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.nama && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.nama}
                </p>
              )}
            </div>

            {/* Nomor Telepon */}
            <div className="space-y-2">
              <Label htmlFor="telepon" className="text-sm font-semibold">
                Nomor Telepon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="telepon"
                name="telepon"
                placeholder="Contoh: 081234567890"
                value={formData.telepon}
                onChange={handleInputChange}
                className={`h-10 ${errors.telepon ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.telepon && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.telepon}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Contoh: user@sim4lon.id"
                value={formData.email}
                onChange={handleInputChange}
                className={`h-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold">
                Peran Pengguna <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`h-10 ${errors.role ? "border-destructive focus-visible:ring-destructive" : ""}`}
                >
                  <SelectValue placeholder="Pilih peran pengguna" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">
                Status Pengguna <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`h-10 ${errors.status ? "border-destructive focus-visible:ring-destructive" : ""}`}
                >
                  <SelectValue placeholder="Pilih status pengguna" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.status}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
              <SafeIcon
                name="Info"
                className="h-5 w-5 text-primary shrink-0 mt-0.5"
              />
              <div className="text-sm text-foreground">
                <p className="font-semibold mb-1">Catatan Penting</p>
                <p className="text-muted-foreground">
                  Perubahan peran pengguna akan langsung berlaku. Pastikan
                  pengguna memiliki akses yang sesuai dengan tanggung jawab
                  mereka.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                <SafeIcon name="X" className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <SafeIcon
                      name="Loader2"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SafeIcon name="Save" className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Konfirmasi Perubahan"
        description={`Apakah Anda yakin ingin menyimpan perubahan data pengguna ${formData.nama}?`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        icon="CheckCircle"
        iconColor="text-primary"
        isLoading={isLoading}
        isDangerous={false}
        onConfirm={handleSubmit}
      />
    </>
  );
}
