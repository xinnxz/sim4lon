
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SafeIcon from '@/components/common/SafeIcon'

const recentActivities = [
  {
    id: 1,
    type: 'payment',
    title: 'Pembayaran Diterima',
    description: 'Pesanan #12345 - Pangkalan Maju Jaya',
    amount: 'Rp 2.500.000',
    time: '2 jam yang lalu',
    icon: 'CheckCircle',
    status: 'success'
  },
{
     id: 2,
     type: 'order',
     title: 'Pesanan Selesai',
     description: 'Pesanan #12344 - Pangkalan Sumber Jaya',
     amount: '50 tabung LPG 12kg',
     time: '4 jam yang lalu',
     icon: 'CheckCircle',
     status: 'success'
   },
  {
    id: 3,
    type: 'order',
    title: 'Pesanan Baru',
    description: 'Pesanan #12346 - Pangkalan Bersama',
    amount: '100 tabung LPG 3kg',
    time: '6 jam yang lalu',
    icon: 'ShoppingCart',
    status: 'pending'
  },
  {
    id: 4,
    type: 'order',
    title: 'Pengiriman Dimulai',
    description: 'Pesanan #12343 - Driver: Ahmad Wijaya',
    amount: 'Rp 5.000.000',
    time: '1 hari yang lalu',
    icon: 'Truck',
    status: 'success'
  }
]

export default function RecentActivitySection() {
    return (
<Card className="h-full flex flex-col shadow-sm">
       <CardHeader className="pb-4">
         <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
         <CardDescription className="text-xs sm:text-sm">Ringkasan pembayaran dan pengiriman terbaru</CardDescription>
       </CardHeader>
<CardContent id="i7bc0u" className="space-y-4 flex-1 flex flex-col">
         <div className="space-y-4 max-h-96 overflow-y-auto flex-1">
{recentActivities.map((activity, index) => {
            const href = activity.type === 'delivery' 
              ? `./detail-pengiriman.html?id=${activity.id}`
              : `./detail-pesanan.html?id=${activity.id}`;
            
            return (
            <a 
              key={activity.id}
              href={href}
              className="transition-all duration-300 ease-out hover:bg-muted/50 p-3 rounded-lg block cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  activity.status === 'success' ? 'bg-primary/10' :
                  activity.status === 'warning' ? 'bg-destructive/10' :
                  'bg-secondary/50'
                }`}>
                  <SafeIcon 
                    name={activity.icon} 
                    className={`h-5 w-5 transition-transform duration-300 ${
                      activity.status === 'success' ? 'text-primary' :
                      activity.status === 'warning' ? 'text-destructive' :
                      'text-foreground/70'
                    }`}
                  />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium transition-colors duration-300">{activity.title}</p>
                    <Badge 
                      variant={activity.status === 'success' ? 'default' : activity.status === 'warning' ? 'destructive' : 'secondary'}
                      className="text-xs flex-shrink-0 transition-all duration-300"
                    >
                      {activity.status === 'success' ? 'Selesai' : activity.status === 'warning' ? 'Tertunda' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 transition-colors duration-300">{activity.description}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
                    <p className="text-muted-foreground transition-colors duration-300">{activity.time}</p>
                    <p className="font-semibold text-primary transition-colors duration-300 line-clamp-1">{activity.amount}</p>
                  </div>
                </div>
              </div>
              {index < recentActivities.length - 1 && <Separator className="mt-3" />}
            </a>
            );
          })}
        </div>
<Button variant="outline" className="w-full mt-2 text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-300 ease-out pointer-events-auto" asChild style={{ pointerEvents: 'auto' }}>
<a href="./page-911994.html" id="i1jdjs" style={{ pointerEvents: 'auto' }}>
            Lihat Semua Aktivitas
            <SafeIcon name="ArrowRight" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
</Button>
</CardContent>
      </Card>
    )
 }
