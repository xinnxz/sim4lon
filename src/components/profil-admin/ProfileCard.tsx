/**
 * ProfileCard - Menampilkan profil user yang sedang login
 * 
 * PENJELASAN:
 * Component ini fetch data profil dari API /auth/profile
 * menggunakan authApi.getProfile(). Data real dari database.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { authApi, type UserProfile } from '@/lib/api'

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'

// Helper to get proper avatar URL with API prefix
const getAvatarUrl = (url: string | null | undefined) => {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}/api${url}`
}

export default function ProfileCard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await authApi.getProfile()
        setProfile(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        setError('Gagal memuat profil')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="border shadow-card">
        <CardContent className="p-8 flex items-center justify-center">
          <SafeIcon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <Card className="border shadow-card">
        <CardContent className="p-8 text-center">
          <SafeIcon name="AlertCircle" className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-destructive">{error || 'Profil tidak ditemukan'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Get initials for avatar fallback
  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="border shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Detail akun Anda</CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`${profile.is_active ? 'bg-green-50 text-primary border-primary/30' : 'bg-gray-50'}`}
            >
              <span className={`h-2 w-2 rounded-full mr-2 ${profile.is_active ? 'bg-primary' : 'bg-gray-400'}`}></span>
              {profile.is_active ? 'Aktif' : 'Tidak Aktif'}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <Avatar className="h-24 w-24 shrink-0">
              <AvatarImage src={getAvatarUrl(profile.avatar_url)} alt={profile.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-sm text-primary font-medium mt-1">
                {profile.role === 'ADMIN' ? 'Administrator' : 'Operator'}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Informasi Kontak</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <SafeIcon name="Mail" className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <SafeIcon name="Phone" className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <p className="text-sm font-medium text-foreground">{profile.phone || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Detail Akun</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">ID User</p>
                <p className="text-sm font-mono font-medium text-foreground">{profile.code || 'USR-001'}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Tanggal Bergabung</p>
                <p className="text-sm font-medium text-foreground">{formatDate(profile.created_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
