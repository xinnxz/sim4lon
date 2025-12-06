
import SafeIcon from '@/components/common/SafeIcon'

export default function DashboardQuickActions() {
  return (
    <a 
      href="./buat-pesanan.html"
      className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-medium text-sm"
    >
      <SafeIcon name="Plus" className="h-4 w-4" />
      <span>Buat Pesanan</span>
    </a>
  )
}
