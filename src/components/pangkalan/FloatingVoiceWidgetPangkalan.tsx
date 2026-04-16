/**
 * FloatingVoiceWidgetPangkalan - Smart Voice Widget untuk Portal Pangkalan
 * 
 * FITUR:
 * - Speech-to-text untuk input penjualan cepat
 * - SMART MATCHING: Cocokkan nama yang diucapkan dengan konsumen existing
 * - CEK STOK: Voice command untuk cek stok tabung
 * - PENGELUARAN: Voice command untuk catat pengeluaran
 * - Support "Konsumen Umum/Random" untuk pembeli tidak terdaftar
 * - Auto-save ke API consumer-orders dan expenses
 * 
 * CONTOH PERINTAH:
 * - "Jual 10 tabung 3kg ke Warung Berkah"
 * - "Cek stok 3 kilo" atau "Berapa sisa tabung?"
 * - "Catat pengeluaran transport 50 ribu"
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { consumersApi, consumerOrdersApi, expensesApi, type Consumer, type LpgType, type ExpenseCategory } from '@/lib/api'
import { LPG_CONFIG, LPG_IMAGES, getLpgName } from '@/lib/lpg-config'
import { formatCurrency } from '@/lib/format'

// ============= MULTI-COMMAND TYPES =============
type CommandType = 'JUAL' | 'CEK_STOK' | 'PENGELUARAN'

type Status =
    | 'idle'
    | 'listening'
    | 'processing'
    | 'confirming'          // Confirming JUAL
    | 'confirming_stock'    // Showing stock info
    | 'confirming_expense'  // Confirming expense
    | 'saving'
    | 'success'
    | 'error'

// Parsed Sale (existing, for JUAL command)
interface ParsedSale {
    consumerId: string | null
    consumerName: string
    consumerMatch: Consumer | null
    isNewConsumer: boolean
    quantity: number
    lpgType: LpgType
    productLabel: string
    pricePerUnit: number
}

// Parsed Stock Check (for CEK_STOK command)
interface ParsedStockCheck {
    lpgType: LpgType | 'all'
    question: string
}

// Parsed Expense (for PENGELUARAN command)
interface ParsedExpense {
    category: ExpenseCategory
    amount: number
    description: string
}

// Unified parsed command result
type ParsedCommand =
    | { type: 'JUAL'; data: ParsedSale }
    | { type: 'CEK_STOK'; data: ParsedStockCheck }
    | { type: 'PENGELUARAN'; data: ParsedExpense }

// ============= CONSTANTS =============

// Default prices per LPG type
const LPG_PRICES: Record<LpgType, number> = {
    '3kg': 18000,
    '5kg': 85000,
    '12kg': 185000,
    '50kg': 650000,
}

// LPG_LABELS replaced by getLpgName from @/lib/lpg-config

// LPG_IMAGES imported from @/lib/lpg-config

// Expense category mapping (keyword -> category)
const EXPENSE_KEYWORDS: Record<ExpenseCategory, string[]> = {
    'TRANSPORT': ['transport', 'bensin', 'bbm', 'ongkos', 'antar', 'kirim', 'delivery', 'solar'],
    'OPERASIONAL': ['operasional', 'maintenance', 'perbaikan', 'servis', 'service'],
    'LISTRIK': ['listrik', 'air', 'pln', 'pdam', 'token'],
    'SEWA': ['sewa', 'kontrakan', 'rent', 'kos'],
    'GAJI': ['gaji', 'upah', 'honor', 'honorarium', 'salary'],
    'LAINNYA': ['lainnya', 'lain', 'other'],
}

// Category icons for display
const EXPENSE_ICONS: Record<ExpenseCategory, string> = {
    'TRANSPORT': 'Truck',
    'OPERASIONAL': 'Settings',
    'LISTRIK': 'Zap',
    'SEWA': 'Home',
    'GAJI': 'Users',
    'LAINNYA': 'MoreHorizontal',
}

// ============= INTENT DETECTION =============
const INTENT_PATTERNS: Record<CommandType, { keywords: string[]; weight: number }> = {
    // More specific patterns first
    'PENGELUARAN': {
        keywords: ['pengeluaran', 'catat keluar', 'catat biaya', 'biaya', 'bayar', 'belanja', 'beli bensin'],
        weight: 1.0
    },
    'CEK_STOK': {
        keywords: ['cek stok', 'berapa stok', 'sisa stok', 'stok berapa', 'cek tabung', 'sisa tabung', 'ada berapa'],
        weight: 0.9
    },
    'JUAL': {
        keywords: ['jual', 'beli tabung', 'order', 'catat penjualan', 'tabung ke'],
        weight: 0.8
    },
}

function detectIntent(text: string): { type: CommandType; confidence: number } {
    const lower = text.toLowerCase()
    let bestMatch: CommandType = 'JUAL'
    let bestScore = 0

    for (const [type, config] of Object.entries(INTENT_PATTERNS)) {
        for (const keyword of config.keywords) {
            if (lower.includes(keyword)) {
                const score = keyword.length * config.weight
                if (score > bestScore) {
                    bestScore = score
                    bestMatch = type as CommandType
                }
            }
        }
    }

    return { type: bestMatch, confidence: bestScore > 0 ? 0.9 : 0.5 }
}

// ============= INDONESIAN NUMBER PARSER =============
function parseIndonesianAmount(text: string): number {
    const lower = text.toLowerCase()
    let amount = 0

    // Pattern: "lima puluh ribu" -> word-based
    const wordNumbers: Record<string, number> = {
        'satu': 1, 'dua': 2, 'tiga': 3, 'empat': 4, 'lima': 5,
        'enam': 6, 'tujuh': 7, 'delapan': 8, 'sembilan': 9, 'sepuluh': 10,
        'sebelas': 11, 'duabelas': 12, 'dua belas': 12,
        'seratus': 100, 'seribu': 1000, 'sejuta': 1000000,
    }

    // Try digit-based patterns first (more reliable)
    const patterns = [
        { regex: /(\d+)\s*(juta|jt)/i, multiplier: 1000000 },
        { regex: /(\d+)\s*(ribu|rb)/i, multiplier: 1000 },
        { regex: /(\d+)[.,](\d{3})/i, multiplier: 1 }, // 50.000 or 50,000
        { regex: /(\d+)/i, multiplier: 1 }, // plain number
    ]

    for (const { regex, multiplier } of patterns) {
        const match = lower.match(regex)
        if (match) {
            if (multiplier === 1 && match[2]) {
                // Handle 50.000 format
                amount = parseInt(match[1] + match[2])
            } else {
                amount = parseInt(match[1]) * multiplier
            }
            if (amount > 0) break
        }
    }

    // If no digit found, try word-based (basic)
    if (amount === 0) {
        for (const [word, value] of Object.entries(wordNumbers)) {
            if (lower.includes(word)) {
                amount = value
                // Check for "ribu" or "juta" multiplier
                if (lower.includes('ribu') || lower.includes('rb')) {
                    amount *= 1000
                } else if (lower.includes('juta') || lower.includes('jt')) {
                    amount *= 1000000
                }
                break
            }
        }
    }

    return amount
}

// ============= EXPENSE PARSER =============
function parseExpense(text: string): ParsedExpense | null {
    const lower = text.toLowerCase()

    // Extract amount
    const amount = parseIndonesianAmount(text)
    if (amount <= 0) return null

    // Detect category from keywords
    let category: ExpenseCategory = 'LAINNYA'
    for (const [cat, keywords] of Object.entries(EXPENSE_KEYWORDS)) {
        if (keywords.some(kw => lower.includes(kw))) {
            category = cat as ExpenseCategory
            break
        }
    }

    // Build description from cleaned text
    let description = text
        .replace(/\d+\s*(ribu|rb|juta|jt)?/gi, '')
        .replace(/(pengeluaran|catat|biaya)/gi, '')
        .trim()

    if (!description || description.length < 2) {
        description = `${category.charAt(0) + category.slice(1).toLowerCase()}`
    }

    return { category, amount, description }
}

// ============= STOCK CHECK PARSER =============
function parseStockCheck(text: string): ParsedStockCheck {
    const lower = text.toLowerCase()
    let lpgType: LpgType | 'all' = 'all'

    // Detect specific LPG type
    if (lower.includes('3 kg') || lower.includes('3kg') || lower.includes('3 kilo') || lower.includes('tiga kilo')) {
        lpgType = '3kg'
    } else if (lower.includes('5 kg') || lower.includes('5kg') || lower.includes('5 kilo') || lower.includes('lima kilo')) {
        lpgType = '5kg'
    } else if (lower.includes('12') || lower.includes('dua belas') || lower.includes('duabelas')) {
        lpgType = '12kg'
    } else if (lower.includes('50') || lower.includes('lima puluh')) {
        lpgType = '50kg'
    }

    return { lpgType, question: text }
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
    const [interimTranscript, setInterimTranscript] = useState('')  // Live text saat berbicara

    // Command-specific state
    const [parsedSale, setParsedSale] = useState<ParsedSale | null>(null)
    const [parsedExpense, setParsedExpense] = useState<ParsedExpense | null>(null)
    const [parsedStock, setParsedStock] = useState<ParsedStockCheck | null>(null)

    // Mock stock data (in real app, fetch from API)
    const [stockData] = useState<Record<LpgType, number>>({
        '3kg': 45,
        '5kg': 12,
        '12kg': 8,
        '50kg': 3,
    })

    const [error, setError] = useState('')
    const [consumers, setConsumers] = useState<Consumer[]>([])
    const [isLoadingConsumers, setIsLoadingConsumers] = useState(false)

    const recognitionRef = useRef<any>(null)
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastSpeechTimeRef = useRef<number>(Date.now())
    const isStoppingRef = useRef<boolean>(false)  // Prevent restart after intentional stop

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
            let interim = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscript += result[0].transcript
                } else {
                    interim += result[0].transcript
                }
            }

            // Update interim transcript (live text)
            setInterimTranscript(interim)

            // Reset silence timer on ANY speech activity (interim or final)
            // This prevents premature auto-stop while user is still speaking
            if (finalTranscript || interim) {
                lastSpeechTimeRef.current = Date.now()
            }

            if (finalTranscript) {
                setTranscript(prev => prev + ' ' + finalTranscript)
                setInterimTranscript('')  // Clear interim when we have final
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
            // Only restart if still listening AND not intentionally stopping
            if (status === 'listening' && !isStoppingRef.current) {
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
        setInterimTranscript('')
        setError('')
        setParsedSale(null)
        lastSpeechTimeRef.current = Date.now()
        isStoppingRef.current = false  // Reset stopping flag for new session

        try {
            recognitionRef.current?.start()
        } catch (e) {
            console.error('Failed to start recognition:', e)
        }

        // Auto-stop disabled - user must manually press stop button
        // (Previous: auto-stop after 2 seconds of silence)
    }, [])

    const stopAndParse = useCallback(() => {
        // Clear silence timer
        if (silenceTimeoutRef.current) {
            clearInterval(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }

        isStoppingRef.current = true  // Prevent restart in onend
        try { recognitionRef.current?.stop() } catch (e) { }
        setStatus('processing')

        setTimeout(() => {
            const text = transcript.trim()
            if (!text) {
                setError('Tidak ada yang terdengar. Coba lagi.')
                setStatus('error')
                return
            }

            // ============= MULTI-COMMAND ROUTING =============
            const intent = detectIntent(text)
            console.log('🎯 Detected Intent:', intent)

            switch (intent.type) {
                case 'CEK_STOK': {
                    const stockCheck = parseStockCheck(text)
                    setParsedStock(stockCheck)
                    setStatus('confirming_stock')
                    break
                }
                case 'PENGELUARAN': {
                    const expense = parseExpense(text)
                    if (expense) {
                        setParsedExpense(expense)
                        setStatus('confirming_expense')
                    } else {
                        setError('Tidak bisa memahami jumlah. Coba: "Catat pengeluaran transport 50 ribu"')
                        setStatus('error')
                    }
                    break
                }
                case 'JUAL':
                default: {
                    const sale = parseSaleTranscript(text)
                    if (sale) {
                        setParsedSale(sale)
                        setStatus('confirming')
                    } else {
                        setError('Tidak bisa memahami. Coba: "Jual 10 tabung ke Warung Berkah"')
                        setStatus('error')
                    }
                    break
                }
            }
        }, 500)
    }, [transcript, consumers])

    // ============= SALE PARSER (for JUAL command) =============
    const parseSaleTranscript = (text: string): ParsedSale | null => {
        if (!text) return null

        const lower = text.toLowerCase()

        // STEP 1: Extract LPG type FIRST (before quantity to avoid confusion)
        // Use comprehensive regex patterns for all LPG types
        let lpgType: LpgType = '3kg' // default

        // LPG Type patterns - check in order of specificity (larger numbers first)
        const lpgTypePatterns: { regex: RegExp; type: LpgType }[] = [
            // 50kg patterns
            { regex: /50\s*(?:kg|kilo|kilogram)/i, type: '50kg' },
            { regex: /lima\s*puluh\s*(?:kg|kilo|kilogram)?/i, type: '50kg' },

            // 12kg patterns
            { regex: /12\s*(?:kg|kilo|kilogram)/i, type: '12kg' },
            { regex: /dua\s*belas\s*(?:kg|kilo|kilogram)?/i, type: '12kg' },

            // 5kg patterns - must check before generic "5" match
            { regex: /5\s*(?:kg|kilo|kilogram)/i, type: '5kg' },
            { regex: /lima\s*(?:kg|kilo|kilogram)/i, type: '5kg' },

            // 3kg patterns (default anyway, but explicit check)
            { regex: /3\s*(?:kg|kilo|kilogram)/i, type: '3kg' },
            { regex: /tiga\s*(?:kg|kilo|kilogram)/i, type: '3kg' },
        ]

        for (const pattern of lpgTypePatterns) {
            if (pattern.regex.test(lower)) {
                lpgType = pattern.type
                break
            }
        }

        // STEP 2: Extract quantity - look for number followed by "tabung/unit/buah"
        // This avoids confusion with the LPG size number (e.g., "5 kilo 10 tabung")
        let quantity = 0

        // Try specific patterns first
        const qtyPatterns = [
            /(\d+)\s*(?:tabung|unit|buah)/i,  // "10 tabung"
            /(?:jual|beli|order)\s+(\d+)/i,    // "jual 10"
        ]

        for (const pattern of qtyPatterns) {
            const match = lower.match(pattern)
            if (match && match[1]) {
                quantity = parseInt(match[1])
                break
            }
        }

        // If no specific pattern matched, try to extract last number that's > lpg size
        if (quantity <= 0) {
            const allNumbers = lower.match(/\d+/g)
            if (allNumbers) {
                // Find the quantity (not the LPG size)
                for (const numStr of allNumbers) {
                    const num = parseInt(numStr)
                    // Skip if it's clearly an LPG size indicator (3, 5, 12, 50)
                    if (num !== 3 && num !== 5 && num !== 12 && num !== 50) {
                        quantity = num
                        break
                    }
                }
                // If all numbers are potential LPG sizes, use the first one as quantity
                if (quantity <= 0 && allNumbers.length > 0) {
                    quantity = parseInt(allNumbers[0])
                }
            }
        }

        if (quantity <= 0) return null

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
            // Strip honorifics from rawName for better matching
            // e.g., "ibu ratna" -> "ratna"
            const cleanedName = stripHonorifics(rawName)

            // Try to match with existing consumers
            let bestMatch: Consumer | null = null
            let bestScore = 0

            for (const consumer of consumers) {
                // Match against both the cleaned name and the original consumer name
                const score1 = fuzzyMatch(cleanedName, consumer.name)
                // Also try matching just the first word of consumer name
                const consumerFirstName = consumer.name.split(' ')[0]
                const score2 = fuzzyMatch(cleanedName, consumerFirstName)
                const score = Math.max(score1, score2)

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
                // No match found - use cleaned name as new consumer name
                consumerName = cleanedName
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
            productLabel: getLpgName(lpgType),
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

    // ============= CONFIRM EXPENSE =============
    const confirmExpense = useCallback(async () => {
        if (!parsedExpense) return

        setStatus('saving')

        try {
            await expensesApi.create({
                category: parsedExpense.category,
                amount: parsedExpense.amount,
                description: parsedExpense.description,
                expense_date: new Date().toISOString().split('T')[0],
            })

            setStatus('success')
            toast.success(`Pengeluaran ${formatCurrency(parsedExpense.amount)} (${parsedExpense.category}) dicatat!`, {
                duration: 4000,
            })

            // Dispatch event for data refresh
            window.dispatchEvent(new CustomEvent('sim4lon:expense-created'))

            setTimeout(() => {
                handleClose()
            }, 1500)
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan pengeluaran')
            setStatus('error')
        }
    }, [parsedExpense])

    const cancel = useCallback(() => {
        // Clear silence timer
        if (silenceTimeoutRef.current) {
            clearInterval(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }

        isStoppingRef.current = true  // Prevent restart in onend
        try { recognitionRef.current?.stop() } catch (e) { }
        setStatus('idle')
        setTranscript('')
        setParsedSale(null)
        setParsedExpense(null)
        setParsedStock(null)
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
            if (!isOpen) return

            if (e.key === 'Enter') {
                e.preventDefault()
                if (status === 'idle') startListening()
                else if (status === 'listening') stopAndParse()
                else if (status === 'confirming') confirmAndSave()
                else if (status === 'error') startListening()
                else if (status === 'success') handleClose()
            } else if (e.key === 'Escape') {
                e.preventDefault()
                handleClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, status, stopAndParse, confirmAndSave, startListening])

    if (!isSupported) return null

    // Calculate total
    const totalAmount = parsedSale ? parsedSale.quantity * parsedSale.pricePerUnit : 0

    // formatCurrency imported from @/lib/format

    if (!isOpen) {
        return (
            <button
                onClick={handleFloatingClick}
                className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Catat Penjualan dengan Suara"
            >
                <SafeIcon name="Mic" className="h-5 w-5 md:h-6 md:w-6 text-white" />
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
                                {status === 'listening' && '↵ Enter selesai • Esc batalkan'}
                                {status === 'confirming' && '↵ Enter konfirmasi • Esc batalkan'}
                                {status === 'error' && '↵ Enter coba lagi • Esc tutup'}
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

                                {/* Live Transcript - shows both final and interim */}
                                <div className="min-h-[50px] px-4">
                                    {(transcript || interimTranscript) ? (
                                        <p className="text-lg text-zinc-900 dark:text-white">
                                            {transcript}
                                            {interimTranscript && (
                                                <span className="text-blue-500 opacity-70">{interimTranscript}</span>
                                            )}
                                        </p>
                                    ) : (
                                        <p className="text-lg text-zinc-400 italic">Bicara sekarang...</p>
                                    )}
                                </div>

                                {/* Tips - now shows all commands */}
                                <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">💡 Contoh perintah:</p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">"<span className="font-medium text-blue-600">Jual</span> 10 tabung ke Warung Berkah"</p>
                                    <p className="text-xs text-zinc-500 mt-1">"<span className="font-medium text-blue-600">Cek stok</span>" atau "Berapa sisa 3kg?"</p>
                                    <p className="text-xs text-zinc-500 mt-1">"<span className="font-medium text-orange-600">Pengeluaran</span> transport 50 ribu"</p>
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
                                <div className={`flex items-center gap-3 p-3 rounded-xl ${parsedSale.consumerMatch?.consumer_type === 'WARUNG'
                                    ? 'bg-amber-50 dark:bg-amber-900/20'
                                    : 'bg-blue-50 dark:bg-blue-900/20'
                                    }`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${parsedSale.consumerMatch?.consumer_type === 'WARUNG'
                                        ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                        : 'bg-blue-500'
                                        }`}>
                                        <SafeIcon
                                            name={parsedSale.consumerMatch?.consumer_type === 'WARUNG' ? 'Store' : (parsedSale.consumerMatch ? 'UserCheck' : 'User')}
                                            className="h-5 w-5 text-white"
                                        />
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
                                        <div className="w-12 h-12 rounded-lg bg-white border overflow-hidden p-1 flex items-center justify-center shadow">
                                            {LPG_IMAGES[parsedSale.lpgType] ? (
                                                <img
                                                    src={LPG_IMAGES[parsedSale.lpgType]}
                                                    alt={parsedSale.productLabel}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-lg font-bold text-emerald-600">
                                                    {parsedSale.quantity}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-zinc-900 dark:text-white">{parsedSale.productLabel}</span>
                                            <p className="text-xs text-zinc-500">{parsedSale.quantity} x @ {formatCurrency(parsedSale.pricePerUnit)}</p>
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

                        {/* ============= STOCK CHECK VIEW ============= */}
                        {parsedStock && status === 'confirming_stock' && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <SafeIcon name="Package" className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                        {parsedStock.lpgType === 'all' ? 'Stok Semua LPG' : `Stok ${getLpgName(parsedStock.lpgType)}`}
                                    </h3>
                                </div>

                                {/* Stock Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {(parsedStock.lpgType === 'all'
                                        ? (['3kg', '5kg', '12kg', '50kg'] as LpgType[])
                                        : [parsedStock.lpgType]
                                    ).map(type => {
                                        const stock = stockData[type]
                                        const isLow = stock < 10
                                        const isCritical = stock < 5
                                        return (
                                            <div key={type} className={`p-4 rounded-xl border-2 ${isCritical ? 'border-red-200 bg-red-50' :
                                                isLow ? 'border-yellow-200 bg-yellow-50' :
                                                    'border-green-200 bg-green-50'
                                                }`}>
                                                <p className="text-xs text-zinc-500 mb-1">{getLpgName(type)}</p>
                                                <p className={`text-2xl font-bold ${isCritical ? 'text-red-600' :
                                                    isLow ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    }`}>
                                                    {stock} <span className="text-sm font-normal">tabung</span>
                                                </p>
                                                {isCritical && <p className="text-xs text-red-500 mt-1">⚠️ Segera restock!</p>}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ============= EXPENSE CONFIRMATION VIEW ============= */}
                        {parsedExpense && status === 'confirming_expense' && (
                            <div className="space-y-4">
                                {transcript && (
                                    <p className="text-sm text-zinc-500 italic">"{transcript.trim()}"</p>
                                )}

                                {/* Category with Icon */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                        <SafeIcon name={EXPENSE_ICONS[parsedExpense.category]} className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-zinc-500">Kategori</p>
                                        <p className="font-semibold text-zinc-900 dark:text-white">{parsedExpense.category}</p>
                                    </div>
                                    <Badge className="bg-orange-100 text-orange-700 border-0">
                                        <SafeIcon name="Receipt" className="h-3 w-3 mr-1" />
                                        Pengeluaran
                                    </Badge>
                                </div>

                                {/* Amount */}
                                <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                            <SafeIcon name="Wallet" className="h-5 w-5 text-red-600" />
                                        </span>
                                        <div>
                                            <p className="text-xs text-zinc-500">Jumlah</p>
                                            <p className="text-xl font-bold text-red-600">{formatCurrency(parsedExpense.amount)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                    <p className="text-xs text-zinc-500 mb-1">Keterangan</p>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{parsedExpense.description}</p>
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
                                <p className="font-semibold text-green-600">Berhasil Dicatat!</p>
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

                        {/* Stock check - just close button */}
                        {status === 'confirming_stock' && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => { cancel(); startListening(); }} className="flex-1 rounded-xl h-11 gap-2">
                                    <SafeIcon name="Mic" className="h-4 w-4" />
                                    Perintah Lain
                                </Button>
                                <Button onClick={handleClose} className="flex-1 rounded-xl h-11 gap-2 bg-blue-500 hover:bg-blue-600">
                                    <SafeIcon name="Check" className="h-4 w-4" />
                                    Oke
                                </Button>
                            </div>
                        )}

                        {/* Expense confirmation - save or retry */}
                        {status === 'confirming_expense' && (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => { cancel(); startListening(); }} className="flex-1 rounded-xl h-11 gap-2">
                                    <SafeIcon name="RotateCcw" className="h-4 w-4" />
                                    Ulangi
                                </Button>
                                <Button onClick={confirmExpense} className="flex-1 rounded-xl h-11 gap-2 bg-orange-500 hover:bg-orange-600">
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
