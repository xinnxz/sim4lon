
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

export default function DriverListHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeInDown">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daftar Supir</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola data supir/driver untuk pengiriman LPG
        </p>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
        onClick={() => {
          // Navigate to add driver page (to be implemented)
          window.location.href = './tambah-supir.html'
        }}
      >
        <SafeIcon name="Plus" className="h-4 w-4" />
        <span>Tambah Supir</span>
      </Button>
    </div>
  )
}
