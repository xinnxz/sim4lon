
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SafeIcon from '@/components/common/SafeIcon'
import type { Driver } from './types'

interface DriverTableProps {
  drivers: Driver[]
  onEdit: (driver: Driver) => void
  onDelete: (driver: Driver) => void
}

export default function DriverTable({ drivers, onEdit, onDelete }: DriverTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <SafeIcon name="Users" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Tidak ada data supir yang ditemukan</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="font-semibold">Nama Supir</TableHead>
              <TableHead className="font-semibold">Nomor Telepon</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow 
                key={driver.id}
                className="hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {driver.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {driver.phone}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={driver.status === 'active' ? 'default' : 'secondary'}
                    className={driver.status === 'active' 
                      ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                      : 'bg-muted text-muted-foreground'
                    }
                  >
                    {driver.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
<TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <SafeIcon name="MoreVertical" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(driver)} className="cursor-pointer">
                        <SafeIcon name="Edit" className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
<DropdownMenuItem 
                        className="text-destructive cursor-pointer"
                        onClick={() => onDelete(driver)}
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
