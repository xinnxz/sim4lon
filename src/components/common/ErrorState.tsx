/**
 * ErrorState - Reusable Error State Component
 * 
 * Menampilkan pesan error yang informatif + tombol "Coba Lagi"
 * sehingga user tidak buntu ketika terjadi error.
 * 
 * @example
 * {error && <ErrorState message={error} onRetry={fetchData} />}
 */

'use client'

import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface ErrorStateProps {
    /** Pesan error utama */
    message?: string
    /** Detail tambahan (opsional) */
    detail?: string
    /** Callback saat tombol "Coba Lagi" ditekan */
    onRetry?: () => void
    /** Icon name dari lucide-react */
    icon?: string
    /** Ukuran: compact (inline), full (full page) */
    size?: 'compact' | 'full'
}

export default function ErrorState({
    message = 'Terjadi kesalahan saat memuat data',
    detail,
    onRetry,
    icon = 'AlertCircle',
    size = 'full',
}: ErrorStateProps) {
    if (size === 'compact') {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <SafeIcon name={icon} className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-800">{message}</p>
                    {detail && <p className="text-xs text-red-600 mt-0.5">{detail}</p>}
                </div>
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="shrink-0 border-red-200 text-red-700 hover:bg-red-100 rounded-lg"
                    >
                        <SafeIcon name="RefreshCw" className="h-3.5 w-3.5 mr-1" />
                        Retry
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md mx-auto px-4">
                {/* Animated icon */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-20" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                        <SafeIcon name={icon} className="h-10 w-10 text-red-500" />
                    </div>
                </div>

                {/* Message */}
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{message}</h3>
                {detail && (
                    <p className="text-sm text-slate-500 mb-6">{detail}</p>
                )}
                {!detail && (
                    <p className="text-sm text-slate-500 mb-6">
                        Periksa koneksi internet Anda dan coba lagi.
                    </p>
                )}

                {/* Retry button */}
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                    >
                        <SafeIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                        Coba Lagi
                    </Button>
                )}
            </div>
        </div>
    )
}
