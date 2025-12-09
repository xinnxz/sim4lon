
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface NotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockNotifications = [
  {
    id: 1,
    title: 'Pesanan Baru',
    message: 'Pesanan #12345 dari Pangkalan Maju Jaya telah dibuat',
    time: '5 menit yang lalu',
    type: 'info',
    icon: 'ShoppingCart'
  },
  {
    id: 2,
    title: 'Pembayaran Diterima',
    message: 'Pembayaran untuk pesanan #12344 telah dikonfirmasi',
    time: '1 jam yang lalu',
    type: 'success',
    icon: 'CheckCircle'
  },
  {
    id: 3,
    title: 'Stok Menipis',
    message: 'Stok LPG 3kg tersisa 50 tabung',
    time: '2 jam yang lalu',
    type: 'warning',
    icon: 'AlertTriangle'
  },
]

export default function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
  const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
    const orderMatch = notification.message.match(/#(\d+)/);
    const orderId = orderMatch ? orderMatch[1] : null;

    if (notification.title === 'Pesanan Baru' || notification.title === 'Pembayaran Diterima') {
      if (orderId) {
        window.location.href = `./detail-pesanan.html?id=${orderId}`;
      }
    } else if (notification.title === 'Stok Menipis') {
      window.location.href = './ringkasan-stok.html';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifikasi</DialogTitle>
          <DialogDescription>
            Anda memiliki {mockNotifications.length} notifikasi baru
          </DialogDescription>
        </DialogHeader>
<ScrollArea className="h-[500px] pr-4">
         <div className="space-y-2">
{mockNotifications.map((notification, index) => (
             <div key={notification.id}>
               <div 
                 onClick={() => handleNotificationClick(notification)}
                 className="flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/5 active:bg-primary/10 transition-colors duration-200 group"
               >
                 <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    notification.type === 'success' ? 'bg-primary/15 group-hover:bg-primary/20' :
                    notification.type === 'warning' ? 'bg-accent/25 group-hover:bg-accent/30' :
                    'bg-secondary group-hover:bg-secondary/70'
                  } transition-colors duration-200`}>
                    <SafeIcon 
                      name={notification.icon} 
                      className={`h-5 w-5 ${
                        notification.type === 'success' ? 'text-primary' :
                        notification.type === 'warning' ? 'text-accent-foreground' :
                        'text-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-none text-foreground">
                        {notification.title}
                      </p>
                      {notification.type === 'warning' && (
                        <Badge variant="outline" className="shrink-0 bg-accent/10 text-accent-foreground border-accent/30 text-xs">Penting</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {notification.time}
                    </p>
                  </div>
                </div>
                {index < mockNotifications.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
         </div>
</ScrollArea>
         <Button variant="outline" className="w-full mt-4 text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-300 ease-out" asChild>
           <a href="./page-911994.html">
             Lihat Semua Aktivitas
             <SafeIcon name="ArrowRight" className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
           </a>
         </Button>
       </DialogContent>
     </Dialog>
  )
}
