
        
import { StatusPesanan, LPGTypeSummary, LPG_TYPES, StatusPesanan as OrderStatus, PaymentMethod } from "./enums";
import { PangkalanSummary, getPangkalanSummary } from "./pangkalan";

/**
 * Item yang dipesan dalam satu pesanan.
 */
export interface OrderItemModel {
  type: LPGTypeSummary['type'];
  label: LPGTypeSummary['label'];
  pricePerUnit: number;
  qty: number;
  subTotal: number;
}

/**
 * Model untuk item daftar pesanan di tabel.
 */
export interface OrderListItemModel {
  orderId: string;
  pangkalan: PangkalanSummary;
  totalLPGTypes: number;
  totalQty: number;
  totalAmount: number;
  status: OrderStatus;
  tanggalPesan: string; // ISO Date String
  detailActionIcon: string;
}

/**
 * Item untuk timeline status pesanan/pengiriman.
 */
export interface TimeLineItemModel {
  status: OrderStatus | 'Pengiriman Dijadwalkan' | 'Pengiriman Diterima'; // Bisa diperluas
  deskripsi: string;
  tanggal: string; // Tanggal dan Waktu
  iconName: string;
}

/**
 * Detail pembayaran terkait pesanan.
 */
export interface OrderPaymentDetail {
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
  amountPaid?: number;
  paymentDate?: string;
  proofUrl?: string;
}

/**
 * Model lengkap detail pesanan.
 */
export interface OrderDetailModel {
  orderId: string;
  pangkalan: PangkalanSummary;
  items: OrderItemModel[];
  totalAmount: number;
  currentStatus: OrderStatus;
  tanggalPesan: string;
  timeline: TimeLineItemModel[];
  payment: OrderPaymentDetail;
  isAssignedToDriver: boolean;
  notes?: string;
}

/**
 * Model ringkas pesanan yang siap dijadwalkan.
 */
export interface OrderSummaryModel extends Pick<OrderDetailModel, 'orderId' | 'totalAmount' | 'tanggalPesan'> {
  pangkalanNama: string;
  totalQty: number;
}

// Helper untuk membuat OrderItem
const createOrderItem = (type: LPGTypeSummary['type'], qty: number): OrderItemModel => {
  const lpg = LPG_TYPES.find(l => l.type === type)!;
  const subTotal = lpg.pricePerUnit * qty;
  return {
    type: lpg.type,
    label: lpg.label,
    pricePerUnit: lpg.pricePerUnit,
    qty,
    subTotal,
  };
};

const MOCK_ORDER_1_ITEMS: OrderItemModel[] = [
  createOrderItem('3kg', 100),
  createOrderItem('12kg', 25),
];

const MOCK_ORDER_2_ITEMS: OrderItemModel[] = [
  createOrderItem('3kg', 50),
];

// MOCK DATA
export const MOCK_ORDER_DATA: OrderDetailModel[] = [
  {
    orderId: "ORD-20251203-001",
    pangkalan: getPangkalanSummary("P-001")!,
    items: MOCK_ORDER_1_ITEMS,
    totalAmount: MOCK_ORDER_1_ITEMS.reduce((sum, item) => sum + item.subTotal, 0), // 5,325,000
    currentStatus: 'SELESAI',
    tanggalPesan: "2025-12-01T10:30:00Z",
    timeline: [
      { status: 'DIPROSES', deskripsi: 'Pesanan dibuat dan diverifikasi oleh Operator.', tanggal: "2025-12-01T10:35:00Z", iconName: "ClipboardCheck" },
      { status: 'MENUNGGU_PEMBAYARAN', deskripsi: 'Menunggu konfirmasi pembayaran penuh.', tanggal: "2025-12-01T11:00:00Z", iconName: "Clock" },
      { status: 'DIKIRIM', deskripsi: 'Pengiriman sedang dalam perjalanan oleh Driver U-003.', tanggal: "2025-12-02T13:00:00Z", iconName: "Truck" },
      { status: 'SELESAI', deskripsi: 'Pesanan berhasil diterima dan diverifikasi di lokasi pangkalan.', tanggal: "2025-12-02T15:45:00Z", iconName: "CheckCircle" },
    ],
    payment: {
      isPaid: true,
      paymentMethod: 'TRANSFER_BANK',
      amountPaid: 5325000,
      paymentDate: "2025-12-01T11:30:00Z",
      proofUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/736bcae2-0c68-4259-b162-db3a3188096c.png",
    },
    isAssignedToDriver: true,
  },
  {
    orderId: "ORD-20251203-002",
    pangkalan: getPangkalanSummary("P-002")!,
    items: MOCK_ORDER_2_ITEMS,
    totalAmount: MOCK_ORDER_2_ITEMS.reduce((sum, item) => sum + item.subTotal, 0), // 900,000
    currentStatus: 'MENUNGGU_PEMBAYARAN',
    tanggalPesan: "2025-12-03T09:00:00Z",
    timeline: [
      { status: 'DRAFT', deskripsi: 'Pesanan baru dibuat oleh Operator U-002.', tanggal: "2025-12-03T08:55:00Z", iconName: "FileText" },
      { status: 'DIPROSES', deskripsi: 'Pesanan diverifikasi dan siap untuk pembayaran.', tanggal: "2025-12-03T09:05:00Z", iconName: "ClipboardCheck" },
    ],
    payment: {
      isPaid: false,
    },
    isAssignedToDriver: false,
  },
  {
    orderId: "ORD-20251203-003",
    pangkalan: getPangkalanSummary("P-003")!,
    items: [createOrderItem('50kg', 10)], // 6,000,000
    totalAmount: 6000000,
    currentStatus: 'SIAP_KIRIM',
    tanggalPesan: "2025-12-03T11:00:00Z",
    timeline: [
      { status: 'DIPROSES', deskripsi: 'Pesanan diverifikasi dan pembayaran telah dikonfirmasi (Tunai).', tanggal: "2025-12-03T11:15:00Z", iconName: "ClipboardCheck" },
      { status: 'SIAP_KIRIM', deskripsi: 'Stok dialokasikan dan pesanan menanti penjadwalan pengiriman.', tanggal: "2025-12-03T11:45:00Z", iconName: "Package" },
    ],
    payment: {
      isPaid: true,
      paymentMethod: 'TUNAI',
      amountPaid: 6000000,
      paymentDate: "2025-12-03T11:15:00Z",
    },
    isAssignedToDriver: false,
    notes: "Pengiriman harus dilakukan besok pagi, 4 Desember 2025.",
  }
];

export const MOCK_ORDER_LIST: OrderListItemModel[] = MOCK_ORDER_DATA.map(o => {
  const totalQty = o.items.reduce((sum, item) => sum + item.qty, 0);
  return {
    orderId: o.orderId,
    pangkalan: o.pangkalan,
    totalLPGTypes: o.items.length,
    totalQty: totalQty,
    totalAmount: o.totalAmount,
    status: o.currentStatus,
    tanggalPesan: new Date(o.tanggalPesan).toLocaleDateString("id-ID"),
    detailActionIcon: "Eye",
  };
});

export const getOrderDetail = (id: string): OrderDetailModel | undefined => {
  return MOCK_ORDER_DATA.find(o => o.orderId === id);
};

export const getOrdersForScheduling = (): OrderSummaryModel[] => {
  return MOCK_ORDER_DATA
    .filter(o => o.currentStatus === 'SIAP_KIRIM' && !o.isAssignedToDriver)
    .map(o => ({
      orderId: o.orderId,
      pangkalanNama: o.pangkalan.nama,
      totalAmount: o.totalAmount,
      tanggalPesan: new Date(o.tanggalPesan).toLocaleDateString("id-ID"),
      totalQty: o.items.reduce((sum, item) => sum + item.qty, 0),
    }));
};
        
      