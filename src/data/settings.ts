
        
import { PaymentMethod } from "./enums";

/**
 * Model untuk detail pengaturan yang dapat dikonfigurasi.
 */
export interface SettingItemModel {
    key: string;
    label: string;
    value: string | number | boolean | string[];
    type: 'text' | 'number' | 'boolean' | 'select_multiple';
    options?: { label: string; value: string }[];
    description: string;
}

/**
 * Model untuk pengaturan umum aplikasi.
 */
export interface GeneralSettingsModel {
    category: string;
    items: SettingItemModel[];
}


export const MOCK_GENERAL_SETTINGS: GeneralSettingsModel[] = [
    {
        category: "Pengaturan Umum Perusahaan",
        items: [
            {
                key: "nama_distributor",
                label: "Nama Distributor",
                value: "PT. SIGAP ELPIJI NUSANTARA",
                type: 'text',
                description: "Nama resmi distributor yang akan muncul di invoice dan laporan."
            },
            {
                key: "alamat_kantor_utama",
                label: "Alamat Kantor",
                value: "Jl. HR Rasuna Said Kav. X-8, No. 5E, Jakarta Selatan",
                type: 'text',
                description: "Alamat fisik kantor pusat."
            },
            {
                key: "kontak_pusat",
                label: "Telepon Pusat",
                value: "021-98765432",
                type: 'text',
                description: "Nomor telepon kontak utama."
            },
        ]
    },
    {
        category: "Pengaturan Keuangan & Pembayaran",
        items: [
            {
                key: "pajak_ppn",
                label: "Persentase PPN (%)",
                value: 11,
                type: 'number',
                description: "Tarif Pajak Pertambahan Nilai (PPN) yang berlaku untuk penjualan."
            },
            {
                key: "metode_pembayaran_aktif",
                label: "Metode Pembayaran Aktif",
                value: ['TUNAI', 'TRANSFER_BANK'],
                type: 'select_multiple',
                options: [
                    { label: "Tunai", value: "TUNAI" },
                    { label: "Transfer Bank", value: "TRANSFER_BANK" },
                    { label: "Virtual Account", value: "VIRTUAL_ACCOUNT" },
                ],
                description: "Pilih metode pembayaran yang tersedia untuk pelanggan."
            },
            {
                key: "batas_kirim_invoice_mandiri",
                label: "Batas Kirim Invoice Mandiri (Hari)",
                value: 7,
                type: 'number',
                description: "Batas waktu (hari) maksimal pembayaran setelah invoice terbit."
            },
        ]
    },
    {
        category: "Pengaturan Operasional",
        items: [
            {
                key: "notifikasi_stok_rendah_aktif",
                label: "Pemberitahuan Stok Rendah",
                value: true,
                type: 'boolean',
                description: "Aktifkan notifikasi jika stok di bawah batas kritis."
            },
        ]
    }
];

// Helper functions for accessing settings can be added here if needed in UI pages (not required by current pages)
        
      