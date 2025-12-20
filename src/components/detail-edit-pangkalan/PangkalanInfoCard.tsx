/**
 * PangkalanInfoCard - Display Pangkalan Details with API Fields
 * 
 * PENJELASAN:
 * Component ini menampilkan informasi detail pangkalan.
 * Fields sesuai dengan API Pangkalan interface.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { type Pangkalan } from '@/lib/api'

interface PangkalanInfoCardProps {
  pangkalan: Pangkalan
}

export default function PangkalanInfoCard({ pangkalan }: PangkalanInfoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      {/* A. Informasi Utama */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SafeIcon name="Store" className="h-5 w-5 text-primary" />
            Informasi Utama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nama Pangkalan</p>
              <p className="text-base text-foreground mt-1 font-semibold">{pangkalan.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kode Pangkalan</p>
              <p className="text-base text-foreground mt-1 font-mono">{pangkalan.code}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wilayah</p>
              <p className="text-base text-foreground mt-1">{pangkalan.region || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-1">
                <Badge
                  variant="status"
                  className={pangkalan.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }
                >
                  {pangkalan.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kapasitas</p>
              <p className="text-base text-foreground mt-1">{pangkalan.capacity ? `${pangkalan.capacity} unit` : '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Alokasi Bulanan</p>
              <p className="text-base text-foreground mt-1 font-semibold">
                {pangkalan.alokasi_bulanan ? `${pangkalan.alokasi_bulanan.toLocaleString()} tabung` : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B. Contact Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Users" className="h-5 w-5 text-primary" />
            Kontak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nama PIC</p>
            <p className="text-base text-foreground mt-1 font-semibold">{pangkalan.pic_name || '-'}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-start gap-3">
                <SafeIcon name="Phone" className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nomor Telepon</p>
                  <a
                    href={`tel:${pangkalan.phone}`}
                    className="text-base text-primary mt-1 hover:underline"
                  >
                    {pangkalan.phone || '-'}
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <SafeIcon name="Mail" className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  {pangkalan.email ? (
                    <a
                      href={`mailto:${pangkalan.email}`}
                      className="text-base text-primary mt-1 hover:underline"
                    >
                      {pangkalan.email}
                    </a>
                  ) : (
                    <p className="text-base text-muted-foreground mt-1 italic">Tidak ada email</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* C. Full Address */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="MapPin" className="h-5 w-5 text-primary" />
            Alamat Lengkap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-foreground">{pangkalan.address}</p>
        </CardContent>
      </Card>

      {/* D. Notes */}
      {pangkalan.note && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <SafeIcon name="FileText" className="h-5 w-5 text-primary" />
              Catatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-foreground">{pangkalan.note}</p>
          </CardContent>
        </Card>
      )}

      {/* E. Metadata */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dibuat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tanggal Pembuatan</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              {formatDate(pangkalan.created_at)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Diperbarui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              {formatDate(pangkalan.updated_at)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
