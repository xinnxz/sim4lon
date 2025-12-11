

import type { LPGType } from "./enums";

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
  movementType: 'MASUK' | 'KELUAR';
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

