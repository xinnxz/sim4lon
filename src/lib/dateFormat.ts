/**
 * Date Format Utility
 * 
 * Reads user's preferred date format from localStorage (from Appearance Settings)
 * and provides a consistent formatting function across the app.
 * 
 * Available formats:
 * - DD/MM/YYYY (default Indonesian)
 * - MM/DD/YYYY (US style)
 * - YYYY-MM-DD (ISO)
 */

type DateFormatOption = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'

const DEFAULT_FORMAT: DateFormatOption = 'DD/MM/YYYY'

/**
 * Get the user's preferred date format from localStorage
 */
export function getDateFormat(): DateFormatOption {
    if (typeof window === 'undefined') return DEFAULT_FORMAT

    try {
        const savedSettings = localStorage.getItem('appearance_settings')
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            return settings.dateFormat || DEFAULT_FORMAT
        }
    } catch { /* ignore */ }

    return DEFAULT_FORMAT
}

/**
 * Format a date according to user's preference
 * @param date - Date object, string, or timestamp
 * @param includeTime - Whether to include time (HH:mm)
 */
export function formatDate(date: Date | string | number, includeTime = false): string {
    const d = new Date(date)

    if (isNaN(d.getTime())) {
        return '-'
    }

    const format = getDateFormat()
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()

    let formatted: string
    switch (format) {
        case 'MM/DD/YYYY':
            formatted = `${month}/${day}/${year}`
            break
        case 'YYYY-MM-DD':
            formatted = `${year}-${month}-${day}`
            break
        case 'DD/MM/YYYY':
        default:
            formatted = `${day}/${month}/${year}`
            break
    }

    if (includeTime) {
        const hours = d.getHours().toString().padStart(2, '0')
        const minutes = d.getMinutes().toString().padStart(2, '0')
        formatted += ` ${hours}:${minutes}`
    }

    return formatted
}

/**
 * Format date with relative description (Hari ini, Kemarin, etc.)
 */
export function formatDateRelative(date: Date | string | number): string {
    const d = new Date(date)
    const now = new Date()

    if (isNaN(d.getTime())) {
        return '-'
    }

    // Same day
    if (d.toDateString() === now.toDateString()) {
        return 'Hari ini'
    }

    // Yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) {
        return 'Kemarin'
    }

    // Tomorrow
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (d.toDateString() === tomorrow.toDateString()) {
        return 'Besok'
    }

    // Within last 7 days
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    if (d > weekAgo) {
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        return dayNames[d.getDay()]
    }

    // Default to format
    return formatDate(date)
}

/**
 * Format a date for display with full month name
 */
export function formatDateLong(date: Date | string | number): string {
    const d = new Date(date)

    if (isNaN(d.getTime())) {
        return '-'
    }

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]

    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}
