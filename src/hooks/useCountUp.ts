import { useState, useEffect, useRef } from 'react'

/**
 * useCountUp - Hook untuk animasi angka yang naik dari 0 ke target value
 * 
 * @param target - Nilai akhir yang ingin dicapai
 * @param duration - Durasi animasi dalam ms (default: 1200ms untuk versi ringan)
 * @param startDelay - Delay sebelum animasi dimulai (untuk staggered effect)
 * @returns Current animated value
 * 
 * @example
 * const animatedValue = useCountUp(100, 1000, 200)
 * // Akan mengembalikan 0 → 100 selama 1 detik, dimulai setelah 200ms
 */
export function useCountUp(
    target: number,
    duration: number = 1200,
    startDelay: number = 0
): number {
    const [count, setCount] = useState(0)
    const startTimeRef = useRef<number | null>(null)
    const frameRef = useRef<number | null>(null)

    useEffect(() => {
        // Reset jika target berubah
        setCount(0)
        startTimeRef.current = null

        if (target === 0) return

        const startAnimation = () => {
            const animate = (timestamp: number) => {
                if (startTimeRef.current === null) {
                    startTimeRef.current = timestamp
                }

                const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
                // Easing function: easeOutExpo - cepat di awal, melambat di akhir
                const easeProgress = 1 - Math.pow(2, -10 * progress)
                setCount(Math.floor(easeProgress * target))

                if (progress < 1) {
                    frameRef.current = requestAnimationFrame(animate)
                } else {
                    setCount(target) // Pastikan nilai akhir tepat
                }
            }
            frameRef.current = requestAnimationFrame(animate)
        }

        const timeoutId = setTimeout(startAnimation, startDelay)

        return () => {
            clearTimeout(timeoutId)
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current)
            }
            startTimeRef.current = null
        }
    }, [target, duration, startDelay])

    return count
}

export default useCountUp
