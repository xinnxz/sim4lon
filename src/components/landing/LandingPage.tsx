/**
 * LandingPage — Marketing page untuk SIM4LON
 * 
 * Sections:
 * 1. Hero — tagline + CTA
 * 2. Features — 6 fitur utama
 * 3. Pricing — 3 plan (FREE/BASIC/PRO)
 * 4. Testimonial — social proof
 * 5. CTA Final — daftar sekarang
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

const FEATURES = [
    {
        icon: 'ShoppingBag',
        title: 'Catat Penjualan',
        desc: 'Catat transaksi LPG dengan cepat. Pilih tipe, jumlah, dan konsumen dalam hitungan detik.',
        color: 'from-emerald-500 to-green-600',
    },
    {
        icon: 'Package',
        title: 'Kelola Stok Real-Time',
        desc: 'Pantau stok LPG secara real-time. Notifikasi otomatis saat stok menipis.',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        icon: 'Receipt',
        title: 'Nota Digital',
        desc: 'Kirim nota penjualan via WhatsApp, cetak thermal receipt, atau salin ke clipboard.',
        color: 'from-violet-500 to-purple-600',
    },
    {
        icon: 'BarChart3',
        title: 'Laporan & Analitik',
        desc: 'Ringkasan harian otomatis, grafik penjualan, dan export laporan bulanan.',
        color: 'from-amber-500 to-orange-600',
    },
    {
        icon: 'Users',
        title: 'Database Konsumen',
        desc: 'Kelola data konsumen lengkap dengan NIK/KK untuk verifikasi subsidi LPG 3kg.',
        color: 'from-rose-500 to-pink-600',
    },
    {
        icon: 'Smartphone',
        title: 'Akses dari HP',
        desc: 'Install di HP seperti aplikasi native. Bekerja di semua perangkat, kapan saja.',
        color: 'from-cyan-500 to-teal-600',
    },
]

const PRICING = [
    {
        name: 'Free',
        price: 'Gratis',
        originalPrice: '',
        discount: '',
        period: '14 hari trial',
        desc: 'Coba semua fitur tanpa biaya',
        features: ['Catat penjualan', 'Kelola stok', 'Nota digital', 'Max 50 transaksi/hari'],
        cta: 'Mulai Gratis',
        popular: false,
        badge: '',
        gradient: 'from-slate-500 to-slate-600',
    },
    {
        name: 'Basic',
        price: 'Rp 50.000',
        originalPrice: 'Rp 99.000',
        discount: 'HEMAT 49%',
        period: '/bulan',
        desc: 'Untuk pangkalan kecil-menengah',
        features: ['Semua fitur Free', 'Unlimited transaksi', 'Laporan bulanan', 'Export PDF/Excel', 'WhatsApp support'],
        cta: 'Pilih Basic',
        popular: true,
        badge: '⭐ Paling Populer',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        name: 'Pro',
        price: 'Rp 50.000',
        originalPrice: 'Rp 250.000',
        discount: 'HEMAT 80%',
        period: '/bulan',
        desc: 'Untuk pangkalan besar & multi-outlet',
        features: ['Semua fitur Basic', 'Multi-user access', 'API integration', 'Priority support', 'Custom branding'],
        cta: 'Pilih Pro',
        popular: false,
        badge: '🔥 Paling Hemat',
        gradient: 'from-violet-500 to-purple-600',
    },
]

const TESTIMONIALS = [
    {
        name: 'Pak Hendra',
        role: 'Pangkalan LPG Sejahtera',
        text: 'Sebelumnya catat pakai buku, sering salah hitung. Sejak pakai SIM4LON, semua rapi dan stok terpantau otomatis.',
        avatar: '👨‍💼',
    },
    {
        name: 'Bu Sari',
        role: 'Pangkalan LPG Berkah',
        text: 'Fitur nota WhatsApp sangat membantu. Konsumen senang dapat bukti pembelian langsung.',
        avatar: '👩‍💼',
    },
    {
        name: 'Mas Andi',
        role: 'Pangkalan LPG Mandiri',
        text: 'Bisa pantau penjualan dari HP kapan saja. Laporan bulanan tinggal export, tidak perlu hitung manual lagi.',
        avatar: '👨‍💻',
    },
]

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-white">
            {/* ===== NAVBAR ===== */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo-sim4lon-transparant-v2.png" alt="SIM4LON" className="w-9 h-9" />
                        <span className="font-bold text-lg text-slate-800">SIM4LON</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#fitur" className="text-sm text-slate-600 hover:text-blue-600 transition">Fitur</a>
                        <a href="#harga" className="text-sm text-slate-600 hover:text-blue-600 transition">Harga</a>
                        <a href="#testimoni" className="text-sm text-slate-600 hover:text-blue-600 transition">Testimoni</a>
                        <a href="/login" className="text-sm text-slate-600 hover:text-blue-600 transition">Login</a>
                        <a href="/register">
                            <Button size="sm" className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5">
                                Daftar Gratis
                            </Button>
                        </a>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                    >
                        <SafeIcon name={mobileMenuOpen ? 'X' : 'Menu'} className="h-5 w-5" />
                    </button>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden px-4 pb-4 space-y-2 border-t border-slate-100">
                        <a href="#fitur" className="block py-2 text-sm text-slate-600">Fitur</a>
                        <a href="#harga" className="block py-2 text-sm text-slate-600">Harga</a>
                        <a href="#testimoni" className="block py-2 text-sm text-slate-600">Testimoni</a>
                        <a href="/login" className="block py-2 text-sm text-slate-600">Login</a>
                        <a href="/register" className="block">
                            <Button size="sm" className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                Daftar Gratis
                            </Button>
                        </a>
                    </div>
                )}
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative overflow-hidden">
                {/* BG decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-6">
                        <SafeIcon name="Sparkles" className="h-3.5 w-3.5" />
                        Gratis 14 Hari — Tanpa Kartu Kredit
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
                        Kelola Pangkalan LPG
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Jadi Lebih Mudah
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Catat penjualan, kelola stok, kirim nota WhatsApp, dan pantau laporan keuangan — semua dari satu aplikasi.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a href="/register">
                            <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 h-12 text-base shadow-lg shadow-blue-500/25">
                                Daftar Gratis Sekarang
                                <SafeIcon name="ArrowRight" className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                        <a href="#fitur">
                            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-300">
                                Lihat Fitur
                                <SafeIcon name="ChevronDown" className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                        {[
                            { val: '500+', label: 'Pangkalan Aktif' },
                            { val: '50rb+', label: 'Transaksi/Bulan' },
                            { val: '4.9⭐', label: 'Rating Pengguna' },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="text-2xl md:text-3xl font-bold text-slate-800">{s.val}</div>
                                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="fitur" className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-4">
                            <SafeIcon name="Zap" className="h-3.5 w-3.5" />
                            Fitur Lengkap
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                            Semua yang Anda Butuhkan
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Dirancang khusus untuk kebutuhan pangkalan LPG di Indonesia
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="group relative p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <SafeIcon name={f.icon} className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="harga" className="py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium mb-4">
                            <SafeIcon name="CreditCard" className="h-3.5 w-3.5" />
                            Harga Terjangkau
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                            Mulai Dari Gratis
                        </h2>
                        <p className="text-slate-500">
                            Pilih plan yang sesuai kebutuhan pangkalan Anda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {PRICING.map((p) => (
                            <div
                                key={p.name}
                                className={`relative p-6 rounded-2xl border-2 transition-all ${p.popular
                                    ? 'border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02]'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {p.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium">
                                        {p.badge}
                                    </div>
                                )}
                                {!p.popular && p.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium">
                                        {p.badge}
                                    </div>
                                )}
                                <div className="text-center mb-6 pt-2">
                                    <h3 className="font-bold text-lg text-slate-800">{p.name}</h3>
                                    <div className="mt-3">
                                        {/* Harga coret (anchoring psychology) */}
                                        {p.originalPrice && (
                                            <div className="mb-1">
                                                <span className="text-sm text-slate-400 line-through">
                                                    {p.originalPrice}
                                                </span>
                                                {p.discount && (
                                                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                                                        {p.discount}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <span className="text-3xl font-extrabold text-slate-800">{p.price}</span>
                                        <span className="text-sm text-slate-400 ml-1">{p.period}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">{p.desc}</p>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {p.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                                            <SafeIcon name="Check" className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a href="/register">
                                    <Button
                                        className={`w-full rounded-xl h-11 ${p.popular
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                            : ''
                                            }`}
                                        variant={p.popular ? 'default' : 'outline'}
                                    >
                                        {p.cta}
                                    </Button>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section id="testimoni" className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium mb-4">
                            <SafeIcon name="MessageSquare" className="h-3.5 w-3.5" />
                            Testimoni
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                            Dipercaya Pangkalan Seluruh Indonesia
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t) => (
                            <div
                                key={t.name}
                                className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm"
                            >
                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <SafeIcon key={s} name="Star" className="h-4 w-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-slate-800">{t.name}</div>
                                        <div className="text-xs text-slate-400">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 md:p-16 text-center text-white">
                        {/* BG decoration  */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
                        </div>

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Siap Kelola Pangkalan Lebih Efisien?
                            </h2>
                            <p className="text-blue-100 max-w-xl mx-auto mb-8">
                                Daftar sekarang dan nikmati free trial 14 hari. Tanpa kartu kredit, langsung pakai.
                            </p>
                            <a href="/register">
                                <Button size="lg" className="rounded-full bg-white text-blue-600 hover:bg-blue-50 px-8 h-12 text-base font-bold shadow-lg">
                                    Daftar Gratis Sekarang
                                    <SafeIcon name="ArrowRight" className="h-5 w-5 ml-2" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-slate-100 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img src="/logo-sim4lon-transparant-v2.png" alt="SIM4LON" className="w-8 h-8" />
                            <span className="font-bold text-slate-700">SIM4LON</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} SIM4LON. Sistem Informasi Manajemen LPG.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="/login" className="text-sm text-slate-500 hover:text-blue-600 transition">Login</a>
                            <a href="/register" className="text-sm text-slate-500 hover:text-blue-600 transition">Daftar</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
