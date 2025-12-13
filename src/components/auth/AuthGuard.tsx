/**
 * AuthGuard Component - Proteksi Route Frontend (OPTIMIZED)
 * 
 * PENJELASAN:
 * Component ini digunakan untuk membungkus halaman yang membutuhkan autentikasi.
 * 
 * OPTIMASI:
 * - User profile di-cache di sessionStorage
 * - Skip API call jika cached profile masih valid
 * - API call hanya dilakukan jika:
 *   1. Tidak ada cached profile
 *   2. Cached profile lebih dari 5 menit
 *   3. Force refresh diminta
 * 
 * Cara kerja:
 * 1. Saat halaman dimuat, cek apakah ada token di localStorage
 * 2. Jika tidak ada token → redirect ke /login
 * 3. Jika ada cached profile yang valid → langsung authorized
 * 4. Jika perlu verify → panggil API /auth/profile
 * 5. Jika token valid → cache profile, tampilkan children
 * 6. Jika token tidak valid → hapus token, redirect ke /login
 */

import { useEffect, useState, type ReactNode } from 'react'
import { authApi, isAuthenticated, removeToken, type UserProfile } from '@/lib/api'

// Cache keys
const PROFILE_CACHE_KEY = 'sim4lon_user_profile'
const PROFILE_CACHE_TIME_KEY = 'sim4lon_profile_cache_time'
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

interface AuthGuardProps {
    children: ReactNode
    /** Roles yang diizinkan mengakses halaman ini. Kosong = semua role boleh */
    allowedRoles?: ('ADMIN' | 'OPERATOR')[]
    /** URL redirect jika tidak authorized (default: /login) */
    redirectTo?: string
    /** Force re-fetch profile dari API */
    forceRefresh?: boolean
}

/**
 * Get cached user profile from sessionStorage
 */
function getCachedProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null

    try {
        const cachedTime = sessionStorage.getItem(PROFILE_CACHE_TIME_KEY)
        const cachedProfile = sessionStorage.getItem(PROFILE_CACHE_KEY)

        if (!cachedTime || !cachedProfile) return null

        // Check if cache is still valid (within 5 minutes)
        const elapsed = Date.now() - parseInt(cachedTime, 10)
        if (elapsed > CACHE_DURATION_MS) {
            // Cache expired, clear it
            sessionStorage.removeItem(PROFILE_CACHE_KEY)
            sessionStorage.removeItem(PROFILE_CACHE_TIME_KEY)
            return null
        }

        return JSON.parse(cachedProfile) as UserProfile
    } catch {
        return null
    }
}

/**
 * Save user profile to sessionStorage cache
 */
function setCachedProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return

    try {
        sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile))
        sessionStorage.setItem(PROFILE_CACHE_TIME_KEY, Date.now().toString())
    } catch {
        // Storage full or error, ignore
    }
}

/**
 * Clear cached profile (for logout)
 */
export function clearCachedProfile(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(PROFILE_CACHE_KEY)
    sessionStorage.removeItem(PROFILE_CACHE_TIME_KEY)
}

export function AuthGuard({
    children,
    allowedRoles = [],
    redirectTo = '/login',
    forceRefresh = false
}: AuthGuardProps) {
    // Start as authorized if we have cached profile (optimistic)
    const cachedProfile = getCachedProfile()
    const hasValidCache = !forceRefresh && cachedProfile !== null

    const [isChecking, setIsChecking] = useState(!hasValidCache)
    const [isAuthorized, setIsAuthorized] = useState(hasValidCache)
    const [user, setUser] = useState<UserProfile | null>(cachedProfile)

    useEffect(() => {
        const checkAuth = async () => {
            // Step 1: Cek apakah ada token
            if (!isAuthenticated()) {
                // Tidak ada token, redirect ke login
                window.location.href = redirectTo
                return
            }

            // Step 2: Jika ada cached profile yang valid, sudah di-set di initial state
            if (!forceRefresh && cachedProfile) {
                // Cek role jika ada restriction
                if (allowedRoles.length > 0 && !allowedRoles.includes(cachedProfile.role)) {
                    const correctDashboard = cachedProfile.role === 'ADMIN'
                        ? '/dashboard-admin'
                        : '/dashboard-operator'
                    window.location.href = correctDashboard
                    return
                }
                // Already set in initial state, nothing more to do
                return
            }

            try {
                // Step 3: Verifikasi token dengan memanggil API
                const userProfile = await authApi.getProfile()

                // Step 4: Cache profile untuk navigasi berikutnya
                setCachedProfile(userProfile)

                // Step 5: Cek role jika ada restriction
                if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile.role)) {
                    const correctDashboard = userProfile.role === 'ADMIN'
                        ? '/dashboard-admin'
                        : '/dashboard-operator'
                    window.location.href = correctDashboard
                    return
                }

                // Step 6: Semua OK, user authorized
                setUser(userProfile)
                setIsAuthorized(true)
            } catch (error) {
                // Token tidak valid, hapus cache dan redirect
                clearCachedProfile()
                removeToken()
                window.location.href = redirectTo
            } finally {
                setIsChecking(false)
            }
        }

        checkAuth()
    }, [allowedRoles, redirectTo, forceRefresh])

    // Jika punya cached profile, langsung render children (no flash!)
    if (hasValidCache && isAuthorized) {
        return <>{children}</>
    }

    // Tampilkan loading saat sedang cek auth via API
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
