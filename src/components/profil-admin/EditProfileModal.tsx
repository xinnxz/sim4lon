"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SafeIcon from "@/components/common/SafeIcon";
import { toast } from "sonner";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockAdminProfile = {
  id: "admin-001",
  name: "Luthfi Alfaridz",
  email: "budi.santoso@sim4lon.com",
  phone: "+62812345678",
  role: "Administrator",
  joinDate: "2024-01-15",
  department: "Sistem Informasi",
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  department: string;
}

export default function EditProfileModal({
  open,
  onOpenChange,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: mockAdminProfile.name,
    email: mockAdminProfile.email,
    phone: mockAdminProfile.phone,
    department: mockAdminProfile.department,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (
      !/^(\+62|0)[0-9]{9,12}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Departemen harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon periksa kembali data yang Anda masukkan");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profil berhasil diperbarui");

      // Reset and close modal
      setTimeout(() => {
        onOpenChange(false);
        setFormData({
          name: mockAdminProfile.name,
          email: mockAdminProfile.email,
          phone: mockAdminProfile.phone,
          department: mockAdminProfile.department,
        });
        setErrors({});
      }, 500);
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      name: mockAdminProfile.name,
      email: mockAdminProfile.email,
      phone: mockAdminProfile.phone,
      department: mockAdminProfile.department,
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SafeIcon name="Edit2" className="h-5 w-5 text-primary" />
            Edit Profil Admin
          </DialogTitle>
          <DialogDescription>
            Perbarui informasi profil pribadi Anda
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[60vh] overflow-y-auto pr-4"
        >
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Nama Lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              name="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-sm font-medium">
              Nomor Telepon <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-phone"
              name="phone"
              type="tel"
              placeholder="Contoh: +62812345678"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-department" className="text-sm font-medium">
              Departemen <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-department"
              name="department"
              type="text"
              placeholder="Masukkan departemen"
              value={formData.department}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.department ? "border-destructive" : ""}
            />
            {errors.department && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" className="h-3 w-3" />
                {errors.department}
              </p>
            )}
          </div>

          {/* Info Box */}
          <Alert className="bg-primary/5 border-primary/20 mt-4">
            <SafeIcon name="Info" className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs text-muted-foreground">
              Perubahan profil akan langsung berlaku setelah disimpan.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
