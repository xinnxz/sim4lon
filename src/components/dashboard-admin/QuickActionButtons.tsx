
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

const quickActions = [
  {
    title: 'Buat Pesanan',
    description: 'Pesanan baru',
    icon: 'Plus',
    href: './buat-pesanan.html',
    variant: 'default' as const
  },
  {
    title: 'Kelola Pangkalan',
    description: 'Lihat & tambah pangkalan',
    icon: 'Building2',
    href: './daftar-pangkalan.html',
    variant: 'outline' as const
  },
  {
    title: 'Update Stok',
    description: 'Perbarui stok',
    icon: 'Plus',
    href: './stok-lpg.html',
    variant: 'outline' as const
  },
  {
    title: 'Tambah Pengguna',
    description: 'Pengguna baru',
    icon: 'Plus',
    href: './daftar-pengguna.html',
    variant: 'outline' as const
  }
]

export default function QuickActionButtons() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
        <CardDescription>Navigasi cepat ke fitur utama</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="w-full justify-start"
              asChild
            >
              <a href={action.href}>
                <SafeIcon name={action.icon} className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs opacity-75">{action.description}</div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
