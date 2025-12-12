/**
 * AuthGuard Component - Proteksi Route Frontend
 * 
 * PENJELASAN:
 * Component ini digunakan untuk membungkus halaman yang membutuhkan autentikasi.
 * 
 * Cara kerja:
 * 1. Saat halaman dimuat, cek apakah ada token di localStorage
 * 2. Jika tidak ada token → redirect ke /login
 * 3. Jika ada token → verifikasi dengan memanggil API /auth/profile
 * 4. Jika token valid → tampilkan children (konten halaman)
 * 5. Jika token tidak valid → hapus token, redirect ke /login
 * 
 * Cara pakai:
 * <AuthGuard>
 *   <DashboardContent />
 * </AuthGuard>
 * 
 * Atau dengan role restriction:
 * <AuthGuard allowedRoles={['ADMIN']}>
 *   <AdminOnlyContent />
 * </AuthGuard>
 */

import { useEffect, useState, type ReactNode } from 'react'
import { authApi, isAuthenticated, removeToken, type UserProfile } from '@/lib/api'

interface AuthGuardProps {
    children: ReactNode
    /** Roles yang diizinkan mengakses halaman ini. Kosong = semua role boleh */
    allowedRoles?: ('ADMIN' | 'OPERATOR')[]
    /** URL redirect jika tidak authorized (default: /login) */
    redirectTo?: string
}

export function AuthGuard({
    children,
    allowedRoles = [],
    redirectTo = '/login'
}: AuthGuardProps) {
    const [isChecking, setIsChecking] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [user, setUser] = useState<UserProfile | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            // Step 1: Cek apakah ada token
            if (!isAuthenticated()) {
                // Tidak ada token, redirect ke login
                window.location.href = redirectTo
                return
            }

            try {
                // Step 2: Verifikasi token dengan memanggil API
                const userProfile = await authApi.getProfile()

                // Step 3: Cek role jika ada restriction
                if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile.role)) {
                    // User tidak punya role yang dibutuhkan
                    // Redirect ke dashboard sesuai role-nya
                    const correctDashboard = userProfile.role === 'ADMIN'
                        ? '/dashboard-admin'
                        : '/dashboard-operator'
                    window.location.href = correctDashboard
                    return
                }

                // Step 4: Semua OK, user authorized
                setUser(userProfile)
                setIsAuthorized(true)
            } catch (error) {
                // Token tidak valid, hapus dan redirect
                removeToken()
                window.location.href = redirectTo
            } finally {
                setIsChecking(false)
            }
        }

        checkAuth()
    }, [allowedRoles, redirectTo])

    // Tampilkan loading saat sedang cek auth
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Memverifikasi akses...</p>
                </div>
            </div>
        )
    }

    // Jika tidak authorized, jangan render apa-apa (akan redirect)
    if (!isAuthorized) {
        return null
    }

    // Authorized, render children
    return <>{children}</>
}

export default AuthGuard
