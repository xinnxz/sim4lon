
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import type { QuickActionModel } from '@/data/dashboard'

interface QuickActionsSectionProps {
  actions: QuickActionModel[]
}

const actionLinks: Record<string, string> = {
  'Buat Pesanan': './buat-pesanan.html',
  'Tambah Pangkalan': './tambah-pangkalan.html',
  'Update Stok': './update-stok.html',
}

export default function QuickActionsSection({ actions }: QuickActionsSectionProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
        <CardDescription>Navigasi ke fungsi utama</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-3"
              asChild
            >
              <a href={actionLinks[action.title] || '#'}>
                <SafeIcon name={action.iconName} className="h-5 w-5" />
                <span>{action.title}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
