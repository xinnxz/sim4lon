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
  email: z.string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  capacity: z.string().optional(),
  alokasi_bulanan: z.string().optional(),
  note: z.string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional(),
  // Field untuk akun login
  login_email: z.string()
    .email('Format email login tidak valid'),
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

  const form = useForm<PangkalanFormValues>({
    resolver: zodResolver(pangkalanSchema),
    defaultValues: {
      name: '',
      address: '',
      kabupaten: '',
      kecamatan: '',
      pic_name: '',
      phone: '',
      email: '',
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
        email: values.email || null,
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
        <CardHeader className={isModal ? 'px-0 pt-0' : ''}>
          <CardTitle>Informasi Pangkalan</CardTitle>
          <CardDescription>
            Isi semua field yang diperlukan untuk mendaftarkan pangkalan baru
          </CardDescription>
        </CardHeader>
        <CardContent className={isModal ? 'px-0' : ''}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nama Pangkalan */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Nama Pangkalan *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Pangkalan Maju Jaya"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Nama resmi pangkalan LPG
                    </FormDescription>
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
                    <FormLabel className="text-base font-semibold">Alamat Lengkap *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Jl. Merdeka No. 123, Kelurahan Sukamaju"
                        {...field}
                        disabled={isSubmitting}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Alamat lengkap pangkalan
                    </FormDescription>
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
                      <FormLabel className="text-base font-semibold">Kabupaten *</FormLabel>
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
                              {kab.name}
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
                      <FormLabel className="text-base font-semibold">Kecamatan *</FormLabel>
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

              {/* PIC Name */}
              <FormField
                control={form.control}
                name="pic_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Nama PIC *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Budi Santoso"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Nama penanggung jawab pangkalan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telepon */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Nomor Telepon *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: 081234567890"
                        {...field}
                        disabled={isSubmitting}
                        type="tel"
                      />
                    </FormControl>
                    <FormDescription>
                      Nomor telepon yang dapat dihubungi
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Email (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: pangkalan@email.com"
                        {...field}
                        disabled={isSubmitting}
                        type="email"
                      />
                    </FormControl>
                    <FormDescription>
                      Untuk kirim invoice/nota
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kapasitas */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Kapasitas (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: 500"
                        {...field}
                        disabled={isSubmitting}
                        type="number"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      />
                    </FormControl>
                    <FormDescription>
                      Kapasitas penyimpanan LPG dalam unit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alokasi Bulanan */}
              <FormField
                control={form.control}
                name="alokasi_bulanan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Alokasi Bulanan (Opsional)</FormLabel>
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
                    <FormDescription>
                      Jumlah alokasi tabung LPG per bulan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Catatan */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Catatan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Lokasi strategis, akses jalan mudah"
                        {...field}
                        disabled={isSubmitting}
                        rows={2}
                      />
                    </FormControl>
                    <FormDescription>
                      Informasi tambahan tentang pangkalan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* === Section Akun Login === */}
              <div className="pt-6 mt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <SafeIcon name="Key" className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Akun Login Pangkalan</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Buat akun untuk login ke dashboard pangkalan
                </p>

                {/* Email Login */}
                <FormField
                  control={form.control}
                  name="login_email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-base font-semibold">Email Login *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: pangkalan@email.com"
                          {...field}
                          disabled={isSubmitting}
                          type="email"
                        />
                      </FormControl>
                      <FormDescription>
                        Email untuk login ke dashboard pangkalan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="login_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Password *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minimal 6 karakter"
                            {...field}
                            disabled={isSubmitting}
                            type="password"
                          />
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
                        <FormLabel className="text-base font-semibold">Konfirmasi Password *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ulangi password"
                            {...field}
                            disabled={isSubmitting}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t">
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
