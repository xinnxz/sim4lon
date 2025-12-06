
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

// Validation schema
const pangkalanSchema = z.object({
  nama: z.string()
    .min(3, 'Nama pangkalan minimal 3 karakter')
    .max(100, 'Nama pangkalan maksimal 100 karakter'),
  alamat: z.string()
    .min(10, 'Alamat minimal 10 karakter')
    .max(255, 'Alamat maksimal 255 karakter'),
  kontak: z.string()
    .regex(/^(\+62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
  catatan: z.string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional()
    .default(''),
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
      nama: '',
      alamat: '',
      kontak: '',
      catatan: '',
    },
  })

async function onSubmit(values: PangkalanFormValues) {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Form submitted:', values)
      toast.success('Pangkalan berhasil ditambahkan!')
      
      // If in modal, call onSuccess callback
      if (isModal && onSuccess) {
        onSuccess()
      } else {
        // Redirect after success (for standalone page use)
        setTimeout(() => {
          window.location.href = './daftar-pangkalan.html'
        }, 1500)
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
          Daftarkan pangkalan LPG baru ke dalam sistem untuk memperluas jangkauan operasional
        </p>
      </div>
      )}

{/* Form Card */}
       <Card className={isModal ? '' : 'shadow-card'}>
         <CardHeader>
           <CardTitle>Informasi Pangkalan</CardTitle>
           <CardDescription>
             Isi semua field yang diperlukan untuk mendaftarkan pangkalan baru
           </CardDescription>
         </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nama Pangkalan */}
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Nama Pangkalan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Pangkalan Maju Jaya"
                        {...field}
                        disabled={isSubmitting}
                        className="h-10"
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
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Jl. Merdeka No. 123, Kelurahan Sukamaju, Kecamatan Cibinong, Kabupaten Bogor, Jawa Barat 16810"
                        {...field}
                        disabled={isSubmitting}
                        rows={4}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Alamat lengkap pangkalan termasuk kota dan provinsi
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kontak */}
              <FormField
                control={form.control}
                name="kontak"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: 0812345678 atau +6212345678"
                        {...field}
                        disabled={isSubmitting}
                        type="tel"
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription>
                      Nomor telepon yang dapat dihubungi (dimulai dengan 0 atau +62)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Catatan */}
              <FormField
                control={form.control}
                name="catatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Catatan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Pangkalan dengan fasilitas lengkap, lokasi strategis di pusat kota"
                        {...field}
                        disabled={isSubmitting}
                        rows={3}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Informasi tambahan tentang pangkalan (maksimal 500 karakter)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = './daftar-pangkalan.html'}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <SafeIcon name="X" className="mr-2 h-4 w-4" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90"
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

{/* Info Box - only show when not in modal */}
       {!isModal && (
       <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
         <div className="flex gap-3">
           <SafeIcon name="Info" className="h-5 w-5 text-primary shrink-0 mt-0.5" />
           <div className="text-sm text-foreground">
             <p className="font-semibold mb-1">Informasi Penting</p>
             <ul className="space-y-1 text-muted-foreground">
               <li>• Pastikan semua data yang diisi sudah benar sebelum menyimpan</li>
               <li>• Nomor telepon harus valid dan dapat dihubungi</li>
               <li>• Pangkalan yang sudah terdaftar dapat diedit dari halaman Daftar Pangkalan</li>
             </ul>
           </div>
         </div>
       </div>
       )}
     </div>
   )
 }
