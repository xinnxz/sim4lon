/**
 * WhatsApp Utility — Helper functions untuk kirim pesan via WhatsApp
 * 
 * Menggunakan WhatsApp Web URL scheme (wa.me) yang bekerja di
 * semua platform tanpa perlu API key atau integrasi pihak ketiga.
 * 
 * Untuk integrasi WhatsApp Business API (opsional), gunakan
 * endpoint backend terpisah.
 */

/**
 * Format nomor telepon Indonesia ke format WhatsApp (62xxx)
 * 
 * @example
 * formatPhoneForWA('08123456789')  → '628123456789'
 * formatPhoneForWA('+628123456789') → '628123456789'
 * formatPhoneForWA('628123456789')  → '628123456789'
 */
export function formatPhoneForWA(phone: string): string {
    // Hapus semua karakter non-digit
    let clean = phone.replace(/\D/g, '')

    // Konversi 0xxx ke 62xxx
    if (clean.startsWith('0')) {
        clean = '62' + clean.substring(1)
    }

    return clean
}

/**
 * Buka WhatsApp dengan pesan pre-filled
 * 
 * @param phone - Nomor HP konsumen (format apapun)
 * @param message - Pesan yang sudah di-format
 */
export function openWhatsApp(phone: string, message: string): void {
    const formatted = formatPhoneForWA(phone)
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${formatted}?text=${encoded}`, '_blank')
}

/**
 * Buka WhatsApp tanpa nomor (pilih kontak sendiri)
 */
export function shareViaWhatsApp(message: string): void {
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
}

// ============================================================
// PRE-BUILT MESSAGE TEMPLATES
// ============================================================

/**
 * Template notifikasi stok rendah ke agen
 */
export function buildStockAlertMessage(
    pangkalanName: string,
    items: Array<{ type: string; qty: number; warning: number }>
): string {
    const header = `⚠️ *PERINGATAN STOK RENDAH*\n\n`
    const from = `Dari: *${pangkalanName}*\n`
    const date = `Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`

    const itemLines = items
        .map(i => `• ${i.type}: *${i.qty} tabung* (batas: ${i.warning})`)
        .join('\n')

    const footer = `\n\nMohon segera dikirim. Terima kasih 🙏`

    return header + from + date + itemLines + footer
}

/**
 * Template nota penjualan untuk konsumen
 */
export function buildSaleReceiptMessage(
    pangkalanName: string,
    order: {
        code: string
        lpgType: string
        qty: number
        pricePerUnit: number
        totalAmount: number
        consumerName?: string
        date: string
    }
): string {
    const header = `🧾 *NOTA PENJUALAN LPG*\n\n`
    const shop = `*${pangkalanName}*\n`
    const divider = `${'─'.repeat(25)}\n`
    const code = `No: ${order.code}\n`
    const date = `Tgl: ${order.date}\n`
    const customer = order.consumerName ? `Konsumen: ${order.consumerName}\n` : ''

    const items = `\n${order.lpgType} x ${order.qty}\n`
    const price = `@ Rp ${order.pricePerUnit.toLocaleString('id-ID')}\n`
    const total = `\n*TOTAL: Rp ${order.totalAmount.toLocaleString('id-ID')}*\n`

    const footer = `\n${divider}💰 Lunas\nTerima kasih! 🙏`

    return header + shop + divider + code + date + customer + items + price + total + footer
}

/**
 * Template reminder pembayaran hutang
 */
export function buildDebtReminderMessage(
    pangkalanName: string,
    consumerName: string,
    totalDebt: number,
    items: Array<{ date: string; amount: number }>
): string {
    const header = `📋 *PENGINGAT PEMBAYARAN*\n\n`
    const greet = `Yth. ${consumerName},\n\n`
    const body = `Berikut rincian tagihan LPG Anda di *${pangkalanName}*:\n\n`

    const itemLines = items
        .map(i => `• ${i.date}: Rp ${i.amount.toLocaleString('id-ID')}`)
        .join('\n')

    const total = `\n\n*Total: Rp ${totalDebt.toLocaleString('id-ID')}*\n`
    const footer = `\nMohon segera dilunasi. Terima kasih 🙏`

    return header + greet + body + itemLines + total + footer
}
