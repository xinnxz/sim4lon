/**
 * TIMEZONE UTILITIES (Frontend)
 * 
 * Helper functions untuk memastikan semua waktu menggunakan
 * timezone Asia/Jakarta (WIB - UTC+7)
 */

export const TIMEZONE = 'Asia/Jakarta';

/**
 * Format date to Indonesian locale with WIB timezone
 */
export function formatDateWIB(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: TIMEZONE,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return dateObj.toLocaleDateString('id-ID', { ...defaultOptions, ...options });
}

/**
 * Format date short (e.g., "16 Jan 2026")
 */
export function formatDateShortWIB(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', {
        timeZone: TIMEZONE,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Format datetime to Indonesian locale with WIB timezone
 */
export function formatDateTimeWIB(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('id-ID', {
        timeZone: TIMEZONE,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format time only to Indonesian locale with WIB timezone
 */
export function formatTimeWIB(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('id-ID', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get relative time string (e.g., "2 jam yang lalu", "kemarin")
 */
export function getRelativeTimeWIB(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;

    return formatDateShortWIB(dateObj);
}

/**
 * Format month year (e.g., "Januari 2026")
 */
export function formatMonthYearWIB(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', {
        timeZone: TIMEZONE,
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Format number with Indonesian locale
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('id-ID');
}
