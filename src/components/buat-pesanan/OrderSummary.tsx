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
    <Card className="sticky top-24 border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
        <CardDescription>
          {isEditMode ? 'Verifikasi perubahan pesanan' : 'Verifikasi detail sebelum menyimpan'}
        </CardDescription>
        {isEditMode && editOrderStatus && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge 
                className={`${
                  editOrderStatus === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                  editOrderStatus === 'payment_confirmed' ? 'bg-blue-100 text-blue-800' :
                  editOrderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
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
        {/* Pangkalan Info */}
        {pangkalan ? (
          <div className="space-y-2 p-3 bg-secondary rounded-lg border border-border">
            <div className="flex items-start gap-2">
              <SafeIcon name="Store" className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{pangkalan.name}</p>
                <p className="text-xs text-muted-foreground truncate">{pangkalan.address}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-muted rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground text-center">
              Pilih pangkalan untuk melihat detail
            </p>
          </div>
        )}

        <Separator />

        {/* Items Summary */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Item Pesanan</p>
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {item.type}
                    </Badge>
                    <span className="text-muted-foreground">× {item.quantity}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Belum ada item</p>
          )}
        </div>

        <Separator />

        {/* Summary Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Item:</span>
            <span className="font-medium">{itemCount} tabung</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jenis LPG:</span>
            <span className="font-medium">{new Set(items.map(i => i.type)).size} jenis</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-2 p-4 bg-gradient-lpg-subtle rounded-lg border border-primary/20">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Total Pembayaran:</span>
            <span className="text-2xl font-bold text-primary">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Belum termasuk biaya pengiriman
          </p>
        </div>

        {/* Status Info */}
        {!isEditMode && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-2">
              <SafeIcon name="Info" className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Pesanan akan dibuat dengan status <strong>Menunggu Pembayaran</strong>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}