

/**
 * Model untuk item notifikasi.
 */
export interface NotificationModel {
  notificationId: string;
  title: string;
  message: string;
  timestamp: string; // ISO Date String
  isRead: boolean;
  type: 'order' | 'delivery' | 'system' | 'payment';
  iconName: string;
}

export const MOCK_NOTIFICATIONS: NotificationModel[] = [
  {
    notificationId: "N-005",
    title: "Pembayaran Diterima!",
    message: "Pembayaran Rp 6.000.000 untuk ORD-003 telah diverifikasi (Tunai).",
    timestamp: "2025-12-03T11:20:00Z",
    isRead: false,
    type: 'payment',
    iconName: "CreditCard",
  },
  {
    notificationId: "N-004",
    title: "Pesanan Baru Masuk",
    message: "Pesanan ORD-002 dari Pangkalan Berkah Sejahtera, menanti konfirmasi pembayaran.",
    timestamp: "2025-12-03T09:10:00Z",
    isRead: false,
    type: 'order',
    iconName: "ShoppingCart",
  },
  {
    notificationId: "N-003",
    title: "Pengiriman Selesai",
    message: "Pengiriman untuk ORD-001 telah berhasil dikirim oleh Driver Bambang.",
    timestamp: "2025-12-02T16:00:00Z",
    isRead: true,
    type: 'delivery',
    iconName: "Truck",
  },
  {
    notificationId: "N-001",
    title: "Peringatan Stok Rendah",
    message: "Stok LPG 50 Kg tersisa 50 unit. Mohon lakukan pemesanan ulang.",
    timestamp: "2025-11-28T09:00:00Z",
    isRead: true,
    type: 'system',
    iconName: "AlertTriangle",
  },
];

