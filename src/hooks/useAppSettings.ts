/**
 * useAppSettings - Hook to fetch and cache application settings
 * 
 * Fetches PPN rate, stock limits, and other settings from company profile.
 * Uses localStorage for caching to reduce API calls.
 */

import { useState, useEffect } from 'react'
import { companyProfileApi } from '@/lib/api'

export interface AppSettings {
    ppnRate: number          // PPN percentage, e.g., 12 for 12%
    criticalStockLimit: number
    invoicePrefix: string
    orderCodePrefix: string
}

const APP_SETTINGS_KEY = 'app_settings_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedSettings {
    settings: AppSettings
    timestamp: number
}

const defaultSettings: AppSettings = {
    ppnRate: 12,
    criticalStockLimit: 10,
    invoicePrefix: 'INV-',
    orderCodePrefix: 'ORD-',
}

/**
 * Get cached settings from localStorage
 */
function getCachedSettings(): AppSettings | null {
    try {
        const cached = localStorage.getItem(APP_SETTINGS_KEY)
        if (!cached) return null

        const parsed: CachedSettings = JSON.parse(cached)
        const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION

        return isExpired ? null : parsed.settings
    } catch {
        return null
    }
}

/**
 * Save settings to localStorage cache
 */
function setCachedSettings(settings: AppSettings): void {
    try {
        const cached: CachedSettings = {
            settings,
            timestamp: Date.now(),
        }
        localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(cached))
    } catch {
        // Ignore localStorage errors
    }
}

/**
 * Hook to get application settings
 */
export function useAppSettings() {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSettings = async () => {
            // Check cache first
            const cached = getCachedSettings()
            if (cached) {
                setSettings(cached)
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const profile = await companyProfileApi.get()

                const newSettings: AppSettings = {
                    ppnRate: Number(profile.ppn_rate) || defaultSettings.ppnRate,
                    criticalStockLimit: profile.critical_stock_limit || defaultSettings.criticalStockLimit,
                    invoicePrefix: profile.invoice_prefix || defaultSettings.invoicePrefix,
                    orderCodePrefix: profile.order_code_prefix || defaultSettings.orderCodePrefix,
                }

                setSettings(newSettings)
                setCachedSettings(newSettings)
                setError(null)
            } catch (err) {
                console.error('Failed to fetch app settings:', err)
                setError('Gagal memuat pengaturan aplikasi')
                // Use default settings on error
                setSettings(defaultSettings)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, [])

    /**
     * Force refresh settings from API
     */
    const refreshSettings = async () => {
        try {
            localStorage.removeItem(APP_SETTINGS_KEY)
            setIsLoading(true)

            const profile = await companyProfileApi.get()

            const newSettings: AppSettings = {
                ppnRate: Number(profile.ppn_rate) || defaultSettings.ppnRate,
                criticalStockLimit: profile.critical_stock_limit || defaultSettings.criticalStockLimit,
                invoicePrefix: profile.invoice_prefix || defaultSettings.invoicePrefix,
                orderCodePrefix: profile.order_code_prefix || defaultSettings.orderCodePrefix,
            }

            setSettings(newSettings)
            setCachedSettings(newSettings)
            setError(null)
        } catch (err) {
            console.error('Failed to refresh settings:', err)
            setError('Gagal memuat pengaturan')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        settings,
        isLoading,
        error,
        refreshSettings,
    }
}

/**
 * Utility function to get PPN rate synchronously from cache
 * Useful for components that can't use hooks
 */
export function getPpnRateFromCache(): number {
    const cached = getCachedSettings()
    return cached?.ppnRate ?? defaultSettings.ppnRate
}

/**
 * Clear settings cache (call after updating settings)
 */
export function clearAppSettingsCache(): void {
    localStorage.removeItem(APP_SETTINGS_KEY)
}
