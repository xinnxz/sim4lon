

/**
 * Tipe untuk status pesanan dalam sistem.
 */
export type StatusPesanan = 'DRAFT' | 'MENUNGGU_PEMBAYARAN' | 'DIPROSES' | 'SIAP_KIRIM' | 'DIKIRIM' | 'SELESAI' | 'BATAL';

/**
 * Enum untuk jenis LPG yang didistribusikan.
 */
export type LPGType = '3kg' | '12kg' | '50kg';

/**
 * Enum untuk peran pengguna dalam sistem admin.
 */
export type UserRole = 'ADMIN' | 'OPERATOR' | 'SUPERVISOR' | 'DRIVER';

/**
 * Tipe untuk status pengiriman.
 */
export type DeliveryStatus = 'BELUM_DIJADWALKAN' | 'MENUNGGU_PICKUP' | 'DALAM_PERJALANAN' | 'DELIVERED' | 'GAGAL';

/**
 * Enum untuk metode pembayaran.
 */
export type PaymentMethod = 'TUNAI' | 'TRANSFER_BANK' | 'VIRTUAL_ACCOUNT';

/**
 * Enum untuk jenis pergerakan stok (Masuk atau Keluar).
 */
export type StockMovementType = 'MASUK' | 'KELUAR';

/**
 * Tipe untuk ringkasan jenis LPG dengan detail harga dan stok.
 */
export interface LPGTypeSummary {
  type: LPGType;
  label: string;
  pricePerUnit: number; // Harga per tabung
  weight: string; // Berat gas dalam kg
  category: 'subsidi' | 'non-subsidi'; // Jenis gas
  minStock: number; // Minimum stok yang harus ada
}

export const LPG_TYPES: LPGTypeSummary[] = [
  { type: '3kg', label: 'LPG 3 Kg', pricePerUnit: 18000, weight: '3', category: 'subsidi', minStock: 100 },
  { type: '12kg', label: 'LPG 12 Kg', pricePerUnit: 145000, weight: '12', category: 'subsidi', minStock: 80 },
  { type: '50kg', label: 'LPG 50 Kg', pricePerUnit: 600000, weight: '50', category: 'non-subsidi', minStock: 50 },
];

