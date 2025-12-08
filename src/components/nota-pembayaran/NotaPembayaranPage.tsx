
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import InvoiceHeader from '@/components/nota-pembayaran/InvoiceHeader'
import InvoiceDetails from '@/components/nota-pembayaran/InvoiceDetails'
import InvoiceItems from '@/components/nota-pembayaran/InvoiceItems'
import InvoiceSummary from '@/components/nota-pembayaran/InvoiceSummary'
import InvoiceFooter from '@/components/nota-pembayaran/InvoiceFooter'

// Mock invoice data
const mockInvoiceData = {
  invoiceNumber: 'INV-2024-12345',
  invoiceDate: '2024-01-15',
  dueDate: '2024-01-22',
  orderId: 'ORD-12345',
  
  customer: {
    name: 'Pangkalan Maju Jaya',
    address: 'Jl. Raya Utama No. 123, Jakarta Timur',
    phone: '021-1234567',
    email: 'info@majujaya.com',
    contactPerson: 'Budi Santoso'
  },
  
  items: [
    {
      id: 1,
      description: 'LPG 3kg',
      quantity: 50,
      unit: 'tabung',
      unitPrice: 45000,
      total: 2250000
    },
    {
      id: 2,
      description: 'LPG 12kg',
      quantity: 20,
      unit: 'tabung',
      unitPrice: 120000,
      total: 2400000
    }
  ],
  
  subtotal: 4650000,
  tax: 465000,
  shippingCost: 250000,
  total: 5365000,
  
  paymentStatus: 'Lunas',
  paymentMethod: 'Transfer Bank',
  paymentDate: '2024-01-15',
  bankName: 'Bank Mandiri',
  accountNumber: '1234567890',
  
  notes: 'Terima kasih atas kepercayaan Anda. Barang akan dikirim sesuai jadwal yang telah disepakati.',
  terms: 'Pembayaran harus dilakukan sebelum pengiriman. Barang yang rusak dapat diklaim dalam 24 jam setelah pengiriman.'
}

export default function NotaPembayaranPage() {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.print()
        setIsPrinting(false)
      }, 100)
    }
  }

  const handleSendWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const message = `Halo ${mockInvoiceData.customer.contactPerson},\n\nBerikut adalah nota pembayaran Anda:\n\nNomor Invoice: ${mockInvoiceData.invoiceNumber}\nNomor Pesanan: ${mockInvoiceData.orderId}\nTotal: Rp ${mockInvoiceData.total.toLocaleString('id-ID')}\nStatus: ${mockInvoiceData.paymentStatus}\n\nTerima kasih atas pesanan Anda.`
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/62${mockInvoiceData.customer.phone.replace(/^0/, '')}?text=${encodedMessage}`
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons - Hidden on Print */}
        <div className="mb-6 flex gap-3 print:hidden">
<Button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = './detail-pesanan.html'
              }
            }}
            variant="outline"
            className="gap-2"
          >
            <SafeIcon name="ArrowLeft" className="h-4 w-4" />
            Kembali
          </Button>
          <div className="flex-1" />
          <Button
            onClick={handleSendWhatsApp}
            variant="outline"
            className="gap-2"
          >
            <SafeIcon name="MessageCircle" className="h-4 w-4" />
            Kirim WA
          </Button>
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <SafeIcon name="Printer" className="h-4 w-4" />
            {isPrinting ? 'Mencetak...' : 'Cetak'}
          </Button>
        </div>

        {/* Invoice Card */}
        <Card className="bg-white shadow-lg print:shadow-none print:border-0">
          <div className="p-8 print:p-0">
            {/* Invoice Content */}
            <div className="space-y-6">
              <InvoiceHeader 
                invoiceNumber={mockInvoiceData.invoiceNumber}
                invoiceDate={mockInvoiceData.invoiceDate}
              />
              
              <div className="border-t pt-6" />
              
              <InvoiceDetails 
                customer={mockInvoiceData.customer}
                orderId={mockInvoiceData.orderId}
                dueDate={mockInvoiceData.dueDate}
              />
              
              <div className="border-t pt-6" />
              
              <InvoiceItems items={mockInvoiceData.items} />
              
              <div className="border-t pt-6" />
              
              <InvoiceSummary
                subtotal={mockInvoiceData.subtotal}
                tax={mockInvoiceData.tax}
                shippingCost={mockInvoiceData.shippingCost}
                total={mockInvoiceData.total}
                paymentStatus={mockInvoiceData.paymentStatus}
                paymentMethod={mockInvoiceData.paymentMethod}
                paymentDate={mockInvoiceData.paymentDate}
              />
              
              <div className="border-t pt-6" />
              
              <InvoiceFooter
                notes={mockInvoiceData.notes}
                terms={mockInvoiceData.terms}
              />
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
