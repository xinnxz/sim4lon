/**
 * useSpeechRecognition - Custom React Hook untuk Web Speech API
 * 
 * PENJELASAN:
 * Hook ini menyediakan interface untuk speech recognition di browser.
 * Menggunakan Web Speech API yang native di Chrome, Edge, dan Safari.
 * 
 * FITUR:
 * - Start/stop recording
 * - Real-time transcript
 * - Error handling (permission denied, not supported)
 * - Support Bahasa Indonesia (id-ID)
 * - AUTO-STOP after silence (2 seconds)
 * 
 * USAGE:
 * const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({ onSpeechEnd })
 */

import { useState, useEffect, useCallback, useRef } from 'react'

// Type definitions for Web Speech API (not included in standard TypeScript)
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message?: string
}

interface SpeechRecognitionResult {
    isFinal: boolean
    [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
}

interface SpeechRecognitionResultList {
    length: number
    [index: number]: SpeechRecognitionResult
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    abort(): void
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
    onstart: (() => void) | null
    onspeechend: (() => void) | null
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition
        webkitSpeechRecognition: new () => SpeechRecognition
    }
}

export interface UseSpeechRecognitionOptions {
    /** Callback when speech ends (auto-stop) */
    onSpeechEnd?: (transcript: string) => void
    /** Auto-stop after silence (ms). Set to 0 to disable. Default: 2000ms */
    silenceTimeout?: number
    /** Auto-stop after speech ends. Default: true */
    autoStop?: boolean
}

export interface UseSpeechRecognitionResult {
    /** Apakah sedang mendengarkan */
    isListening: boolean
    /** Hasil transcript dari speech */
    transcript: string
    /** Interim transcript (real-time, belum final) */
    interimTranscript: string
    /** Error message jika ada */
    error: string | null
    /** Apakah browser mendukung Web Speech API */
    isSupported: boolean
    /** Confidence score (0-1) dari hasil terakhir */
    confidence: number
    /** Mulai mendengarkan */
    startListening: () => void
    /** Berhenti mendengarkan */
    stopListening: () => void
    /** Reset transcript */
    resetTranscript: () => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionResult {
    const {
        onSpeechEnd,
        silenceTimeout = 2000,  // 2 seconds of silence to auto-stop
        autoStop = true
    } = options

    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [interimTranscript, setInterimTranscript] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [confidence, setConfidence] = useState(0)

    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const lastSpeechTimeRef = useRef<number>(Date.now())
    const transcriptRef = useRef<string>('')  // To access latest transcript in callbacks

    // Check browser support
    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

    // Clear silence timer
    const clearSilenceTimer = useCallback(() => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = null
        }
    }, [])

    // Reset silence timer
    const resetSilenceTimer = useCallback(() => {
        if (!autoStop || silenceTimeout <= 0) return

        clearSilenceTimer()
        lastSpeechTimeRef.current = Date.now()

        silenceTimerRef.current = setTimeout(() => {
            console.log('[SpeechRecognition] Silence timeout - auto-stopping...')
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }, silenceTimeout)
    }, [autoStop, silenceTimeout, clearSilenceTimer])

    // Track if speech has started (to avoid early timeout)
    const hasSpeechStartedRef = useRef(false)

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported) return

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognitionAPI()

        // Configuration
        recognition.continuous = true  // Keep listening until stopped
        recognition.interimResults = true  // Get real-time results
        recognition.lang = 'id-ID'  // Bahasa Indonesia

        // Event handlers
        recognition.onstart = () => {
            setIsListening(true)
            setError(null)
            hasSpeechStartedRef.current = false  // Reset flag
            console.log('[SpeechRecognition] Started listening...')

            // DON'T start silence timer here - wait for first speech
            // This prevents early timeout when user takes time to start speaking
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = ''
            let interim = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                const text = result[0].transcript

                if (result.isFinal) {
                    finalTranscript += text
                    setConfidence(result[0].confidence)
                } else {
                    interim += text
                }
            }

            if (finalTranscript) {
                setTranscript(prev => {
                    const newTranscript = prev + finalTranscript
                    transcriptRef.current = newTranscript
                    return newTranscript
                })
            }
            setInterimTranscript(interim)

            // Only start/reset silence timer AFTER first speech is detected
            if (finalTranscript || interim) {
                if (!hasSpeechStartedRef.current) {
                    hasSpeechStartedRef.current = true
                    console.log('[SpeechRecognition] First speech detected, starting silence timer')
                }
                // Reset timer on each speech activity
                resetSilenceTimer()
            }
        }

        // Speech end event - user stopped speaking
        recognition.onspeechend = () => {
            console.log('[SpeechRecognition] Speech ended - user stopped speaking')
            // Don't call stop() here, let silence timer handle it
            // This gives user time to continue if they're just pausing
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('[SpeechRecognition] Error:', event.error)
            clearSilenceTimer()

            let errorMessage = 'Terjadi kesalahan'
            switch (event.error) {
                case 'not-allowed':
                case 'permission-denied':
                    errorMessage = 'Izin mikrofon ditolak. Silakan aktifkan di pengaturan browser.'
                    break
                case 'no-speech':
                    errorMessage = 'Tidak ada suara terdeteksi. Silakan coba lagi.'
                    break
                case 'network':
                    errorMessage = 'Koneksi internet diperlukan untuk speech recognition.'
                    break
                case 'aborted':
                    errorMessage = 'Speech recognition dibatalkan.'
                    break
                case 'audio-capture':
                    errorMessage = 'Mikrofon tidak ditemukan atau tidak bisa diakses.'
                    break
                default:
                    errorMessage = `Error: ${event.error}`
            }

            setError(errorMessage)
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
            clearSilenceTimer()
            console.log('[SpeechRecognition] Stopped listening')

            // Call onSpeechEnd callback with final transcript
            if (onSpeechEnd && transcriptRef.current) {
                console.log('[SpeechRecognition] Calling onSpeechEnd with:', transcriptRef.current)
                onSpeechEnd(transcriptRef.current)
            }
        }

        recognitionRef.current = recognition

        // Cleanup
        return () => {
            clearSilenceTimer()
            recognition.abort()
        }
    }, [isSupported, autoStop, silenceTimeout, resetSilenceTimer, clearSilenceTimer, onSpeechEnd])

    // Start listening
    const startListening = useCallback(() => {
        if (!recognitionRef.current) {
            setError('Browser tidak mendukung Speech Recognition')
            return
        }

        // Reset state
        setTranscript('')
        setInterimTranscript('')
        setError(null)
        setConfidence(0)
        transcriptRef.current = ''

        try {
            recognitionRef.current.start()
        } catch (err) {
            // Already started
            console.warn('[SpeechRecognition] Already listening')
        }
    }, [])

    // Stop listening
    const stopListening = useCallback(() => {
        clearSilenceTimer()
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
    }, [clearSilenceTimer])

    // Reset transcript
    const resetTranscript = useCallback(() => {
        setTranscript('')
        setInterimTranscript('')
        setConfidence(0)
        transcriptRef.current = ''
    }, [])

    return {
        isListening,
        transcript,
        interimTranscript,
        error,
        isSupported,
        confidence,
        startListening,
        stopListening,
        resetTranscript,
    }
}

export default useSpeechRecognition

