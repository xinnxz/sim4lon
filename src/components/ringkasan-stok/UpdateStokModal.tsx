'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import UpdateStokForm from '@/components/update-stok/UpdateStokForm'

interface UpdateStokModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function UpdateStokModal({ open, onOpenChange, onSuccess }: UpdateStokModalProps) {
  const handleSuccess = () => {
    onSuccess?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Stok LPG</DialogTitle>
          <DialogDescription>
            Catat pemasukan atau pengeluaran stok LPG
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <UpdateStokForm
            onClose={() => onOpenChange(false)}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}