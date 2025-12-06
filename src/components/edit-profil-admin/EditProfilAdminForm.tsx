"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import SafeIcon from "@/components/common/SafeIcon";

// Mock admin profile data
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

export default function EditProfilAdminForm() {
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
    // Clear error for this field when user starts typing
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    toast.success("Profil berhasil diperbarui");

    // Redirect after success
    setTimeout(() => {
      window.location.href = "./profil-admin.html";
    }, 1500);
  };

  const handleCancel = () => {
    window.location.href = "./profil-admin.html";
  };

  return (
    <div
      className="space-y-6 animate-fadeInUp"
      style={{ margin: "0px 120px 0px 120px" }}
    >
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <SafeIcon
            name="ArrowLeft"
            className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={handleCancel}
          />
          <h1 className="text-3xl font-bold text-foreground">
            Edit Profil Admin
          </h1>
        </div>
        <p className="text-muted-foreground">
          Perbarui informasi profil pribadi Anda
        </p>
      </div>

      <Separator />

      {/* Form Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>
            Ubah data pribadi Anda di bawah ini. Pastikan semua informasi
            akurat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Nomor Telepon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Contoh: +62812345678 atau 08123456789"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Department Field */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium">
                Departemen <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                name="department"
                type="text"
                placeholder="Masukkan departemen"
                value={formData.department}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.department ? "border-destructive" : ""}
              />
              {errors.department && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" className="h-4 w-4" />
                  {errors.department}
                </p>
              )}
            </div>

            {/* Read-only Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Role
                </Label>
                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                  {mockAdminProfile.role}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Tanggal Bergabung
                </Label>
                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                  {new Date(mockAdminProfile.joinDate).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                <SafeIcon name="X" className="mr-2 h-4 w-4" />
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
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <SafeIcon
              name="Info"
              className="h-5 w-5 text-primary shrink-0 mt-0.5"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Informasi Penting
              </p>
              <p className="text-sm text-muted-foreground">
                Untuk mengubah kata sandi, silakan kunjungi halaman Ubah
                Password. Perubahan profil akan langsung berlaku setelah
                disimpan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
