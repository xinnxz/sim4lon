/**
 * OrderActionsPanel - Panel aksi untuk detail pesanan
 * 
 * PENJELASAN:
 * Component ini menampilkan tombol aksi berdasarkan status pesanan:
 * - pending_payment → Dapat catat pembayaran, tunggu konfirmasi
 * - payment_confirmed → Dapat assign driver
 * - driver_assigned → Dapat selesaikan
 * - Kapan saja → Print invoice, kirim WA, batalkan
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface OrderActionsPanelProps {
    orderStatus: string
    onPaymentClick?: () => void
    onPaymentConfirmed?: () => void
    onPrintInvoice: () => void
    onSendWhatsApp: () => void
    onDriverAssignClick?: () => void
    onCompleteOrder?: () => void
    onEditOrder?: () => void
    onCancelOrder?: () => void
    onConfirmOrder?: () => void
    isPaymentConfirmed?: boolean
    isDriverAssigned?: boolean
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
    onConfirmOrder,
    isPaymentConfirmed = false,
    isDriverAssigned = false,
}: OrderActionsPanelProps) {
    const isDraft = orderStatus === 'created'
    const isPending = orderStatus === 'pending_payment'
    const isConfirmed = orderStatus === 'payment_confirmed' || orderStatus === 'ready_to_ship'
    const isCompleted = orderStatus === 'completed'
    const isCancelled = orderStatus === 'cancelled'
    const canEdit = orderStatus === 'pending_payment' || orderStatus === 'created'
    const canCancel = !isCompleted && !isCancelled

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* DRAFT Actions - Confirm to proceed */}
                {isDraft && (
                    <>
                        <Button
                            onClick={onConfirmOrder}
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            <SafeIcon name="CheckCircle" className="mr-2 h-4 w-4" />
                            Konfirmasi Pesanan
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Konfirmasi untuk memproses ke tahap pembayaran
                        </p>
                    </>
                )}

                {/* Payment Actions */}
                {isPending && (
                    <>
                        <Button
                            onClick={onPaymentClick}
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            <SafeIcon name="CreditCard" className="mr-2 h-4 w-4" />
                            Catat Pembayaran
                        </Button>
                        <Button
                            onClick={onPaymentConfirmed}
                            variant="outline"
                            className="w-full"
                        >
                            <SafeIcon name="CheckCircle" className="mr-2 h-4 w-4" />
                            Konfirmasi Lunas
                        </Button>
                    </>
                )}

                {/* Driver Assignment */}
                {isConfirmed && !isDriverAssigned && (
                    <Button
                        onClick={onDriverAssignClick}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        <SafeIcon name="UserPlus" className="mr-2 h-4 w-4" />
                        Tugaskan Driver
                    </Button>
                )}

                {/* Complete Order */}
                {isDriverAssigned && !isCompleted && (
                    <Button
                        onClick={onCompleteOrder}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        <SafeIcon name="CheckCircle2" className="mr-2 h-4 w-4" />
                        Selesaikan Pesanan
                    </Button>
                )}

                {/* Edit Order */}
                {canEdit && onEditOrder && (
                    <Button
                        onClick={onEditOrder}
                        variant="outline"
                        className="w-full"
                    >
                        <SafeIcon name="Edit" className="mr-2 h-4 w-4" />
                        Edit Pesanan
                    </Button>
                )}

                {/* Invoice Actions */}
                <div className="space-y-2 pt-2 border-t">
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

                {/* Cancel Order */}
                {canCancel && onCancelOrder && (
                    <Button
                        onClick={onCancelOrder}
                        variant="outline"
                        className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                    >
                        <SafeIcon name="X" className="mr-2 h-4 w-4" />
                        Batalkan Pesanan
                    </Button>
                )}

                {/* Back Button */}
                <Button
                    onClick={() => window.location.href = '/daftar-pesanan'}
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
