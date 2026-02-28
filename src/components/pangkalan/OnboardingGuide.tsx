/**
 * OnboardingGuide - Tutorial Interaktif untuk User Baru
 * 
 * Menampilkan step-by-step guide saat user pertama kali login.
 * Tersimpan di localStorage sehingga hanya tampil sekali.
 * 
 * Bisa dipanggil ulang dari menu Profil.
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon'

const ONBOARDING_KEY = 'sim4lon_onboarding_done'

interface OnboardingStep {
    icon: string
    title: string
    description: string
    color: string
    gradient: string
}

const STEPS: OnboardingStep[] = [
    {
        icon: 'Sparkles',
        title: 'Selamat Datang di SIM4LON! 🎉',
        description: 'Aplikasi manajemen penjualan LPG yang membantu Anda mencatat penjualan, kelola stok, dan pantau keuangan dengan mudah.',
        color: 'text-blue-600',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        icon: 'ShoppingBag',
        title: 'Catat Penjualan',
        description: 'Klik tombol "Jual" di menu bawah untuk mencatat penjualan. Pilih tipe LPG, jumlah tabung, dan konsumen. Setelah simpan, Anda bisa kirim nota via WhatsApp.',
        color: 'text-emerald-600',
        gradient: 'from-emerald-500 to-green-600',
    },
    {
        icon: 'Package',
        title: 'Kelola Stok',
        description: 'Pantau stok LPG real-time di halaman Stok. Anda akan mendapat notifikasi saat stok menipis. Pesan ke agen langsung dari dashboard.',
        color: 'text-amber-600',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        icon: 'Users',
        title: 'Data Konsumen',
        description: 'Daftarkan konsumen dengan NIK dan KK untuk penjualan LPG 3kg bersubsidi. Lihat riwayat pembelian setiap konsumen.',
        color: 'text-violet-600',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        icon: 'BarChart3',
        title: 'Laporan & Ringkasan',
        description: 'Lihat ringkasan harian, grafik penjualan, dan laporan keuangan. Export laporan untuk pelaporan ke agen atau pemerintah.',
        color: 'text-rose-600',
        gradient: 'from-rose-500 to-pink-600',
    },
    {
        icon: 'Smartphone',
        title: 'Install di HP Anda 📱',
        description: 'Tambahkan SIM4LON ke layar utama HP Anda! Klik menu browser → "Add to Home Screen" / "Tambahkan ke Layar Utama" untuk akses cepat.',
        color: 'text-cyan-600',
        gradient: 'from-cyan-500 to-teal-600',
    },
]

interface OnboardingGuideProps {
    /** Force open (from settings/profile) */
    forceOpen?: boolean
    /** Callback on close */
    onClose?: () => void
}

export default function OnboardingGuide({ forceOpen = false, onClose }: OnboardingGuideProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (forceOpen) {
            setIsOpen(true)
            setCurrentStep(0)
            return
        }

        // Check if onboarding has been completed
        const done = localStorage.getItem(ONBOARDING_KEY)
        if (!done) {
            // Small delay to not compete with page load
            const timer = setTimeout(() => setIsOpen(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [forceOpen])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleFinish()
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleFinish = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true')
        setIsOpen(false)
        onClose?.()
    }

    const handleSkip = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true')
        setIsOpen(false)
        onClose?.()
    }

    const step = STEPS[currentStep]
    const isLast = currentStep === STEPS.length - 1
    const progress = ((currentStep + 1) / STEPS.length) * 100

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && handleSkip()}>
            <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
                {/* Progress Bar */}
                <div className="h-1 bg-slate-100">
                    <div
                        className={`h-full bg-gradient-to-r ${step.gradient} transition-all duration-500 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="px-6 py-8 text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg transition-all duration-300`}>
                        <SafeIcon name={step.icon} className="h-10 w-10 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-800 mb-3">
                        {step.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                        {step.description}
                    </p>

                    {/* Step Dots */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {STEPS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`transition-all duration-300 rounded-full ${i === currentStep
                                        ? `w-8 h-2 bg-gradient-to-r ${step.gradient}`
                                        : i < currentStep
                                            ? 'w-2 h-2 bg-slate-400'
                                            : 'w-2 h-2 bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 pb-6 pt-0 flex flex-row items-center justify-between gap-2">
                    {currentStep > 0 ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrev}
                            className="rounded-xl text-slate-500"
                        >
                            <SafeIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
                            Kembali
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            className="rounded-xl text-slate-400"
                        >
                            Lewati
                        </Button>
                    )}

                    <Button
                        onClick={handleNext}
                        className={`rounded-xl bg-gradient-to-r ${step.gradient} text-white shadow-lg px-6`}
                    >
                        {isLast ? (
                            <>
                                Mulai! <SafeIcon name="Rocket" className="h-4 w-4 ml-1" />
                            </>
                        ) : (
                            <>
                                Lanjut <SafeIcon name="ChevronRight" className="h-4 w-4 ml-1" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

/** 
 * Export fungsi untuk reset onboarding (dipanggil dari settings/profil)
 */
export function resetOnboarding() {
    localStorage.removeItem(ONBOARDING_KEY)
}
