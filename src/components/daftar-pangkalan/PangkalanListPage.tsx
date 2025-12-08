
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TambahPangkalanForm from '@/components/tambah-pangkalan/TambahPangkalanForm'
import ConfirmationModal from '@/components/common/ConfirmationModal'

interface Pangkalan {
  id: string
  nama: string
  alamat: string
  kontak: string
  email: string
  pic: string
  status: 'aktif' | 'nonaktif'
  createdAt: string
}

const mockPangkalanData: Pangkalan[] = [
  {
    id: 'PK001',
    nama: 'Pangkalan Maju Jaya',
    alamat: 'Jl. Raya Utama No. 123, Jakarta Pusat',
    kontak: '021-1234567',
    email: 'majujaya@lpg.com',
    pic: 'Budi Santoso',
    status: 'aktif',
    createdAt: '2024-01-15'
  },
  {
    id: 'PK002',
    nama: 'Pangkalan Sejahtera',
    alamat: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
    kontak: '021-2345678',
    email: 'sejahtera@lpg.com',
    pic: 'Siti Nurhaliza',
    status: 'aktif',
    createdAt: '2024-01-20'
  },
  {
    id: 'PK003',
    nama: 'Pangkalan Bersama',
    alamat: 'Jl. Ahmad Yani No. 789, Bandung',
    kontak: '022-3456789',
    email: 'bersama@lpg.com',
    pic: 'Ahmad Wijaya',
    status: 'aktif',
    createdAt: '2024-02-01'
  },
  {
    id: 'PK004',
    nama: 'Pangkalan Mitra Utama',
    alamat: 'Jl. Diponegoro No. 321, Surabaya',
    kontak: '031-4567890',
    email: 'mitrautama@lpg.com',
    pic: 'Eka Putra',
    status: 'aktif',
    createdAt: '2024-02-10'
  },
  {
    id: 'PK005',
    nama: 'Pangkalan Sentosa',
    alamat: 'Jl. Sudirman No. 654, Medan',
    kontak: '061-5678901',
    email: 'sentosa@lpg.com',
    pic: 'Rini Handayani',
    status: 'nonaktif',
    createdAt: '2024-02-15'
  },
  {
    id: 'PK006',
    nama: 'Pangkalan Jaya Abadi',
    alamat: 'Jl. Imam Bonjol No. 987, Semarang',
    kontak: '024-6789012',
    email: 'jayaabadi@lpg.com',
    pic: 'Dwi Prasetyo',
    status: 'aktif',
    createdAt: '2024-03-01'
  },
]

export default function PangkalanListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'semua' | 'aktif' | 'nonaktif'>('semua')
  const [pangkalanList, setPangkalanList] = useState<Pangkalan[]>(mockPangkalanData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPangkalan, setSelectedPangkalan] = useState<Pangkalan | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

const filteredPangkalan = pangkalanList.filter(
    (p) => {
      const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kontak.includes(searchTerm)
      
      if (statusFilter === 'semua') return matchesSearch
      return matchesSearch && p.status === statusFilter
    }
  )

  const handleStatusToggleClick = (pangkalan: Pangkalan) => {
    setSelectedPangkalan(pangkalan)
    setShowConfirmModal(true)
  }

  const handleConfirmStatusToggle = async () => {
    if (!selectedPangkalan) return
    
    const newStatus = selectedPangkalan.status === 'aktif' ? 'nonaktif' : 'aktif'
    setPangkalanList(pangkalanList.map(p => 
      p.id === selectedPangkalan.id 
        ? { ...p, status: newStatus }
        : p
    ))
    
    setShowConfirmModal(false)
    setSelectedPangkalan(null)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pangkalan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pangkalan distribusi LPG Anda
          </p>
        </div>
<Button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
        >
          <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
          Tambah Pangkalan
        </Button>
      </div>

{/* Summary Stats */}
       <div id="ikyt24" className="grid gap-4 md:grid-cols-3">
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Pangkalan
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{pangkalanList.length}</div>
             <p className="text-xs text-muted-foreground mt-1">
               Semua pangkalan terdaftar
             </p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Pangkalan Aktif
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-primary">
               {pangkalanList.filter((p) => p.status === 'aktif').length}
             </div>
             <p className="text-xs text-muted-foreground mt-1">
               Siap beroperasi
             </p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Pangkalan Nonaktif
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-destructive">
               {pangkalanList.filter((p) => p.status === 'nonaktif').length}
             </div>
             <p className="text-xs text-muted-foreground mt-1">
               Memerlukan perhatian
             </p>
           </CardContent>
         </Card>
       </div>

{/* Search and Filter Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cari Pangkalan</CardTitle>
            <CardDescription>
              Cari berdasarkan nama, alamat, atau nomor kontak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Cari pangkalan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <SafeIcon name="Search" className="h-4 w-4" />
                </Button>
              </div>
<div className="flex gap-2">
                <Button
                  variant={statusFilter === 'semua' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('semua')}
                  className="flex-1 sm:flex-none"
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === 'aktif' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('aktif')}
                  className="flex-1 sm:flex-none"
                >
                  Aktif
                </Button>
                <Button
                  variant={statusFilter === 'nonaktif' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('nonaktif')}
                  className="flex-1 sm:flex-none"
                >
                  Nonaktif
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

       {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pangkalan</CardTitle>
          <CardDescription>
            Total {filteredPangkalan.length} pangkalan terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
<TableHeader>
                 <TableRow className="bg-muted/50">
                   <TableHead className="font-semibold">ID</TableHead>
                   <TableHead className="font-semibold">Nama Pangkalan</TableHead>
                   <TableHead className="font-semibold">Alamat</TableHead>
                   <TableHead className="font-semibold">Kontak</TableHead>
                   <TableHead className="font-semibold">PIC</TableHead>
                   <TableHead className="font-semibold">Status</TableHead>
                   <TableHead className="text-right font-semibold">Aksi</TableHead>
                 </TableRow>
               </TableHeader>
              <TableBody>
                {filteredPangkalan.length > 0 ? (
                  filteredPangkalan.map((pangkalan) => (
                    <TableRow key={pangkalan.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-primary">
                        {pangkalan.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {pangkalan.nama}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {pangkalan.alamat}
                      </TableCell>
<TableCell className="text-sm">
                         {pangkalan.kontak}
                       </TableCell>
                       <TableCell className="text-sm font-medium">
                         {pangkalan.pic}
                       </TableCell>
                       <TableCell>
                         <Badge
                           variant={pangkalan.status === 'aktif' ? 'default' : 'secondary'}
                           className={
                             pangkalan.status === 'aktif'
                               ? 'bg-primary/20 text-primary hover:bg-primary/30'
                               : ''
                           }
                         >
                           {pangkalan.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
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
 <DropdownMenuItem asChild>
                               <a
                                 href={`./detail-edit-pangkalan.html?id=${pangkalan.id}`}
                                 className="cursor-pointer"
                               >
                                 <SafeIcon name="Eye" className="mr-2 h-4 w-4" />
                                 <span>Lihat Detail</span>
                               </a>
                             </DropdownMenuItem>
                             {pangkalan.status === 'aktif' ? (
                               <DropdownMenuItem 
                                 className="text-destructive cursor-pointer"
                                 onClick={() => handleStatusToggleClick(pangkalan)}
                               >
                                  <SafeIcon name="Ban" className="mr-2 h-4 w-4" />
                                  <span>Nonaktifkan Pangkalan</span>
                                </DropdownMenuItem>
                             ) : (
                               <DropdownMenuItem 
                                 className="text-green-600 cursor-pointer"
                                 onClick={() => handleStatusToggleClick(pangkalan)}
                               >
                                  <SafeIcon name="Check" className="mr-2 h-4 w-4" />
                                  <span>Aktifkan Pangkalan</span>
                                </DropdownMenuItem>
                             )}
                           </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
<TableRow>
                     <TableCell colSpan={7} className="text-center py-8">
                       <div className="flex flex-col items-center gap-2">
                         <SafeIcon name="Search" className="h-8 w-8 text-muted-foreground" />
                         <p className="text-muted-foreground">
                           Tidak ada pangkalan yang sesuai dengan pencarian Anda
                         </p>
                       </div>
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
</div>
         </CardContent>
</Card>

{/* Modal for Adding Pangkalan */}
       <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>Tambah Pangkalan Baru</DialogTitle>
             <DialogDescription>
               Daftarkan pangkalan LPG baru ke dalam sistem
             </DialogDescription>
           </DialogHeader>
           <div className="py-4">
             <TambahPangkalanForm 
               isModal={true}
               onSuccess={() => setShowAddModal(false)} 
             />
           </div>
         </DialogContent>
       </Dialog>

       {/* Confirmation Modal for Status Toggle */}
       {selectedPangkalan && (
         <ConfirmationModal
           open={showConfirmModal}
           onOpenChange={setShowConfirmModal}
           title={selectedPangkalan.status === 'aktif' ? 'Nonaktifkan Pangkalan' : 'Aktifkan Pangkalan'}
           description={
             selectedPangkalan.status === 'aktif'
               ? `Apakah Anda yakin ingin menonaktifkan pangkalan "${selectedPangkalan.nama}"? Pangkalan ini tidak akan dapat menerima pesanan sampai diaktifkan kembali.`
               : `Apakah Anda yakin ingin mengaktifkan pangkalan "${selectedPangkalan.nama}"? Pangkalan ini akan dapat menerima pesanan kembali.`
           }
           confirmText={selectedPangkalan.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
           cancelText="Batal"
           icon={selectedPangkalan.status === 'aktif' ? 'AlertTriangle' : 'CheckCircle'}
           isDangerous={selectedPangkalan.status === 'aktif'}
           onConfirm={handleConfirmStatusToggle}
         />
       )}
      </div>
    )
  }
