
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import SafeIcon from '@/components/common/SafeIcon'

interface Pangkalan {
  id: string
  nama: string
  alamat: string
  kontak: string
  email: string
  catatan: string
  createdAt: string
  updatedAt: string
  picName: string
  area: string
  status: string
}

interface PangkalanEditFormProps {
  pangkalan: Pangkalan
  onSave: (data: Omit<Pangkalan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export default function PangkalanEditForm({
  pangkalan,
  onSave,
  onCancel,
  isSaving
}: PangkalanEditFormProps) {
const form = useForm({
    defaultValues: {
      nama: pangkalan.nama,
      alamat: pangkalan.alamat,
      area: pangkalan.area,
      kontak: pangkalan.kontak,
      email: pangkalan.email,
      picName: pangkalan.picName,
      catatan: pangkalan.catatan,
      status: pangkalan.status,
    }
  })

  const onSubmit = async (data: any) => {
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
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pangkalan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama pangkalan"
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
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan alamat lengkap pangkalan"
                      {...field}
                      disabled={isSaving}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Alamat lengkap termasuk kota dan kode pos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Area & PIC Name */}
            <div className="grid gap-4 sm:grid-cols-2">
<FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area / Wilayah</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isSaving}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih area" />
                        </SelectTrigger>
<SelectContent>
                            <SelectItem value="Agrabinta">Agrabinta</SelectItem>
                            <SelectItem value="Bojongpicung">Bojongpicung</SelectItem>
                            <SelectItem value="Campaka">Campaka</SelectItem>
                            <SelectItem value="Cianjur">Cianjur</SelectItem>
                            <SelectItem value="Cibeber">Cibeber</SelectItem>
                            <SelectItem value="Cibinong">Cibinong</SelectItem>
                            <SelectItem value="Cidaun">Cidaun</SelectItem>
                            <SelectItem value="Cikalongkulon">Cikalongkulon</SelectItem>
                            <SelectItem value="Cilaku">Cilaku</SelectItem>
                            <SelectItem value="Cijati">Cijati</SelectItem>
                            <SelectItem value="Cipanas">Cipanas</SelectItem>
                            <SelectItem value="Ciranjang">Ciranjang</SelectItem>
                            <SelectItem value="Cugenang">Cugenang</SelectItem>
                            <SelectItem value="Gekbrong">Gekbrong</SelectItem>
                            <SelectItem value="Kadupandak">Kadupandak</SelectItem>
                            <SelectItem value="Karangtengah">Karangtengah</SelectItem>
                            <SelectItem value="Leles">Leles</SelectItem>
                            <SelectItem value="Mande">Mande</SelectItem>
                            <SelectItem value="Naringgul">Naringgul</SelectItem>
                            <SelectItem value="Pacet">Pacet</SelectItem>
                            <SelectItem value="Pagelaran">Pagelaran</SelectItem>
                            <SelectItem value="Sindangbarang">Sindangbarang</SelectItem>
                            <SelectItem value="Sukaluyu">Sukaluyu</SelectItem>
                            <SelectItem value="Sukanagara">Sukanagara</SelectItem>
                            <SelectItem value="Sukaresmi">Sukaresmi</SelectItem>
                            <SelectItem value="Takokak">Takokak</SelectItem>
                            <SelectItem value="Tanggeung">Tanggeung</SelectItem>
                            <SelectItem value="Warungkondang">Warungkondang</SelectItem>
                          </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="picName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama PIC (Person In Charge)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Budi Santoso"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Kontak & Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="kontak"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0812-3456-7890"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@pangkalan.com"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

{/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Pangkalan</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value === 'Aktif' ? 'Pangkalan sedang aktif' : 'Pangkalan sedang nonaktif'}
                    </div>
                  </div>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{field.value === 'Aktif' ? 'Aktif' : 'Nonaktif'}</span>
                      <select
                        {...field}
                        disabled={isSaving}
                        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Catatan */}
            <FormField
              control={form.control}
              name="catatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan catatan atau informasi tambahan"
                      {...field}
                      disabled={isSaving}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Informasi tambahan tentang pangkalan (opsional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
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
