'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface DeleteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onConfirmDelete: (userId: string) => void
  isDeleting?: boolean
}

export default function DeleteUserModal({
  open,
  onOpenChange,
  user,
  onConfirmDelete,
  isDeleting = false,
}: DeleteUserModalProps) {
  const handleConfirm = () => {
    if (user) {
      onConfirmDelete(user.id)
    }
  }

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <SafeIcon name="Trash2" className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-bold">Hapus Pengguna</DialogTitle>
          </div>
          <DialogDescription className="text-base mt-4">
            <div className="space-y-3">
              <p className="text-foreground font-medium">
                Apakah Anda yakin ingin menghapus pengguna ini?
              </p>
              {user && (
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground font-medium min-w-24">Nama:</span>
                      <span className="font-semibold text-foreground">{user.name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground font-medium min-w-24">Email:</span>
                      <span className="text-muted-foreground break-all">{user.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground font-medium min-w-24">Peran:</span>
                      <span className="font-medium text-foreground capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20 flex gap-2">
                <SafeIcon name="AlertTriangle" className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">
                  Tindakan ini tidak dapat dibatalkan. Data pengguna akan dihapus secara permanen dari sistem.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? (
              <>
                <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <SafeIcon name="Trash2" className="mr-2 h-4 w-4" />
                Hapus Pengguna
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}