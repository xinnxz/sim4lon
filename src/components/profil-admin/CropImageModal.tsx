'use client'

import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import SafeIcon from '@/components/common/SafeIcon'

interface CropImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedImage: string) => void
}

export default function CropImageModal({ open, onOpenChange, imageSrc, onCropComplete }: CropImageModalProps) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (err) => reject(err))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  useEffect(() => {
    if (!open || !imageSrc) return

    const loadImage = async () => {
      try {
        const img = await createImage(imageSrc)
        if (imageRef.current) {
          imageRef.current = img
          setImageLoaded(true)
          setZoom(1)
          setOffset({ x: 0, y: 0 })
        }
      } catch (error) {
        console.error('Error loading image:', error)
      }
    }

    loadImage()
  }, [open, imageSrc])

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const drawPreview = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const containerWidth = 400
    const containerHeight = 400
    
    canvas.width = containerWidth
    canvas.height = containerHeight

    const image = imageRef.current
    const aspectRatio = image.width / image.height

    let displayWidth = containerWidth * zoom
    let displayHeight = containerHeight * zoom

    if (aspectRatio > 1) {
      displayHeight = displayWidth / aspectRatio
    } else {
      displayWidth = displayHeight * aspectRatio
    }

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, containerWidth, containerHeight)

    ctx.drawImage(
      image,
      offset.x,
      offset.y,
      displayWidth,
      displayHeight
    )

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(containerWidth / 2, containerHeight / 2, Math.min(containerWidth, containerHeight) / 2, 0, Math.PI * 2)
    ctx.stroke()
  }

  useEffect(() => {
    drawPreview()
  }, [zoom, offset, imageLoaded])

  const getCroppedImg = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const image = imageRef.current
        if (!image) throw new Error('Image not loaded')

        const cropSize = 300
        const aspectRatio = image.width / image.height

        let sourceSize = cropSize
        if (aspectRatio > 1) {
          sourceSize = cropSize / aspectRatio
        }

        const sourceCanvas = document.createElement('canvas')
        const sourceCtx = sourceCanvas.getContext('2d')
        if (!sourceCtx) throw new Error('Failed to get canvas context')

        sourceCanvas.width = sourceSize
        sourceCanvas.height = sourceSize

        const centerX = image.width / 2
        const centerY = image.height / 2

        const displayWidth = 400 * zoom
        const displayHeight = 400 * zoom

        const sourceX = centerX - (sourceSize / 2) * (displayWidth / 400)
        const sourceY = centerY - (sourceSize / 2) * (displayHeight / 400)

        sourceCtx.drawImage(
          image,
          sourceX - offset.x / zoom,
          sourceY - offset.y / zoom,
          displayWidth,
          displayHeight,
          0,
          0,
          sourceSize,
          sourceSize
        )

        const finalCanvas = document.createElement('canvas')
        const finalCtx = finalCanvas.getContext('2d')
        if (!finalCtx) throw new Error('Failed to get canvas context')

        finalCanvas.width = cropSize
        finalCanvas.height = cropSize

        finalCtx.fillStyle = '#ffffff'
        finalCtx.fillRect(0, 0, cropSize, cropSize)

        finalCtx.beginPath()
        finalCtx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2)
        finalCtx.clip()

        finalCtx.drawImage(sourceCanvas, 0, 0)

        finalCanvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'))
            return
          }
          const url = URL.createObjectURL(blob)
          resolve(url)
        }, 'image/jpeg')
      } catch (error) {
        reject(error)
      }
    })
  }

  const handleApplyCrop = async () => {
    setIsProcessing(true)
    try {
      const croppedImage = await getCroppedImg()
      onCropComplete(croppedImage)
      onOpenChange(false)
    } catch (error) {
      console.error('Error cropping image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const sliderStyles: CSSProperties = {
    background: `linear-gradient(to right, hsl(152 100% 30%) 0%, hsl(152 100% 30%) ${((zoom - 1) / 2) * 100}%, hsl(220 13% 91%) ${((zoom - 1) / 2) * 100}%, hsl(220 13% 91%) 100%)`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SafeIcon name="Crop" className="h-5 w-5 text-primary" />
            Pangkas Foto Profil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canvas Cropper */}
          <div
            ref={containerRef}
            className="relative w-full bg-black rounded-lg overflow-hidden cursor-move"
            style={{ height: '400px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ display: 'block' }}
            />
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <SafeIcon name="ZoomIn" className="h-4 w-4 inline mr-2" />
              Perbesar ({Math.round((zoom - 1) * 100)}%)
            </label>
            <div className="flex items-center gap-2">
              <SafeIcon name="Minus" className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <SafeIcon name="Plus" className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
            <p>💡 Gunakan slider untuk memperbesar/memperkecil, lalu tarik untuk memposisikan gambar sesuai kebutuhan</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing || !imageLoaded}
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
                  Terapkan Pangkasan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}