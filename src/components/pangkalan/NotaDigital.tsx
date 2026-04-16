/**
 * NotaDigital - Komponen Nota/Receipt Digital
 * 
 * Menampilkan nota penjualan yang bisa:
 * - Print langsung (window.print)
 * - Share ke WhatsApp (text format)
 * - Copy ke clipboard
 * 
 * Dipanggil dari CatatPenjualanPage setelah penjualan berhasil,
 * atau dari RiwayatPenjualanPage untuk cetak ulang.
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon'
import { getLpgName } from '@/lib/lpg-config'
import { formatCurrency, formatDate, formatTime } from '@/lib/format'
import { toast } from 'sonner'
import type { ConsumerOrder } from '@/lib/api'

interface NotaDigitalProps {
    order: ConsumerOrder
    pangkalanName?: string
    pangkalanPhone?: string
    pangkalanAddress?: string
    open: boolean
    onClose: () => void
}

export default function NotaDigital({
    order,
    pangkalanName = 'Pangkalan LPG',
    pangkalanPhone,
    pangkalanAddress,
    open,
    onClose,
}: NotaDigitalProps) {
    const [isCopied, setIsCopied] = useState(false)

    const lpgName = getLpgName(order.lpg_type)
    const consumerName = order.consumers?.name || order.consumer_name || 'Walk-in'
    const consumerPhone = order.consumers?.phone || null

    // Generate text nota
    const generateNotaText = () => {
        const separator = '━'.repeat(28)
        const lines = [
            `🧾 NOTA PENJUALAN`,
            separator,
            `📍 ${pangkalanName}`,
        ]

        if (pangkalanAddress) lines.push(`   ${pangkalanAddress}`)
        if (pangkalanPhone) lines.push(`📞 ${pangkalanPhone}`)

        lines.push(separator)
        lines.push(`No    : ${order.code}`)
        lines.push(`Tgl   : ${formatDate(order.sale_date)} ${formatTime(order.created_at)}`)
        lines.push(`Pembeli: ${consumerName}`)
        lines.push(separator)
        lines.push(``)
        lines.push(`  ${lpgName}`)
        lines.push(`  ${order.qty} tabung × ${formatCurrency(order.price_per_unit)}`)
        lines.push(``)
        lines.push(separator)
        lines.push(`  TOTAL: ${formatCurrency(order.total_amount)}`)
        lines.push(separator)
        lines.push(``)
        lines.push(`Status: ${order.payment_status === 'LUNAS' ? '✅ LUNAS' : '⚠️ HUTANG'}`)
        lines.push(``)
        lines.push(`Terima kasih 🙏`)
        lines.push(`SIM4LON - Sistem Informasi LPG`)

        return lines.join('\n')
    }

    // Share via WhatsApp
    const handleShareWhatsApp = () => {
        const text = generateNotaText()
        const phone = consumerPhone?.replace(/[^0-9]/g, '') || ''
        const encodedText = encodeURIComponent(text)

        if (phone) {
            // Format: 08xxx → 628xxx for WhatsApp API
            const waPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
            window.open(`https://wa.me/${waPhone}?text=${encodedText}`, '_blank')
        } else {
            // No phone → open WhatsApp without recipient
            window.open(`https://wa.me/?text=${encodedText}`, '_blank')
        }

        toast.success('Membuka WhatsApp...')
    }

    // Copy to clipboard
    const handleCopy = async () => {
        const text = generateNotaText()
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)
            toast.success('Nota disalin ke clipboard!')
            setTimeout(() => setIsCopied(false), 2000)
        } catch {
            toast.error('Gagal menyalin')
        }
    }

    // Print
    const handlePrint = () => {
        const printWindow = window.open('', '_blank', 'width=400,height=600')
        if (!printWindow) {
            toast.error('Pop-up diblokir browser')
            return
        }

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Nota ${order.code}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10mm; width: 80mm; }
        .header { text-align: center; margin-bottom: 8px; }
        .header h2 { font-size: 14px; margin-bottom: 4px; }
        .header p { font-size: 10px; color: #666; }
        .separator { border-top: 1px dashed #000; margin: 6px 0; }
        .info { margin: 4px 0; }
        .info span { display: inline-block; width: 60px; }
        .item { margin: 8px 0; padding: 4px 0; }
        .item .name { font-weight: bold; }
        .item .calc { color: #666; }
        .total { font-size: 16px; font-weight: bold; text-align: right; margin: 8px 0; }
        .status { text-align: center; padding: 4px 8px; border-radius: 4px; margin: 8px 0; font-weight: bold; }
        .status.lunas { background: #dcfce7; color: #166534; }
        .status.hutang { background: #fef3c7; color: #92400e; }
        .footer { text-align: center; margin-top: 12px; font-size: 10px; color: #999; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h2>${pangkalanName}</h2>
        ${pangkalanAddress ? `<p>${pangkalanAddress}</p>` : ''}
        ${pangkalanPhone ? `<p>📞 ${pangkalanPhone}</p>` : ''}
    </div>
    <div class="separator"></div>
    <div class="info"><span>No</span>: ${order.code}</div>
    <div class="info"><span>Tanggal</span>: ${formatDate(order.sale_date)} ${formatTime(order.created_at)}</div>
    <div class="info"><span>Pembeli</span>: ${consumerName}</div>
    <div class="separator"></div>
    <div class="item">
        <div class="name">${lpgName}</div>
        <div class="calc">${order.qty} × ${formatCurrency(order.price_per_unit)}</div>
    </div>
    <div class="separator"></div>
    <div class="total">TOTAL: ${formatCurrency(order.total_amount)}</div>
    <div class="separator"></div>
    <div class="status ${order.payment_status === 'LUNAS' ? 'lunas' : 'hutang'}">
        ${order.payment_status === 'LUNAS' ? '✅ LUNAS' : '⚠️ HUTANG'}
    </div>
    <div class="footer">
        <p>Terima kasih atas pembeliannya!</p>
        <p>SIM4LON - Sistem Informasi LPG</p>
    </div>
</body>
</html>
        `)
        printWindow.document.close()
        setTimeout(() => {
            printWindow.print()
        }, 300)
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <SafeIcon name="Receipt" className="h-5 w-5 text-blue-600" />
                        </div>
                        Nota Digital
                    </DialogTitle>
                    <DialogDescription>
                        #{order.code}
                    </DialogDescription>
                </DialogHeader>

                {/* Receipt Preview */}
                <div className="px-4 py-3">
                    <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs space-y-2 border border-slate-200">
                        {/* Header */}
                        <div className="text-center pb-2 border-b border-dashed border-slate-300">
                            <p className="font-bold text-sm text-slate-800">{pangkalanName}</p>
                            {pangkalanAddress && <p className="text-slate-500 text-[10px]">{pangkalanAddress}</p>}
                            {pangkalanPhone && <p className="text-slate-500 text-[10px]">📞 {pangkalanPhone}</p>}
                        </div>

                        {/* Info */}
                        <div className="space-y-1 text-slate-600">
                            <div className="flex justify-between">
                                <span>No</span>
                                <span className="font-medium text-slate-800">{order.code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tanggal</span>
                                <span>{formatDate(order.sale_date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pembeli</span>
                                <span className="font-medium text-slate-800 truncate ml-2">{consumerName}</span>
                            </div>
                        </div>

                        {/* Item */}
                        <div className="py-2 border-y border-dashed border-slate-300">
                            <p className="font-bold text-slate-800">{lpgName}</p>
                            <p className="text-slate-500">{order.qty} × {formatCurrency(order.price_per_unit)}</p>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-1">
                            <span className="font-bold text-slate-800">TOTAL</span>
                            <span className="font-bold text-lg text-blue-600">{formatCurrency(order.total_amount)}</span>
                        </div>

                        {/* Status */}
                        <div className={`text-center py-1 rounded-lg text-[10px] font-bold ${order.payment_status === 'LUNAS'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                            {order.payment_status === 'LUNAS' ? '✅ LUNAS' : '⚠️ HUTANG'}
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 hover:bg-green-50 hover:border-green-300"
                        onClick={handleShareWhatsApp}
                    >
                        <SafeIcon name="MessageCircle" className="h-5 w-5 text-green-600" />
                        <span className="text-[10px] font-medium text-green-700">WhatsApp</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 hover:bg-blue-50 hover:border-blue-300"
                        onClick={handlePrint}
                    >
                        <SafeIcon name="Printer" className="h-5 w-5 text-blue-600" />
                        <span className="text-[10px] font-medium text-blue-700">Cetak</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 hover:bg-violet-50 hover:border-violet-300"
                        onClick={handleCopy}
                    >
                        <SafeIcon name={isCopied ? "Check" : "Copy"} className={`h-5 w-5 ${isCopied ? 'text-green-600' : 'text-violet-600'}`} />
                        <span className={`text-[10px] font-medium ${isCopied ? 'text-green-700' : 'text-violet-700'}`}>
                            {isCopied ? 'Tersalin!' : 'Salin'}
                        </span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
