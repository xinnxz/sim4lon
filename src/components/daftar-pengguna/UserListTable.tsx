import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SafeIcon from '@/components/common/SafeIcon'
import { Card } from '@/components/ui/card'

interface User {
  id: string
  name: string
  phone: string
  email: string
  role: 'admin' | 'operator'
  status: 'active' | 'inactive'
  createdAt: string
}

interface UserListTableProps {
  users: User[]
  roleLabels: Record<string, string>
  onEditUser: (user: User) => void
  onDisableUser: (user: User) => void
}

export default function UserListTable({ users, roleLabels, onEditUser, onDisableUser }: UserListTableProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary'
      case 'operator':
        return 'bg-accent/20 text-accent-foreground'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-900' 
      : 'bg-gray-100 text-gray-900'
  }

  if (users.length === 0) {
    return (
      <Card className="p-8 text-center">
        <SafeIcon name="Users" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Tidak ada pengguna yang sesuai dengan kriteria pencarian</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nama</TableHead>
              <TableHead className="font-semibold">No hp</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Peran</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{user.phone}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge className={`${getRoleColor(user.role)} border-0`}>
                    {roleLabels[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(user.status)} border-0`}>
                    {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
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
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => onEditUser(user)}
                      >
                        <SafeIcon name="Edit2" className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
<DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => onDisableUser(user)}
                      >
                        <SafeIcon name="Ban" className="mr-2 h-4 w-4" />
                        <span>Nonaktif</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}