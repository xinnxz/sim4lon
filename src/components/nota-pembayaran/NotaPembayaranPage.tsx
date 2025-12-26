/**
 * NotaPembayaranPage - Unified Invoice/Nota Document View
 * 
 * PENJELASAN:
 * Halaman enterprise untuk menampilkan Invoice (pre-payment) atau Nota/Kwitansi (post-payment).
 * - Fetch real data dari API
 * - Toggle antara mode Invoice dan Nota
 * - Print-optimized layout (A4)
 * - WhatsApp share dengan formatted text
 * 
 * URL Params:
 * - id: Order ID (required)
 * - type: 'invoice' | 'nota' (default: 'nota')
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/SafeIcon'
import { ordersApi, paymentApi, companyProfileApi, type Order, type OrderPaymentDetail, type CompanyProfile } from '@/lib/api'
import { formatCurrency } from '@/lib/currency'
import { toast } from 'sonner'
import { useAppSettings } from '@/hooks/useAppSettings'

type DocumentType = 'invoice' | 'nota'

interface DocumentData {
  // Order info
  orderId: string
  orderCode: string
  orderDate: string

  // Customer/Pangkalan info
  customerName: string
  customerAddress: string
  customerPhone: string
  customerEmail: string
  contactPerson: string

  // Items
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    subtotal: number
  }>

  // Totals
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number

  // Payment
  isPaid: boolean
  paymentMethod: string | null
  paymentDate: string | null
  amountPaid: number
}

export default function NotaPembayaranPage() {
  const [documentType, setDocumentType] = useState<DocumentType>('nota')
  const [data, setData] = useState<DocumentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)

  // Get app settings (PPN rate, etc.)
  const { settings: appSettings } = useAppSettings()

  // Get params from URL
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('id') || params.get('orderId')
    const type = params.get('type') as DocumentType

    if (type === 'invoice' || type === 'nota') {
      setDocumentType(type)
    }

    if (!orderId) {
      setError('Order ID tidak ditemukan')
      setIsLoading(false)
      return
    }

    fetchData(orderId)
  }, [])

  const fetchData = async (orderId: string) => {
    try {
      setIsLoading(true)

      // Fetch order, payment data, and company profile
      const [order, payment, profile] = await Promise.all([
        ordersApi.getById(orderId),
        paymentApi.getOrderPayment(orderId).catch((): null => null),
        companyProfileApi.get().catch((): null => null)
      ])

      // Store company profile for header
      if (profile) {
        setCompanyProfile(profile)
      }

      // Map to DocumentData
      const pangkalan = order.pangkalans
      const items = order.order_items.map(item => ({
        name: item.label || `LPG ${item.lpg_type}`,
        quantity: item.qty,
        unitPrice: Number(item.price_per_unit),
        subtotal: Number(item.sub_total || item.price_per_unit * item.qty)
      }))

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
      const taxAmount = items.reduce((sum, item) => {
        // Only non-subsidi items have tax
        const itemTax = (order.order_items.find(oi =>
          (oi.label || oi.lpg_type) === item.name
        ) as any)?.tax_amount || 0
        return sum + Number(itemTax)
      }, 0)
      // Determine if paid - from payment record OR order status
      const paidStatuses = ['DIPROSES', 'DIKIRIM', 'SELESAI']
      const isPaidFromStatus = paidStatuses.includes(order.current_status)
      const isPaid = payment?.is_paid || isPaidFromStatus

      setData({
        orderId: order.id,
        orderCode: order.code || `ORD-${order.id.slice(0, 4).toUpperCase()}`,
        orderDate: new Date(order.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: pangkalan?.name || 'Unknown',
        customerAddress: pangkalan?.address || '',
        customerPhone: pangkalan?.phone || '',
        customerEmail: (pangkalan as any)?.email || '',
        contactPerson: (pangkalan as any)?.pic_name || '',
        items,
        subtotal,
        taxRate: appSettings.ppnRate,
        taxAmount,
        total: order.total_amount,
        isPaid: isPaid,
        paymentMethod: payment?.payment_method || null,
        paymentDate: payment?.payment_date ? new Date(payment.payment_date).toLocaleDateString('id-ID') : null,
        amountPaid: Number(payment?.amount_paid || 0)
      })

      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch document data:', err)
      setError(err.message || 'Gagal memuat data dokumen')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  const handleShareWhatsApp = () => {
    if (!data) return

    const isNota = documentType === 'nota'
    const docTitle = isNota ? 'NOTA PEMBAYARAN' : 'INVOICE'

    // Format items list
    const itemLines = data.items.map(item =>
      `• ${item.name} x${item.quantity} = ${formatCurrency(item.subtotal)}`
    ).join('\n')

    // Get document link
    const docLink = window.location.href

    // Build clean message with monospace for summary
    const message = `*${docTitle}*

\`No: ${data.orderCode}\`
\`Tgl: ${data.orderDate}\`

*Kepada:*
${data.customerName}
${data.customerAddress}

*Detail Pesanan:*
${itemLines}

\`\`\`
Subtotal : ${formatCurrency(data.subtotal)}
PPN 12%  : ${formatCurrency(data.taxAmount)}
─────────────────────
TOTAL    : ${formatCurrency(data.total)}
\`\`\`

${isNota ? '✅ *Status: LUNAS*' : '⏳ *Status: Belum Dibayar*'}

📄 *Lihat Dokumen:*
${docLink}

_SIM4LON - Sistem Manajemen LPG_`

    const phone = data.customerPhone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/62${phone.startsWith('0') ? phone.slice(1) : phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link berhasil disalin!')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <SafeIcon name="Loader2" className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Memuat dokumen...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="max-w-md glass-card">
          <CardContent className="pt-6 text-center space-y-4">
            <SafeIcon name="AlertCircle" className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-semibold">Gagal Memuat Dokumen</h2>
            <p className="text-muted-foreground">{error || 'Data tidak ditemukan'}</p>
            <Button onClick={() => window.location.href = '/daftar-pesanan'}>
              Kembali ke Daftar Pesanan
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isNota = documentType === 'nota'
  const docNumber = isNota
    ? `NOTA-${data.orderCode.replace('ORD-', '')}`
    : `INV-${data.orderCode.replace('ORD-', '')}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Bar - Hidden on Print */}
        <div className="mb-6 flex flex-wrap gap-3 print:hidden">
          <Button
            onClick={() => {
              const params = new URLSearchParams(window.location.search)
              const orderId = params.get('id') || params.get('orderId')
              if (orderId) {
                window.location.href = `/detail-pesanan?id=${orderId}`
              } else {
                window.location.href = '/daftar-pesanan'
              }
            }}
            variant="outline"
            className="gap-2"
          >
            <SafeIcon name="ArrowLeft" className="h-4 w-4" />
            Kembali
          </Button>

          {/* Document Type Toggle */}
          <Tabs value={documentType} onValueChange={(v) => {
            // Only allow switching to nota if paid
            if (v === 'nota' && !data.isPaid) {
              toast.error('Nota hanya tersedia setelah pembayaran lunas')
              return
            }
            setDocumentType(v as DocumentType)
          }}>
            <TabsList className="bg-secondary">
              <TabsTrigger
                value="invoice"
                className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <SafeIcon name="FileText" className="h-4 w-4" />
                Invoice
              </TabsTrigger>
              <TabsTrigger
                value="nota"
                className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                disabled={!data.isPaid}
                title={!data.isPaid ? 'Nota tersedia setelah pembayaran lunas' : ''}
              >
                <SafeIcon name="Receipt" className="h-4 w-4" />
                Nota
                {!data.isPaid && <SafeIcon name="Lock" className="h-3 w-3 ml-1 opacity-50" />}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1" />

          <Button onClick={handleCopyLink} variant="outline" className="gap-2">
            <SafeIcon name="Link" className="h-4 w-4" />
            Copy Link
          </Button>
          <Button onClick={handleShareWhatsApp} variant="outline" className="gap-2">
            <SafeIcon name="MessageCircle" className="h-4 w-4" />
            Share WA
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting} className="gap-2 bg-primary hover:bg-primary/90">
            <SafeIcon name="Printer" className="h-4 w-4" />
            {isPrinting ? 'Mencetak...' : 'Print'}
          </Button>
        </div>

        {/* Document Card - Premium with shadow and dark mode */}
        <Card className="bg-white dark:bg-card shadow-xl dark:shadow-2xl print:shadow-none print:border-0 relative overflow-hidden print:overflow-visible border-0">
          {/* LUNAS Watermark for Nota - Diagonal Green */}
          {isNota && data.isPaid && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div
                className="text-green-500/10 dark:text-green-400/10 print:text-green-500/15"
                style={{
                  fontSize: 'clamp(100px, 20vw, 180px)',
                  fontWeight: 900,
                  transform: 'rotate(-35deg)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  userSelect: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                LUNAS
              </div>
            </div>
          )}

          <CardContent className="p-8 print:p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                {/* Company Logo */}
                {companyProfile?.logo_url ? (
                  <img
                    src={companyProfile.logo_url}
                    alt="Company Logo"
                    className="w-16 h-16 object-contain rounded-lg border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <SafeIcon name="Building2" className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-primary">
                    {companyProfile?.company_name || 'SIM4LON'}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {companyProfile?.address || 'Sistem Manajemen LPG'}
                  </p>
                  {companyProfile?.phone && (
                    <p className="text-xs text-muted-foreground">Tel: {companyProfile.phone}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {isNota ? 'NOTA PEMBAYARAN' : 'INVOICE'}
                </h2>
                <p className="text-sm font-mono mt-1">{docNumber}</p>
                <p className="text-sm text-muted-foreground">{data.orderDate}</p>
                {isNota && data.isPaid && (
                  <Badge className="mt-2 bg-green-500 text-white">
                    <SafeIcon name="CheckCircle" className="h-3 w-3 mr-1" />
                    LUNAS
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">TAGIHAN KEPADA</p>
                <p className="font-semibold text-lg">{data.customerName}</p>
                <p className="text-sm text-gray-600">{data.customerAddress}</p>
                {data.contactPerson && (
                  <p className="text-sm text-gray-600 mt-1">PIC: {data.contactPerson}</p>
                )}
                {data.customerPhone && (
                  <p className="text-sm text-gray-600">Tel: {data.customerPhone}</p>
                )}
                {data.customerEmail && (
                  <p className="text-sm text-gray-600">Email: {data.customerEmail}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground mb-2">REFERENSI</p>
                <p className="text-sm">No. Order: <span className="font-mono font-semibold">{data.orderCode}</span></p>
                {isNota && data.paymentDate && (
                  <p className="text-sm mt-1">Tanggal Bayar: {data.paymentDate}</p>
                )}
                {isNota && data.paymentMethod && (
                  <p className="text-sm">Metode: {data.paymentMethod}</p>
                )}
              </div>
            </div>

            {/* Items Table - Premium styling */}
            <div className="border dark:border-border/50 rounded-lg overflow-hidden mb-8 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Item</th>
                    <th className="text-center p-3 text-sm font-semibold w-20">Qty</th>
                    <th className="text-right p-3 text-sm font-semibold w-32">Harga</th>
                    <th className="text-right p-3 text-sm font-semibold w-36">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={index} className="border-t dark:border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-sm">{item.name}</td>
                      <td className="p-3 text-sm text-center">{item.quantity}</td>
                      <td className="p-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-3 text-sm text-right font-medium">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(data.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PPN ({data.taxRate}%)</span>
                  <span>{formatCurrency(data.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL</span>
                  <span className="text-primary">{formatCurrency(data.total)}</span>
                </div>
                {isNota && data.isPaid && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Terbayar</span>
                    <span>{formatCurrency(data.amountPaid || data.total)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t dark:border-border/50">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Catatan:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {isNota
                      ? 'Terima kasih atas pembayaran Anda. Simpan nota ini sebagai bukti transaksi.'
                      : 'Pembayaran dapat dilakukan melalui transfer bank. Harap sertakan nomor order saat transfer.'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-8">Hormat kami,</p>
                  <p className="text-sm font-semibold">SIM4LON</p>
                  <p className="text-xs text-muted-foreground">Sistem Manajemen LPG</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card >
      </div >

      {/* Print Styles - Force White Background for Print */}
      <style>{`
        @media print {
          /* CRITICAL: Force light theme for print regardless of dark mode */
          html, body, .dark, :root { 
            background: white !important;
            background-color: white !important;
            color: #1f2937 !important;
            color-scheme: light !important;
          }
          
          /* Override dark mode variables for print */
          :root, .dark {
            --background: 0 0% 100% !important;
            --foreground: 222.2 84% 4.9% !important;
            --card: 0 0% 100% !important;
            --card-foreground: 222.2 84% 4.9% !important;
            --muted: 210 40% 96.1% !important;
            --muted-foreground: 215.4 16.3% 46.9% !important;
            --border: 214.3 31.8% 91.4% !important;
          }
          
          /* Force white background on all elements */
          *, *::before, *::after {
            background-color: transparent !important;
          }
          
          /* Card must be white */
          .bg-white, 
          [class*="bg-card"],
          [class*="dark:bg-card"],
          .dark .bg-white,
          .dark [class*="bg-card"] {
            background: white !important;
            background-color: white !important;
            color: #1f2937 !important;
          }
          
          /* Page background */
          .min-h-screen,
          [class*="from-slate"],
          [class*="dark:from-slate"] {
            background: white !important;
          }
          
          /* Text colors for print */
          h1, h2, h3, h4, h5, h6, p, span, td, th, label {
            color: #1f2937 !important;
          }
          
          .text-muted-foreground,
          [class*="text-gray"] {
            color: #6b7280 !important;
          }
          
          .text-primary {
            color: #16a34a !important;
          }
          
          /* Table styling for print */
          table { border-collapse: collapse !important; }
          thead { background: #f9fafb !important; }
          th, td { 
            border-color: #e5e7eb !important;
            background: transparent !important;
          }
          
          /* Hide action bar and non-print elements */
          header, footer, nav, aside,
          .print\\:hidden,
          [data-radix-portal],
          [role="navigation"],
          .toaster { 
            display: none !important; 
          }
          
          /* Document container */
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-0 { border: none !important; }
          
          /* Ensure content fits on one page */
          .max-w-4xl { 
            max-width: 100% !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* No page breaks inside elements */
          table, tr, td, th, thead, tbody { 
            page-break-inside: avoid !important; 
          }
          
          /* Watermark visibility on print */
          [class*="text-green-500/10"],
          [class*="text-green-400/10"] {
            color: rgba(34, 197, 94, 0.15) !important;
          }
          
          /* Badge styling */
          .bg-green-500 {
            background-color: #22c55e !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        @page { 
          size: A4 portrait; 
          margin: 0.8cm;
        }
      `}</style>
    </div>
  )
}
