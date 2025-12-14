/**
 * Region Data - Kabupaten & Kecamatan
 * 
 * PENJELASAN:
 * Data wilayah untuk dropdown cascading:
 * 1. User pilih Kabupaten
 * 2. Kecamatan otomatis filter sesuai Kabupaten
 * 
 * Future: Bisa dipindahkan ke database untuk manage via admin panel
 */

export interface Kabupaten {
    id: string
    name: string
    kecamatan: string[]
}

/**
 * Daftar Kabupaten yang dilayani
 * Saat ini fokus di Cianjur dan sekitarnya
 */
export const KABUPATEN_DATA: Kabupaten[] = [
    {
        id: 'cianjur',
        name: 'Kabupaten Cianjur',
        kecamatan: [
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
    },
    {
        id: 'sukabumi',
        name: 'Kabupaten Sukabumi',
        kecamatan: [
            'Cicurug',
            'Cidahu',
            'Cidolog',
            'Ciemas',
            'Cikakak',
            'Cikembar',
            'Cikidang',
            'Ciracap',
            'Cisolok',
            'Cisaat',
            'Gegerbitung',
            'Jampang Kulon',
            'Jampang Tengah',
            'Kabandungan',
            'Kalapanunggal',
            'Lengkong',
            'Nyalindung',
            'Pabuaran',
            'Palabuhanratu',
            'Parung Kuda',
            'Purabaya',
            'Sagaranten',
            'Simpenan',
            'Sukabumi',
            'Sukaraja',
            'Warungkiara',
        ],
    },
    {
        id: 'bandung',
        name: 'Kabupaten Bandung',
        kecamatan: [
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
            'Rancabali',
            'Rancaekek',
            'Solokanjeruk',
            'Soreang',
        ],
    },
]

/**
 * Helper: Get kecamatan by kabupaten ID
 */
export function getKecamatanByKabupaten(kabupatenId: string): string[] {
    const kabupaten = KABUPATEN_DATA.find(k => k.id === kabupatenId)
    return kabupaten?.kecamatan || []
}

/**
 * Helper: Get kabupaten name by ID
 */
export function getKabupatenName(kabupatenId: string): string {
    const kabupaten = KABUPATEN_DATA.find(k => k.id === kabupatenId)
    return kabupaten?.name || kabupatenId
}

/**
 * Helper: Format region display (Kecamatan, Kabupaten)
 */
export function formatRegionDisplay(kecamatan: string, kabupatenId: string): string {
    const kabupatenName = getKabupatenName(kabupatenId)
    return `${kecamatan}, ${kabupatenName}`
}
