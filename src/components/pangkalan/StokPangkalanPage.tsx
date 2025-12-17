/**
 * StokPangkalanPage - Halaman Stok LPG untuk Pangkalan
 * 
 * Menampilkan informasi stok LPG yang tersedia di pangkalan
 * (Data dari allocations/orders yang sudah diterima)
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi, type UserProfile } from '@/lib/api'

// Stok per tipe LPG (akan diganti dengan data real)
interface StokLPG {
    type: string
    label: string
    qty: number
    color: string
}

const MOCK_STOK: StokLPG[] = [
    { type: '3kg', label: 'LPG 3 kg', qty: 150, color: 'bg-green-500' },
    { type: '5.5kg', label: 'LPG 5.5 kg', qty: 30, color: 'bg-cyan-500' },
    { type: '12kg', label: 'LPG 12 kg', qty: 45, color: 'bg-blue-500' },
    { type: '50kg', label: 'LPG 50 kg', qty: 12, color: 'bg-orange-500' },
]

export default function StokPangkalanPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stokList, setStokList] = useState<StokLPG[]>(MOCK_STOK)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await authApi.getProfile()
                setProfile(profileData)
                // TODO: Fetch real stock data from API
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const getTotalStok = () => stokList.reduce((sum, s) => sum + s.qty, 0)

    const getStokStatus = (qty: number) => {
        if (qty <= 10) return { label: 'Kritis', color: 'text-red-600 bg-red-100' }
        if (qty <= 30) return { label: 'Rendah', color: 'text-orange-600 bg-orange-100' }
        return { label: 'Aman', color: 'text-green-600 bg-green-100' }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stok LPG</h1>
                <p className="text-slate-500">Pantau ketersediaan stok LPG di pangkalan</p>
            </div>

            {/* Total Stok Card */}
            <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Total Stok</p>
                            <p className="text-4xl font-bold">{getTotalStok()} tabung</p>
                            <p className="text-blue-100 text-sm mt-2">
                                Dari 4 tipe LPG
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <SafeIcon name="Package" className="h-8 w-8" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stok per Tipe */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stokList.map((stok) => {
                    const status = getStokStatus(stok.qty)
                    return (
                        <Card key={stok.type} className="shadow-lg">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-lg ${stok.color} flex items-center justify-center`}>
                                        <SafeIcon name="Cylinder" className="h-6 w-6 text-white" />
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500 mb-1">{stok.label}</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {stok.qty}
                                    <span className="text-sm font-normal text-slate-500 ml-1">tabung</span>
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Info */}
            <Card className="mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <SafeIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Catatan:</strong> Data stok saat ini adalah estimasi berdasarkan alokasi dan penjualan.
                                Pastikan untuk melakukan stock opname secara berkala.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
