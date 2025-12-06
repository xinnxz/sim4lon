
        
/**
 * Model untuk kartu KPI di Dashboard Laporan.
 */
export interface ReportKPIModel {
  title: string;
  value: string;
  iconName: string;
  trend: 'up' | 'down' | 'flat';
}

/**
 * Model untuk kartu navigasi ringkasan laporan.
 */
export interface ReportSummaryCardModel {
  title: string;
  description: string;
  iconName: string;
}

/**
 * Struktur data generik untuk grafik Pie.
 */
export interface PieChartDataModel {
  labels: string[];
  data: number[];
  colors: string[];
}


export const MOCK_REPORT_KPIS: ReportKPIModel[] = [
  {
    title: "Pendapatan Bersih Bulan Ini",
    value: "Rp 155 Juta",
    iconName: "DollarSign",
    trend: 'up',
  },
  {
    title: "Total Pesanan",
    value: "2,150",
    iconName: "ShoppingBag",
    trend: 'up',
  },
  {
    title: "Rasio Pembayaran Lunas",
    value: "92.5%",
    iconName: "Percent",
    trend: 'flat',
  },
  {
    title: "Stok Critical Item",
    value: "5 Item",
    iconName: "AlertCircle",
    trend: 'down',
  },
];

export const MOCK_REPORT_SUMMARY_CARDS: ReportSummaryCardModel[] = [
  {
    title: "Tren Penjualan",
    description: "Analisis penjualan harian dan mingguan.",
    iconName: "Activity",
  },
{
     title: "Status Pembayaran",
     description: "Persentase lunas dan belum dibayar.",
     iconName: "BarChart3",
   },
  {
    title: "Pemakaian Stok",
    description: "Volume stok keluar berdasarkan jenis LPG.",
    iconName: "ChartArea",
  },
  {
    title: "Log Export",
    description: "Histori dan opsi Ekspor Laporan PDF/Excel.",
    iconName: "Download",
  },
];

export const MOCK_PAYMENT_STATUS_CHART: PieChartDataModel = {
  labels: ['Lunas (925 Pesanan)', 'Belum Dibayar (75 Pesanan)'],
  data: [925, 75],
  colors: ['#009B4C', '#EF4444'],
};
        
      