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
  status: string
}

interface DisableUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onConfirmDisable: (userId: string) => void
  isDisabling?: boolean
}

export default function DisableUserModal({
  open,
  onOpenChange,
  user,
  onConfirmDisable,
  isDisabling = false,
}: DisableUserModalProps) {
  const handleConfirm = () => {
    if (user) {
      onConfirmDisable(user.id)
    }
  }

  const isAlreadyInactive = user?.status === 'inactive'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-200">
              <SafeIcon name="AlertCircle" className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {isAlreadyInactive ? 'Aktifkan Pengguna' : 'Nonaktifkan Pengguna'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base mt-4">
            <div className="space-y-3">
              <p className="text-foreground font-medium">
                {isAlreadyInactive
                  ? 'Apakah Anda yakin ingin mengaktifkan pengguna ini?'
                  : 'Apakah Anda yakin ingin menonaktifkan pengguna ini?'}
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
                      <span className="text-muted-foreground font-medium min-w-24">Status:</span>
                      <span className="font-medium">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                          user.status === 'inactive'
                            ? 'bg-red-100 text-red-900'
                            : 'bg-green-100 text-green-900'
                        }`}>
                          {user.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className={`rounded-lg p-3 border flex gap-2 ${
                isAlreadyInactive
                  ? 'bg-green-50 border-green-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <SafeIcon
                  name={isAlreadyInactive ? 'CheckCircle' : 'AlertTriangle'}
                  className={`h-5 w-5 shrink-0 mt-0.5 ${
                    isAlreadyInactive ? 'text-green-600' : 'text-amber-600'
                  }`}
                />
                <p className={`text-sm ${
                  isAlreadyInactive ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {isAlreadyInactive
                    ? 'Pengguna akan dapat mengakses sistem kembali setelah diaktifkan.'
                    : 'Pengguna tidak akan dapat mengakses sistem sampai diaktifkan kembali.'}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDisabling}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isDisabling}
            className={isAlreadyInactive
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-amber-600 hover:bg-amber-700 text-white"}
          >
            {isDisabling ? (
              <>
                <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                {isAlreadyInactive ? 'Mengaktifkan...' : 'Menonaktifkan...'}
              </>
            ) : (
              <>
                <SafeIcon name={isAlreadyInactive ? 'Check' : 'Power'} className="mr-2 h-4 w-4" />
                {isAlreadyInactive ? 'Aktifkan Pengguna' : 'Nonaktifkan Pengguna'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}