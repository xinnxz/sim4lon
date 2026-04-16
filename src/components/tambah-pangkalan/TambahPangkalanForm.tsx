/**
 * TambahPangkalanForm - Form Tambah Pangkalan dengan API Integration
 * 
 * PENJELASAN:
 * Form ini digunakan untuk menambahkan pangkalan baru ke sistem.
 * Data dikirim ke API /pangkalans via POST request.
 * 
 * Fields:
 * - name: Nama pangkalan (required)
 * - address: Alamat lengkap (required)
 * - region: Wilayah/kota (required)
 * - pic_name: Nama PIC (required)
 * - phone: Nomor telepon (required)
 * - capacity: Kapasitas penyimpanan (optional)
 * - note: Catatan tambahan (optional)
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'
import { pangkalanApi } from '@/lib/api'
import { KABUPATEN_DATA, getKecamatanByKabupaten } from '@/data/regions'


/**
 * Validation schema dengan Zod
 * Semua field divalidasi sebelum submit
 * Note: capacity jadi string untuk hindari type issue dengan react-hook-form
 * Note: email untuk login sekaligus untuk invoice (tidak perlu 2 email)
 */
const pangkalanSchema = z.object({
  name: z.string()
    .min(3, 'Nama pangkalan minimal 3 karakter')
    .max(100, 'Nama pangkalan maksimal 100 karakter'),
  address: z.string()
    .min(10, 'Alamat minimal 10 karakter')
    .max(255, 'Alamat maksimal 255 karakter'),
  kabupaten: z.string()
    .min(1, 'Kabupaten harus dipilih'),
  kecamatan: z.string()
    .min(1, 'Kecamatan harus dipilih'),
  pic_name: z.string()
    .min(2, 'Nama PIC minimal 2 karakter')
    .max(100, 'Nama PIC maksimal 100 karakter'),
  phone: z.string()
    .regex(/^(\+62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid (contoh: 08xx atau +62xx)'),
  capacity: z.string().optional(),
  alokasi_bulanan: z.string().optional(),
  note: z.string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional(),
  // Field untuk akun login (sekaligus email untuk invoice)
  login_email: z.string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  login_password: z.string()
    .min(6, 'Password minimal 6 karakter'),
  confirm_password: z.string()
    .min(6, 'Konfirmasi password harus diisi'),
}).refine((data) => data.login_password === data.confirm_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirm_password'],
})

type PangkalanFormValues = z.infer<typeof pangkalanSchema>

interface TambahPangkalanFormProps {
  onSuccess?: () => void
  isModal?: boolean
}

export default function TambahPangkalanForm({ onSuccess, isModal = false }: TambahPangkalanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedKabupaten, setSelectedKabupaten] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<PangkalanFormValues>({
    resolver: zodResolver(pangkalanSchema),
    defaultValues: {
      name: '',
      address: '',
      kabupaten: '',
      kecamatan: '',
      pic_name: '',
      phone: '',
      capacity: '',
      alokasi_bulanan: '',
      note: '',
      login_email: '',
      login_password: '',
      confirm_password: '',
    },
  })

  // Get kecamatan list based on selected kabupaten
  const kecamatanList = getKecamatanByKabupaten(selectedKabupaten)

  /**
   * Submit form ke API
   */
  async function onSubmit(values: PangkalanFormValues) {
    setIsSubmitting(true)
    try {
      // Parse capacity string to number
      const capacityNum = values.capacity ? parseInt(values.capacity, 10) : 0

      // Combine kabupaten + kecamatan into region
      const kabupatenName = KABUPATEN_DATA.find(k => k.id === values.kabupaten)?.name || values.kabupaten
      const region = `${values.kecamatan}, ${kabupatenName}`

      await pangkalanApi.create({
        name: values.name,
        address: values.address,
        region: region,
        pic_name: values.pic_name,
        phone: values.phone,
        email: values.login_email, // Use login email for invoice too
        capacity: capacityNum,
        alokasi_bulanan: values.alokasi_bulanan ? parseInt(values.alokasi_bulanan, 10) : 0,
        note: values.note || '',
        // Akun login
        login_email: values.login_email,
        login_password: values.login_password,
      })

      toast.success('Pangkalan berhasil ditambahkan!')

      // If in modal, call onSuccess callback
      if (isModal && onSuccess) {
        onSuccess()
      } else {
        // Redirect after success (for standalone page use)
        setTimeout(() => {
          window.location.href = '/daftar-pangkalan'
        }, 1000)
      }
    } catch (error) {
      toast.error('Gagal menambahkan pangkalan. Silakan coba lagi.')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={isModal ? '' : 'max-w-2xl mx-auto'}>
      {/* Header - only show when not in modal */}
      {!isModal && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <SafeIcon name="Store" className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Tambah Pangkalan</h1>
          </div>
          <p className="text-muted-foreground">
            Daftarkan pangkalan LPG baru ke dalam sistem
          </p>
        </div>
      )}

      {/* Form Card */}
      <Card className={isModal ? 'border-0 shadow-none' : 'shadow-card'}>
        <CardContent className={isModal ? 'px-0' : ''}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={isModal ? 'space-y-3' : 'space-y-6'}>
              {/* Nama Pangkalan */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pangkalan *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Pangkalan Maju Jaya"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {!isModal && <FormDescription>Nama resmi pangkalan LPG</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alamat */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Jl. Merdeka No. 123, Kelurahan Sukamaju"
                        {...field}
                        disabled={isSubmitting}
                        rows={isModal ? 2 : 3}
                      />
                    </FormControl>
                    {!isModal && <FormDescription>Alamat lengkap pangkalan</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Wilayah - Cascading Dropdowns */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Kabupaten */}
                <FormField
                  control={form.control}
                  name="kabupaten"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kabupaten *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedKabupaten(value)
                          // Reset kecamatan when kabupaten changes
                          form.setValue('kecamatan', '')
                        }}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Kabupaten" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {KABUPATEN_DATA.map((kab) => (
                            <SelectItem key={kab.id} value={kab.id}>
                              {kab.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kecamatan */}
                <FormField
                  control={form.control}
                  name="kecamatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecamatan *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting || !selectedKabupaten}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedKabupaten ? "Pilih Kecamatan" : "Pilih Kabupaten dulu"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {kecamatanList.map((kec) => (
                            <SelectItem key={kec} value={kec}>
                              {kec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* PIC Name + Phone - Grid in modal */}
              <div className={isModal ? 'grid gap-3 sm:grid-cols-2' : 'space-y-6'}>
                <FormField
                  control={form.control}
                  name="pic_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama PIC *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Budi Santoso"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      {!isModal && <FormDescription>Nama penanggung jawab pangkalan</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: 081234567890"
                          {...field}
                          disabled={isSubmitting}
                          type="tel"
                        />
                      </FormControl>
                      {!isModal && <FormDescription>Nomor telepon yang dapat dihubungi</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Kapasitas + Alokasi - Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: 500"
                          {...field}
                          disabled={isSubmitting}
                          type="number"
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        />
                      </FormControl>
                      {!isModal && <FormDescription>Kapasitas penyimpanan LPG dalam unit</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alokasi_bulanan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alokasi Bulanan (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: 500"
                          {...field}
                          disabled={isSubmitting}
                          type="number"
                          min={0}
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        />
                      </FormControl>
                      {!isModal && <FormDescription>Jumlah alokasi tabung LPG (3kg) per bulan</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Catatan */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Lokasi strategis, akses jalan mudah"
                        {...field}
                        disabled={isSubmitting}
                        rows={isModal ? 1 : 2}
                      />
                    </FormControl>
                    {!isModal && <FormDescription>Informasi tambahan tentang pangkalan</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* === Section Akun Login === */}
              <div className={isModal ? 'pt-3 mt-3 border-t' : 'pt-6 mt-6 border-t'}>
                <div className="flex items-center gap-2 mb-2">
                  <SafeIcon name="Key" className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Akun Login Pangkalan</h3>
                </div>
                {!isModal && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Buat akun untuk login ke dashboard pangkalan. Email ini juga digunakan untuk invoice.
                  </p>
                )}

                {/* Email Login */}
                <FormField
                  control={form.control}
                  name="login_email"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Email Login *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: pangkalan@email.com"
                          {...field}
                          disabled={isSubmitting}
                          type="email"
                        />
                      </FormControl>
                      {!isModal && <FormDescription>Email untuk login ke dashboard pangkalan</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="login_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Minimal 6 karakter"
                              {...field}
                              disabled={isSubmitting}
                              type={showPassword ? 'text' : 'password'}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              tabIndex={-1}
                            >
                              <SafeIcon name={showPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Ulangi password"
                              {...field}
                              disabled={isSubmitting}
                              type={showConfirmPassword ? 'text' : 'password'}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              tabIndex={-1}
                            >
                              <SafeIcon name={showConfirmPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className={`flex gap-3 ${isModal ? 'pt-3 border-t' : 'pt-6 border-t'}`}>
                {!isModal && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = '/daftar-pangkalan'}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <SafeIcon name="X" className="mr-2 h-4 w-4" />
                    Batal
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={isModal ? 'w-full' : 'flex-1 bg-primary hover:bg-primary/90'}
                >
                  {isSubmitting ? (
                    <>
                      <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <SafeIcon name="Save" className="mr-2 h-4 w-4" />
                      Simpan Pangkalan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
