'use client'

import { type ReactNode } from 'react'

/**
 * PageHeader - Theme-Aware Page Header Component
 * 
 * PENJELASAN:
 * Komponen header halaman yang konsisten dengan style dari SettingsPage:
 * - Gradient bar vertikal di kiri (from-primary via-primary/70 to-accent)
 * - Title bold dengan class text-gradient-primary
 * - Subtitle dengan warna muted
 * 
 * Warna otomatis berubah sesuai tema (green/blue/red) via CSS variable --primary
 */

interface PageHeaderProps {
    /** Judul halaman */
    title: string
    /** Deskripsi halaman */
    subtitle: string
    /** Action buttons atau content tambahan di sebelah kanan */
    actions?: ReactNode
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <div className="space-y-2 animate-fadeInDown">
                <div className="flex items-center gap-3">
                    {/* Gradient Bar - Same style as SettingsPage */}
                    <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" />
                    <div>
                        <h1 className="text-3xl font-bold text-gradient-primary sm:text-4xl tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground/80">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Optional Actions */}
            {actions && (
                <div className="shrink-0">
                    {actions}
                </div>
            )}
        </div>
    )
}
