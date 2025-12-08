
import { DeliveryStatus, DeliveryStatus as StatusPengiriman } from "./enums";
import { PangkalanSummary, getPangkalanSummary } from "./pangkalan";
import { OrderItemModel, getOrderDetail } from "./order";
import { DriverSummaryModel, getUserById } from "./user";
import { TimeLineItemModel } from "./order"; // Reusing Timeline Model

/**
 * Bukti pengiriman yang diambil di lokasi pangkalan.
 */
export interface DeliveryProofModel {
  photoUrl: string;
  receiverName: string;
  timestamp: string;
}

/**
 * Model lengkap detail pengiriman.
 */
export interface DeliveryDetailModel {
  deliveryId: string;
  orderId: string;
  pangkalan: PangkalanSummary;
  driver: DriverSummaryModel;
  items: OrderItemModel[];
  currentStatus: StatusPengiriman;
  tanggalJadwal: string; // Tanggal rencana pengiriman
  tanggalPengirimanSelesai?: string;
  timeline: TimeLineItemModel[];
  proof?: DeliveryProofModel;
}

/**
 * Model untuk item daftar pengiriman di tabel.
 */
export interface DeliveryListItemModel extends Pick<DeliveryDetailModel, 'deliveryId' | 'currentStatus' | 'tanggalJadwal' | 'orderId'> {
  pangkalan: PangkalanSummary;
  driverName: string;
  detailActionIcon: string;
}

const mockDriver1 = getUserById("U-003");

const MOCK_DELIVERY_DATA: DeliveryDetailModel[] = [
  {
    deliveryId: "DLV-20251202-001",
    orderId: "ORD-20251203-001",
    pangkalan: getPangkalanSummary("P-001")!,
    driver: { userId: mockDriver1!.userId, nama: mockDriver1!.nama, telepon: mockDriver1!.telepon, avatarUrl: mockDriver1!.avatarUrl },
    items: getOrderDetail("ORD-20251203-001")!.items,
    currentStatus: 'DELIVERED',
    tanggalJadwal: "2025-12-02",
    tanggalPengirimanSelesai: "2025-12-02T15:45:00Z",
    timeline: [
      { status: 'Pengiriman Dijadwalkan' as any, deskripsi: 'Jadwal dibuat pada 2 Desember 2025', tanggal: "2025-12-02T08:00:00Z", iconName: "CalendarCheck" },
      { status: 'MENUNGGU_PICKUP', deskripsi: 'Driver U-003 mempersiapkan barang di gudang.', tanggal: "2025-12-02T10:00:00Z", iconName: "HardHat" },
      { status: 'DALAM_PERJALANAN', deskripsi: 'Truck No. B 1234 XYZ berangkat menuju Pangkalan P-001.', tanggal: "2025-12-02T13:00:00Z", iconName: "Truck" },
      { status: 'DELIVERED', deskripsi: 'Barang diterima dan status pengiriman selesai.', tanggal: "2025-12-02T15:45:00Z", iconName: "MapPin" },
    ],
    proof: {
      photoUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/baea0813-5005-4cfe-8ad9-587aa2fa797c.png",
      receiverName: "Budi Santoso (Admin Pangkalan)",
      timestamp: "2025-12-02T15:45:00Z",
    }
  },
  {
    deliveryId: "DLV-20251204-002",
    orderId: "ORD-20251203-003",
    pangkalan: getPangkalanSummary("P-003")!,
    driver: { userId: mockDriver1!.userId, nama: mockDriver1!.nama, telepon: mockDriver1!.telepon, avatarUrl: mockDriver1!.avatarUrl },
    items: getOrderDetail("ORD-20251203-003")!.items,
    currentStatus: 'MENUNGGU_PICKUP',
    tanggalJadwal: "2025-12-04",
    tanggalPengirimanSelesai: undefined,
    timeline: [
      { status: 'Pengiriman Dijadwalkan' as any, deskripsi: 'Jadwal dibuat untuk tanggal 4 Desember 2025', tanggal: "2025-12-03T15:00:00Z", iconName: "CalendarCheck" },
      { status: 'MENUNGGU_PICKUP', deskripsi: 'Menunggu driver untuk mengambil stok di gudang.', tanggal: "2025-12-03T15:05:00Z", iconName: "Box" },
    ],
    proof: undefined,
  },
];

export const MOCK_DELIVERY_LIST: DeliveryListItemModel[] = MOCK_DELIVERY_DATA.map(d => ({
  deliveryId: d.deliveryId,
  orderId: d.orderId,
  pangkalan: d.pangkalan,
  driverName: d.driver.nama,
  currentStatus: d.currentStatus,
  tanggalJadwal: d.tanggalJadwal,
  detailActionIcon: "Package",
}));

export const getDeliveryDetail = (id: string): DeliveryDetailModel | undefined => {
  return MOCK_DELIVERY_DATA.find(d => d.deliveryId === id);
};
