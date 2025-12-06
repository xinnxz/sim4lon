
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SafeIcon from '@/components/common/SafeIcon'

interface DateRangeFilterProps {
  onDateRangeChange: (from: Date, to: Date) => void
  initialFrom: Date
  initialTo: Date
}

export default function DateRangeFilter({
  onDateRangeChange,
  initialFrom,
  initialTo,
}: DateRangeFilterProps) {
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  // Initialize dates on mount
  useEffect(() => {
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    setFromDate(formatDate(initialFrom))
    setToDate(formatDate(initialTo))
  }, [initialFrom, initialTo])

  const handleApplyFilter = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate)
      const to = new Date(toDate)
      
      if (from <= to) {
        onDateRangeChange(from, to)
      }
    }
  }

  const handleQuickFilter = (days: number) => {
    const to = new Date()
    const from = new Date(to)
    from.setDate(from.getDate() - days)

    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    setFromDate(formatDate(from))
    setToDate(formatDate(to))
    onDateRangeChange(from, to)
  }

  return (
    <div className="space-y-4">
      {/* Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from-date" className="text-sm font-medium">
            Dari Tanggal
          </Label>
          <Input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to-date" className="text-sm font-medium">
            Sampai Tanggal
          </Label>
          <Input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Filter Cepat</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(7)}
            className="text-xs"
          >
            <SafeIcon name="Calendar" className="mr-1 h-3 w-3" />
            7 Hari
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(14)}
            className="text-xs"
          >
            <SafeIcon name="Calendar" className="mr-1 h-3 w-3" />
            14 Hari
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(30)}
            className="text-xs"
          >
            <SafeIcon name="Calendar" className="mr-1 h-3 w-3" />
            30 Hari
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(90)}
            className="text-xs"
          >
            <SafeIcon name="Calendar" className="mr-1 h-3 w-3" />
            90 Hari
          </Button>
        </div>
      </div>

      {/* Apply Button */}
      <Button 
        onClick={handleApplyFilter}
        className="w-full sm:w-auto"
      >
        <SafeIcon name="Filter" className="mr-2 h-4 w-4" />
        Terapkan Filter
      </Button>
    </div>
  )
}
