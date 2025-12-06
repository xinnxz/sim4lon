import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SafeIcon from "@/components/common/SafeIcon";
import OrderSummaryCard from "./OrderSummaryCard";
import OrderItemsTable from "./OrderItemsTable";
import OrderTimelineStatus from "./OrderTimelineStatus";
import OrderActionsPanel from "./OrderActionsPanel";
import CustomerInfoCard from "./CustomerInfoCard";
import DeliveryInfoCard from "./DeliveryInfoCard";
import { MOCK_DRIVER_LIST, getDriverById } from "@/data/user";

// Mock order data
const mockOrder = {
  id: "ORD-2024-12345",
  status: "pending_payment",
  statusLabel: "Menunggu Pembayaran",
  createdDate: "2024-01-15",
  createdTime: "10:30",
  dueDate: "2024-01-20",
  customer: {
    name: "Pangkalan Maju Jaya",
    address: "Jl. Raya Industri No. 45, Jakarta Timur",
    email: "pangkalan.majujaya@email.com",
    contact: "Luthfi Alfaridz",
    contactPhone: "0812-3456789",
  },
  items: [
    { id: 1, type: "3kg", quantity: 50, price: 25000, subtotal: 1250000 },
    { id: 2, type: "12kg", quantity: 20, price: 75000, subtotal: 1500000 },
  ],
  subtotal: 2750000,
  tax: 275000,
  total: 3025000,
  paymentMethod: null,
  paidAmount: 0,
  delivery: {
    status: "not_scheduled",
    statusLabel: "Belum Dijadwalkan",
    driver: null,
    driverPhone: null,
    estimatedDate: null,
    notes: "Pengiriman akan dijadwalkan setelah pembayaran dikonfirmasi",
  },
  timeline: [
    {
      status: "created",
      label: "Pesanan Dibuat",
      date: "2024-01-15 10:30",
      completed: true,
    },
    {
      status: "pending_payment",
      label: "Menunggu Pembayaran",
      date: null,
      completed: false,
    },
    {
      status: "payment_confirmed",
      label: "Pembayaran Diterima",
      date: null,
      completed: false,
    },
    {
      status: "driver_assigned",
      label: "Driver Ditugaskan",
      date: null,
      completed: false,
    },
    {
      status: "completed",
      label: "Pesanan Selesai",
      date: null,
      completed: false,
    },
  ],
};

export default function OrderDetailContent() {
  const [order, setOrder] = useState(mockOrder);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handlePaymentClick = () => {
    window.location.href = "./catat-pembayaran.html";
  };

  const handlePaymentConfirmed = () => {
    // Update order status to payment confirmed
    const updatedOrder = {
      ...order,
      status: "payment_confirmed",
      statusLabel: "Pembayaran Diterima",
      delivery: {
        ...order.delivery,
        status: "ready_to_ship",
        statusLabel: "Siap Dikirim",
        notes: "Stok dialokasikan dan pesanan menanti penjadwalan pengiriman.",
      },
      timeline: order.timeline.map((item) => {
        if (item.status === "payment_confirmed") {
          return {
            ...item,
            date: new Date().toLocaleString("id-ID"),
            completed: true,
          };
        }
        return item;
      }),
    };
    setOrder(updatedOrder);
  };

  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  const handleSendWhatsApp = () => {
    const message = `Halo, berikut adalah detail pesanan Anda:\n\nID Pesanan: ${order.id}\nTotal: Rp ${order.total.toLocaleString("id-ID")}\n\nTerima kasih telah memesan.`;
    const whatsappUrl = `https://wa.me/${order.customer.contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSelectDriver = (driverId: string) => {
    const driver = getDriverById(driverId);
    if (driver) {
      setSelectedDriverId(driverId);
      // Update delivery info with selected driver
      const updatedOrder = {
        ...order,
        status: "driver_assigned",
        statusLabel: "Driver Ditugaskan",
        delivery: {
          ...order.delivery,
          driver: driver.nama,
          driverPhone: driver.telepon,
          notes: "Driver telah ditugaskan",
        },
        timeline: order.timeline.map((item) => {
          if (item.status === "driver_assigned") {
            return {
              ...item,
              date: new Date().toLocaleString("id-ID"),
              completed: true,
            };
          }
          return item;
        }),
      };
      setOrder(updatedOrder);
      setIsDriverModalOpen(false);
    }
  };

  const handleCompleteOrder = () => {
    const updatedOrder = {
      ...order,
      status: "completed",
      statusLabel: "Pesanan Selesai",
      timeline: order.timeline.map((item) => {
        if (item.status === "completed") {
          return {
            ...item,
            date: new Date().toLocaleString("id-ID"),
            completed: true,
          };
        }
        return item;
      }),
    };
    setOrder(updatedOrder);
  };

  const handleEditOrder = () => {
    window.location.href = `./buat-pesanan.html?id=${order.id}`;
  };

  const handleCancelOrder = () => {
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = () => {
    const updatedOrder = {
      ...order,
      status: "cancelled",
      statusLabel: "Pesanan Dibatalkan",
      timeline: order.timeline.map((item) => ({
        ...item,
        completed: false,
      })),
    };
    setOrder(updatedOrder);
    setIsCancelModalOpen(false);
    window.location.href = "./daftar-pesanan.html";
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (window.location.href = "./daftar-pesanan.html")}
          >
            <SafeIcon name="ArrowLeft" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detail Pesanan</h1>
            <p className="text-muted-foreground">ID: {order.id}</p>
          </div>
        </div>
        <Badge
          className={`text-base px-4 py-2 ${
            order.status === "pending_payment"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "payment_confirmed"
                ? "bg-blue-100 text-blue-800"
                : order.status === "completed" || order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.statusLabel}
        </Badge>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <OrderSummaryCard order={order} />

          {/* Timeline Status */}
          <OrderTimelineStatus timeline={order.timeline} />
        </div>

        {/* Right Column - Info Cards & Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <CustomerInfoCard customer={order.customer} />

          {/* Delivery Info */}
          <DeliveryInfoCard delivery={order.delivery} />

          {/* Actions Panel */}
          <OrderActionsPanel
            orderStatus={order.status}
            onPaymentClick={handlePaymentClick}
            onPaymentConfirmed={handlePaymentConfirmed}
            onPrintInvoice={handlePrintInvoice}
            onSendWhatsApp={handleSendWhatsApp}
            onDriverAssignClick={() => setIsDriverModalOpen(true)}
            onCompleteOrder={handleCompleteOrder}
            onEditOrder={handleEditOrder}
            onCancelOrder={handleCancelOrder}
            isPaymentConfirmed={order.status === "payment_confirmed"}
            isDriverAssigned={order.delivery.driver !== null}
          />
        </div>
      </div>

      {/* Driver Assignment Modal */}
      <Dialog open={isDriverModalOpen} onOpenChange={setIsDriverModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {MOCK_DRIVER_LIST.map((driver) => (
              <button
                key={driver.userId}
                onClick={() => handleSelectDriver(driver.userId)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={driver.avatarUrl} alt={driver.nama} />
                  <AvatarFallback>{driver.nama.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{driver.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {driver.telepon}
                  </p>
                </div>
                {selectedDriverId === driver.userId && (
                  <SafeIcon name="Check" className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SafeIcon
                name="AlertCircle"
                className="h-5 w-5 text-destructive"
              />
              Batalkan Pesanan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm font-medium text-destructive mb-2">
                Tindakan ini tidak dapat dibatalkan
              </p>
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin membatalkan pesanan{" "}
                <span className="font-semibold">{order.id}</span>? Pesanan akan
                ditandai sebagai dibatalkan dan tidak dapat diproses lebih
                lanjut.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsCancelModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={confirmCancelOrder}
                variant="destructive"
                className="flex-1"
              >
                <SafeIcon name="Trash2" className="mr-2 h-4 w-4" />
                Batalkan Pesanan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
