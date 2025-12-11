import { LPG_TYPES } from "./enums";
import { MOCK_ORDER_DATA } from "./order";

/**
 * Model untuk kartu KPI (Key Performance Indicator).
 */
export interface DashboardKPIModel {
  title: string;
  value: string;
  unit?: string;
  iconName: string;
  colorClass: 'green' | 'yellow' | 'blue' | 'gray';
}

/**
 * Model untuk tombol aksi cepat di dashboard.
 */
export interface QuickActionModel {
  title: string;
  iconName: string;
}

/**
 * Struktur data generik untuk grafik Line atau Bar.
 */
export interface ChartDataModel {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

/**
 * Item untuk ringkasan aktivitas terbaru (Pembayaran/Pengiriman).
 */
export interface ActivityItemModel {
  id: string;
  type: 'Payment' | 'Delivery';
  title: string;
  subtitle: string;
  timestamp: string;
  iconName: string;
}

const calculateDashboardData = (orders: typeof MOCK_ORDER_DATA): { kpis: DashboardKPIModel[]; activity: ActivityItemModel[] } => {
  const today = new Date().toISOString().split('T')[0];
  const totalOrdersToday = orders.filter(o => o.tanggalPesan.startsWith(today)).length;
  const pendingOrders = orders.filter(o => o.currentStatus === 'MENUNGGU_PEMBAYARAN' || o.currentStatus === 'DIPROSES').length;
  const activeDeliveries = orders.filter(o => o.currentStatus === 'DIKIRIM' || o.currentStatus === 'SIAP_KIRIM').length;

  const totalStock = LPG_TYPES.reduce((sum, lpg) => sum + (lpg.type === '3kg' ? 1500 : lpg.type === '12kg' ? 500 : 50), 0); // Mock total Qty

  const kpis: DashboardKPIModel[] = [
    {
      title: "Total Pesanan Hari Ini",
      value: totalOrdersToday.toString(),
      iconName: "ShoppingCart",
      colorClass: 'green',
    },
    {
      title: "Pesanan Belum Diproses",
      value: pendingOrders.toString(),
      iconName: "Hourglass",
      colorClass: 'yellow',
    },
    {
      title: "Pengiriman Aktif",
      value: activeDeliveries.toString(),
      iconName: "Truck",
      colorClass: 'blue',
    },
    {
      title: "Total Stok LPG (Unit)",
      value: totalStock.toString(),
      iconName: "Package",
      colorClass: 'gray',
      unit: "Unit",
    },
  ];

  const recentPaymentActivity: ActivityItemModel[] = orders
    .filter(o => o.payment.isPaid)
    .sort((a, b) => new Date(b.payment.paymentDate!).getTime() - new Date(a.payment.paymentDate!).getTime())
    .slice(0, 3)
    .map(o => ({
      id: o.orderId,
      type: 'Payment',
      title: `Pembayaran diterima dari ${o.pangkalan.nama}`,
      subtitle: `Rp ${o.totalAmount.toLocaleString('id-ID')}`,
      timestamp: new Date(o.payment.paymentDate!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      iconName: "CreditCard",
    }));

  const recentDeliveryActivity: ActivityItemModel[] = orders
    .filter(o => o.currentStatus === 'SELESAI' && o.isAssignedToDriver)
    .sort((a, b) => new Date(b.timeline.find(t => t.status === 'SELESAI')?.tanggal!).getTime() - new Date(a.timeline.find(t => t.status === 'SELESAI')?.tanggal!).getTime())
    .slice(0, 3)
    .map(o => ({
      id: o.orderId,
      type: 'Delivery',
      title: `Pengiriman Selesai ke ${o.pangkalan.nama}`,
      subtitle: `Order ID: ${o.orderId}`,
      timestamp: new Date(o.timeline.find(t => t.status === 'SELESAI')?.tanggal!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      iconName: "CheckCircle",
    }));

  return { kpis, activity: [...recentPaymentActivity.slice(0, 2), ...recentDeliveryActivity.slice(0, 2)].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) };
};

export const MOCK_DASHBOARD_KPI = calculateDashboardData(MOCK_ORDER_DATA).kpis;
export const MOCK_RECENT_ACTIVITY = calculateDashboardData(MOCK_ORDER_DATA).activity;


export const MOCK_DASHBOARD_QUICK_ACTIONS: QuickActionModel[] = [
  { title: "Buat Pesanan", iconName: "PlusCircle" },
  { title: "Tambah Pangkalan", iconName: "Building" },
  { title: "Update Stok", iconName: "Warehouse" },
];

export const MOCK_PENJUALAN_MINGGUAN_CHART: ChartDataModel = {
  labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  datasets: [{
    label: "Penjualan (Juta Rp)",
    data: [12.5, 15.3, 11.9, 18.0, 25.1, 16.5, 14.8],
    color: "#009B4C", // Hijau LPG
  }],
};

export const MOCK_PEMAKAIAN_STOK_CHART: ChartDataModel = {
  labels: ["Minggu 48", "Minggu 49", "Minggu 50", "Minggu 51", "Minggu 52"],
  datasets: [
    {
      label: "LPG 3 Kg (Unit)",
      data: [500, 650, 480, 720, 550],
      color: "#009B4C", // Hijau
    },
    {
      label: "LPG 12 Kg (Unit)",
      data: [150, 180, 130, 200, 160],
      color: "#FFD447", // Kuning Emas
    }
  ],
};

export const MOCK_KEUNTUNGAN_SUMMARY: number = 25000000; // Keuntungan bulan berjalan


