/**
 * useVoiceOrder - Hook untuk end-to-end voice ordering
 * 
 * PENJELASAN:
 * Hook ini menggabungkan:
 * - Speech Recognition (Web Speech API)
 * - Gemini AI Parsing (via backend)
 * - Order Creation (ordersApi)
 * - Navigation ke daftar pesanan
 */

import { useState, useCallback } from 'react'
import { useSpeechRecognition } from './useSpeechRecognition'
import { toast } from 'sonner'

// API base URL
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api'

interface ParsedOrderItem {
    productId: string
    productName: string
    lpgType: string
    quantity: number
    price: number
    stockAvailable?: number  // Current stock for validation display
}

// Validation issue from backend
export interface ValidationIssue {
    type: 'quantity_too_high' | 'quantity_too_low' | 'stock_insufficient' | 'pangkalan_not_found' | 'product_not_found' | 'pangkalan_inactive'
    field: string
    message: string
    suggestion?: string
}

export interface GeminiParseResult {
    success: boolean
    pangkalanId: string | null
    pangkalanName: string | null
    items: ParsedOrderItem[]
    note: string | null
    confidence: number
    rawText: string
    error?: string
    // Comprehensive validation from backend
    validation?: {
        isValid: boolean
        issues: ValidationIssue[]
        warnings: string[]
    }
}

interface OrderCreationResult {
    success: boolean
    orderId?: string
    orderCode?: string
    error?: string
}

/** Missing info types for validation */
export type MissingInfoType = 'pangkalan' | 'items' | 'quantity'

export interface UseVoiceOrderResult {
    /** Status: idle, listening, parsing, needsInfo, confirming, creating, success, error */
    status: 'idle' | 'listening' | 'parsing' | 'needsInfo' | 'confirming' | 'creating' | 'success' | 'error'
    /** Apakah sedang dalam proses */
    isProcessing: boolean
    /** Transcript dari speech */
    transcript: string
    /** Hasil parsing dari Gemini */
    parseResult: GeminiParseResult | null
    /** Error message */
    error: string | null
    /** Missing info yang perlu dilengkapi */
    missingInfo: MissingInfoType | null
    /** Prompt untuk user tentang info yang kurang */
    missingInfoPrompt: string | null
    /** Apakah browser support */
    isSupported: boolean
    /** Mulai listening */
    startListening: () => void
    /** Stop listening dan mulai parse */
    stopAndParse: () => Promise<void>
    /** Cancel semua proses */
    cancel: () => void
    /** Confirm dan create order */
    confirmAndCreate: () => Promise<OrderCreationResult>
    /** Lanjutkan dengan info tambahan (untuk follow-up) */
    continueWithInfo: () => void
}

/**
 * Get auth token from localStorage
 */
function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('sim4lon_token')
}

/**
 * Call Gemini API to parse voice command
 */
async function parseVoiceCommand(text: string): Promise<GeminiParseResult> {
    const token = getToken()
    if (!token) {
        throw new Error('Tidak terautentikasi')
    }

    const response = await fetch(`${API_BASE_URL}/gemini/parse-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(error.message || 'Gagal parsing perintah suara')
    }

    return response.json()
}

/**
 * Create order via API
 */
async function createOrder(data: {
    pangkalan_id: string
    items: Array<{ lpg_type: string; qty: number; price_per_unit: number; lpg_product_id?: string; label?: string }>
    note?: string
    is_voice_order?: boolean
    is_paid_cash?: boolean
}): Promise<{ id: string; code: string }> {
    const token = getToken()
    if (!token) {
        throw new Error('Tidak terautentikasi')
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(error.message || 'Gagal membuat pesanan')
    }

    return response.json()
}

export function useVoiceOrder(): UseVoiceOrderResult {
    const [status, setStatus] = useState<UseVoiceOrderResult['status']>('idle')
    const [parseResult, setParseResult] = useState<GeminiParseResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [missingInfo, setMissingInfo] = useState<MissingInfoType | null>(null)
    const [missingInfoPrompt, setMissingInfoPrompt] = useState<string | null>(null)

    // Auto-parse when speech ends (after 2 seconds of silence)
    const handleSpeechEnd = useCallback(async (finalTranscript: string) => {
        console.log('[useVoiceOrder] Speech ended, auto-parsing:', finalTranscript)

        if (!finalTranscript.trim()) {
            setError('Tidak ada suara terdeteksi')
            setStatus('error')
            return
        }

        setStatus('parsing')

        try {
            toast.loading('Memproses perintah suara...', { id: 'voice-parse' })
            const result = await parseVoiceCommand(finalTranscript)

            if (result.success && result.items.length > 0) {
                // Check for validation issues from backend
                if (result.validation && !result.validation.isValid) {
                    setParseResult(result)
                    setError(result.error || 'Validasi gagal')
                    setStatus('error')
                    toast.error(result.error || 'Validasi gagal', { id: 'voice-parse' })
                } else {
                    setParseResult(result)
                    setStatus('confirming')
                    toast.success('Perintah berhasil dipahami!', { id: 'voice-parse' })
                }
            } else {
                setError(result.error || 'Tidak dapat memahami perintah')
                setStatus('error')
                toast.error(result.error || 'Tidak dapat memahami perintah', { id: 'voice-parse' })
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memproses perintah')
            setStatus('error')
            toast.error(err.message || 'Gagal memproses perintah', { id: 'voice-parse' })
        }
    }, [])

    const {
        isListening,
        transcript,
        interimTranscript,  // Real-time interim result
        isSupported,
        startListening: startSpeech,
        stopListening: stopSpeech,
        resetTranscript,
        error: speechError
    } = useSpeechRecognition({
        onSpeechEnd: handleSpeechEnd,
        silenceTimeout: 2000,  // 4 seconds of silence = auto stop
        autoStop: true
    })

    // Live transcript = final + interim (for real-time display)
    const liveTranscript = transcript + (interimTranscript ? interimTranscript : '')

    // Start listening
    const startListening = useCallback(() => {
        setStatus('listening')
        setError(null)
        setParseResult(null)
        setMissingInfo(null)
        setMissingInfoPrompt(null)
        resetTranscript()
        startSpeech()
    }, [startSpeech, resetTranscript])

    // Validate parse result and check for missing info
    const validateParseResult = useCallback((result: GeminiParseResult): { valid: boolean; missing?: MissingInfoType; prompt?: string } => {
        // Check if pangkalan is missing
        if (!result.pangkalanId) {
            return {
                valid: false,
                missing: 'pangkalan',
                prompt: '🏪 Pangkalan belum disebutkan. Untuk pangkalan mana pesanan ini?'
            }
        }

        // Check if items are empty
        if (!result.items || result.items.length === 0) {
            return {
                valid: false,
                missing: 'items',
                prompt: '📦 Produk belum terdeteksi. Mau pesan produk LPG yang mana? (3kg, 12kg, 50kg)'
            }
        }

        // Check if any item has quantity 0 or less
        const invalidQty = result.items.find(item => item.quantity <= 0)
        if (invalidQty) {
            return {
                valid: false,
                missing: 'quantity',
                prompt: `🔢 Jumlah untuk ${invalidQty.productName} belum jelas. Berapa unit yang mau dipesan?`
            }
        }

        return { valid: true }
    }, [])

    // Stop and parse with Gemini
    const stopAndParse = useCallback(async () => {
        stopSpeech()

        if (!transcript.trim()) {
            setError('Tidak ada suara terdeteksi')
            setStatus('error')
            return
        }

        setStatus('parsing')

        try {
            toast.loading('Memproses perintah suara...', { id: 'voice-parse' })
            const result = await parseVoiceCommand(transcript)

            if (result.success && result.items.length > 0) {
                // Validate for missing info
                const validation = validateParseResult(result)

                if (!validation.valid && validation.missing) {
                    setParseResult(result)
                    setMissingInfo(validation.missing)
                    setMissingInfoPrompt(validation.prompt || null)
                    setStatus('needsInfo')
                    toast.warning(validation.prompt || 'Ada informasi yang kurang', { id: 'voice-parse' })
                } else {
                    setParseResult(result)
                    setStatus('confirming')
                    toast.success('Perintah berhasil dipahami!', { id: 'voice-parse' })
                }
            } else {
                setError(result.error || 'Tidak dapat memahami perintah')
                setStatus('error')
                toast.error(result.error || 'Tidak dapat memahami perintah', { id: 'voice-parse' })
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memproses perintah')
            setStatus('error')
            toast.error(err.message || 'Gagal memproses perintah', { id: 'voice-parse' })
        }
    }, [stopSpeech, transcript, validateParseResult])

    // Continue listening for missing info
    const continueWithInfo = useCallback(() => {
        // Keep previous parse result, just start listening again
        setStatus('listening')
        setMissingInfo(null)
        setMissingInfoPrompt(null)
        resetTranscript()
        startSpeech()
    }, [resetTranscript, startSpeech])

    // Cancel all
    const cancel = useCallback(() => {
        stopSpeech()
        resetTranscript()
        setStatus('idle')
        setError(null)
        setParseResult(null)
        setMissingInfo(null)
        setMissingInfoPrompt(null)
    }, [stopSpeech, resetTranscript])

    // Confirm and create order
    const confirmAndCreate = useCallback(async (): Promise<OrderCreationResult> => {
        if (!parseResult || !parseResult.pangkalanId) {
            return { success: false, error: 'Data pesanan tidak lengkap' }
        }

        setStatus('creating')

        try {
            toast.loading('Membuat pesanan...', { id: 'voice-create' })

            const orderData = {
                pangkalan_id: parseResult.pangkalanId,
                items: parseResult.items.map(item => ({
                    lpg_type: item.lpgType,
                    qty: item.quantity,
                    price_per_unit: item.price,
                    lpg_product_id: item.productId,
                    label: item.productName
                })),
                note: parseResult.note || `[Voice Order] ${parseResult.rawText}`,
                // EXPRESS: Voice order langsung DIPROSES + LUNAS
                is_voice_order: true,
                is_paid_cash: true
            }

            const result = await createOrder(orderData)

            setStatus('success')
            toast.success(`Pesanan ${result.code} berhasil dibuat!`, { id: 'voice-create' })

            // Redirect to order list after 1 second
            setTimeout(() => {
                window.location.href = '/daftar-pesanan'
            }, 1000)

            return { success: true, orderId: result.id, orderCode: result.code }
        } catch (err: any) {
            setError(err.message || 'Gagal membuat pesanan')
            setStatus('error')
            toast.error(err.message || 'Gagal membuat pesanan', { id: 'voice-create' })
            return { success: false, error: err.message }
        }
    }, [parseResult])

    // Check for speech errors
    if (speechError && status === 'listening') {
        setError(speechError)
        setStatus('error')
    }

    return {
        status,
        isProcessing: ['listening', 'parsing', 'creating'].includes(status),
        transcript: liveTranscript,  // Use liveTranscript for real-time display
        parseResult,
        error,
        missingInfo,
        missingInfoPrompt,
        isSupported,
        startListening,
        stopAndParse,
        cancel,
        confirmAndCreate,
        continueWithInfo
    }
}

export default useVoiceOrder
