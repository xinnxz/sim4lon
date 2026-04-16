'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import PageHeader from '@/components/common/PageHeader'
import CompanyProfileSettings from './CompanyProfileSettings'
import AppearanceSettings from './AppearanceSettings'
import ApplicationSettings from './ApplicationSettings'

const PROFILE_CACHE_KEY = 'sim4lon_user_profile'

type UserRole = 'ADMIN' | 'OPERATOR' | 'PANGKALAN'

interface TabConfig {
  id: string
  label: string
  icon: string
  adminOnly?: boolean  // If true, only ADMIN can see this tab
}

/**
 * Get user role from cached profile
 */
function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'OPERATOR'

  try {
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY)
    if (cached) {
      const profile = JSON.parse(cached)
      return profile.role || 'OPERATOR'
    }
  } catch { /* ignore */ }

  return 'OPERATOR'  // Default to most restricted role
}

/**
 * SettingsPage - Halaman pengaturan utama SIM4LON
 * 
 * 3 Tab (admin only for Profil and Aplikasi):
 * 1. Profil Perusahaan - Info distributor, logo, kontak (ADMIN only)
 * 2. Tampilan - Tema, bahasa, format tanggal (ALL users)
 * 3. Aplikasi - Pengaturan khusus LPG (ADMIN only)
 */
export default function SettingsPage() {
  const [userRole, setUserRole] = useState<UserRole>('ADMIN') // Default admin to show all during SSR

  // Tab configuration with role restrictions
  const allTabs: TabConfig[] = [
    { id: 'profile', label: 'Profil Perusahaan', icon: 'Building2', adminOnly: true },
    { id: 'appearance', label: 'Tampilan', icon: 'Palette' },
    { id: 'application', label: 'Aplikasi', icon: 'Settings2', adminOnly: true }
  ]

  // Filter tabs based on user role
  const visibleTabs = userRole === 'ADMIN'
    ? allTabs
    : allTabs.filter(tab => !tab.adminOnly)

  // Default to first visible tab
  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || 'appearance')

  // Get user role after hydration
  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)

    // Update active tab if current is not accessible
    const tabs = role === 'ADMIN' ? allTabs : allTabs.filter(t => !t.adminOnly)
    if (!tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id || 'appearance')
    }
  }, [])

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Page Header - Using reusable PageHeader component */}
      <PageHeader
        title="Pengaturan"
        subtitle={userRole === 'ADMIN'
          ? "Kelola konfigurasi dan preferensi aplikasi SIM4LON"
          : "Atur tampilan dan preferensi Anda"}
      />

      {/* Settings Content */}
      <Card className="border-0 shadow-lg animate-fadeInUp overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation - Premium styling */}
          <div className="border-b bg-gradient-to-r from-muted/50 to-muted/30">
            <TabsList className="w-full justify-start gap-0 bg-transparent border-0 h-auto p-0 rounded-none">
              {visibleTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative flex items-center gap-2 px-6 py-4 text-sm font-medium rounded-none border-0 transition-all duration-300 
                    data-[state=active]:bg-background data-[state=active]:shadow-sm
                    data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-background/50"
                >
                  <SafeIcon name={tab.icon} className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>

                  {/* Active indicator line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 transition-transform duration-300 data-[state=active]:scale-x-100"
                    data-state={activeTab === tab.id ? 'active' : 'inactive'}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="p-6">
            {visibleTabs.some(t => t.id === 'profile') && (
              <TabsContent value="profile" className="mt-0 animate-fadeIn">
                <CompanyProfileSettings />
              </TabsContent>
            )}

            <TabsContent value="appearance" className="mt-0 animate-fadeIn">
              <AppearanceSettings />
            </TabsContent>

            {visibleTabs.some(t => t.id === 'application') && (
              <TabsContent value="application" className="mt-0 animate-fadeIn">
                <ApplicationSettings />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
