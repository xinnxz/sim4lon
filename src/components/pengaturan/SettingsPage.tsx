'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import CompanyProfileSettings from './CompanyProfileSettings'
import AppearanceSettings from './AppearanceSettings'
import ApplicationSettings from './ApplicationSettings'

/**
 * SettingsPage - Halaman pengaturan utama SIM4LON
 * 
 * 3 Tab:
 * 1. Profil Perusahaan - Info distributor, logo, kontak
 * 2. Tampilan - Tema, bahasa, format tanggal
 * 3. Aplikasi - Pengaturan khusus LPG (stok kritis, invoice, dll)
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profil Perusahaan', icon: 'Building2' },
    { id: 'appearance', label: 'Tampilan', icon: 'Palette' },
    { id: 'application', label: 'Aplikasi', icon: 'Settings2' }
  ]

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Page Header - Elegant style */}
      <div className="space-y-2 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary via-primary/70 to-accent" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Pengaturan
            </h1>
            <p className="text-sm text-muted-foreground/80">
              Kelola konfigurasi dan preferensi aplikasi SIM4LON
            </p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <Card className="border-0 shadow-lg animate-fadeInUp overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation - Premium styling */}
          <div className="border-b bg-gradient-to-r from-muted/50 to-muted/30">
            <TabsList className="w-full justify-start gap-0 bg-transparent border-0 h-auto p-0 rounded-none">
              {tabs.map((tab) => (
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
            <TabsContent value="profile" className="mt-0 animate-fadeIn">
              <CompanyProfileSettings />
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 animate-fadeIn">
              <AppearanceSettings />
            </TabsContent>

            <TabsContent value="application" className="mt-0 animate-fadeIn">
              <ApplicationSettings />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
