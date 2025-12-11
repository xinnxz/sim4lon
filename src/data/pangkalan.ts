




/**
 * Model lengkap untuk detail sebuah Pangkalan.
 */
export interface PangkalanModel {
  pangkalanId: string;
  nama: string;
  alamat: string;
  kontak: string; // Nomor telepon
  email: string;
  catatan: string;
  batasKredit?: number; // Opsional
}

/**
 * Model ringkas untuk ditampilkan dalam daftar atau dropdown.
 */
export interface PangkalanSummary {
  pangkalanId: string;
  nama: string;
  alamatSingkat: string;
  kontak: string;
}

/**
 * Model untuk item daftar Pangkalan di tabel.
 */
export interface PangkalanListItemModel extends PangkalanSummary {
  aksiIcon: string;
}


export const MOCK_PANGKALAN_DATA: PangkalanModel[] = [
  {
    pangkalanId: "P-001",
    nama: "Pangkalan Maju Jaya Abadi",
    alamat: "Jl. Sudirman No. 12, Kel. Menteng, Jakarta Pusat",
    kontak: "081234567890",
    email: "maju.jaya@email.com",
    catatan: "Pangkalan terbesar di area ini, pesanan sering di atas 100 unit.",
    batasKredit: 50000000,
  },
  {
    pangkalanId: "P-002",
    nama: "Pangkalan Berkah Sejahtera",
    alamat: "Jalan Gajah Mada Blok C5 No. 4, Semarang",
    kontak: "087765432109",
    email: "berkah.sejahtera@email.com",
    catatan: "Membutuhkan LPG subsidi 3kg dan non-subsidi 12kg.",
    batasKredit: 25000000,
  },
  {
    pangkalanId: "P-003",
    nama: "Pangkalan Sumber Rezeki",
    alamat: "Perumahan Indah Blok R No. 10, Bandung",
    kontak: "085611223344",
    email: "sumber.rezeki@email.com",
    catatan: "Pembayaran selalu tepat waktu (Tunai).",
    batasKredit: 10000000,
  },
];

export const MOCK_PANGKALAN_SUMMARIES: PangkalanSummary[] = MOCK_PANGKALAN_DATA.map(p => ({
  pangkalanId: p.pangkalanId,
  nama: p.nama,
  alamatSingkat: p.alamat.substring(0, 30) + (p.alamat.length > 30 ? '...' : ''),
  kontak: p.kontak,
}));

export const MOCK_PANGKALAN_LIST: PangkalanListItemModel[] = MOCK_PANGKALAN_DATA.map(p => ({
  pangkalanId: p.pangkalanId,
  nama: p.nama,
  alamatSingkat: p.alamat.substring(0, 30) + (p.alamat.length > 30 ? '...' : ''),
  kontak: p.kontak,
  aksiIcon: "Edit", // Lucide icon name
}));

export const getPangkalanSummary = (id: string): PangkalanSummary | undefined => {
  const pangkalan = MOCK_PANGKALAN_DATA.find(p => p.pangkalanId === id);
  if (!pangkalan) return undefined;
  return {
    pangkalanId: pangkalan.pangkalanId,
    nama: pangkalan.nama,
    alamatSingkat: pangkalan.alamat.substring(0, 30) + '...',
    kontak: pangkalan.kontak,
  };
};

export const getPangkalanDetail = (id: string): PangkalanModel | undefined => {
  return MOCK_PANGKALAN_DATA.find(p => p.pangkalanId === id);
};


