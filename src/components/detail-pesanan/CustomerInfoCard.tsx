
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'

interface Customer {
  name: string
  address: string
  email: string
  contact: string
  contactPhone: string
}

interface CustomerInfoCardProps {
  customer: Customer
}

export default function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <SafeIcon name="Store" className="h-4 w-4 text-primary" />
          Informasi Pangkalan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Nama Pangkalan</p>
          <p className="font-medium text-sm sm:text-base">{customer.name}</p>
        </div>

        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Alamat</p>
          <p className="text-xs sm:text-sm">{customer.address}</p>
        </div>

        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
          <a
            href={`mailto:${customer.email}`}
            className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
          >
            <SafeIcon name="Mail" className="h-3 w-3 sm:h-4 sm:w-4" />
            {customer.email}
          </a>
        </div>

        <div className="border-t pt-3 sm:pt-4">
          <p className="text-xs sm:text-sm text-muted-foreground">Kontak Penanggung Jawab</p>
          <p className="font-medium text-xs sm:text-sm">{customer.contact}</p>
          <a
            href={`tel:${customer.contactPhone}`}
            className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 mt-1"
          >
            <SafeIcon name="Phone" className="h-3 w-3 sm:h-4 sm:w-4" />
            {customer.contactPhone}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
