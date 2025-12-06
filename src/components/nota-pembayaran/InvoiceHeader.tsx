
import SafeIcon from '@/components/common/SafeIcon'

interface InvoiceHeaderProps {
  invoiceNumber: string
  invoiceDate: string
}

export default function InvoiceHeader({ invoiceNumber, invoiceDate }: InvoiceHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="flex items-start justify-between">
      {/* Company Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <SafeIcon name="Flame" className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SIM4LON</h1>
            <p className="text-sm text-muted-foreground">Sistem Informasi Distribusi LPG</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground space-y-1 mt-4">
          <p>Jl. Industri No. 45, Jakarta Pusat</p>
          <p>Telepon: (021) 5555-1234</p>
          <p>Email: info@sim4lon.com</p>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="text-right space-y-2">
        <h2 className="text-3xl font-bold text-primary">NOTA PEMBAYARAN</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-end gap-4">
            <span className="text-muted-foreground">Nomor Invoice:</span>
            <span className="font-semibold text-foreground w-40">{invoiceNumber}</span>
          </div>
          <div className="flex justify-end gap-4">
            <span className="text-muted-foreground">Tanggal:</span>
            <span className="font-semibold text-foreground w-40">{formatDate(invoiceDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
