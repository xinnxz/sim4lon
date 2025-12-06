
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import EditProfileModal from '@/components/profil-admin/EditProfileModal'
import ChangePasswordModal from '@/components/profil-admin/ChangePasswordModal'

export default function ProfileActions() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

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
          <Button 
            onClick={() => setIsEditProfileOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <SafeIcon name="Edit2" className="h-4 w-4 mr-2" />
            Edit Profil
          </Button>
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

      {/* Modals */}
      <EditProfileModal open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />
      <ChangePasswordModal open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />

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
           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <span className="text-sm text-muted-foreground">Status</span>
               <span className="inline-flex items-center gap-2 text-sm font-medium">
                 <span className="h-2 w-2 rounded-full bg-primary"></span>
                 Aktif
               </span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-sm text-muted-foreground">Terakhir Login</span>
<span className="text-sm font-medium text-foreground">10 Desember 2024 – 14:30 WIB</span>
             </div>
           </div>
         </CardContent>
       </Card>
    </div>
  )
}
