/**
 * OptimizedImage - Lazy loading image component with blur placeholder
 * 
 * Features:
 * - Native lazy loading
 * - Blur placeholder while loading
 * - WebP format support
 * - Responsive sizing
 * - Error fallback
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean // Load immediately (for above-the-fold images)
    fallback?: string // Fallback image on error
    placeholder?: 'blur' | 'empty'
}

export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    fallback = '/placeholder-image.png',
    placeholder = 'blur'
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [isInView, setIsInView] = useState(priority)
    const imgRef = useRef<HTMLImageElement>(null)

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || !imgRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true)
                        observer.disconnect()
                    }
                })
            },
            {
                rootMargin: '50px', // Start loading 50px before viewport
                threshold: 0
            }
        )

        observer.observe(imgRef.current)

        return () => observer.disconnect()
    }, [priority])

    const handleLoad = () => {
        setIsLoading(false)
    }

    const handleError = () => {
        setHasError(true)
        setIsLoading(false)
    }

    const imageSrc = hasError ? fallback : src

    return (
        <div
            ref={imgRef}
            className={cn(
                'relative overflow-hidden',
                className
            )}
            style={{
                width: width ? `${width}px` : undefined,
                height: height ? `${height}px` : undefined,
            }}
        >
            {/* Blur placeholder */}
            {placeholder === 'blur' && isLoading && (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 animate-pulse"
                />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={imageSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'transition-opacity duration-300',
                        isLoading ? 'opacity-0' : 'opacity-100',
                        'w-full h-full object-cover'
                    )}
                />
            )}
        </div>
    )
}
