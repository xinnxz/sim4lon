/**
 * LPG Configuration — Single Source of Truth
 * 
 * Semua config terkait tipe LPG (nama, warna, gambar, normalisasi)
 * disatukan di sini supaya konsisten di seluruh aplikasi.
 * 
 * PENTING: Jangan duplikasi config ini di komponen lain!
 * Import dari file ini: import { LPG_CONFIG, LPG_IMAGES, normalizeType } from '@/lib/lpg-config'
 */

// ===== Type Definitions =====

export interface LpgTypeConfig {
    /** Nama display (contoh: "LPG 3 kg") */
    name: string
    /** Hex color untuk chart/badge */
    color: string
    /** Tailwind gradient class (contoh: "from-green-500 to-emerald-600") */
    gradient: string
}

export interface LpgDisplayItem {
    /** Internal value used in forms (contoh: "kg3") */
    value: string
    /** Database type format (same as value) */
    dbType: string
    /** Stock API returns format (contoh: "3kg") — digunakan saat matching stock levels */
    stockType: string
    /** Display label (contoh: "3 kg") */
    display: string
    /** Hex color */
    color: string
    /** Tailwind gradient background class */
    bgClass: string
    /** Default price if no price data from API */
    defaultPrice: number
}

// ===== LPG Config (supports both 'kg3' and '3kg' formats) =====

export const LPG_CONFIG: Record<string, LpgTypeConfig> = {
    // Bright Gas 220gr
    'gr220': { name: 'Bright Gas 220gr', color: '#FFA500', gradient: 'from-orange-400 to-amber-500' },
    '220gr': { name: 'Bright Gas 220gr', color: '#FFA500', gradient: 'from-orange-400 to-amber-500' },
    // 3kg
    '3kg': { name: 'LPG 3 kg', color: '#22C55E', gradient: 'from-green-500 to-emerald-600' },
    'kg3': { name: 'LPG 3 kg', color: '#22C55E', gradient: 'from-green-500 to-emerald-600' },
    // 5.5kg
    '5kg': { name: 'LPG 5.5 kg', color: '#ff82c5', gradient: 'from-pink-400 to-pink-600' },
    'kg5': { name: 'LPG 5.5 kg', color: '#ff82c5', gradient: 'from-pink-400 to-pink-600' },
    // 12kg
    '12kg': { name: 'LPG 12 kg', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
    'kg12': { name: 'LPG 12 kg', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
    // 50kg
    '50kg': { name: 'LPG 50 kg', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600' },
    'kg50': { name: 'LPG 50 kg', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600' },
}

// ===== LPG Product Images =====

export const LPG_IMAGES: Record<string, string> = {
    // Bright Gas 220gr
    'gr220': '/images/products/bright-gas-220gr.png',
    '220gr': '/images/products/bright-gas-220gr.png',
    'bright_gas_220gr': '/images/products/bright-gas-220gr.png',
    // 3kg
    'kg3': '/images/products/lpg-3kg.png',
    '3kg': '/images/products/lpg-3kg.png',
    // 5.5kg
    'kg5': '/images/products/lpg-5kg.png',
    '5kg': '/images/products/lpg-5kg.png',
    // 12kg
    'kg12': '/images/products/lpg-12kg.png',
    '12kg': '/images/products/lpg-12kg.png',
    // 50kg
    'kg50': '/images/products/lpg-50kg.png',
    '50kg': '/images/products/lpg-50kg.png',
}

// ===== LPG Display Items (untuk form, selector, dll) =====

export const LPG_DISPLAY: LpgDisplayItem[] = [
    { value: 'kg3', dbType: 'kg3', stockType: '3kg', display: '3 kg', color: '#22C55E', bgClass: 'from-green-500 to-emerald-600', defaultPrice: 20000 },
    { value: 'kg5', dbType: 'kg5', stockType: '5kg', display: '5.5 kg', color: '#ff82c5', bgClass: 'from-pink-400 to-pink-600', defaultPrice: 60000 },
    { value: 'kg12', dbType: 'kg12', stockType: '12kg', display: '12 kg', color: '#3B82F6', bgClass: 'from-blue-500 to-indigo-600', defaultPrice: 180000 },
    { value: 'kg50', dbType: 'kg50', stockType: '50kg', display: '50 kg', color: '#ef0e0e', bgClass: 'from-red-500 to-red-600', defaultPrice: 700000 },
    { value: 'gr220', dbType: 'gr220', stockType: 'gr220', display: '220 gr', color: '#F59E0B', bgClass: 'from-amber-500 to-orange-600', defaultPrice: 22000 },
]

// ===== Fixed 5 Product Types (untuk halaman Kelola Produk) =====

export const FIXED_PRODUCTS = [
    { lpgType: 'gr220', name: 'Bright Gas Can', size_kg: 0.22, color: '#FFA500' },
    { lpgType: 'kg3', name: 'LPG 3 kg', size_kg: 3, color: '#22C55E' },
    { lpgType: 'kg5', name: 'LPG 5.5 kg', size_kg: 5.5, color: '#ff82c5' },
    { lpgType: 'kg12', name: 'LPG 12 kg', size_kg: 12, color: '#3B82F6' },
    { lpgType: 'kg50', name: 'LPG 50 kg', size_kg: 50, color: '#8B5CF6' },
] as const

// ===== Expense Categories Config =====

export const EXPENSE_CATEGORIES: Record<string, { label: string; color: string }> = {
    // Standard categories (uppercase)
    'OPERASIONAL': { label: 'Operasional', color: '#8B5CF6' },
    'TRANSPORT': { label: 'Transport', color: '#F97316' },
    'SEWA': { label: 'Sewa', color: '#EC4899' },
    'LISTRIK': { label: 'Listrik/Air', color: '#EAB308' },
    'GAJI': { label: 'Gaji', color: '#3B82F6' },
    'LAINNYA': { label: 'Lainnya', color: '#10B981' },
    // Legacy/alternative formats
    'MAINTENANCE': { label: 'Maintenance', color: '#06B6D4' },
    'Maintenance': { label: 'Maintenance', color: '#06B6D4' },
    'maintenance': { label: 'Maintenance', color: '#06B6D4' },
    'PERAWATAN': { label: 'Perawatan', color: '#14B8A6' },
    'LAIN-LAIN': { label: 'Lain-lain', color: '#6366F1' },
    'Lain-lain': { label: 'Lain-lain', color: '#6366F1' },
    'lain-lain': { label: 'Lain-lain', color: '#6366F1' },
}

// ===== Utility Functions =====

/**
 * Normalisasi format lpg_type.
 * Mengubah berbagai format (3kg, kg3, 220gr, gr220) ke format internal standar.
 * 
 * @example
 * normalizeType('3kg')   // => 'kg3'
 * normalizeType('kg3')   // => 'kg3'
 * normalizeType('220gr') // => 'gr220'
 * normalizeType('gr220') // => 'gr220'
 */
export function normalizeType(type: string): string {
    if (type.startsWith('kg')) return type // already kg3 format
    const match = type.match(/^(\d+\.?\d*)kg$/)
    if (match) return `kg${match[1]}`
    if (type.match(/g?r?220g?r?/i)) return 'gr220'
    return type
}

/**
 * Konversi lpg_type (format pangkalan) ke size_kg (format agen).
 * Digunakan saat matching produk pangkalan dengan katalog agen.
 * 
 * @example
 * lpgTypeToSizeKg('kg3')   // => 3
 * lpgTypeToSizeKg('kg5')   // => 5.5
 * lpgTypeToSizeKg('gr220') // => 0.22
 */
export function lpgTypeToSizeKg(lpgType: string): number {
    const mapping: Record<string, number> = {
        'kg3': 3,
        'kg5': 5.5,
        'kg55': 5.5,
        'kg12': 12,
        'kg50': 50,
        'gr220': 0.22,
        'kg220': 0.22,
    }
    return mapping[lpgType] ?? parseFloat(lpgType.replace('kg', ''))
}

/**
 * Konversi size_kg (format agen) ke lpg_type (format pangkalan).
 * 
 * @example
 * sizeKgToLpgType(3)    // => 'kg3'
 * sizeKgToLpgType(5.5)  // => 'kg5'
 * sizeKgToLpgType(0.22) // => 'gr220'
 */
export function sizeKgToLpgType(sizeKg: number): string {
    const mapping: Record<number, string> = {
        0.22: 'gr220',
        3: 'kg3',
        5.5: 'kg5',
        12: 'kg12',
        50: 'kg50',
    }
    return mapping[sizeKg] ?? `kg${String(sizeKg).replace('.', '')}`
}

/**
 * Dapatkan nama display untuk tipe LPG.
 * Fallback ke format uppercase jika tidak ditemukan.
 */
export function getLpgName(type: string): string {
    return LPG_CONFIG[type]?.name || type.toUpperCase()
}

/**
 * Dapatkan warna untuk tipe LPG.
 * Fallback ke gray jika tidak ditemukan.
 */
export function getLpgColor(type: string): string {
    return LPG_CONFIG[type]?.color || '#94A3B8'
}

/**
 * Dapatkan path gambar untuk tipe LPG.
 * Fallback ke gambar 3kg jika tidak ditemukan.
 */
export function getLpgImage(type: string): string {
    const normalized = type?.toLowerCase().replace(/[^a-z0-9]/g, '')
    return LPG_IMAGES[normalized] || LPG_IMAGES[type?.toLowerCase()] || '/images/products/lpg-3kg.png'
}

/**
 * Get active LPG types from API dropdown list.
 * Filters standard types based on which ones have active price entries.
 */
export function getActiveLpgTypes(prices: Array<{ lpg_type: string; is_active: boolean }>): Array<{ value: string; label: string }> {
    const allTypes = [
        { value: 'gr220', label: 'Bright Gas 220gr' },
        { value: 'kg3', label: 'LPG 3 kg' },
        { value: 'kg5', label: 'LPG 5.5 kg' },
        { value: 'kg12', label: 'LPG 12 kg' },
        { value: 'kg50', label: 'LPG 50 kg' },
    ]

    if (prices.length === 0) return allTypes

    return allTypes.filter(type => {
        const priceData = prices.find(p => normalizeType(p.lpg_type) === normalizeType(type.value))
        return priceData?.is_active === true
    })
}
