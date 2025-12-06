
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/SafeIcon'

interface ReportNavigationProps {
  currentPage: string
}

export default function ReportNavigation({ currentPage }: ReportNavigationProps) {
  const reports = [
    {
      id: 'tren_penjualan',
      label: 'Tren Penjualan',
      href: './tren-penjualan.html',
      icon: 'TrendingUp'
    },
    {
      id: 'status_pembayaran',
      label: 'Status Pembayaran',
      href: './status-pembayaran.html',
      icon: 'PieChart'
    },
    {
      id: 'pemakaian_stok',
      label: 'Pemakaian Stok',
      href: './pemakaian-stok.html',
      icon: 'Package'
    },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {reports.map((report) => (
        <a
          key={report.id}
          href={report.href}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            currentPage === report.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          <SafeIcon name={report.icon} className="h-4 w-4" />
          <span className="text-sm font-medium">{report.label}</span>
        </a>
      ))}
    </div>
  )
}
