/**
 * Shared Formatting Utilities
 * 
 * Format functions untuk currency, tanggal, waktu, dll.
 * Digunakan di seluruh aplikasi supaya konsisten.
 * 
 * Import: import { formatCurrency, formatDate, formatTime } from '@/lib/format'
 */

/**
 * Format angka ke Rupiah.
 * @example formatCurrency(150000) // => "Rp150.000"
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}

/**
 * Format angka ke Rupiah tanpa simbol "Rp".
 * @example formatNumber(150000) // => "150.000"
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value)
}

/**
 * Format currency pendek untuk chart axis.
 * @example formatCurrencyShort(1500000) // => "1.5jt"
 * @example formatCurrencyShort(50000)   // => "50rb"
 */
export function formatCurrencyShort(value: number): string {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`
    return value.toString()
}

/**
 * Format tanggal ke format Indonesia pendek.
 * @example formatDate('2026-03-01') // => "1 Mar"
 */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    })
}

/**
 * Format tanggal lengkap.
 * @example formatDateFull('2026-03-01') // => "1 Maret 2026"
 */
export function formatDateFull(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

/**
 * Format tanggal dengan waktu.
 * @example formatDateTime('2026-03-01T10:30:00') // => "01 Mar 2026, 10:30"
 */
export function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Format waktu saja.
 * @example formatTime('2026-03-01T10:30:00') // => "10:30"
 */
export function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    })
}
