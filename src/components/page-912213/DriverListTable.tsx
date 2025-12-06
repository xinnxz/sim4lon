
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SafeIcon from '@/components/common/SafeIcon'
import type { Driver } from './types'

interface DriverListTableProps {
  drivers: Driver[]
  onToggleStatus: (id: number) => void
  onDeleteDriver: (id: number) => void
}

export default function DriverListTable({
  drivers,
  onToggleStatus,
  onDeleteDriver,
}: DriverListTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card p-8 text-center">
        <SafeIcon name="Users" className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Tidak ada supir ditemukan
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Coba ubah filter atau tambahkan supir baru
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nama Supir</TableHead>
              <TableHead className="font-semibold">Nomor Telepon</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Pengiriman</TableHead>
              <TableHead className="font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">
                  {driver.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {driver.phone}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={driver.status === 'Aktif' ? 'default' : 'secondary'}
                    className={
                      driver.status === 'Aktif'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {driver.totalDeliveries} pengiriman
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <SafeIcon name="MoreVertical" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={`./edit-supir.html?id=${driver.id}`}>
                          <SafeIcon name="Edit" className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(driver.id)}
                      >
                        <SafeIcon
                          name={
                            driver.status === 'Aktif'
                              ? 'XCircle'
                              : 'CheckCircle'
                          }
                          className="mr-2 h-4 w-4"
                        />
                        <span>
                          {driver.status === 'Aktif'
                            ? 'Nonaktifkan'
                            : 'Aktifkan'}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteDriver(driver.id)}
                        className="text-destructive"
                      >
                        <SafeIcon name="Trash2" className="mr-2 h-4 w-4" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
