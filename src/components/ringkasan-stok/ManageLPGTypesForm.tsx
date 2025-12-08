'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import EditLPGTypeModal from './EditLPGTypeModal'
import AddLPGTypeModal from './AddLPGTypeModal'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { LPG_TYPES } from '@/data/enums'

interface EditingLPGType {
  type: string
  label: string
  weight: string
  category: 'subsidi' | 'non-subsidi'
  minStock: number
  maxCapacity: number
  pricePerUnit: number
}

interface LPGTypeWithPrice extends EditingLPGType {
  pricePerUnit: number
}

export default function ManageLPGTypesForm({ onClose }: { onClose?: () => void }) {
  const [lpgTypes, setLpgTypes] = useState<LPGTypeWithPrice[]>(LPG_TYPES as LPGTypeWithPrice[])
  const [editingType, setEditingType] = useState<EditingLPGType | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingType, setDeletingType] = useState<string | null>(null)

const handleEditType = (type: LPGTypeWithPrice) => {
    setEditingType({
      type: type.type,
      label: type.label,
      weight: type.weight,
      category: type.category,
      minStock: type.minStock,
      maxCapacity: type.maxCapacity || 500,
      pricePerUnit: type.pricePerUnit,
    })
    setShowEditModal(true)
  }

const handleSaveEdit = (updatedType: EditingLPGType) => {
     const updated = lpgTypes.map(item => 
       item.type === updatedType.type 
         ? { ...item, label: updatedType.label, weight: updatedType.weight, category: updatedType.category, minStock: updatedType.minStock, maxCapacity: updatedType.maxCapacity, pricePerUnit: updatedType.pricePerUnit }
         : item
     )
     setLpgTypes(updated)
     setShowEditModal(false)
     setEditingType(null)
   }

const handleAddType = (newType: {
     type: string
     label: string
     weight: string
     category: 'subsidi' | 'non-subsidi'
     minStock: number
     maxCapacity: number
     pricePerUnit: number
   }) => {
    // Check if type already exists
    if (lpgTypes.some(item => item.type === newType.type)) {
      alert('Kode jenis LPG sudah ada')
      return
    }

    // Add new type
    setLpgTypes([...lpgTypes, newType])
    setShowAddModal(false)
  }

  const handleDeleteType = (typeCode: string) => {
    setDeletingType(typeCode)
  }

  const confirmDeleteType = () => {
    if (deletingType) {
      setLpgTypes(lpgTypes.filter(item => item.type !== deletingType))
      setDeletingType(null)
    }
  }

  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Kelola Jenis LPG</CardTitle>
            <CardDescription>
              Kelola semua jenis LPG yang tersedia di sistem
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <SafeIcon name="Plus" className="h-4 w-4" />
            Tambah
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {lpgTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada jenis LPG yang tersedia
            </div>
          ) : (
            lpgTypes.map((lpg) => (
              <div key={lpg.type} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors">
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-foreground">{lpg.label}</p>
<div className="text-sm text-muted-foreground space-y-0.5">
                     <p>Berat: {lpg.weight} Kg</p>
                     <p>Jenis: {lpg.category === 'subsidi' ? 'Subsidi' : 'Non-Subsidi'}</p>
                     <p>Min. Stok: {lpg.minStock} tabung</p>
                     <p>Max Kapasitas: {lpg.maxCapacity || 500} tabung</p>
                     <p>Harga: Rp {lpg.pricePerUnit.toLocaleString('id-ID')}</p>
                   </div>
                </div>
<div className="flex gap-2">
                  <Button
                    onClick={() => handleEditType(lpg)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <SafeIcon name="Edit" className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteType(lpg.type)}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <SafeIcon name="Trash2" className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingType && (
        <EditLPGTypeModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          lpgType={editingType}
          onSave={handleSaveEdit}
        />
      )}

{/* Add Modal */}
      <AddLPGTypeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddType}
      />

      {/* Delete Confirmation Modal */}
      {deletingType && (
        <ConfirmationModal
          open={!!deletingType}
          title="Hapus Jenis LPG"
          description={`Apakah Anda yakin ingin menghapus jenis LPG ini? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          variant="destructive"
          onConfirm={confirmDeleteType}
          onCancel={() => setDeletingType(null)}
        />
      )}
    </div>
  )
}