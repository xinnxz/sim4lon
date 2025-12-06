
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import SafeIcon from '@/components/common/SafeIcon'

interface DeliveryStatusOverrideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: string
  onStatusChange: (status: string) => void
}

const statusOptions = [
  { value: 'pending', label: 'Menunggu', icon: 'Clock' },
  { value: 'in_transit', label: 'Dalam Perjalanan', icon: 'Truck' },
  { value: 'delivered', label: 'Terkirim', icon: 'CheckCircle' },
  { value: 'failed', label: 'Gagal', icon: 'AlertCircle' }
]

export default function DeliveryStatusOverride({
  open,
  onOpenChange,
  currentStatus,
  onStatusChange
}: DeliveryStatusOverrideProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    onStatusChange(selectedStatus)
    setNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Status Pengiriman</DialogTitle>
          <DialogDescription>
            Pilih status baru untuk pengiriman ini. Perubahan akan dicatat dalam timeline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Status Baru</Label>
            <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    <SafeIcon name={option.icon} className="h-4 w-4" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan tentang perubahan status ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            className="gap-2"
          >
            <SafeIcon name="Save" className="h-4 w-4" />
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
