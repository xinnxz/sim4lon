
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
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
{mockNotifications.map((notification, index) => (
              <div key={notification.id}>
                <div 
                  onClick={() => handleNotificationClick(notification)}
                  className="flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    notification.type === 'success' ? 'bg-primary/10' :
                    notification.type === 'warning' ? 'bg-accent/20' :
                    'bg-secondary'
                  }`}>
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
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      {notification.type === 'warning' && (
                        <Badge variant="outline" className="shrink-0">Penting</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
                {index < mockNotifications.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
