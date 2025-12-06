
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import GeneralSettings from './GeneralSettings'
import NotificationSettings from './NotificationSettings'
import SystemSettings from './SystemSettings'
import UserPreferences from './UserPreferences'

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <SafeIcon name="Settings" className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
            <p className="text-sm text-muted-foreground">Kelola konfigurasi sistem dan preferensi Anda</p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card className="border shadow-soft">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-t-lg border-b bg-muted/50 p-0">
            <TabsTrigger 
              value="general" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <SafeIcon name="Sliders" className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Umum</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <SafeIcon name="Bell" className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Notifikasi</span>
            </TabsTrigger>
            <TabsTrigger 
              value="system"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <SafeIcon name="Cpu" className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Sistem</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preferences"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <SafeIcon name="User" className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Preferensi</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="p-6">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="notifications" className="p-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="system" className="p-6">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="preferences" className="p-6">
            <UserPreferences />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
