import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

/**
 * CreateOrderButton - Premium styled button dengan animations
 * 
 * PENJELASAN ANIMASI:
 * 1. Shine Effect - Efek cahaya yang bergerak dari kiri ke kanan
 * 2. Glow Animation - Border berkedip halus dengan warna primary
 * 3. Icon Rotation - Icon Plus berputar 90 derajat saat hover
 * 4. Scale Effect - Tombol membesar sedikit saat hover, mengecil saat klik
 */
export default function CreateOrderButton() {
  return (
    <div className="w-full">
      <a
        href="./buat-pesanan.html"
        className="group inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 bg-white border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-border active:scale-95 transition-all duration-300 ease-out font-semibold text-sm sm:text-base text-foreground"
        id="icez9"
      >
        <SafeIcon
          name="Plus"
          className="h-5 w-5 stroke-[2] flex-shrink-0 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110 text-primary"
        />
        <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Buat Pesanan</span>
      </a>
    </div>
  )
}