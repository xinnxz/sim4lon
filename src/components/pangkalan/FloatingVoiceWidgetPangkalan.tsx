/**
 * FloatingVoiceWidgetPangkalan - Smart Voice Widget untuk Portal Pangkalan
 * 
 * FITUR:
 * - Speech-to-text untuk input penjualan cepat
 * - SMART MATCHING: Cocokkan nama yang diucapkan dengan konsumen existing
 * - Support "Konsumen Umum/Random" untuk pembeli tidak terdaftar
 * - Auto-save ke API consumer-orders
 * 
 * CONTOH PERINTAH:
 * - "Jual 10 tabung 3kg ke Warung Berkah"
 * - "Jual 5 tabung ke Pak Budi" 
 * - "Jual 3 tabung ke orang random"
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { consumersApi, consumerOrdersApi, type Consumer, type LpgType } from '@/lib/api'

type Status = 'idle' | 'listening' | 'processing' | 'confirming' | 'saving' | 'success' | 'error'

interface ParsedSale {
    consumerId: string | null
    consumerName: string
    consumerMatch: Consumer | null  // Matched consumer from DB
    isNewConsumer: boolean          // True if consumer not found in DB
    quantity: number
    lpgType: LpgType
    productLabel: string
    pricePerUnit: number
}

// Default prices per LPG type
const LPG_PRICES: Record<LpgType, number> = {
    '3kg': 18000,
    '5kg': 85000,
    '12kg': 185000,
    '50kg': 650000,
}

const LPG_LABELS: Record<LpgType, string> = {
    '3kg': 'LPG 3 kg',
    '5kg': 'LPG 5 kg',
    '12kg': 'LPG 12 kg',
    '50kg': 'LPG 50 kg',
}

// Simple fuzzy matching function
function fuzzyMatch(text: string, target: string): number {
    const t = text.toLowerCase().trim()
    const tar = target.toLowerCase().trim()

    // Exact match
    if (t === tar) return 1.0

    // Contains match
    if (tar.includes(t) || t.includes(tar)) return 0.8

    // Word-based match
    const tWords = t.split(/\s+/)
    const tarWords = tar.split(/\s+/)
    let matchedWords = 0
    for (const tw of tWords) {
        if (tarWords.some(tarW => tarW.includes(tw) || tw.includes(tarW))) {
            matchedWords++
        }
    }
    if (tWords.length > 0) {
        return (matchedWords / tWords.length) * 0.6
    }

    return 0
}

// Honorifics to strip from names
const HONORIFICS = ['pak', 'bu', 'bapak', 'ibu', 'mas', 'mbak', 'bang', 'kak', 'om', 'tante', 'oom']

// Strip honorifics from name
function stripHonorifics(name: string): string {
    let cleaned = name.trim()
    const lower = cleaned.toLowerCase()

    // Remove leading honorific
    for (const h of HONORIFICS) {
        if (lower.startsWith(h + ' ')) {
            cleaned = cleaned.slice(h.length + 1).trim()
            break
        }
    }

    // Capitalize first letter
    if (cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    }

    return cleaned
}

export default function FloatingVoiceWidgetPangkalan() {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState<Status>('idle')
    const [transcript, setTranscript] = useState('')
    const [parsedSale, setParsedSale] = useState<ParsedSale | null>(null)
    const [error, setError] = useState('')
    const [consumers, setConsumers] = useState<Consumer[]>([])
    const [isLoadingConsumers, setIsLoadingConsumers] = useState(false)

    const recognitionRef = useRef<any>(null)
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastSpeechTimeRef = useRef<number>(Date.now())

    // Check browser support
    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

    // Fetch consumers when widget opens
    useEffect(() => {
        if (isOpen && consumers.length === 0) {
            fetchConsumers()
        }
    }, [isOpen])

    const fetchConsumers = async () => {
        setIsLoadingConsumers(true)
        try {
            // Fetch all consumers (up to 100 for matching)
            const result = await consumersApi.getAll(1, 100)
            setConsumers(result.data)
        } catch (err) {
            console.error('Failed to fetch consumers:', err)
        } finally {
            setIsLoadingConsumers(false)
        }
    }

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported) return

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'id-ID'

        recognition.onresult = (event: any) => {
            let finalTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscript += result[0].transcript
                }
            }
            if (finalTranscript) {
                setTranscript(prev => prev + ' ' + finalTranscript)
                // Reset silence timer on speech
                lastSpeechTimeRef.current = Date.now()
            }
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            if (event.error !== 'no-speech') {
                setError('Gagal mendengar. Coba lagi.')
                setStatus('error')
            }
        }

        recognition.onend = () => {
            if (status === 'listening') {
                try { recognition.start() } catch (e) { }
            }
        }

        recognitionRef.current = recognition

        return () => {
            try { recognition.stop() } catch (e) { }
            if (silenceTimeoutRef.current) {
                clearInterval(silenceTimeoutRef.current)
            }
        }
    }, [isSupported])

    const startListening = useCallback(() => {
        setStatus('listening')
        setTranscript('')
        setError('')
        setParsedSale(null)
        lastSpeechTimeRef.current = Date.now()

        try {
            recognitionRef.current?.start()
        } catch (e) {
            console.error('Failed to start recognition:', e)
        }

        // Auto-stop after 4 seconds of silence
        silenceTimeoutRef.current = setInterval(() => {
            const now = Date.now()
            const silenceDuration = now - lastSpeechTimeRef.current

            // If we have some transcript and 4 seconds of silence, auto-stop
            if (silenceDuration >= 4000) {
                if (silenceTimeoutRef.current) {
                    clearInterval(silenceTimeoutRef.current)
                    silenceTimeoutRef.current = null
                }
                // Only auto-stop if we have transcript
                setTranscript(prev => {
                    if (prev.trim()) {
                        // Trigger stop and parse
                        setTimeout(() => {
                            try { recognitionRef.current?.stop() } catch (e) { }
                            setStatus('processing')
                        }, 100)
                    }
                    return prev
                })
            }
        }, 500)
    }, [])

    const stopAndParse = useCallback(() => {
        // Clear silence timer
        if (silenceTimeoutRef.current) {
            clearInterval(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }

        try { recognitionRef.current?.stop() } catch (e) { }
        setStatus('processing')

        setTimeout(() => {
            const result = parseTranscript(transcript.trim())
            if (result) {
                setParsedSale(result)
                setStatus('confirming')
            } else {
                setError('Tidak bisa memahami. Coba: "Jual 10 tabung ke Warung Berkah"')
                setStatus('error')
            }
        }, 500)
    }, [transcript, consumers])

    const parseTranscript = (text: string): ParsedSale | null => {
        if (!text) return null

        const lower = text.toLowerCase()

        // Extract quantity
        const qtyMatch = lower.match(/(\d+)\s*(tabung|unit|buah)?/)
        const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 0

        if (quantity <= 0) return null

        // Extract LPG type (default to 3kg)
        let lpgType: LpgType = '3kg'

        if (lower.includes('12') || lower.includes('dua belas')) {
            lpgType = '12kg'
        } else if (lower.includes('50') || lower.includes('lima puluh')) {
            lpgType = '50kg'
        } else if (lower.includes('5 kg') || lower.includes('lima kilo')) {
            lpgType = '5kg'
        }

        // Extract consumer name - look for patterns
        let rawName = ''
        const namePatterns = [
            /(?:ke|untuk|buat)\s+(.+?)(?:\s+(?:\d+|tabung|unit)|\s*$)/i,
            /(?:pak|bu|bapak|ibu|mas|mbak|warung|toko)\s+([a-zA-Z\s]+)/i,
        ]

        for (const pattern of namePatterns) {
            const match = text.match(pattern)
            if (match && match[1]) {
                rawName = match[1].trim()
                break
            }
        }

        // Check for random/unknown consumer
        const isRandom = /random|umum|tidak (tau|tahu)|acak|langsung/.test(lower)

        // Smart matching with existing consumers
        let matchedConsumer: Consumer | null = null
        let consumerName = 'Konsumen Umum'
        let consumerId: string | null = null
        let isNewConsumer = false

        if (isRandom) {
            // User explicitly said random/umum
            consumerName = 'Konsumen Umum'
            isNewConsumer = false
        } else if (rawName) {
            // Try to match with existing consumers
            let bestMatch: Consumer | null = null
            let bestScore = 0

            for (const consumer of consumers) {
                const score = fuzzyMatch(rawName, consumer.name)
                if (score > bestScore && score >= 0.5) {
                    bestScore = score
                    bestMatch = consumer
                }
            }

            if (bestMatch) {
                matchedConsumer = bestMatch
                consumerName = bestMatch.name
                consumerId = bestMatch.id
                isNewConsumer = false
            } else {
                // No match found - strip honorifics and use as new consumer name
                consumerName = stripHonorifics(rawName)
                if (!consumerName || consumerName.length < 2) {
                    consumerName = 'Konsumen Umum'
                    isNewConsumer = false
                } else {
                    isNewConsumer = true
                }
            }
        }

        return {
            consumerId,
            consumerName,
            consumerMatch: matchedConsumer,
            isNewConsumer,
            quantity,
            lpgType,
            productLabel: LPG_LABELS[lpgType],
            pricePerUnit: LPG_PRICES[lpgType]
        }
    }

    const confirmAndSave = useCallback(async () => {
        if (!parsedSale) return

        setStatus('saving')

        try {
            // Create consumer order via API
            await consumerOrdersApi.create({
                consumer_id: parsedSale.consumerId || undefined,
                consumer_name: parsedSale.consumerId ? undefined : parsedSale.consumerName,
                lpg_type: parsedSale.lpgType,
                qty: parsedSale.quantity,
                price_per_unit: parsedSale.pricePerUnit,
                payment_status: 'LUNAS',
            })

            setStatus('success')
            toast.success(`Penjualan ${parsedSale.quantity} ${parsedSale.productLabel} ke ${parsedSale.consumerName} dicatat!`, {
                duration: 4000,
            })

            // Dispatch custom event to trigger data refresh in listening components
            window.dispatchEvent(new CustomEvent('sim4lon:sale-created'))

            setTimeout(() => {
                handleClose()
            }, 1500)
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan penjualan')
            setStatus('error')
        }
    }, [parsedSale])

    const cancel = useCallback(() => {
        // Clear silence timer
        if (silenceTimeoutRef.current) {
            clearInterval(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }

        try { recognitionRef.current?.stop() } catch (e) { }
        setStatus('idle')
        setTranscript('')
        setParsedSale(null)
        setError('')
    }, [])

    const handleFloatingClick = () => {
        setIsOpen(true)
        if (status === 'idle') startListening()
    }

    const handleClose = () => {
        cancel()
        setIsOpen(false)
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isOpen) {
                e.preventDefault()
                if (status === 'idle') startListening()
                else if (status === 'listening') stopAndParse()
                else if (status === 'confirming') confirmAndSave()
                else if (status === 'error') startListening()
                else if (status === 'success') handleClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, status, stopAndParse, confirmAndSave, startListening])

    if (!isSupported) return null

    // Calculate total
    const totalAmount = parsedSale ? parsedSale.quantity * parsedSale.pricePerUnit : 0

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    if (!isOpen) {
        return (
            <button
                onClick={handleFloatingClick}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Catat Penjualan dengan Suara"
            >
                <SafeIcon name="Mic" className="h-6 w-6 text-white" />
            </button>
        )
    }

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={handleClose}>
                <div
                    className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
                        <div>
                            <h2 className="font-semibold text-zinc-900 dark:text-white">
                                {status === 'idle' && 'Catat Penjualan'}
                                {status === 'listening' && 'Mendengarkan...'}
                                {status === 'processing' && 'AI Memproses...'}
                                {status === 'confirming' && 'Konfirmasi Penjualan'}
                                {status === 'saving' && 'Menyimpan...'}
                                {status === 'success' && 'Berhasil!'}
                                {status === 'error' && 'Gagal'}
                            </h2>
                            <p className="text-xs text-zinc-500">
                                {status === 'listening' && '↵ Enter untuk selesai'}
                                {status === 'confirming' && '↵ Enter untuk konfirmasi'}
                                {isLoadingConsumers && 'Memuat data konsumen...'}
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
                        {/* Listening */}
                        {status === 'listening' && (
                            <div className="text-center py-6 space-y-5">
                                {/* Pulsing circles */}
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

                                {/* Transcript */}
                                <div className="min-h-[50px] px-4">
                                    <p className={`text-lg ${transcript ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 italic'}`}>
                                        {transcript || 'Bicara sekarang...'}
                                    </p>
                                </div>

                                {/* Tips */}
                                <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">💡 Contoh:</p>
                                    <p className="text-xs text-zinc-500">"Jual 10 tabung ke Warung Berkah"</p>
                                    <p className="text-xs text-zinc-400 mt-1">"Jual 3 tabung ke orang random"</p>
                                </div>
                            </div>
                        )}

                        {/* Processing */}
                        {(status === 'processing' || status === 'saving') && (
                            <div className="py-8 text-center">
                                <div className="relative w-16 h-16 mx-auto mb-4">
                                    <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700" />
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
                                </div>
                                <p className="text-zinc-600 dark:text-zinc-300">
                                    {status === 'processing' ? 'AI mencocokkan konsumen...' : 'Menyimpan penjualan...'}
                                </p>
                            </div>
                        )}

                        {/* Confirming */}
                        {parsedSale && status === 'confirming' && (
                            <div className="space-y-4">
                                {transcript && (
                                    <p className="text-sm text-zinc-500 italic">"{transcript.trim()}"</p>
                                )}

                                {/* Consumer - with smart match indicator */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                        <SafeIcon name={parsedSale.consumerMatch ? "UserCheck" : "User"} className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-zinc-500">Konsumen</p>
                                        <p className="font-semibold text-zinc-900 dark:text-white">{parsedSale.consumerName}</p>
                                    </div>
                                    {parsedSale.consumerMatch ? (
                                        <Badge className="bg-green-100 text-green-700 border-0">
                                            <SafeIcon name="Check" className="h-3 w-3 mr-1" />
                                            Terdaftar
                                        </Badge>
                                    ) : parsedSale.isNewConsumer ? (
                                        <Badge variant="secondary">
                                            <SafeIcon name="UserPlus" className="h-3 w-3 mr-1" />
                                            Baru
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Umum</Badge>
                                    )}
                                </div>

                                {/* Product & Quantity */}
                                <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-lg font-bold text-emerald-600">
                                            {parsedSale.quantity}
                                        </span>
                                        <div>
                                            <span className="text-zinc-900 dark:text-white">{parsedSale.productLabel}</span>
                                            <p className="text-xs text-zinc-500">@ {formatCurrency(parsedSale.pricePerUnit)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Total</span>
                                    <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {status === 'error' && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Success */}
                        {status === 'success' && (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                                    <SafeIcon name="Check" className="h-8 w-8 text-white" />
                                </div>
                                <p className="font-semibold text-green-600">Penjualan Dicatat!</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
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
                                <Button variant="outline" onClick={handleClose} className="flex-1 rounded-xl h-11">
                                    Batal
                                </Button>
                                <Button onClick={stopAndParse} className="flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600">
                                    <SafeIcon name="StopCircle" className="h-4 w-4" />
                                    Selesai
                                </Button>
                            </div>
                        )}

                        {status === 'confirming' && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => { cancel(); startListening(); }} className="flex-1 rounded-xl h-11 gap-2">
                                    <SafeIcon name="RotateCcw" className="h-4 w-4" />
                                    Ulangi
                                </Button>
                                <Button onClick={confirmAndSave} className="flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600">
                                    <SafeIcon name="Check" className="h-4 w-4" />
                                    Simpan
                                </Button>
                            </div>
                        )}

                        {(status === 'processing' || status === 'saving') && (
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
