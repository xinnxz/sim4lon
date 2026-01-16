/**
 * TIMEZONE UTILITIES
 * 
 * Helper functions untuk memastikan semua waktu menggunakan
 * timezone Asia/Jakarta (WIB - UTC+7)
 * 
 * Penting karena server Railway/Vercel biasanya di UTC,
 * tapi bisnis logic harus pakai WIB.
 */

export const TIMEZONE = 'Asia/Jakarta';

/**
 * Get current date/time in WIB timezone
 * Gunakan ini sebagai pengganti `new Date()` untuk business logic
 */
export function nowWIB(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

/**
 * Get today's date at midnight in WIB timezone
 * Berguna untuk filter "hari ini"
 */
export function todayWIB(): Date {
    const now = nowWIB();
    now.setHours(0, 0, 0, 0);
    return now;
}

/**
 * Get start of day in WIB for a given date
 */
export function startOfDayWIB(date: Date): Date {
    const wibDate = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
    wibDate.setHours(0, 0, 0, 0);
    return wibDate;
}

/**
 * Get end of day in WIB for a given date
 */
export function endOfDayWIB(date: Date): Date {
    const wibDate = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
    wibDate.setHours(23, 59, 59, 999);
    return wibDate;
}

/**
 * Format date to Indonesian locale with WIB timezone
 */
export function formatDateWIB(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: TIMEZONE,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return date.toLocaleDateString('id-ID', { ...defaultOptions, ...options });
}

/**
 * Format datetime to Indonesian locale with WIB timezone
 */
export function formatDateTimeWIB(date: Date): string {
    return date.toLocaleString('id-ID', {
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
export function formatTimeWIB(date: Date): string {
    return date.toLocaleTimeString('id-ID', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Check if a date is today in WIB timezone
 */
export function isTodayWIB(date: Date): boolean {
    const today = todayWIB();
    const checkDate = startOfDayWIB(date);
    return today.getTime() === checkDate.getTime();
}

/**
 * Get relative time string (e.g., "2 jam yang lalu", "kemarin")
 */
export function getRelativeTimeWIB(date: Date): string {
    const now = nowWIB();
    const diffMs = now.getTime() - new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE })).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;

    return formatDateWIB(date);
}
