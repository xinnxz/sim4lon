import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ManageLPGTypesForm from './ManageLPGTypesForm'

interface ManageLPGTypesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ManageLPGTypesModal({ open, onOpenChange }: ManageLPGTypesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manajemen Jenis LPG</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <ManageLPGTypesForm onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}