
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

const reportTypes = [
  { id: 'penjualan', label: 'Laporan Penjualan', description: 'Tren penjualan dan ringkasan transaksi' },
  { id: 'pembayaran', label: 'Status Pembayaran', description: 'Detail pembayaran pesanan' },
  { id: 'stok', label: 'Pemakaian Stok', description: 'Laporan inventaris dan pemakaian' },
]

export default function ExportLaporanForm() {
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf')
  const [selectedReports, setSelectedReports] = useState<string[]>(['penjualan', 'pembayaran'])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Set default dates (current month)
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const defaultStartDate = firstDay.toISOString().split('T')[0]
  const defaultEndDate = lastDay.toISOString().split('T')[0]

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleSelectAll = () => {
    if (selectedReports.length === reportTypes.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(reportTypes.map(r => r.id))
    }
  }

  const handleExport = async () => {
    if (selectedReports.length === 0) {
      toast.error('Pilih minimal satu laporan untuk diekspor')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Pilih periode tanggal terlebih dahulu')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir')
      return
    }

    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      const reportNames = selectedReports
        .map(id => reportTypes.find(r => r.id === id)?.label)
        .join(', ')

      toast.success(
        `Laporan berhasil diekspor dalam format ${format.toUpperCase()}\n${reportNames}`
      )
      setIsExporting(false)
    }, 1500)
  }

  const handleReset = () => {
    setFormat('pdf')
    setSelectedReports(['penjualan', 'pembayaran'])
    setStartDate('')
    setEndDate('')
  }

return (
    <>
{/* Back Button */}
      <div className="flex justify-start mb-6" style={{ margin: '10px 0px 10px 50px' }}>
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <a href="./dashboard-laporan.html">
            <SafeIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Kembali
          </a>
        </Button>
      </div>

      <div className="grid gap-6" style={{ margin: '0px 50px 0px 50px' }}>
      {/* Format Selection Card */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="FileText" className="h-5 w-5 text-primary" />
            Format Ekspor
          </CardTitle>
          <CardDescription>
            Pilih format file yang Anda inginkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as 'pdf' | 'excel')}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex-1 cursor-pointer">
                  <div className="font-medium">PDF</div>
                  <div className="text-sm text-muted-foreground">Format PDF untuk cetak dan arsip</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex-1 cursor-pointer">
                  <div className="font-medium">Excel</div>
                  <div className="text-sm text-muted-foreground">Format Excel untuk analisis data</div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Report Selection Card */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="BarChart3" className="h-5 w-5 text-primary" />
            Pilih Laporan
          </CardTitle>
          <CardDescription>
            Pilih jenis laporan yang ingin diekspor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Select All Option */}
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-secondary/30 border border-primary/20">
              <Checkbox
                id="select-all"
                checked={selectedReports.length === reportTypes.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="flex-1 cursor-pointer font-medium">
                Pilih Semua Laporan
              </Label>
            </div>

            <Separator />

            {/* Report Options */}
            <div className="space-y-3">
              {reportTypes.map(report => (
                <div key={report.id} className="flex items-start space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <Checkbox
                    id={report.id}
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => handleReportToggle(report.id)}
                    className="mt-1"
                  />
                  <Label htmlFor={report.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{report.label}</div>
                    <div className="text-sm text-muted-foreground">{report.description}</div>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Range Card */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Calendar" className="h-5 w-5 text-primary" />
            Periode Laporan
          </CardTitle>
          <CardDescription>
            Tentukan rentang tanggal untuk laporan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Tanggal Mulai</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate || defaultStartDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Tanggal Akhir</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate || defaultEndDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

{/* Summary Card */}
       {selectedReports.length > 0 && (
         <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <SafeIcon name="Info" className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Ringkasan Ekspor</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Anda akan mengekspor {selectedReports.length} laporan dalam format {format.toUpperCase()} untuk periode {startDate || defaultStartDate} hingga {endDate || defaultEndDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

{/* Action Buttons */}
       <div className="flex gap-3 justify-end">
         <Button
           variant="outline"
           onClick={handleReset}
           disabled={isExporting}
         >
           <SafeIcon name="RotateCcw" className="mr-2 h-4 w-4" />
           Reset
         </Button>
         <Button
           onClick={handleExport}
           disabled={isExporting || selectedReports.length === 0}
           className="bg-primary hover:bg-primary/90"
         >
           {isExporting ? (
             <>
               <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
               Mengekspor...
             </>
           ) : (
             <>
               <SafeIcon name="Download" className="mr-2 h-4 w-4" />
               Ekspor Laporan
             </>
           )}
         </Button>
       </div>
     </div>
    </>
   )
}
