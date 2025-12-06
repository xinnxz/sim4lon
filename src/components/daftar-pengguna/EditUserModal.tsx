'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import EditUserForm from '@/components/edit-pengguna/EditUserForm'

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  onSuccess?: () => void
}

export default function EditUserModal({ open, onOpenChange, userId, onSuccess }: EditUserModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui informasi pengguna sistem
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EditUserForm onClose={() => {
            onOpenChange(false)
            onSuccess?.()
          }} userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}