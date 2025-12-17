/**
 * CatatPenjualanPage - Form Catat Penjualan Simple
 * 
 * LPG Types: 3kg, 5.5kg, 12kg, 50kg
 * Note: API uses kg3, kg5, kg12, kg50 (Prisma enum values)
 * 
 * Alur:
 * 1. Pilih LPG → 2. Jumlah → 3. Nama (opsional) → 4. Bayar → 5. Simpan
 */

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon'
import { consumerOrdersApi } from '@/lib/api'
import { toast } from 'sonner'

// value = Prisma enum value (untuk API), display = untuk tampilan
const LPG_OPTIONS = [
    { value: 'kg3', display: '3 kg', price: 20000, label: 'LPG 3 kg', color: 'bg-green-500' },
    { value: 'kg5', display: '5.5 kg', price: 60000, label: 'LPG 5.5 kg', color: 'bg-cyan-500' },
    { value: 'kg12', display: '12 kg', price: 180000, label: 'LPG 12 kg', color: 'bg-blue-500' },
    { value: 'kg50', display: '50 kg', price: 700000, label: 'LPG 50 kg', color: 'bg-red-500' },
]

export default function CatatPenjualanPage() {
    const [lpgType, setLpgType] = useState('kg3')  // Default to kg3 (Prisma enum)
    const [qty, setQty] = useState(1)
    const [buyerName, setBuyerName] = useState('')
    const [paymentStatus, setPaymentStatus] = useState<'LUNAS' | 'HUTANG'>('LUNAS')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const selectedLpg = LPG_OPTIONS.find(l => l.value === lpgType)!
    const total = qty * selectedLpg.price

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (qty < 1) {
            toast.error('Jumlah minimal 1')
            return
        }

        try {
            setIsSubmitting(true)
            await consumerOrdersApi.create({
                consumer_name: buyerName || 'Walk-in',
                lpg_type: lpgType as any,
                qty,
                price_per_unit: selectedLpg.price,
                payment_status: paymentStatus,
            })

            setShowSuccess(true)
            toast.success('Penjualan berhasil dicatat!')

            setTimeout(() => {
                setShowSuccess(false)
                setQty(1)
                setBuyerName('')
                setPaymentStatus('LUNAS')
            }, 2000)
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (showSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] p-6">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                        <SafeIcon name="Check" className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Berhasil!
                    </h2>
                    <p className="text-slate-500 mb-6">
                        {qty}x {selectedLpg.display} - {formatCurrency(total)}
                    </p>
                    <Button onClick={() => setShowSuccess(false)} className="bg-blue-600 hover:bg-blue-700">
                        <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
                        Catat Lagi
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Catat Penjualan
                    </h1>
                    <p className="text-slate-500">Catat transaksi penjualan LPG baru</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-6 space-y-6">
                            {/* Pilih LPG */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                                    Tipe LPG
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {LPG_OPTIONS.map((lpg) => (
                                        <button
                                            key={lpg.value}
                                            type="button"
                                            onClick={() => setLpgType(lpg.value)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${lpgType === lpg.value
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg ${lpg.color} flex items-center justify-center`}>
                                                    <SafeIcon name="Cylinder" className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white block">
                                                        {lpg.display}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {formatCurrency(lpg.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Jumlah */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                                    Jumlah
                                </Label>
                                <div className="flex items-center justify-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-12 h-12 rounded-full text-xl font-bold"
                                    >
                                        −
                                    </Button>
                                    <div className="text-center min-w-[80px]">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={qty}
                                            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                                            className="w-20 h-14 text-center text-3xl font-bold border-0 bg-transparent"
                                        />
                                        <span className="text-xs text-slate-500">tabung</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setQty(qty + 1)}
                                        className="w-12 h-12 rounded-full text-xl font-bold"
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {/* Nama Pembeli */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                    Nama Pembeli <span className="font-normal text-slate-400">(opsional)</span>
                                </Label>
                                <Input
                                    value={buyerName}
                                    onChange={(e) => setBuyerName(e.target.value)}
                                    placeholder="Kosongkan untuk walk-in"
                                    className="h-12"
                                />
                            </div>

                            {/* Status Bayar */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                                    Status Pembayaran
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentStatus('LUNAS')}
                                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentStatus === 'LUNAS'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                            : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        <SafeIcon name="CheckCircle" className={`h-5 w-5 ${paymentStatus === 'LUNAS' ? 'text-green-600' : 'text-slate-400'}`} />
                                        <span className={`font-semibold ${paymentStatus === 'LUNAS' ? 'text-green-700' : 'text-slate-600'}`}>
                                            Lunas
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentStatus('HUTANG')}
                                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentStatus === 'HUTANG'
                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30'
                                            : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        <SafeIcon name="Clock" className={`h-5 w-5 ${paymentStatus === 'HUTANG' ? 'text-orange-600' : 'text-slate-400'}`} />
                                        <span className={`font-semibold ${paymentStatus === 'HUTANG' ? 'text-orange-700' : 'text-slate-600'}`}>
                                            Hutang
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-center text-white">
                                <p className="text-blue-100 text-sm mb-1">Total</p>
                                <p className="text-4xl font-bold">{formatCurrency(total)}</p>
                                <p className="text-blue-200 text-sm mt-2">
                                    {qty} × {selectedLpg.label}
                                </p>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-semibold shadow-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <SafeIcon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <SafeIcon name="Save" className="mr-2 h-5 w-5" />
                                        Simpan Penjualan
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
