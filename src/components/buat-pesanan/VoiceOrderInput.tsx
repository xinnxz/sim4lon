/**
 * VoiceOrderInput - Komponen UI untuk Voice Order
 * 
 * PENJELASAN:
 * Komponen ini menampilkan tombol mikrofon untuk input pesanan via suara.
 * Menggunakan useSpeechRecognition hook untuk speech-to-text dan
 * voiceOrderParser untuk NLP parsing.
 * 
 * FITUR:
 * - Tombol mikrofon dengan animasi recording
 * - Real-time transcript display
 * - Dialog konfirmasi sebelum auto-fill
 * - Error handling dengan fallback ke manual input
 */

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { parseVoiceCommand, mapKeywordToProductSize, type VoiceOrderIntent } from '@/lib/voiceOrderParser'

interface PangkalanOption {
    id: string
    name: string
}

interface LpgProductOption {
    id: string
    name: string
    size_kg: number
}

interface VoiceOrderResult {
    pangkalanId: string | null
    items: Array<{
        productId: string
        quantity: number
    }>
}

interface VoiceOrderInputProps {
    /** List of available pangkalan for fuzzy matching */
    pangkalanList: PangkalanOption[]
    /** List of available LPG products */
    lpgProducts: LpgProductOption[]
    /** Callback when voice order is confirmed */
    onVoiceOrderConfirmed: (result: VoiceOrderResult) => void
    /** Disabled state */
    disabled?: boolean
}

export default function VoiceOrderInput({
    pangkalanList,
    lpgProducts,
    onVoiceOrderConfirmed,
    disabled = false,
}: VoiceOrderInputProps) {
    const {
        isListening,
        transcript,
        interimTranscript,
        error,
        isSupported,
        confidence,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition()

    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [parsedIntent, setParsedIntent] = useState<VoiceOrderIntent | null>(null)
    const [matchedItems, setMatchedItems] = useState<Array<{ product: LpgProductOption; quantity: number }>>([])
    const [matchedPangkalan, setMatchedPangkalan] = useState<PangkalanOption | null>(null)

    // Parse transcript when it changes
    useEffect(() => {
        if (transcript && !isListening) {
            const intent = parseVoiceCommand(transcript, pangkalanList)
            setParsedIntent(intent)

            // Match products
            const items: Array<{ product: LpgProductOption; quantity: number }> = []
            for (const item of intent.items) {
                const targetSize = mapKeywordToProductSize(item.productKeyword)
                if (targetSize !== null) {
                    const product = lpgProducts.find(p =>
                        Math.abs(p.size_kg - targetSize) < 0.5
                    )
                    if (product) {
                        items.push({ product, quantity: item.quantity })
                    }
                }
            }
            setMatchedItems(items)

            // Match pangkalan
            if (intent.matchedPangkalanId) {
                const pangkalan = pangkalanList.find(p => p.id === intent.matchedPangkalanId)
                setMatchedPangkalan(pangkalan || null)
            } else {
                setMatchedPangkalan(null)
            }

            // Show confirmation if we have something
            if (items.length > 0 || intent.matchedPangkalanId) {
                setShowConfirmDialog(true)
            } else if (intent.intent === 'UNKNOWN') {
                toast.warning('Tidak dapat memahami perintah. Silakan coba lagi atau input manual.')
            }
        }
    }, [transcript, isListening, pangkalanList, lpgProducts])

    // Handle start/stop recording
    const handleMicClick = useCallback(() => {
        if (isListening) {
            stopListening()
        } else {
            resetTranscript()
            setParsedIntent(null)
            setMatchedItems([])
            setMatchedPangkalan(null)
            startListening()
        }
    }, [isListening, startListening, stopListening, resetTranscript])

    // Handle confirm
    const handleConfirm = useCallback(() => {
        const result: VoiceOrderResult = {
            pangkalanId: matchedPangkalan?.id || null,
            items: matchedItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
            })),
        }

        onVoiceOrderConfirmed(result)
        setShowConfirmDialog(false)
        resetTranscript()

        toast.success('Form terisi otomatis dari perintah suara!')
    }, [matchedPangkalan, matchedItems, onVoiceOrderConfirmed, resetTranscript])

    // Handle cancel
    const handleCancel = useCallback(() => {
        setShowConfirmDialog(false)
        resetTranscript()
        setParsedIntent(null)
    }, [resetTranscript])

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    // If not supported, show disabled button
    if (!isSupported) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <SafeIcon name="MicOff" className="h-4 w-4" />
                <span className="text-sm">Browser tidak mendukung voice input</span>
            </div>
        )
    }

    return (
        <>
            {/* Voice Input Card */}
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <SafeIcon name="Mic" className="h-4 w-4 text-primary" />
                        Pesan dengan Suara
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Mic Button */}
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            variant={isListening ? 'destructive' : 'default'}
                            size="lg"
                            onClick={handleMicClick}
                            disabled={disabled}
                            className={`
                relative rounded-full h-16 w-16 p-0
                ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}
              `}
                        >
                            <SafeIcon
                                name={isListening ? 'MicOff' : 'Mic'}
                                className="h-6 w-6"
                            />
                            {isListening && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 animate-ping" />
                            )}
                        </Button>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                        {isListening ? (
                            <Badge variant="destructive" className="animate-pulse">
                                <SafeIcon name="Radio" className="h-3 w-3 mr-1" />
                                Mendengarkan...
                            </Badge>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Klik tombol dan ucapkan pesanan Anda
                            </p>
                        )}
                    </div>

                    {/* Live Transcript */}
                    {(transcript || interimTranscript) && (
                        <div className="p-3 bg-background rounded-lg border">
                            <p className="text-sm text-foreground">
                                {transcript}
                                <span className="text-muted-foreground italic">{interimTranscript}</span>
                            </p>
                            {confidence > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Confidence: {Math.round(confidence * 100)}%
                                </p>
                            )}
                        </div>
                    )}

                    {/* Example */}
                    <p className="text-xs text-muted-foreground text-center">
                        Contoh: "Pesan 50 tabung 3 kilo ke Pangkalan Mitra Jaya"
                    </p>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <SafeIcon name="CheckCircle" className="h-5 w-5 text-primary" />
                            Konfirmasi Pesanan
                        </DialogTitle>
                        <DialogDescription>
                            Hasil parsing dari perintah suara Anda:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Detected Items */}
                        {matchedItems.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Item Pesanan:</p>
                                {matchedItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                                    >
                                        <span className="text-sm">{item.product.name}</span>
                                        <Badge variant="secondary">{item.quantity} unit</Badge>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Detected Pangkalan */}
                        {matchedPangkalan && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Pangkalan:</p>
                                <div className="p-2 bg-secondary rounded-lg">
                                    <span className="text-sm">{matchedPangkalan.name}</span>
                                </div>
                            </div>
                        )}

                        {/* Confidence */}
                        {parsedIntent && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    Confidence: {Math.round(parsedIntent.confidence * 100)}%
                                </span>
                                {parsedIntent.confidence >= 0.7 ? (
                                    <Badge variant="default" className="bg-green-500">Tinggi</Badge>
                                ) : parsedIntent.confidence >= 0.4 ? (
                                    <Badge variant="secondary">Sedang</Badge>
                                ) : (
                                    <Badge variant="destructive">Rendah</Badge>
                                )}
                            </div>
                        )}

                        {/* Raw Text */}
                        <div className="p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">Teks asli:</p>
                            <p className="text-sm italic">"{parsedIntent?.rawText}"</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Batal
                        </Button>
                        <Button onClick={handleConfirm}>
                            <SafeIcon name="Check" className="h-4 w-4 mr-2" />
                            Gunakan Hasil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
