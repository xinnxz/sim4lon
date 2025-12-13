/**
 * Data Wilayah Indonesia - Kabupaten dan Kecamatan
 * 
 * PENJELASAN:
 * Constant ini berisi data wilayah untuk dropdown cascading.
 * Saat ini fokus di Jawa Barat (Cianjur dan sekitarnya).
 * Bisa ditambah kabupaten lain jika bisnis expand.
 * 
 * Structure:
 * - KABUPATEN_LIST: Array of kabupaten names
 * - KECAMATAN_BY_KABUPATEN: Object mapping kabupaten to kecamatan array
 */

/**
 * Daftar Kabupaten yang tersedia
 * Tambah kabupaten baru di sini jika bisnis expand
 */
export const KABUPATEN_LIST = [
    'Cianjur',
    'Sukabumi',
    'Bandung',
    'Bogor',
] as const;

export type KabupatenType = typeof KABUPATEN_LIST[number];

/**
 * Mapping Kabupaten ke Kecamatan
 * Data resmi dari Kemendagri
 */
export const KECAMATAN_BY_KABUPATEN: Record<KabupatenType, string[]> = {
    'Cianjur': [
        'Agrabinta',
        'Bojongpicung',
        'Campaka',
        'Campakamulya',
        'Cianjur',
        'Cibeber',
        'Cibinong',
        'Cidaun',
        'Cijati',
        'Cikadu',
        'Cikalongkulon',
        'Cilaku',
        'Cipanas',
        'Ciranjang',
        'Cugenang',
        'Gekbrong',
        'Haurwangi',
        'Kadupandak',
        'Karangtengah',
        'Leles',
        'Mande',
        'Naringgul',
        'Pacet',
        'Pagelaran',
        'Pasirkuda',
        'Sindangbarang',
        'Sukaluyu',
        'Sukanagara',
        'Sukaresmi',
        'Takokak',
        'Tanggeung',
        'Warungkondang',
    ],
    'Sukabumi': [
        'Bojonggenteng',
        'Caringin',
        'Cicantayan',
        'Cicurug',
        'Cidadap',
        'Cidahu',
        'Cidolog',
        'Ciemas',
        'Cikakak',
        'Cikembar',
        'Cikidang',
        'Cimanggu',
        'Ciracap',
        'Cisaat',
        'Cisolok',
        'Gegerbitung',
        'Gunungguruh',
        'Jampangkulon',
        'Kabandungan',
        'Kadudampit',
        'Kalapanunggal',
        'Kebonpedes',
        'Lengkong',
        'Nagrak',
        'Nyalindung',
        'Pabuaran',
        'Palabuhanratu',
        'Parungkuda',
        'Purabaya',
        'Sagaranten',
        'Simpenan',
        'Sukabumi',
        'Sukaraja',
        'Surade',
        'Tegalbuleud',
        'Waluran',
        'Warungkiara',
    ],
    'Bandung': [
        'Arjasari',
        'Baleendah',
        'Banjaran',
        'Bojongsoang',
        'Cangkuang',
        'Cicalengka',
        'Cikancung',
        'Cilengkrang',
        'Cileunyi',
        'Cimaung',
        'Cimenyan',
        'Ciparay',
        'Ciwidey',
        'Dayeuhkolot',
        'Ibun',
        'Katapang',
        'Kertasari',
        'Kutawaringin',
        'Majalaya',
        'Margaasih',
        'Margahayu',
        'Nagreg',
        'Pacet',
        'Pameungpeuk',
        'Pangalengan',
        'Paseh',
        'Pasirjambu',
        'Rancaekek',
        'Rancabali',
        'Solokanjeruk',
        'Soreang',
    ],
    'Bogor': [
        'Babakan Madang',
        'Caringin',
        'Cariu',
        'Ciampea',
        'Ciawi',
        'Cibinong',
        'Cibungbulang',
        'Cigombong',
        'Cigudeg',
        'Cijeruk',
        'Cileungsi',
        'Ciomas',
        'Cisarua',
        'Ciseeng',
        'Citeureup',
        'Dramaga',
        'Gunung Putri',
        'Gunung Sindur',
        'Jasinga',
        'Jonggol',
        'Kemang',
        'Klapanunggal',
        'Leuwiliang',
        'Leuwisadeng',
        'Megamendung',
        'Nanggung',
        'Pamijahan',
        'Parung',
        'Parung Panjang',
        'Rancabungur',
        'Rumpin',
        'Sukajaya',
        'Sukamakmur',
        'Sukaraja',
        'Tajurhalang',
        'Tamansari',
        'Tanjungsari',
        'Tenjo',
        'Tenjolaya',
    ],
};

/**
 * Helper function untuk mendapatkan kecamatan berdasarkan kabupaten
 */
export function getKecamatanByKabupaten(kabupaten: string): string[] {
    return KECAMATAN_BY_KABUPATEN[kabupaten as KabupatenType] || [];
}

/**
 * Helper untuk format region string
 * @returns "Kecamatan, Kabupaten" format
 */
export function formatRegion(kecamatan: string, kabupaten: string): string {
    return `${kecamatan}, ${kabupaten}`;
}

/**
 * Parse region string ke kecamatan dan kabupaten
 */
export function parseRegion(region: string): { kecamatan: string; kabupaten: string } {
    const parts = region.split(', ');
    if (parts.length === 2) {
        return { kecamatan: parts[0], kabupaten: parts[1] };
    }
    // Fallback: cari kabupaten yang mengandung region ini
    for (const [kab, kecList] of Object.entries(KECAMATAN_BY_KABUPATEN)) {
        if (kecList.includes(region)) {
            return { kecamatan: region, kabupaten: kab };
        }
    }
    return { kecamatan: region, kabupaten: 'Cianjur' }; // Default
}
