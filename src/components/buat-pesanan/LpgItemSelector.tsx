import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from '@/components/common/SafeIcon'

interface LpgItem {
  id: string | number
  type: '3kg' | '12kg' | '50kg'
  quantity: number
  price: number
}

interface LpgItemSelectorProps {
  items: LpgItem[]
  onItemsChange: (items: LpgItem[]) => void
  disabled?: boolean
}

const lpgTypes = [
  { value: '3kg', label: 'LPG 3kg', price: 25000 },
  { value: '12kg', label: 'LPG 12kg', price: 85000 },
  { value: '50kg', label: 'LPG 50kg', price: 350000 },
] as const

export default function LpgItemSelector({ items, onItemsChange, disabled = false }: LpgItemSelectorProps) {
  const handleTypeChange = (id: string | number, type: '3kg' | '12kg' | '50kg') => {
    if (disabled) return
    const priceMap: Record<'3kg' | '12kg' | '50kg', number> = {
      '3kg': 25000,
      '12kg': 85000,
      '50kg': 350000,
    }
    
    const updatedItems = items.map(item =>
      String(item.id) === String(id) ? { ...item, type, price: priceMap[type] } : item
    )
    onItemsChange(updatedItems)
  }

  const handleQuantityChange = (id: string | number, quantity: number) => {
    if (disabled) return
    if (quantity < 1) return
    const updatedItems = items.map(item =>
      String(item.id) === String(id) ? { ...item, quantity } : item
    )
    onItemsChange(updatedItems)
  }

  const handleAddItem = () => {
    if (disabled) return
    const newId = Math.max(...items.map(i => typeof i.id === 'string' ? parseInt(i.id) : i.id), 0) + 1
    const newItem: LpgItem = {
      id: newId.toString(),
      type: '3kg',
      quantity: 1,
      price: 25000,
    }
    onItemsChange([...items, newItem])
  }

  const handleRemoveItem = (id: string | number) => {
    if (disabled) return
    if (items.length === 1) {
      alert('Minimal harus ada satu item LPG')
      return
    }
    onItemsChange(items.filter(item => String(item.id) !== String(id)))
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={item.id} className="border border-border">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Item {index + 1}
                </span>
                {items.length > 1 && !disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <SafeIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* LPG Type */}
                <div className="space-y-2">
                  <Label htmlFor={`type-${item.id}`} className="text-sm">
                    Jenis LPG
                  </Label>
                  <Select value={item.type} onValueChange={(value) => handleTypeChange(item.id, value as '3kg' | '12kg' | '50kg')} disabled={disabled}>
                    <SelectTrigger id={`type-${item.id}`} className="h-9" disabled={disabled}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {lpgTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor={`qty-${item.id}`} className="text-sm">
                    Jumlah
                  </Label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    className="h-9"
                    disabled={disabled}
                  />
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Harga per unit:</span>
                <span className="font-semibold text-foreground">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm font-medium text-foreground">Subtotal:</span>
                <span className="font-bold text-primary">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Item Button */}
      {!disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          className="w-full border-dashed"
        >
          <SafeIcon name="Plus" className="mr-2 h-4 w-4" />
          Tambah Item LPG
        </Button>
      )}
    </div>
  )
}