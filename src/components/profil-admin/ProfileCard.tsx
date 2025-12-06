import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SafeIcon from "@/components/common/SafeIcon";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  lastLogin: string;
  status: "active" | "inactive";
  avatar: string;
}

const mockAdminProfile: AdminProfile = {
  id: "ADM001",
  name: "Luthfi Alfaridz",
  email: "budi.santoso@sim4lon.id",
  phone: "+62 812-3456-7890",
  role: "Administrator",
  department: "",
  joinDate: "15 Januari 2023",
  lastLogin: "2 jam yang lalu",
  status: "active",
  avatar:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/307adb9b-4e82-4810-bce6-d781a7e2c71a.png",
};

export default function ProfileCard() {
  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="border shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Detail akun administrator Anda</CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`${mockAdminProfile.status === "active" ? "bg-green-50 text-primary border-primary/30" : "bg-gray-50"}`}
            >
              <span
                className={`h-2 w-2 rounded-full mr-2 ${mockAdminProfile.status === "active" ? "bg-primary" : "bg-gray-400"}`}
              ></span>
              {mockAdminProfile.status === "active" ? "Aktif" : "Tidak Aktif"}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <Avatar className="h-24 w-24 shrink-0">
              <AvatarImage
                src={mockAdminProfile.avatar}
                alt={mockAdminProfile.name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {mockAdminProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {mockAdminProfile.name}
              </h2>
              <p className="text-sm text-primary font-medium mt-1">
                {mockAdminProfile.role}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <SafeIcon name="Clock" className="h-3 w-3" />
                <span>{mockAdminProfile.lastLogin}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Informasi Kontak</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <SafeIcon
                  name="Mail"
                  className="h-5 w-5 text-primary mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">
                    {mockAdminProfile.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <SafeIcon
                  name="Phone"
                  className="h-5 w-5 text-primary mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <p className="text-sm font-medium text-foreground">
                    {mockAdminProfile.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Detail Akun</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  ID Administrator
                </p>
                <p className="text-sm font-mono font-medium text-foreground">
                  {mockAdminProfile.id}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Tanggal Bergabung
                </p>
                <p className="text-sm font-medium text-foreground">
                  {mockAdminProfile.joinDate}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
