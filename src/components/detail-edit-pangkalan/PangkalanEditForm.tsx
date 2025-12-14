/**
 * PangkalanEditForm - Form Edit Pangkalan dengan Cascading Dropdown
 * 
 * PENJELASAN:
 * Form untuk edit data pangkalan dengan:
 * - Cascading dropdown Kabupaten → Kecamatan
 * - Zod validation
 * - Pre-populate dari existing region data
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { KABUPATEN_DATA, getKecamatanByKabupaten } from '@/data/regions'

/**
 * Helper: Parse existing region string to kabupaten/kecamatan
 * Format: "Kecamatan, Kabupaten Xxx" 
 */
function parseRegion(region: string | null): { kabupaten: string; kecamatan: string } {
  if (!region) return { kabupaten: '', kecamatan: '' }

  // Try to match "Kecamatan, Kabupaten Xxx" format
  const parts = region.split(',')
  if (parts.length >= 2) {
    const kecamatan = parts[0].trim()
    const kabupatenName = parts[1].trim()
    // Find kabupaten ID by name
    const kabupaten = KABUPATEN_DATA.find(k =>
      k.name === kabupatenName || kabupatenName.includes(k.name.replace('Kabupaten ', ''))
    )
    if (kabupaten) {
      return { kabupaten: kabupaten.id, kecamatan }
    }
  }

  // Fallback: try to find kecamatan in any kabupaten
  for (const kab of KABUPATEN_DATA) {
    if (kab.kecamatan.includes(region)) {
      return { kabupaten: kab.id, kecamatan: region }
    }
  }

  return { kabupaten: '', kecamatan: region }
}

/**
 * Validation schema
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
  // Parse existing region to kabupaten/kecamatan
  const parsedRegion = parseRegion(pangkalan.region)
  const [selectedKabupaten, setSelectedKabupaten] = useState(parsedRegion.kabupaten)

  const form = useForm<PangkalanFormValues>({
    resolver: zodResolver(pangkalanSchema),
    defaultValues: {
      name: pangkalan.name || '',
      address: pangkalan.address || '',
      kabupaten: parsedRegion.kabupaten,
      kecamatan: parsedRegion.kecamatan,
      pic_name: pangkalan.pic_name || '',
      phone: pangkalan.phone || '',
      email: pangkalan.email || '',
      capacity: pangkalan.capacity?.toString() || '',
      note: pangkalan.note || '',
      is_active: pangkalan.is_active,
    },
  })

  // Get kecamatan list based on selected kabupaten
  const kecamatanList = getKecamatanByKabupaten(selectedKabupaten)

  /**
   * Submit form - combine kabupaten+kecamatan into region
   */
  const onSubmit = async (values: PangkalanFormValues) => {
    // Combine kabupaten + kecamatan into region
    const kabupatenName = KABUPATEN_DATA.find(k => k.id === values.kabupaten)?.name || values.kabupaten
    const region = `${values.kecamatan}, ${kabupatenName}`

    const data: Partial<Pangkalan> = {
      name: values.name,
      address: values.address,
      region: region,
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
                      placeholder="Masukkan alamat lengkap..."
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
                      disabled={isSaving}
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
                      disabled={isSaving || !selectedKabupaten}
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

            {/* PIC Name & Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="pic_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Nama PIC *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama penanggung jawab"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">No. Telepon *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="08xx atau +62xx"
                        {...field}
                        disabled={isSaving}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Email (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      disabled={isSaving}
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

            {/* Capacity */}
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
                      placeholder="Catatan tambahan..."
                      {...field}
                      disabled={isSaving}
                      rows={3}
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">Status Aktif</FormLabel>
                    <FormDescription>
                      Pangkalan aktif dapat menerima pesanan
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
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
              >
                <SafeIcon name="X" className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="min-w-[140px]"
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
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
