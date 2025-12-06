import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

export default function CreateOrderButton() {
  return (
    <div id="ik3r7o" className="w-full">
      <a 
        href="./buat-pesanan.html"
        className="inline-flex items-center gap-3 px-4 sm:px-5 py-3 bg-white border border-border rounded-xl shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-out font-medium text-sm sm:text-base text-foreground"
      >
        <SafeIcon name="Plus" className="h-5 w-5 stroke-[1.5] flex-shrink-0 transition-transform duration-300" />
        Buat Pesanan
      </a>
    </div>
  )
}