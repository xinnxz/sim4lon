
        
        
import { DriverSummaryModel } from "./user";
import { OrderSummaryModel } from "./order";

/**
 * Model ringkas sebuah pengiriman untuk Kalender.
 */
export interface DeliverySummaryForSchedule {
  deliveryId: string;
  orderId: string;
  pangkalanNama: string;
  driverId: string;
}

/**
 * Model untuk satu hari entri jadwal di kalender (Digunakan di UI Kalender bulanan).
 */
export interface ScheduleEntryModel {
  date: string; // YYYY-MM-DD
  deliveryCount: number;
  driverCount: number;
  deliveryIds: string[];
}

/**
 * Model lengkap untuk detail jadwal pengiriman.
 */
export interface DailyScheduleModel {
  date: string; // YYYY-MM-DD
  driver: DriverSummaryModel;
  orders: OrderSummaryModel[]; // Detail daftar pesanan yang dijadwalkan
}

export const MOCK_SCHEDULE_ENTRIES: ScheduleEntryModel[] = [
  { date: "2025-12-02", deliveryCount: 1, driverCount: 1, deliveryIds: ["DLV-20251202-001"] },
  { date: "2025-12-04", deliveryCount: 1, driverCount: 1, deliveryIds: ["DLV-20251204-002"] },
  { date: "2025-12-05", deliveryCount: 2, driverCount: 1, deliveryIds: [] },
  { date: "2025-12-08", deliveryCount: 3, driverCount: 2, deliveryIds: [] },
];
        
      