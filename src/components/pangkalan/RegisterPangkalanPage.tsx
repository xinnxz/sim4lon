/**
 * RegisterPangkalanPage — Halaman Registrasi Pangkalan Baru
 * 
 * Form multi-step untuk self-registration:
 * Step 1: Data Pemilik (nama, email, HP, password)
 * Step 2: Data Pangkalan (nama pangkalan, alamat, wilayah)
 * 
 * Setelah berhasil: auto-login → redirect ke dashboard
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi } from '@/lib/api'
import { toast } from 'sonner'

export default function RegisterPangkalanPage() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        owner_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        pangkalan_name: '',
        address: '',
        region: '',
    })

    const updateForm = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const validateStep1 = () => {
        if (!form.owner_name.trim()) return 'Nama pemilik wajib diisi'
        if (!form.email.trim()) return 'Email wajib diisi'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Format email tidak valid'
        if (form.password.length < 6) return 'Password minimal 6 karakter'
        if (form.password !== form.confirmPassword) return 'Konfirmasi password tidak cocok'
        return null
    }

    const validateStep2 = () => {
        if (!form.pangkalan_name.trim()) return 'Nama pangkalan wajib diisi'
        if (!form.address.trim()) return 'Alamat wajib diisi'
        return null
    }

    const handleNext = () => {
        const error = validateStep1()
        if (error) {
            toast.error(error)
            return
        }
        setStep(2)
    }

    const handleSubmit = async () => {
        const error = validateStep2()
        if (error) {
            toast.error(error)
            return
        }

        setIsLoading(true)
        try {
            const response = await authApi.registerPangkalan({
                owner_name: form.owner_name,
                email: form.email,
                phone: form.phone || undefined,
                password: form.password,
                pangkalan_name: form.pangkalan_name,
                address: form.address,
                region: form.region || undefined,
            })

            toast.success(response.message)

            // Redirect to dashboard after successful registration
            setTimeout(() => {
                window.location.href = '/pangkalan/dashboard'
            }, 1500)
        } catch (err: any) {
            toast.error(err?.message || 'Registrasi gagal. Coba lagi.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full py-8">
            <div className="w-full max-w-md mx-auto">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/logo-sim4lon-transparant-v3.png"
                        alt="SIM4LON"
                        className="w-20 h-20 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-slate-800">Daftar Pangkalan</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Mulai kelola penjualan LPG Anda dengan SIM4LON
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                    {/* Step Indicator */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${step === 1 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            <SafeIcon name={step === 1 ? 'User' : 'Check'} className="h-3.5 w-3.5" />
                            Data Pemilik
                        </div>
                        <div className="flex-1 h-px bg-slate-200" />
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${step === 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                            <SafeIcon name="Store" className="h-3.5 w-3.5" />
                            Data Pangkalan
                        </div>
                    </div>

                    {/* Step 1: Data Pemilik */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="owner_name" className="text-sm font-medium text-slate-700">
                                    Nama Lengkap Pemilik <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="owner_name"
                                    placeholder="Contoh: Budi Santoso"
                                    value={form.owner_name}
                                    onChange={(e) => updateForm('owner_name', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@contoh.com"
                                    value={form.email}
                                    onChange={(e) => updateForm('email', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                    No. HP (WhatsApp)
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="08123456789"
                                    value={form.phone}
                                    onChange={(e) => updateForm('phone', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimal 6 karakter"
                                    value={form.password}
                                    onChange={(e) => updateForm('password', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                                    Konfirmasi Password <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Ketik ulang password"
                                    value={form.confirmPassword}
                                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            <Button
                                onClick={handleNext}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg h-11 mt-2"
                            >
                                Lanjut
                                <SafeIcon name="ChevronRight" className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Data Pangkalan */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="pangkalan_name" className="text-sm font-medium text-slate-700">
                                    Nama Pangkalan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="pangkalan_name"
                                    placeholder="Contoh: Pangkalan LPG Sejahtera"
                                    value={form.pangkalan_name}
                                    onChange={(e) => updateForm('pangkalan_name', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                                    Alamat Lengkap <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="Jl. Merpati No. 12, Kota XYZ"
                                    value={form.address}
                                    onChange={(e) => updateForm('address', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="region" className="text-sm font-medium text-slate-700">
                                    Wilayah/Region
                                </Label>
                                <Input
                                    id="region"
                                    placeholder="Contoh: Jawa Barat"
                                    value={form.region}
                                    onChange={(e) => updateForm('region', e.target.value)}
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>

                            {/* Trial info */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <SafeIcon name="Gift" className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-amber-800">Free Trial 14 Hari!</p>
                                        <p className="text-amber-600 text-xs mt-0.5">
                                            Akses semua fitur tanpa biaya selama 14 hari.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1 rounded-xl h-11"
                                >
                                    <SafeIcon name="ChevronLeft" className="h-4 w-4 mr-1" />
                                    Kembali
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg h-11"
                                >
                                    {isLoading ? (
                                        <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            Daftar
                                            <SafeIcon name="Rocket" className="h-4 w-4 ml-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Sudah punya akun?{' '}
                    <a href="/login" className="text-blue-600 font-medium hover:underline">
                        Login disini
                    </a>
                </p>
            </div>
        </div>
    )
}
