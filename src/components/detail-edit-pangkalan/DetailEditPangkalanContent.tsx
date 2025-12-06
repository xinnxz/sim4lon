import { useState } from "react";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/SafeIcon";
import PangkalanInfoCard from "@/components/detail-edit-pangkalan/PangkalanInfoCard";
import PangkalanEditForm from "@/components/detail-edit-pangkalan/PangkalanEditForm";
import { toast } from "sonner";

interface Pangkalan {
  id: string;
  nama: string;
  alamat: string;
  kontak: string;
  email: string;
  catatan: string;
  createdAt: string;
  updatedAt: string;
  picName: string;
  area: string;
  status: string;
}

const mockPangkalan: Pangkalan = {
  id: "PKL-001",
  nama: "Pangkalan Maju Jaya",
  alamat: "Jl. Raya Industri No. 45, Jakarta Timur 13920",
  kontak: "0812-3456-7890",
  email: "majujaya@lpg.com",
  catatan: "Pangkalan utama dengan kapasitas penyimpanan 5000 tabung",
  createdAt: "2024-01-15",
  updatedAt: "2024-12-20",
  picName: "Luthfi Alfaridz",
  area: "Jakarta Timur",
  status: "Aktif",
};

export default function DetailEditPangkalanContent() {
  const [pangkalan, setPangkalan] = useState<Pangkalan>(mockPangkalan);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (
    formData: Omit<Pangkalan, "id" | "createdAt" | "updatedAt">
  ) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPangkalan({
        ...pangkalan,
        ...formData,
        updatedAt: new Date().toISOString().split("T")[0],
      });

      setIsEditing(false);
      toast.success("Data pangkalan berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui data pangkalan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <a
            href="./daftar-pangkalan.html"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pangkalan
          </a>
          <SafeIcon
            name="ChevronRight"
            className="h-4 w-4 text-muted-foreground"
          />
          <span className="text-foreground font-semibold text-lg">
            {pangkalan.nama}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-3xl font-bold text-foreground">
            Detail Pangkalan
          </h1>
          <div className="flex gap-2">
            <a href="./daftar-pangkalan.html">
              <Button variant="outline" size="sm" className="gap-1 h-8 px-2">
                <SafeIcon name="ArrowLeft" className="h-3.5 w-3.5" />
                Kembali
              </Button>
            </a>
            <Button
              variant={isEditing ? "outline" : "ghost"}
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
              className="gap-1 h-8 px-2"
            >
              <SafeIcon
                name={isEditing ? "X" : "Pencil"}
                className="h-3.5 w-3.5"
              />
              {isEditing ? "Batal" : "Edit"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {!isEditing ? (
          <PangkalanInfoCard pangkalan={pangkalan} />
        ) : (
          <PangkalanEditForm
            pangkalan={pangkalan}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
