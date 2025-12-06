import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface OrderActionsPanelProps {
  orderStatus: string
  onPaymentClick: () => void
  onPaymentConfirmed: () => void
  onPrintInvoice: () => void
  onSendWhatsApp: () => void
  onDriverAssignClick: () => void
  onCompleteOrder: () => void
  onEditOrder: () => void
  onCancelOrder: () => void
  isPaymentConfirmed: boolean
  isDriverAssigned: boolean
}

export default function OrderActionsPanel({
  orderStatus,
  onPaymentClick,
  onPaymentConfirmed,
  onPrintInvoice,
  onSendWhatsApp,
  onDriverAssignClick,
  onCompleteOrder,
  onEditOrder,
  onCancelOrder,
  isPaymentConfirmed,
  isDriverAssigned,
}: OrderActionsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aksi</CardTitle>
      </CardHeader>
<CardContent className="space-y-3">
{/* Status: Belum Dibayar (pending_payment) */}
        {orderStatus === 'pending_payment' && (
          <>
            <Button 
              onClick={onPaymentClick}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <SafeIcon name="CreditCard" className="mr-2 h-4 w-4" />
              Catat Pembayaran
            </Button>
            <Button 
              onClick={onEditOrder}
              variant="outline"
              className="w-full"
            >
              <SafeIcon name="Edit" className="mr-2 h-4 w-4" />
              Edit Pesanan
            </Button>
            <Button
              onClick={onCancelOrder}
              variant="outline"
              className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              Batalkan Pesanan
            </Button>
            <div className="space-y-2">
              <Button 
                onClick={onPrintInvoice}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="Printer" className="mr-2 h-4 w-4" />
                Cetak Invoice
              </Button>
              <Button 
                onClick={onSendWhatsApp}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="MessageCircle" className="mr-2 h-4 w-4" />
                Kirim Invoice WA
              </Button>
            </div>
<Button
              onClick={onPaymentConfirmed}
              variant="outline"
              className="w-full text-xs"
            >
              Simulasi Pembayaran Diterima
            </Button>
          </>
        )}

{/* Status: Pembayaran Diterima (payment_confirmed) */}
         {orderStatus === 'payment_confirmed' && (
          <>
            <Button 
              onClick={onDriverAssignClick}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <SafeIcon name="Users" className="mr-2 h-4 w-4" />
              Tugaskan Driver
            </Button>
            <Button
              onClick={onCancelOrder}
              variant="outline"
              className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              Batalkan Pesanan
            </Button>
            <div className="space-y-2">
              <Button 
                onClick={onPrintInvoice}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="Printer" className="mr-2 h-4 w-4" />
                Cetak Invoice
              </Button>
              <Button 
                onClick={onSendWhatsApp}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="MessageCircle" className="mr-2 h-4 w-4" />
                Kirim Invoice WA
              </Button>
            </div>
          </>
        )}

        {/* Status: Driver Ditugaskan (driver_assigned) */}
        {orderStatus === 'driver_assigned' && (
          <>
            <Button 
              onClick={onCompleteOrder}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <SafeIcon name="CheckCircle" className="mr-2 h-4 w-4" />
              Selesaikan Pesanan
            </Button>
            <div className="space-y-2">
              <Button 
                onClick={onPrintInvoice}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="Printer" className="mr-2 h-4 w-4" />
                Cetak Invoice
              </Button>
              {/* Optional: Kirim Invoice WA */}
              <Button 
                onClick={onSendWhatsApp}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="MessageCircle" className="mr-2 h-4 w-4" />
                Kirim Invoice WA
              </Button>
            </div>
            <Button
              onClick={onCancelOrder}
              variant="outline"
              className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              Batalkan Pesanan
            </Button>
          </>
        )}

        {/* Status: Selesai (completed) */}
        {orderStatus === 'completed' && (
          <>
            <div className="space-y-2">
              <Button 
                onClick={onPrintInvoice}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="Printer" className="mr-2 h-4 w-4" />
                Cetak Invoice
              </Button>
              <Button 
                onClick={onSendWhatsApp}
                variant="outline"
                className="w-full"
              >
                <SafeIcon name="MessageCircle" className="mr-2 h-4 w-4" />
                Kirim Invoice WA
              </Button>
            </div>
          </>
        )}

        {/* Back Button - Always visible */}
        <Button 
          onClick={() => window.location.href = './daftar-pesanan.html'}
          variant="ghost"
          className="w-full"
        >
          <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
          Kembali ke Daftar
        </Button>
      </CardContent>
    </Card>
  )
}