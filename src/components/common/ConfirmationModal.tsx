'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  icon?: string
  iconColor?: string
  isLoading?: boolean
  isDangerous?: boolean
  onConfirm: () => void | Promise<void>
}

export default function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  icon = 'AlertTriangle',
  iconColor = 'text-primary',
  isLoading = false,
  isDangerous = false,
  onConfirm,
}: ConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDangerous ? 'bg-destructive/10' : 'bg-primary/10'}`}>
              <SafeIcon 
                name={icon} 
                className={`h-5 w-5 ${isDangerous ? 'text-destructive' : iconColor}`}
              />
            </div>
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base mt-4">
            <p className="text-foreground font-medium">{description}</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={isDangerous ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-primary hover:bg-primary/90'}
          >
            {isLoading ? (
              <>
                <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}