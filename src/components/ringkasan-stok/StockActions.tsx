
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface StockActionsProps {
  onUpdateClick?: () => void
  onManageLPGClick?: () => void
}

export default function StockActions({ onUpdateClick, onManageLPGClick }: StockActionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 mt-2.5 mb-2.5">
      <Button 
        onClick={onUpdateClick}
        className="h-auto flex-col gap-2 py-4"
        variant="outline"
      >
        <SafeIcon name="Plus" className="h-5 w-5" />
        <span className="text-sm font-medium">Update Stok</span>
      </Button>
      
<Button 
        onClick={onManageLPGClick}
        variant="outline"
        className="h-auto flex-col gap-2 py-4"
      >
        <SafeIcon name="Settings" className="h-5 w-5" />
        <span className="text-sm font-medium">Kelola LPG</span>
      </Button>
    </div>
  )
}
