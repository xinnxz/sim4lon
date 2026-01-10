/**
 * ConfirmDialog - Custom Confirmation Dialog
 * 
 * Menggantikan browser confirm() yang jelek dengan dialog yang lebih informatif.
 * 
 * Features:
 * - Customizable title, message, icon
 * - Destructive variant untuk delete actions
 * - Keyboard support (Enter=confirm, Escape=cancel)
 * - Accessible dengan proper focus management
 */

'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface ConfirmDialogOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    icon?: string
}

interface ConfirmDialogContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null)

/**
 * useConfirmDialog - Hook untuk menampilkan custom confirmation dialog
 * 
 * Fallback ke browser confirm() jika dipanggil di luar ConfirmDialogProvider
 * (misalnya saat SSR build atau halaman tanpa provider)
 */
export function useConfirmDialog(): ConfirmDialogContextType {
    const context = useContext(ConfirmDialogContext)

    // Fallback: gunakan browser confirm() jika tidak ada provider
    if (!context) {
        return {
            confirm: async (options: ConfirmDialogOptions) => {
                // SSR check - return false if no window
                if (typeof window === 'undefined') {
                    return false
                }
                // Fallback ke browser confirm
                return window.confirm(`${options.title}\n\n${options.message}`)
            }
        }
    }

    return context
}

interface ConfirmDialogProviderProps {
    children: React.ReactNode
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [options, setOptions] = useState<ConfirmDialogOptions | null>(null)
    const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null)

    const confirm = useCallback((opts: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(opts)
            setResolveRef(() => resolve)
            setIsOpen(true)
        })
    }, [])

    const handleConfirm = useCallback(() => {
        resolveRef?.(true)
        setIsOpen(false)
    }, [resolveRef])

    const handleCancel = useCallback(() => {
        resolveRef?.(false)
        setIsOpen(false)
    }, [resolveRef])

    // Keyboard shortcuts
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                handleConfirm()
            } else if (e.key === 'Escape') {
                e.preventDefault()
                handleCancel()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, handleConfirm, handleCancel])

    const isDestructive = options?.variant === 'destructive'

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}

            <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDestructive
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                <SafeIcon
                                    name={options?.icon || (isDestructive ? 'AlertTriangle' : 'HelpCircle')}
                                    className={`h-5 w-5 ${isDestructive
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-blue-600 dark:text-blue-400'
                                        }`}
                                />
                            </div>
                            {options?.title || 'Konfirmasi'}
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            {options?.message || 'Apakah Anda yakin?'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="rounded-xl"
                        >
                            {options?.cancelText || 'Batal'}
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className={`rounded-xl ${isDestructive
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {options?.confirmText || 'Ya'}
                        </Button>
                    </DialogFooter>
                    <p className="text-xs text-center text-slate-400 mt-2">
                        Tekan Enter untuk konfirmasi, Escape untuk batal
                    </p>
                </DialogContent>
            </Dialog>
        </ConfirmDialogContext.Provider>
    )
}

/**
 * Helper function untuk konfirmasi delete
 */
export function createDeleteConfirmation(itemName: string): ConfirmDialogOptions {
    return {
        title: 'Hapus Data',
        message: `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        variant: 'destructive',
        icon: 'Trash2'
    }
}
