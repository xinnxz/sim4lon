/**
 * CatatPenjualanPage - Clean POS Form
 * 
 * Best Practice Layout:
 * - 2-column layout on desktop
 * - Submit button near Total for clear context
 * - Hold +/- for rapid quantity change
 * - Consumer autocomplete with NIK
 * - Prices fetched from database (configurable per pangkalan)
 */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { consumerOrdersApi, consumersApi, lpgPricesApi, type Consumer, type PangkalanLpgPrice } from '@/lib/api'
import { toast } from 'sonner'

// Static LPG display options (colors, display names)
const LPG_DISPLAY = [
    { value: '3kg', dbType: 'kg3', display: '3 kg', color: '#22C55E', bgClass: 'from-green-500 to-emerald-600', defaultPrice: 20000 },
    { value: '5kg', dbType: 'kg5', display: '5.5 kg', color: '#ff82c5', bgClass: 'from-pink-400 to-pink-600', defaultPrice: 60000 },
    { value: '12kg', dbType: 'kg12', display: '12 kg', color: '#3B82F6', bgClass: 'from-blue-500 to-indigo-600', defaultPrice: 180000 },
    { value: '50kg', dbType: 'kg50', display: '50 kg', color: '#ef0e0e', bgClass: 'from-red-500 to-red-600', defaultPrice: 700000 },
]

export default function CatatPenjualanPage() {
    const [lpgType, setLpgType] = useState('3kg')
    const [qty, setQty] = useState(1)
    const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null)
    const [consumerSearch, setConsumerSearch] = useState('')
    const [consumers, setConsumers] = useState<Consumer[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'LUNAS' | 'HUTANG'>('LUNAS')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [lpgPrices, setLpgPrices] = useState<PangkalanLpgPrice[]>([])

    const dropdownRef = useRef<HTMLDivElement>(null)
    const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Fetch LPG prices on mount
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const prices = await lpgPricesApi.getAll()
                setLpgPrices(prices)
            } catch (error) {
                console.error('Failed to fetch LPG prices:', error)
            }
        }
        fetchPrices()
    }, [])

    // Get price for current LPG type (from API or default)
    const getPrice = (type: string) => {
        const displayItem = LPG_DISPLAY.find(l => l.value === type)
        if (!displayItem) return 20000

        const priceFromDb = lpgPrices.find(p => p.lpg_type === displayItem.dbType)
        return priceFromDb ? Number(priceFromDb.selling_price) : displayItem.defaultPrice
    }

    // Check if LPG type is active
    const isLpgActive = (type: string) => {
        const displayItem = LPG_DISPLAY.find(l => l.value === type)
        if (!displayItem) return false
        const priceFromDb = lpgPrices.find(p => p.lpg_type === displayItem.dbType)
        return priceFromDb ? priceFromDb.is_active : true // Default active if not in DB
    }

    // Get active LPG types
    const activeLpgTypes = LPG_DISPLAY.filter(lpg => isLpgActive(lpg.value))

    // Auto-select first active type when prices load
    useEffect(() => {
        if (lpgPrices.length > 0 && activeLpgTypes.length > 0) {
            if (!isLpgActive(lpgType)) {
                setLpgType(activeLpgTypes[0].value)
            }
        }
    }, [lpgPrices])

    const selectedLpg = LPG_DISPLAY.find(l => l.value === lpgType)!
    const currentPrice = getPrice(lpgType)
    const total = qty * currentPrice

    const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)

    // Hold to increment/decrement
    const startHold = useCallback((action: 'inc' | 'dec') => {
        holdTimeoutRef.current = setTimeout(() => {
            holdIntervalRef.current = setInterval(() => {
                if (action === 'inc') setQty(prev => prev + 1)
                else setQty(prev => Math.max(1, prev - 1))
            }, 80)
        }, 300)
    }, [])

    const stopHold = useCallback(() => {
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    }, [])

    useEffect(() => () => stopHold(), [stopHold])

    // Fetch consumers
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setIsLoading(true)
                const res = await consumersApi.getAll(1, 10, consumerSearch || undefined)
                setConsumers(res.data)
            } catch (e) { console.error(e) }
            finally { setIsLoading(false) }
        }, 300)
        return () => clearTimeout(timer)
    }, [consumerSearch])

    // Close dropdown
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (qty < 1) return toast.error('Jumlah minimal 1')
        try {
            setIsSubmitting(true)
            await consumerOrdersApi.create({
                consumer_id: selectedConsumer?.id,
                consumer_name: selectedConsumer?.name || consumerSearch || 'Walk-in',
                lpg_type: lpgType as any,
                qty,
                price_per_unit: currentPrice, // Use dynamic price from API
                payment_status: paymentStatus,
            })
            setShowSuccess(true)
            toast.success('Penjualan berhasil!')
            setTimeout(() => {
                setShowSuccess(false)
                setQty(1)
                setSelectedConsumer(null)
                setConsumerSearch('')
            }, 2000)
        } catch (err: any) {
            toast.error(err.message || 'Gagal menyimpan')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Success State
    if (showSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                        <SafeIcon name="Check" className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold mb-1">Berhasil!</h2>
                    <p className="text-slate-500 mb-4">{qty}× {selectedLpg.display} = {formatCurrency(total)}</p>
                    <Button onClick={() => setShowSuccess(false)} className="rounded-xl">
                        <SafeIcon name="Plus" className="h-4 w-4 mr-1" /> Catat Lagi
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Catat Penjualan</h1>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => window.location.href = '/pangkalan/penjualan'}>
                    <SafeIcon name="History" className="h-4 w-4 mr-1" /> Riwayat
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Left: Product & Quantity */}
                    <Card className="shadow-lg border-0 rounded-2xl">
                        <CardContent className="p-5 space-y-5">
                            {/* LPG Type */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-3 block">Tipe LPG</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {activeLpgTypes.map((lpg) => (
                                        <button
                                            key={lpg.value}
                                            type="button"
                                            onClick={() => setLpgType(lpg.value)}
                                            className={`relative p-3 rounded-xl border-2 text-left transition-all ${lpgType === lpg.value
                                                ? 'border-transparent bg-gradient-to-br ' + lpg.bgClass + ' shadow-lg'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${lpgType === lpg.value ? 'bg-white/20' : ''}`}
                                                    style={{ backgroundColor: lpgType !== lpg.value ? lpg.color + '20' : undefined }}
                                                >
                                                    <SafeIcon name="Cylinder" className={`h-5 w-5 ${lpgType === lpg.value ? 'text-white' : ''}`}
                                                        style={{ color: lpgType !== lpg.value ? lpg.color : undefined }} />
                                                </div>
                                                <div>
                                                    <span className={`font-bold block ${lpgType === lpg.value ? 'text-white' : 'text-slate-900'}`}>{lpg.display}</span>
                                                    <span className={`text-xs ${lpgType === lpg.value ? 'text-white/80' : 'text-slate-500'}`}>{formatCurrency(getPrice(lpg.value))}</span>
                                                </div>
                                            </div>
                                            {lpgType === lpg.value && <SafeIcon name="Check" className="absolute top-2 right-2 h-4 w-4 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-3 block">Jumlah</Label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 text-lg font-bold rounded-xl"
                                        onClick={() => setQty(Math.max(0, qty - 1))}
                                        onMouseDown={() => startHold('dec')}
                                        onMouseUp={stopHold}
                                        onMouseLeave={stopHold}
                                        onTouchStart={() => startHold('dec')}
                                        onTouchEnd={stopHold}
                                        disabled={qty <= 0}
                                    >−</Button>
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={qty === 0 ? '' : qty.toString()}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/^0+/, '').replace(/\D/g, '')
                                            setQty(val === '' ? 0 : parseInt(val))
                                        }}
                                        placeholder="0"
                                        className="h-12 text-center font-bold text-xl flex-1 rounded-xl"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 text-lg font-bold rounded-xl"
                                        onClick={() => setQty(qty + 1)}
                                        onMouseDown={() => startHold('inc')}
                                        onMouseUp={stopHold}
                                        onMouseLeave={stopHold}
                                        onTouchStart={() => startHold('inc')}
                                        onTouchEnd={stopHold}
                                    >+</Button>
                                </div>
                            </div>

                            {/* Consumer Search */}
                            <div ref={dropdownRef} className="relative">
                                <Label className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                    Konsumen <Badge variant="secondary" className="text-xs ml-2">Opsional</Badge>
                                </Label>
                                <div className="relative">
                                    <SafeIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={consumerSearch}
                                        onChange={(e) => { setConsumerSearch(e.target.value); setSelectedConsumer(null); setShowDropdown(true) }}
                                        onFocus={() => setShowDropdown(true)}
                                        placeholder="Cari konsumen..."
                                        className="h-12 pl-10 rounded-xl"
                                    />
                                    {selectedConsumer && (
                                        <SafeIcon name="CheckCircle2" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                                    )}
                                </div>
                                {showDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-48 overflow-y-auto">
                                        {isLoading ? (
                                            <div className="p-4 text-center text-slate-500 text-sm">
                                                <SafeIcon name="Loader2" className="h-4 w-4 animate-spin inline mr-2" /> Memuat...
                                            </div>
                                        ) : consumers.length > 0 ? (
                                            consumers.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => { setSelectedConsumer(c); setConsumerSearch(c.name); setShowDropdown(false) }}
                                                    className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 border-b border-slate-100 last:border-0 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                        <SafeIcon name="User" className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate">{c.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {c.nik ? `NIK: ${c.nik}` : c.phone || 'Konsumen terdaftar'}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 text-sm">
                                                {consumerSearch ? `"${consumerSearch}" = Walk-in` : 'Ketik untuk mencari...'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Payment & Summary */}
                    <Card className="shadow-lg border-0 rounded-2xl">
                        <CardContent className="p-5 space-y-5">
                            {/* Payment Status */}
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-3 block">Status Pembayaran</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentStatus('LUNAS')}
                                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentStatus === 'LUNAS'
                                            ? 'border-green-500 bg-green-50 shadow-md'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <SafeIcon name="CheckCircle" className={`h-5 w-5 ${paymentStatus === 'LUNAS' ? 'text-green-600' : 'text-slate-400'}`} />
                                        <span className={`font-semibold ${paymentStatus === 'LUNAS' ? 'text-green-700' : 'text-slate-600'}`}>Lunas</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentStatus('HUTANG')}
                                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentStatus === 'HUTANG'
                                            ? 'border-orange-500 bg-orange-50 shadow-md'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <SafeIcon name="Clock" className={`h-5 w-5 ${paymentStatus === 'HUTANG' ? 'text-orange-600' : 'text-slate-400'}`} />
                                        <span className={`font-semibold ${paymentStatus === 'HUTANG' ? 'text-orange-700' : 'text-slate-600'}`}>Hutang</span>
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-center text-white shadow-lg">
                                <p className="text-blue-200 text-sm font-medium">Total Pembayaran</p>
                                <p className="text-4xl font-bold my-2">{formatCurrency(total)}</p>
                                <p className="text-blue-200 text-sm">{qty} × {selectedLpg.display} @ {formatCurrency(currentPrice)}</p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting || qty < 1}
                                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <><SafeIcon name="Loader2" className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...</>
                                ) : (
                                    <><SafeIcon name="Save" className="mr-2 h-5 w-5" /> Simpan Penjualan</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}
