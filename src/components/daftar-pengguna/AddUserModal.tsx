'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import AddUserForm from '@/components/tambah-pengguna/AddUserForm'

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddUserModal({ open, onOpenChange, onSuccess }: AddUserModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Daftarkan pengguna baru ke dalam sistem SIM4LON
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddUserForm onClose={() => {
            onOpenChange(false)
            onSuccess?.()
          }} />
        </div>
      </DialogContent>
    </Dialog>
  )
}