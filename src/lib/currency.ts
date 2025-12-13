/**
 * Currency Formatting Utility
 * 
 * PENJELASAN:
 * Utility ini menyediakan fungsi-fungsi untuk format uang sesuai best practice Indonesia:
 * - Format: Rp 1.234.567
 * - Pemisah ribuan: titik (.)
 * - Pemisah desimal: koma (,) - jika diperlukan
 * - Tanpa desimal untuk rupiah (karena nilai terkecil adalah 1 rupiah)
 */

/**
 * Format angka menjadi format mata uang Rupiah
 * @param amount - Jumlah dalam angka
 * @param options - Opsi tambahan
 * @returns String format Rupiah (contoh: "Rp 1.234.567")
 * 
 * @example
 * formatCurrency(1500000) // "Rp 1.500.000"
 * formatCurrency(1500000, { withSymbol: false }) // "1.500.000"
 * formatCurrency(1500000, { compact: true }) // "Rp 1,5 jt"
 */
export function formatCurrency(
    amount: number | string | undefined | null,
    options?: {
        withSymbol?: boolean  // Include "Rp" symbol (default: true)
        compact?: boolean     // Use compact format like "1,5 jt" (default: false)
        decimals?: number     // Decimal places (default: 0)
    }
): string {
    const { withSymbol = true, compact = false, decimals = 0 } = options || {}

    // Handle null/undefined/NaN
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (numAmount === undefined || numAmount === null || isNaN(numAmount)) {
        return withSymbol ? 'Rp 0' : '0'
    }

    // Compact format for large numbers
    if (compact) {
        const absAmount = Math.abs(numAmount)
        let formatted: string

        if (absAmount >= 1_000_000_000_000) {
            formatted = `${(numAmount / 1_000_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} T`
        } else if (absAmount >= 1_000_000_000) {
            formatted = `${(numAmount / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
        } else if (absAmount >= 1_000_000) {
            formatted = `${(numAmount / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
        } else if (absAmount >= 1_000) {
            formatted = `${(numAmount / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} rb`
        } else {
            formatted = numAmount.toLocaleString('id-ID')
        }

        return withSymbol ? `Rp ${formatted}` : formatted
    }

    // Standard format
    const formatted = numAmount.toLocaleString('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })

    return withSymbol ? `Rp ${formatted}` : formatted
}

/**
 * Parse string format Rupiah menjadi angka
 * @param currencyString - String format Rupiah (contoh: "Rp 1.234.567")
 * @returns Angka
 * 
 * @example
 * parseCurrency("Rp 1.500.000") // 1500000
 * parseCurrency("1.234.567") // 1234567
 */
export function parseCurrency(currencyString: string | undefined | null): number {
    if (!currencyString) return 0

    // Remove "Rp", spaces, and dots (thousand separator)
    const cleaned = currencyString
        .replace(/[Rp\s]/gi, '')
        .replace(/\./g, '')
        .replace(/,/g, '.')  // Replace comma (decimal separator) with dot

    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
}

/**
 * Format angka dengan prefix +/- untuk menunjukkan perubahan
 * @param amount - Jumlah perubahan
 * @returns String dengan prefix (contoh: "+Rp 50.000" atau "-Rp 30.000")
 */
export function formatCurrencyChange(amount: number): string {
    const prefix = amount >= 0 ? '+' : ''
    return `${prefix}${formatCurrency(amount)}`
}

/**
 * Format range harga
 * @param min - Harga minimum
 * @param max - Harga maximum
 * @returns String range (contoh: "Rp 100.000 - Rp 200.000")
 */
export function formatCurrencyRange(min: number, max: number): string {
    if (min === max) {
        return formatCurrency(min)
    }
    return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

// Default export for convenience
export default formatCurrency
