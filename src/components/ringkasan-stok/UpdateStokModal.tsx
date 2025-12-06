'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import UpdateStokForm from '@/components/update-stok/UpdateStokForm'

interface UpdateStokModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdateStokModal({ open, onOpenChange }: UpdateStokModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Stok LPG</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <UpdateStokForm onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}