/**
 * AvatarCropperModal - Modal untuk crop gambar avatar
 * 
 * PENJELASAN:
 * Modal ini menampilkan interface untuk crop gambar sebelum upload.
 * Menggunakan react-image-crop untuk cropping dengan area lingkaran.
 * Output: cropped blob yang siap diupload ke server.
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
// CSS imported via global.css
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface AvatarCropperModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    imageSrc: string
    onCropComplete: (croppedBlob: Blob) => void
}

// Helper to center the crop
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function AvatarCropperModal({
    open,
    onOpenChange,
    imageSrc,
    onCropComplete,
}: AvatarCropperModalProps) {
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<Crop>()
    const [isProcessing, setIsProcessing] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    // When image loads, set initial centered crop
    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, 1)) // 1:1 aspect for avatar
    }, [])

    // Generate cropped image blob
    const getCroppedImg = useCallback(async (): Promise<Blob | null> => {
        const image = imgRef.current
        if (!image || !completedCrop) return null

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return null

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        // Set canvas size (output 300x300 for avatar)
        const outputSize = 300
        canvas.width = outputSize
        canvas.height = outputSize

        // Draw the cropped portion
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            outputSize,
            outputSize,
        )

        // Convert to blob
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => resolve(blob),
                'image/jpeg',
                0.9, // 90% quality
            )
        })
    }, [completedCrop])

    const handleSave = async () => {
        console.log('handleSave called, completedCrop:', completedCrop)
        setIsProcessing(true)
        try {
            const blob = await getCroppedImg()
            console.log('getCroppedImg result:', blob, blob?.size)
            if (blob) {
                onCropComplete(blob)
                onOpenChange(false)
            } else {
                console.error('Blob is null - crop failed')
            }
        } catch (error) {
            console.error('Error cropping image:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <SafeIcon name="Crop" className="h-5 w-5 text-primary" />
                        Crop Foto Profil
                    </DialogTitle>
                    <DialogDescription>
                        Sesuaikan area foto yang ingin digunakan sebagai avatar
                    </DialogDescription>
                </DialogHeader>

                {/* Crop Area */}
                <div className="flex justify-center overflow-hidden rounded-lg bg-muted p-2 max-h-[400px]">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                        circularCrop
                        className="max-h-[380px]"
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop preview"
                            onLoad={onImageLoad}
                            className="max-h-[380px] object-contain"
                            crossOrigin="anonymous"
                        />
                    </ReactCrop>
                </div>

                {/* Preview Indicator */}
                <p className="text-xs text-center text-muted-foreground">
                    <SafeIcon name="Info" className="inline h-3 w-3 mr-1" />
                    Drag untuk memindahkan, resize sudut untuk mengubah ukuran
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="flex-1"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isProcessing || !completedCrop}
                        className="flex-1 bg-primary hover:bg-primary/90"
                    >
                        {isProcessing ? (
                            <>
                                <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                                Gunakan Foto
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
