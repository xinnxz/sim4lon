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
  region: z.string()
    .min(2, 'Wilayah minimal 2 karakter')
    .max(100, 'Wilayah maksimal 100 karakter'),
  pic_name: z.string()
    .min(2, 'Nama PIC minimal 2 karakter')
    .max(100, 'Nama PIC maksimal 100 karakter'),
  phone: z.string()
    .regex(/^(\+62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid (contoh: 08xx atau +62xx)'),
  capacity: z.string().optional(),
  note: z.string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional(),
})

type PangkalanFormValues = z.infer<typeof pangkalanSchema>

interface TambahPangkalanFormProps {
  onSuccess?: () => void
  isModal?: boolean
}

export default function TambahPangkalanForm({ onSuccess, isModal = false }: TambahPangkalanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PangkalanFormValues>({
    resolver: zodResolver(pangkalanSchema),
    defaultValues: {
      name: '',
      address: '',
      region: '',
      pic_name: '',
      phone: '',
      capacity: '',
      note: '',
    },
  })

  /**
   * Submit form ke API
   */
  async function onSubmit(values: PangkalanFormValues) {
    setIsSubmitting(true)
    try {
      // Parse capacity string to number
      const capacityNum = values.capacity ? parseInt(values.capacity, 10) : 0

      await pangkalanApi.create({
        name: values.name,
        address: values.address,
        region: values.region,
        pic_name: values.pic_name,
        phone: values.phone,
        capacity: capacityNum,
        note: values.note || '',
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

              {/* Wilayah */}
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Wilayah *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Jakarta Pusat"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Kota atau wilayah pangkalan berada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      />
                    </FormControl>
                    <FormDescription>
                      Kapasitas penyimpanan LPG dalam unit
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
