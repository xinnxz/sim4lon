
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SafeIcon from '@/components/common/SafeIcon'
import { MOCK_DRIVER_MANAGEMENT_LIST } from '@/data/user'

export default function DriverListTable() {
  const [drivers] = useState(MOCK_DRIVER_MANAGEMENT_LIST)

  const handleEdit = (driverId: string) => {
    // Navigate to edit driver page (to be implemented)
    window.location.href = `./edit-supir.html?id=${driverId}`
  }

  const handleDeactivate = (driverId: string) => {
    // Handle deactivate action (to be implemented)
    console.log('Deactivate driver:', driverId)
  }

  return (
    <Card className="animate-fadeInUp">
      <CardHeader>
        <CardTitle>Daftar Supir Aktif</CardTitle>
        <CardDescription>
          Total {drivers.length} supir terdaftar dalam sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Nama Supir</TableHead>
                <TableHead className="font-semibold">Nomor Telepon</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <TableRow key={driver.userId} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={driver.avatarUrl} alt={driver.nama} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {driver.nama.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{driver.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {driver.telepon}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={driver.isActive ? "default" : "secondary"}
                        className={driver.isActive ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}
                      >
                        {driver.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <SafeIcon name="MoreVertical" className="h-4 w-4" />
                            <span className="sr-only">Buka menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleEdit(driver.userId)}
                            className="cursor-pointer"
                          >
                            <SafeIcon name="Edit" className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeactivate(driver.userId)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <SafeIcon name="Ban" className="mr-2 h-4 w-4" />
                            <span>{driver.isActive ? "Nonaktifkan" : "Aktifkan"}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <SafeIcon name="Users" className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">Tidak ada data supir</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
