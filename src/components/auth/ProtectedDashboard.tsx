/**
 * ProtectedDashboard - Wrapper untuk Dashboard dengan Auth Protection
 * 
 * PENJELASAN:
 * Karena Astro menggunakan Islands Architecture (komponen React di dalam Astro),
 * kita perlu membungkus konten dashboard dengan AuthGuard.
 * 
 * Component ini:
 * 1. Membungkus children dengan AuthGuard
 * 2. Meneruskan allowedRoles untuk role-based access
 * 3. Menampilkan loading spinner saat verifikasi
 */

import { type ReactNode } from 'react'
import { AuthGuard } from './AuthGuard'

interface ProtectedDashboardProps {
    children: ReactNode
    /** Roles yang diizinkan. Kosong = semua role */
    allowedRoles?: ('ADMIN' | 'OPERATOR')[]
}

export function ProtectedDashboard({ children, allowedRoles }: ProtectedDashboardProps) {
    return (
        <AuthGuard allowedRoles={allowedRoles}>
            {children}
        </AuthGuard>
    )
}

export default ProtectedDashboard
