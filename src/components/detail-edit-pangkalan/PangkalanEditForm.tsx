/**
 * PangkalanEditForm - Form Edit Pangkalan dengan API Integration
 * 
 * PENJELASAN:
 * Form ini digunakan untuk mengedit data pangkalan.
 * Menggunakan field names yang match dengan API.
 * 
 * Fields (sesuai API):
 * - name: Nama pangkalan (required)
 * - address: Alamat lengkap (required)
 * - region: Wilayah/kota (required)
 * - pic_name: Nama PIC (required)
 * - phone: Nomor telepon (required)
 * - email: Email (optional)
 * - capacity: Kapasitas penyimpanan (optional)
 * - note: Catatan tambahan (optional)
 * - is_active: Status aktif (required)
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import SafeIcon from '@/components/common/SafeIcon'
import { type Pangkalan } from '@/lib/api'

/**
 * Validation schema dengan Zod - match dengan API fields
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
  email: z.string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  capacity: z.string().optional(),
  note: z.string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional(),
  is_active: z.boolean(),
})

type PangkalanFormValues = z.infer<typeof pangkalanSchema>

interface PangkalanEditFormProps {
  pangkalan: Pangkalan
  onSave: (data: Partial<Pangkalan>) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export default function PangkalanEditForm({
  pangkalan,
  onSave,
  onCancel,
  isSaving
}: PangkalanEditFormProps) {
  const form = useForm<PangkalanFormValues>({
    resolver: zodResolver(pangkalanSchema),
    defaultValues: {
      name: pangkalan.name || '',
      address: pangkalan.address || '',
      region: pangkalan.region || '',
      pic_name: pangkalan.pic_name || '',
      phone: pangkalan.phone || '',
      email: pangkalan.email || '',
      capacity: pangkalan.capacity?.toString() || '',
      note: pangkalan.note || '',
      is_active: pangkalan.is_active,
    },
  })

  /**
   * Submit form - convert to API format
   * Only send fields that have values to avoid validation issues
   */
  const onSubmit = async (values: PangkalanFormValues) => {
    const data: Partial<Pangkalan> = {
      name: values.name,
      address: values.address,
      region: values.region,
      pic_name: values.pic_name,
      phone: values.phone,
      is_active: values.is_active,
    }

    // Only add optional fields if they have values
    if (values.email) data.email = values.email
    if (values.capacity) data.capacity = parseInt(values.capacity, 10)
    if (values.note) data.note = values.note

    await onSave(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Informasi Pangkalan</CardTitle>
        <CardDescription>
          Perbarui data pangkalan sesuai kebutuhan
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                      disabled={isSaving}
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
                      disabled={isSaving}
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

            {/* Wilayah & PIC Name - 2 columns */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Wilayah *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Cianjur"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormDescription>
                      Kota atau wilayah
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormDescription>
                      Penanggung jawab
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Telepon & Email - 2 columns */}
            <div className="grid gap-4 sm:grid-cols-2">
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
                        disabled={isSaving}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Contoh: pangkalan@email.com"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormDescription>
                      Untuk kirim invoice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      disabled={isSaving}
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
                      placeholder="Informasi tambahan tentang pangkalan"
                      {...field}
                      disabled={isSaving}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Aktif */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">Status Pangkalan</FormLabel>
                    <FormDescription>
                      {field.value ? 'Pangkalan sedang aktif' : 'Pangkalan sedang nonaktif'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SafeIcon name="Save" className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
                className="flex-1"
              >
                <SafeIcon name="X" className="mr-2 h-4 w-4" />
                Batal
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
