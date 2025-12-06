
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface StockActionsProps {
  onUpdateClick?: () => void
}

export default function StockActions({ onUpdateClick }: StockActionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-2.5 mb-2.5">
      <Button 
        onClick={onUpdateClick}
        className="h-auto flex-col gap-2 py-4"
        variant="outline"
      >
        <SafeIcon name="Plus" className="h-5 w-5" />
        <span className="text-sm font-medium">Update Stok</span>
      </Button>
      
      <Button 
        variant="outline"
        className="h-auto flex-col gap-2 py-4"
        disabled
      >
        <SafeIcon name="TrendingDown" className="h-5 w-5" />
        <span className="text-sm font-medium">Laporan Pemakaian</span>
      </Button>
      
      <Button 
        variant="outline"
        className="h-auto flex-col gap-2 py-4"
        disabled
      >
        <SafeIcon name="AlertTriangle" className="h-5 w-5" />
        <span className="text-sm font-medium">Stok Menipis</span>
      </Button>
      
      <Button 
        variant="outline"
        className="h-auto flex-col gap-2 py-4"
        disabled
      >
        <SafeIcon name="Download" className="h-5 w-5" />
        <span className="text-sm font-medium">Export Data</span>
      </Button>
    </div>
  )
}
