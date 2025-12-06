
        
import { StatusPesanan, PaymentMethod } from "./enums";
import { PangkalanSummary } from "./pangkalan";
import { OrderDetailModel, getOrderDetail } from "./order";

/**
 * Model untuk satu entri dalam log aktivitas penuh.
 */
export interface FullActivityModel {
  activityId: string;
  orderId: string;
  type: 'PAYMENT_RECEIVED' | 'ORDER_COMPLETED' | 'NEW_ORDER' | 'DELIVERY_SHIPPED';
  title: string;
  pangkalan: PangkalanSummary['nama'];
  timestamp: string; // ISO Date String
  detailNumeric: number; // Qty total atau nominal pembayaran
  unit: 'Unit' | 'IDR';
  iconName: string;
  statusBadge: StatusPesanan | 'LUNAS' | 'BELUM DIPROSES';
}

const generateActivityLog = (orders: OrderDetailModel[]): FullActivityModel[] => {
  const activities: FullActivityModel[] = [];
  let index = 100;

  orders.forEach(order => {
    const pangkalanNama = order.pangkalan.nama;
    const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);

    // 1. New Order
    activities.push({
      activityId: `ACT-${index++}`,
      orderId: order.orderId,
      type: 'NEW_ORDER',
      title: `Pesanan Baru: ${totalQty} Unit LPG`,
      pangkalan: pangkalanNama,
      timestamp: order.tanggalPesan,
      detailNumeric: totalQty,
      unit: 'Unit',
      iconName: "ShoppingCart",
      statusBadge: 'DIPROSES',
    });

    // 2. Payment Received
    if (order.payment.isPaid && order.payment.paymentDate) {
      activities.push({
        activityId: `ACT-${index++}`,
        orderId: order.orderId,
        type: 'PAYMENT_RECEIVED',
        title: `Pembayaran Diterima (${order.payment.paymentMethod === 'TUNAI' ? 'Tunai' : 'Transfer'})`,
        pangkalan: pangkalanNama,
        timestamp: order.payment.paymentDate,
        detailNumeric: order.payment.amountPaid || order.totalAmount,
        unit: 'IDR',
        iconName: "CreditCard",
        statusBadge: 'LUNAS',
      });
    }

    // 3. Delivery Shipped (DIKIRIM)
    const deliveryStart = order.timeline.find(t => t.status === 'DIKIRIM');
    if (deliveryStart) {
      activities.push({
        activityId: `ACT-${index++}`,
        orderId: order.orderId,
        type: 'DELIVERY_SHIPPED',
        title: `Pesanan Mulai Dikirim: ${totalQty} Unit`,
        pangkalan: pangkalanNama,
        timestamp: deliveryStart.tanggal,
        detailNumeric: 0,
        unit: 'Unit',
        iconName: "Truck",
        statusBadge: 'DIKIRIM',
      });
    }

    // 4. Order Completed (SELESAI)
    const deliveryComplete = order.timeline.find(t => t.status === 'SELESAI');
    if (deliveryComplete) {
      activities.push({
        activityId: `ACT-${index++}`,
        orderId: order.orderId,
        type: 'ORDER_COMPLETED',
        title: `Pesanan Selesai Diterima`,
        pangkalan: pangkalanNama,
        timestamp: deliveryComplete.tanggal,
        detailNumeric: totalQty,
        unit: 'Unit',
        iconName: "PackageCheck",
        statusBadge: 'SELESAI',
      });
    }
  });

  // Sort by latest timestamp
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};


export const MOCK_FULL_ACTIVITY_LOG: FullActivityModel[] = generateActivityLog(getOrderDetail("ORD-20251203-001") ? [getOrderDetail("ORD-20251203-001")!, getOrderDetail("ORD-20251203-002")!, getOrderDetail("ORD-20251203-003")!] : []);
        
      