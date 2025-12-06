
interface Customer {
  name: string
  address: string
  phone: string
  email: string
  contactPerson: string
}

interface InvoiceDetailsProps {
  customer: Customer
  orderId: string
  dueDate: string
}

export default function InvoiceDetails({ customer, orderId, dueDate }: InvoiceDetailsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Bill To */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Ditagihkan Kepada
        </h3>
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-foreground">{customer.name}</p>
          <p className="text-muted-foreground">{customer.address}</p>
          <p className="text-muted-foreground">Telepon: {customer.phone}</p>
          <p className="text-muted-foreground">Email: {customer.email}</p>
          <p className="text-muted-foreground">PIC: {customer.contactPerson}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Detail Invoice
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nomor Pesanan:</span>
            <span className="font-semibold text-foreground">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jatuh Tempo:</span>
            <span className="font-semibold text-foreground">{formatDate(dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
