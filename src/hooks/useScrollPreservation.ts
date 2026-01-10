/**
 * useScrollPreservation - Hook untuk menjaga posisi scroll saat refetch data
 * 
 * Masalah: Saat modal ditutup dan data di-refetch, halaman scroll ke atas
 * Solusi: Simpan posisi scroll sebelum refetch, restore setelah selesai
 * 
 * Usage:
 * const { preserveScroll, restoreScroll } = useScrollPreservation()
 * 
 * const handleSubmit = async () => {
 *   preserveScroll()  // Simpan posisi
 *   await fetchData()
 *   restoreScroll()   // Kembalikan posisi
 * }
 */

import { useRef, useCallback } from 'react'

export function useScrollPreservation() {
    const scrollPositionRef = useRef<number>(0)

    /**
     * Simpan posisi scroll saat ini
     */
    const preserveScroll = useCallback(() => {
        scrollPositionRef.current = window.scrollY
    }, [])

    /**
     * Kembalikan ke posisi scroll yang tersimpan
     * Menggunakan requestAnimationFrame untuk memastikan DOM sudah update
     */
    const restoreScroll = useCallback(() => {
        requestAnimationFrame(() => {
            window.scrollTo({
                top: scrollPositionRef.current,
                behavior: 'instant' // Instant, bukan smooth agar tidak terlihat scrolling
            })
        })
    }, [])

    /**
     * Wrapper untuk async function yang menjaga scroll position
     */
    const withScrollPreservation = useCallback(<T,>(asyncFn: () => Promise<T>): Promise<T> => {
        preserveScroll()
        return asyncFn().finally(() => {
            restoreScroll()
        })
    }, [preserveScroll, restoreScroll])

    return {
        preserveScroll,
        restoreScroll,
        withScrollPreservation,
        scrollPosition: scrollPositionRef.current
    }
}

/**
 * usePreventScrollReset - Mencegah scroll reset saat state berubah
 * 
 * Berguna untuk halaman dengan banyak state update yang menyebabkan re-render
 */
export function usePreventScrollReset() {
    const scrollRef = useRef<number>(0)
    const isPreservingRef = useRef<boolean>(false)

    const startPreserving = useCallback(() => {
        isPreservingRef.current = true
        scrollRef.current = window.scrollY
    }, [])

    const stopPreserving = useCallback(() => {
        if (isPreservingRef.current) {
            requestAnimationFrame(() => {
                window.scrollTo(0, scrollRef.current)
                isPreservingRef.current = false
            })
        }
    }, [])

    return { startPreserving, stopPreserving }
}
