
        
import { LPGType, StockMovementType } from "./enums";

/**
 * Model untuk ringkasan stok per jenis LPG.
 */
export interface StockSummaryModel {
  type: LPGType;
  label: string;
  currentStock: number; // Jumlah tabung
  lastUpdate: string;
  iconName: string;
}

/**
 * Model untuk riwayat pergerakan stok (Masuk/Keluar).
 */
export interface StockHistoryModel {
  historyId: string;
  type: LPGType;
  movementType: StockMovementType;
  qty: number;
  timestamp: string;
  notes: string;
}

export const MOCK_STOCK_SUMMARY: StockSummaryModel[] = [
  {
    type: '3kg',
    label: 'LPG 3 Kg',
    currentStock: 1500,
    lastUpdate: '2025-12-03 14:00',
    iconName: 'Package',
  },
  {
    type: '12kg',
    label: 'LPG 12 Kg',
    currentStock: 500,
    lastUpdate: '2025-12-03 14:00',
    iconName: 'Package',
  },
  {
    type: '50kg',
    label: 'LPG 50 Kg',
    currentStock: 50,
    lastUpdate: '2025-12-03 14:00',
    iconName: 'Package',
  },
];

export const MOCK_MOVEMENT_TYPES: StockMovementType[] = ['MASUK', 'KELUAR'];

// Contoh riwayat stok (untuk tampilan tabel jika diperlukan)
export const MOCK_STOCK_HISTORY: StockHistoryModel[] = [
    {
        historyId: "H-001",
        type: "3kg",
        movementType: "MASUK",
        qty: 1000,
        timestamp: "2025-11-20T09:00:00Z",
        notes: "Penerimaan dari Supplier A.",
    },
    {
        historyId: "H-002",
        type: "12kg",
        movementType: "KELUAR",
        qty: 150,
        timestamp: "2025-11-21T10:30:00Z",
        notes: "Alokasi untuk Pengiriman DLV-005.",
    },
];
        
      