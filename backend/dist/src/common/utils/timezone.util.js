"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIMEZONE = void 0;
exports.nowWIB = nowWIB;
exports.todayWIB = todayWIB;
exports.startOfDayWIB = startOfDayWIB;
exports.endOfDayWIB = endOfDayWIB;
exports.formatDateWIB = formatDateWIB;
exports.formatDateTimeWIB = formatDateTimeWIB;
exports.formatTimeWIB = formatTimeWIB;
exports.isTodayWIB = isTodayWIB;
exports.getRelativeTimeWIB = getRelativeTimeWIB;
exports.TIMEZONE = 'Asia/Jakarta';
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
function nowWIB() {
    const now = new Date();
    return new Date(now.getTime() + WIB_OFFSET_MS);
}
function todayWIB() {
    const wibNow = nowWIB();
    wibNow.setUTCHours(0, 0, 0, 0);
    return new Date(wibNow.getTime() - WIB_OFFSET_MS);
}
function startOfDayWIB(date) {
    const wibDate = new Date(date.toLocaleString('en-US', { timeZone: exports.TIMEZONE }));
    wibDate.setHours(0, 0, 0, 0);
    return wibDate;
}
function endOfDayWIB(date) {
    const wibDate = new Date(date.toLocaleString('en-US', { timeZone: exports.TIMEZONE }));
    wibDate.setHours(23, 59, 59, 999);
    return wibDate;
}
function formatDateWIB(date, options) {
    const defaultOptions = {
        timeZone: exports.TIMEZONE,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    return date.toLocaleDateString('id-ID', { ...defaultOptions, ...options });
}
function formatDateTimeWIB(date) {
    return date.toLocaleString('id-ID', {
        timeZone: exports.TIMEZONE,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
function formatTimeWIB(date) {
    return date.toLocaleTimeString('id-ID', {
        timeZone: exports.TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
    });
}
function isTodayWIB(date) {
    const today = todayWIB();
    const checkDate = startOfDayWIB(date);
    return today.getTime() === checkDate.getTime();
}
function getRelativeTimeWIB(date) {
    const now = nowWIB();
    const diffMs = now.getTime() - new Date(date.toLocaleString('en-US', { timeZone: exports.TIMEZONE })).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)
        return 'Baru saja';
    if (diffMins < 60)
        return `${diffMins} menit yang lalu`;
    if (diffHours < 24)
        return `${diffHours} jam yang lalu`;
    if (diffDays === 1)
        return 'Kemarin';
    if (diffDays < 7)
        return `${diffDays} hari yang lalu`;
    return formatDateWIB(date);
}
//# sourceMappingURL=timezone.util.js.map