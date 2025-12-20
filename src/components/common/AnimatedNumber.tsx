import { useCountUp } from '@/hooks/useCountUp'

/**
 * Format angka dengan separator ribuan Indonesia
 */
function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Format angka sebagai currency Rupiah
 */
function formatCurrency(num: number): string {
    return `Rp ${formatNumber(num)}`
}

interface AnimatedNumberProps {
    /** Nilai akhir yang ditampilkan */
    value: number
    /** Delay sebelum animasi dimulai (untuk staggered effect) */
    delay?: number
    /** Custom class untuk styling */
    className?: string
    /** Apakah format sebagai currency Rupiah */
    isCurrency?: boolean
    /** Prefix sebelum angka (contoh: "Rp") */
    prefix?: string
    /** Suffix setelah angka (contoh: " tabung") */
    suffix?: string
    /** Durasi animasi dalam ms */
    duration?: number
}

/**
 * AnimatedNumber - Komponen untuk menampilkan angka dengan efek count-up
 * 
 * @example
 * <AnimatedNumber value={1500} delay={100} suffix=" tabung" />
 * <AnimatedNumber value={50000000} isCurrency delay={200} />
 */
export default function AnimatedNumber({
    value,
    delay = 0,
    className = '',
    isCurrency = false,
    prefix = '',
    suffix = '',
    duration = 1200
}: AnimatedNumberProps) {
    const animatedValue = useCountUp(value, duration, delay)

    const formattedValue = isCurrency
        ? formatCurrency(animatedValue)
        : formatNumber(animatedValue)

    return (
        <span
            className={`animate-countUp ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {prefix}{formattedValue}{suffix}
        </span>
    )
}

// Export formatters untuk dipakai di tempat lain
export { formatNumber, formatCurrency }
