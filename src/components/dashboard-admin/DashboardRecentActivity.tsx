import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SafeIcon from "@/components/common/SafeIcon";

interface Activity {
  id: string;
  type: "payment" | "delivery";
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "in-progress";
  icon: string;
}

const recentActivities: Activity[] = [
  {
    id: "1",
    type: "payment",
    title: "Pembayaran Diterima",
    description: "Pesanan #12345 - Pangkalan Maju Jaya",
    timestamp: "2 jam yang lalu",
    status: "completed",
    icon: "CheckCircle",
  },
  {
    id: "2",
    type: "delivery",
    title: "Pengiriman Dimulai",
    description: "Pesanan #12344 - Driver: Luthfi Alfaridz",
    timestamp: "1 jam yang lalu",
    status: "in-progress",
    icon: "Truck",
  },
  {
    id: "3",
    type: "payment",
    title: "Pembayaran Tertunda",
    description: "Pesanan #12343 - Pangkalan Sejahtera",
    timestamp: "30 menit yang lalu",
    status: "pending",
    icon: "AlertCircle",
  },
  {
    id: "4",
    type: "delivery",
    title: "Pengiriman Selesai",
    description: "Pesanan #12342 - Pangkalan Bersama",
    timestamp: "15 menit yang lalu",
    status: "completed",
    icon: "CheckCircle",
  },
];

const statusColors = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
};

const statusLabels = {
  completed: "Selesai",
  pending: "Tertunda",
  "in-progress": "Berlangsung",
};

export default function DashboardRecentActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Pembayaran Terbaru</CardTitle>
          <CardDescription>Aktivitas pembayaran terakhir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities
            .filter((a) => a.type === "payment")
            .map((activity, index) => (
              <div key={activity.id}>
                <div className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-100"
                        : activity.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <SafeIcon
                      name={activity.icon}
                      className={`h-5 w-5 ${
                        activity.status === "completed"
                          ? "text-green-700"
                          : activity.status === "pending"
                            ? "text-yellow-700"
                            : "text-blue-700"
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusColors[activity.status]}
                  >
                    {statusLabels[activity.status]}
                  </Badge>
                </div>
                {index <
                  recentActivities.filter((a) => a.type === "payment").length -
                    1 && <Separator className="my-4" />}
              </div>
            ))}
          <Button variant="outline" className="w-full mt-4" asChild>
            <a href="./daftar-pesanan.html">Lihat Semua Pembayaran</a>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Pengiriman Terbaru</CardTitle>
          <CardDescription>Aktivitas pengiriman terakhir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities
            .filter((a) => a.type === "delivery")
            .map((activity, index) => (
              <div key={activity.id}>
                <div className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-100"
                        : activity.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <SafeIcon
                      name={activity.icon}
                      className={`h-5 w-5 ${
                        activity.status === "completed"
                          ? "text-green-700"
                          : activity.status === "pending"
                            ? "text-yellow-700"
                            : "text-blue-700"
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusColors[activity.status]}
                  >
                    {statusLabels[activity.status]}
                  </Badge>
                </div>
                {index <
                  recentActivities.filter((a) => a.type === "delivery").length -
                    1 && <Separator className="my-4" />}
              </div>
            ))}
          <Button variant="outline" className="w-full mt-4" asChild>
            <a href="./daftar-pengiriman.html">Lihat Semua Pengiriman</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
