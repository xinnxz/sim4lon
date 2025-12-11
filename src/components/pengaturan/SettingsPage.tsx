
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import GeneralSettings from './GeneralSettings'
import NotificationSettings from './NotificationSettings'
import SecuritySettings from './SecuritySettings'
import SystemSettings from './SystemSettings'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Page Header */}
      <div className="space-y-2 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <SafeIcon name="Settings" className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pengaturan Sistem</h1>
            <p className="text-sm text-muted-foreground">Kelola konfigurasi dan preferensi aplikasi SIM4LON</p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card className="border shadow-card animate-scaleIn">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b bg-muted/30 px-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-transparent border-0 h-auto p-0">
              <TabsTrigger 
                value="general"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
              >
                <SafeIcon name="Sliders" className="h-4 w-4" />
                <span className="hidden sm:inline">Umum</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notification"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
              >
                <SafeIcon name="Bell" className="h-4 w-4" />
                <span className="hidden sm:inline">Notifikasi</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
              >
                <SafeIcon name="Lock" className="h-4 w-4" />
                <span className="hidden sm:inline">Keamanan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="system"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5"
              >
                <SafeIcon name="Server" className="h-4 w-4" />
                <span className="hidden sm:inline">Sistem</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="p-6">
            <TabsContent value="general" className="space-y-6 animate-fadeIn">
              <GeneralSettings />
            </TabsContent>

            <TabsContent value="notification" className="space-y-6 animate-fadeIn">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-6 animate-fadeIn">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="system" className="space-y-6 animate-fadeIn">
              <SystemSettings />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
