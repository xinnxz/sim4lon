import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'

interface LpgItem {
  id: string | number
  type: '3kg' | '12kg' | '50kg'
  quantity: number
  price: number
}

interface Pangkalan {
  id: string
  name: string
  address: string
}

interface OrderSummaryProps {
  pangkalan?: Pangkalan
  items: LpgItem[]
  total: number
  isEditMode?: boolean
  editOrderStatus?: string
}

export default function OrderSummary({ pangkalan, items, total, isEditMode, editOrderStatus }: OrderSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="sticky top-24 glass-card overflow-hidden">
      {/* Premium Gradient Header */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-accent" />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10">
            <SafeIcon name="ClipboardList" className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
            <CardDescription>
              {isEditMode ? 'Verifikasi perubahan pesanan' : 'Verifikasi detail sebelum menyimpan'}
            </CardDescription>
          </div>
        </div>
        {isEditMode && editOrderStatus && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge
                className={`${editOrderStatus === 'pending_payment' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                  editOrderStatus === 'payment_confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                    editOrderStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}
              >
                {editOrderStatus === 'pending_payment' ? 'Menunggu Pembayaran' :
                  editOrderStatus === 'payment_confirmed' ? 'Pembayaran Diterima' :
                    editOrderStatus === 'completed' ? 'Pesanan Selesai' :
                      editOrderStatus === 'driver_assigned' ? 'Driver Ditugaskan' : editOrderStatus}
              </Badge>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pangkalan Info - Premium Card */}
        {pangkalan ? (
          <div className="space-y-2 p-3 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-lg border border-primary/20 dark:border-primary/30">
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
                <SafeIcon name="Store" className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{pangkalan.name}</p>
                <p className="text-xs text-muted-foreground truncate">{pangkalan.address}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border-2 border-dashed border-border">
            <div className="flex flex-col items-center gap-2 text-center">
              <SafeIcon name="Store" className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Pilih pangkalan untuk melihat detail
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Items Summary - Enhanced */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SafeIcon name="Package" className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Item Pesanan</p>
          </div>
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/50 dark:bg-secondary/30 hover:bg-secondary/80 dark:hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:border-primary/40">
                      {item.type}
                    </Badge>
                    <span className="text-muted-foreground">× {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <SafeIcon name="PackageOpen" className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Belum ada item ditambahkan</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Summary Stats - Visual Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50 dark:bg-secondary/30 text-center">
            <p className="text-2xl font-bold text-primary">{itemCount}</p>
            <p className="text-xs text-muted-foreground">Total Tabung</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 dark:bg-secondary/30 text-center">
            <p className="text-2xl font-bold text-accent">{new Set(items.map(i => i.type)).size}</p>
            <p className="text-xs text-muted-foreground">Jenis LPG</p>
          </div>
        </div>

        <Separator />

        {/* Total - Premium Gradient Box */}
        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20 rounded-xl border border-primary/20 dark:border-primary/30">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
            <p className="text-3xl font-bold text-gradient-primary">
              Rp {total.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              * Belum termasuk biaya pengiriman
            </p>
          </div>
        </div>

        {/* Status Info - Dark Mode Ready */}
        {!isEditMode && (
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
            <div className="flex gap-2">
              <SafeIcon name="Info" className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Pesanan akan dibuat dengan status <strong className="text-blue-900 dark:text-blue-100">Menunggu Pembayaran</strong>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}