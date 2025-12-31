/**
 * FloatingVoiceWidget - Google-style Voice Order Widget
 * 
 * Clean, simple, professional design:
 * - Blue color scheme (Google style)
 * - Minimal header (no indicator bar/icon)
 * - Simple result display
 */

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { useVoiceOrder } from '@/hooks/useVoiceOrder'
import { formatCurrency } from '@/lib/currency'

export default function FloatingVoiceWidget() {
    const [isOpen, setIsOpen] = useState(false)

    const {
        status,
        transcript,
        parseResult,
        error,
        missingInfoPrompt,
        isSupported,
        startListening,
        stopAndParse,
        cancel,
        confirmAndCreate,
        continueWithInfo
    } = useVoiceOrder()

    if (!isSupported) return null

    const handleFloatingClick = () => {
        setIsOpen(true)
        if (status === 'idle') startListening()
    }

    const handleClose = () => {
        cancel()
        setIsOpen(false)
    }

    const handleStopAndParse = useCallback(async () => {
        await stopAndParse()
    }, [stopAndParse])

    const handleConfirm = useCallback(async () => {
        await confirmAndCreate()
    }, [confirmAndCreate])

    // Enter key handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isOpen) {
                e.preventDefault()
                if (status === 'idle') startListening()
                else if (status === 'listening') handleStopAndParse()
                else if (status === 'confirming') handleConfirm()
                else if (status === 'needsInfo') continueWithInfo()
                else if (status === 'error') startListening()
                else if (status === 'success') handleClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, status, handleStopAndParse, handleConfirm, continueWithInfo, startListening])

    const totalAmount = parseResult?.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
    ) || 0

    if (!isOpen) {
        return (
            <button
                onClick={handleFloatingClick}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Pesan dengan Suara"
            >
                <SafeIcon name="Mic" className="h-6 w-6 text-white" />
            </button>
        )
    }

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal Container - clicking here also closes */}
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={handleClose}>
                {/* Modal Content - stop propagation so clicking inside doesn't close */}
                <div
                    className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Simple Header - Text only */}
                    <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
                        <div>
                            <h2 className="font-semibold text-zinc-900 dark:text-white">
                                {status === 'idle' && 'Pesan dengan Suara'}
                                {status === 'listening' && 'Mendengarkan...'}
                                {status === 'parsing' && 'Memproses...'}
                                {status === 'needsInfo' && 'Info Diperlukan'}
                                {status === 'confirming' && 'Konfirmasi Pesanan'}
                                {status === 'creating' && 'Membuat Pesanan...'}
                                {status === 'success' && 'Berhasil!'}
                                {status === 'error' && 'Gagal'}
                            </h2>
                            <p className="text-xs text-zinc-500">
                                {status === 'listening' && '↵ Enter untuk selesai'}
                                {status === 'confirming' && '↵ Enter untuk konfirmasi'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <SafeIcon name="X" className="h-4 w-4 text-zinc-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 max-h-[60vh] overflow-y-auto">
                        {/* Listening - Google style blue circles */}
                        {status === 'listening' && (
                            <div className="text-center py-6 space-y-5">
                                {/* Blue Pulsing Circles */}
                                <div className="relative w-28 h-28 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900 animate-ping opacity-50" />
                                    <div className="absolute inset-4 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-ping opacity-40" style={{ animationDelay: '0.2s' }} />
                                    <div className="absolute inset-8 rounded-full border-4 border-blue-300 dark:border-blue-700 animate-ping opacity-30" style={{ animationDelay: '0.4s' }} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <SafeIcon name="Mic" className="h-7 w-7 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Live Transcript */}
                                <div className="min-h-[50px] px-4">
                                    <p className={`text-lg ${transcript ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 italic'}`}>
                                        {transcript || 'Bicara sekarang...'}
                                    </p>
                                </div>

                                {/* Example Tips */}
                                <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">💡 Contoh perintah:</p>
                                    <p className="text-xs text-zinc-500">"Pesan 50 unit 3 kilo ke pangkalan Reon"</p>
                                </div>
                            </div>
                        )}

                        {/* Processing */}
                        {(status === 'parsing' || status === 'creating') && (
                            <div className="py-8 text-center">
                                <div className="relative w-16 h-16 mx-auto mb-4">
                                    <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700" />
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
                                </div>
                                <p className="text-zinc-600 dark:text-zinc-300">
                                    {status === 'parsing' ? 'AI menganalisis...' : 'Membuat pesanan...'}
                                </p>
                            </div>
                        )}

                        {/* Confirming - Simple modern cards */}
                        {parseResult && status === 'confirming' && (
                            <div className="space-y-4">
                                {/* Transcript - compact */}
                                {transcript && (
                                    <p className="text-sm text-zinc-500 italic">"{transcript}"</p>
                                )}

                                {/* Pangkalan - simple */}
                                {parseResult.pangkalanName && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                            <SafeIcon name="MapPin" className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">Tujuan</p>
                                            <p className="font-semibold text-zinc-900 dark:text-white">{parseResult.pangkalanName}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Items - minimal */}
                                {parseResult.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold">
                                                {item.quantity}
                                            </span>
                                            <span className="text-zinc-900 dark:text-white">{item.productName}</span>
                                        </div>
                                        <span className="font-medium text-zinc-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}

                                {/* Total - clean */}
                                <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-700">
                                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Total</span>
                                    <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
                                </div>

                                {/* Confidence badge - subtle */}
                                <div className="flex justify-end">
                                    <Badge variant="secondary" className="text-xs font-normal">
                                        {Math.round(parseResult.confidence * 100)}% akurat
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Needs Info */}
                        {status === 'needsInfo' && missingInfoPrompt && (
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                                <p className="text-amber-800 dark:text-amber-200">{missingInfoPrompt}</p>
                            </div>
                        )}

                        {/* Error */}
                        {status === 'error' && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                                {parseResult?.validation && !parseResult.validation.isValid ? (
                                    <div className="space-y-2">
                                        {parseResult.validation.issues.map((issue, i) => (
                                            <div key={i}>
                                                <p className="text-sm text-red-600 dark:text-red-400">{issue.message}</p>
                                                {issue.suggestion && (
                                                    <p className="text-xs text-zinc-500 mt-1">💡 {issue.suggestion}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-red-600 dark:text-red-400">{error}</p>
                                )}
                            </div>
                        )}

                        {/* Success */}
                        {status === 'success' && (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                                    <SafeIcon name="Check" className="h-8 w-8 text-white" />
                                </div>
                                <p className="font-semibold text-green-600">Pesanan Dibuat!</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800">
                        {(status === 'idle' || status === 'error') && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl h-11">
                                    Batal
                                </Button>
                                <Button onClick={startListening} className="flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600">
                                    <SafeIcon name="Mic" className="h-4 w-4" />
                                    Mulai
                                </Button>
                            </div>
                        )}

                        {status === 'listening' && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl h-11 cursor-pointer">
                                    Batal
                                </Button>
                                <Button onClick={handleStopAndParse} className="flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer">
                                    <SafeIcon name="StopCircle" className="h-4 w-4" />
                                    Selesai
                                </Button>
                            </div>
                        )}

                        {status === 'needsInfo' && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl h-11">Batal</Button>
                                <Button onClick={continueWithInfo} className="flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600">
                                    <SafeIcon name="Mic" className="h-4 w-4" />
                                    Lanjut
                                </Button>
                            </div>
                        )}

                        {status === 'confirming' && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => { cancel(); startListening(); }} className="flex-1 rounded-xl h-11 gap-2">
                                    <SafeIcon name="RotateCcw" className="h-4 w-4" />
                                    Ulangi
                                </Button>
                                <Button onClick={handleConfirm} className="flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600">
                                    <SafeIcon name="Check" className="h-4 w-4" />
                                    Konfirmasi
                                </Button>
                            </div>
                        )}

                        {(status === 'parsing' || status === 'creating') && (
                            <Button disabled className="w-full rounded-xl h-11 gap-2">
                                <SafeIcon name="Loader2" className="h-4 w-4 animate-spin" />
                                Memproses...
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
