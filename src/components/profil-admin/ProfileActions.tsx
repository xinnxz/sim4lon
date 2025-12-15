/**
 * ProfileActions - Panel aksi untuk profil user
 * 
 * PENJELASAN:
 * Menampilkan 3 section:
 * 1. Edit Profil - Link ke halaman edit
 * 2. Keamanan - Ubah password
 * 3. Status Akun - Status dan terakhir login (data real dari API)
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import ChangePasswordModal from '@/components/profil-admin/ChangePasswordModal'
import { authApi, type UserProfile } from '@/lib/api'

export default function ProfileActions() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch profile data for status section
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await authApi.getProfile()
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Format date with time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  }

  return (
    <div className="space-y-6">
      {/* Edit Profile Card */}
      <Card className="border shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Edit Profil</CardTitle>
          <CardDescription>Perbarui informasi pribadi Anda</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Ubah nama, email, nomor telepon, dan informasi profil lainnya.
          </p>
          <a href="/edit-profil-admin">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <SafeIcon name="Pencil" className="h-4 w-4 mr-2" />
              Edit Profil
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="border shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Keamanan</CardTitle>
          <CardDescription>Kelola kata sandi akun Anda</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Ubah kata sandi untuk menjaga keamanan akun Anda.
          </p>
          <Button
            onClick={() => setIsChangePasswordOpen(true)}
            variant="outline"
            className="w-full border-primary/30 hover:bg-primary/5"
          >
            <SafeIcon name="Lock" className="h-4 w-4 mr-2" />
            Ubah Password
          </Button>
        </CardContent>
      </Card>

      {/* Account Status Card */}
      <Card className="border shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <SafeIcon name="Shield" className="h-5 w-5 text-primary" />
            Status Akun
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <SafeIcon name="Loader2" className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <span className={`h-2 w-2 rounded-full ${profile?.is_active ? 'bg-primary' : 'bg-gray-400'}`}></span>
                  {profile?.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Terakhir Login</span>
                <span className="text-sm font-medium text-foreground">
                  Sesi saat ini
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <ChangePasswordModal open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </div>
  )
}
