/**
 * SubscriptionPage — Kelola Langganan SIM4LON
 * 
 * Menampilkan status langganan saat ini, plan yang tersedia,
 * dan tombol upgrade/downgrade. Payment gateway integration
 * (Midtrans/Xendit) bisa ditambahkan di masa depan.
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi } from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import { toast } from 'sonner'

interface SubscriptionInfo {
    plan: string
    status: string
    expires_at: string | null
}

const PLANS = [
    {
        id: 'FREE',
        name: 'Free',
        price: 0,
        originalPrice: 0,
        discount: '',
        period: 'Selamanya',
        desc: 'Fitur dasar untuk memulai',
        popular: false,
        features: [
            'Catat penjualan',
            'Kelola stok',
            'Nota digital',
            'Max 50 transaksi/hari',
        ],
        gradient: 'from-slate-500 to-slate-600',
        borderColor: 'border-slate-200',
    },
    {
        id: 'BASIC',
        name: 'Basic',
        price: 50000,
        originalPrice: 99000,
        discount: 'HEMAT 49%',
        period: '/bulan',
        desc: 'Untuk pangkalan kecil-menengah',
        popular: true,
        features: [
            'Unlimited transaksi',
            'Laporan bulanan',
            'Export PDF/Excel',
            'WhatsApp support',
            'Database konsumen',
        ],
        gradient: 'from-blue-500 to-indigo-600',
        borderColor: 'border-blue-500',
    },
    {
        id: 'PRO',
        name: 'Pro',
        price: 100000,
        originalPrice: 250000,
        discount: 'HEMAT 60%',
        period: '/bulan',
        desc: 'Untuk pangkalan besar & multi-cabang',
        popular: false,
        features: [
            'Semua fitur Basic',
            'Multi-user access',
            'API integration',
            'Priority support',
            'Custom branding',
        ],
        gradient: 'from-violet-500 to-purple-600',
        borderColor: 'border-violet-500',
        badge: '🔥 Paling Hemat',
    },
]

export default function SubscriptionPage() {
    const [currentPlan, setCurrentPlan] = useState<SubscriptionInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadSubscription()
    }, [])

    const loadSubscription = async () => {
        try {
            const profile = await authApi.getProfile()
            // Subscription info from profile (mock for now, will come from API)
            setCurrentPlan({
                plan: 'FREE',
                status: 'TRIAL',
                expires_at: null,
            })
        } catch {
            // Default to free
            setCurrentPlan({
                plan: 'FREE',
                status: 'TRIAL',
                expires_at: null,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectPlan = (planId: string) => {
        if (planId === 'FREE') return

        // TODO: Integrate with Midtrans/Xendit payment gateway
        // For now, show coming soon message
        toast.info(
            `Pembayaran untuk plan ${planId} akan segera tersedia! Hubungi admin untuk upgrade manual.`,
            { duration: 5000 }
        )
    }

    const getTrialDaysLeft = () => {
        if (!currentPlan?.expires_at) return null
        const exp = new Date(currentPlan.expires_at)
        const now = new Date()
        const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return Math.max(0, diff)
    }

    const trialDays = getTrialDaysLeft()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Current Plan Status */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Langganan</h1>
                <p className="text-slate-500">Kelola paket langganan SIM4LON Anda</p>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-200 text-sm">Paket Saat Ini</p>
                        <h2 className="text-2xl font-bold mt-1">
                            {currentPlan?.plan || 'FREE'}
                            {currentPlan?.status === 'TRIAL' && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-medium">
                                    TRIAL
                                </span>
                            )}
                        </h2>
                        {trialDays !== null && trialDays > 0 && (
                            <p className="text-blue-200 text-sm mt-1">
                                Trial berakhir dalam {trialDays} hari
                            </p>
                        )}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                        <SafeIcon name="Crown" className="h-7 w-7 text-white" />
                    </div>
                </div>
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {PLANS.map((plan) => {
                    const isCurrent = plan.id === (currentPlan?.plan || 'FREE')

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl border-2 p-5 transition-all ${isCurrent
                                ? `${plan.borderColor} shadow-lg`
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {isCurrent && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r ${plan.gradient} text-white text-xs font-medium`}>
                                    Paket Anda
                                </div>
                            )}
                            {!isCurrent && plan.popular && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r ${plan.gradient} text-white text-xs font-medium`}>
                                    ⭐ Populer
                                </div>
                            )}
                            {!isCurrent && (plan as any).badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium">
                                    {(plan as any).badge}
                                </div>
                            )}

                            <div className="text-center mb-4 pt-2">
                                <h3 className="font-bold text-slate-800">{plan.name}</h3>
                                <div className="mt-2">
                                    {/* Harga coret (anchoring) */}
                                    {plan.originalPrice > 0 && (
                                        <div className="mb-1">
                                            <span className="text-sm text-slate-400 line-through">
                                                {formatCurrency(plan.originalPrice)}
                                            </span>
                                            {plan.discount && (
                                                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                                                    {plan.discount}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <span className="text-2xl font-extrabold text-slate-800">
                                        {plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}
                                    </span>
                                    {plan.price > 0 && (
                                        <span className="text-sm text-slate-400 ml-1">{plan.period}</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                            </div>

                            <ul className="space-y-2 mb-5">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                                        <SafeIcon name="Check" className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full rounded-xl h-10 ${isCurrent ? 'opacity-50' : ''
                                    } ${plan.id !== 'FREE' && !isCurrent ? `bg-gradient-to-r ${plan.gradient} text-white` : ''}`}
                                variant={plan.id === 'FREE' || isCurrent ? 'outline' : 'default'}
                                disabled={isCurrent}
                                onClick={() => handleSelectPlan(plan.id)}
                            >
                                {isCurrent ? 'Paket Aktif' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                            </Button>
                        </div>
                    )
                })}
            </div>

            {/* FAQ / Note */}
            <div className="mt-8 p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                    <SafeIcon name="HelpCircle" className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-medium text-amber-800 mb-1">Butuh Bantuan?</h3>
                        <p className="text-sm text-amber-700">
                            Untuk upgrade paket atau pertanyaan tentang billing, hubungi admin melalui WhatsApp.
                            Kami juga menerima pembayaran via transfer bank.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
