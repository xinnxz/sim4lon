
export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled'

export interface Delivery {
  id: string
  baseName: string
  baseAddress: string
  driverName: string
  driverPhone: string
  status: DeliveryStatus
  date: Date
  items: {
    type: string // '3kg', '12kg', '50kg'
    quantity: number
  }[]
  totalItems: number
}

export const deliveryStatuses = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'in_transit', label: 'Dalam Perjalanan' },
  { value: 'delivered', label: 'Terkirim' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

export const mockDrivers = [
  'Budi Santoso',
  'Ahmad Wijaya',
  'Siti Nurhaliza',
  'Rudi Hermawan',
  'Eka Putri',
]

export const mockDeliveries: Delivery[] = [
  {
    id: 'DLV-001',
    baseName: 'Pangkalan Maju Jaya',
    baseAddress: 'Jl. Raya Utama No. 123, Jakarta',
    driverName: 'Budi Santoso',
    driverPhone: '081234567890',
    status: 'delivered',
    date: new Date(2024, 0, 15, 14, 30),
    items: [
      { type: '3kg', quantity: 50 },
      { type: '12kg', quantity: 30 },
    ],
    totalItems: 80,
  },
  {
    id: 'DLV-002',
    baseName: 'Pangkalan Sejahtera',
    baseAddress: 'Jl. Gatot Subroto No. 456, Bandung',
    driverName: 'Ahmad Wijaya',
    driverPhone: '081234567891',
    status: 'in_transit',
    date: new Date(2024, 0, 16, 9, 15),
    items: [
      { type: '12kg', quantity: 40 },
      { type: '50kg', quantity: 10 },
    ],
    totalItems: 50,
  },
  {
    id: 'DLV-003',
    baseName: 'Pangkalan Bersama',
    baseAddress: 'Jl. Ahmad Yani No. 789, Surabaya',
    driverName: 'Siti Nurhaliza',
    driverPhone: '081234567892',
    status: 'pending',
    date: new Date(2024, 0, 17, 10, 0),
    items: [
      { type: '3kg', quantity: 100 },
    ],
    totalItems: 100,
  },
  {
    id: 'DLV-004',
    baseName: 'Pangkalan Maju Jaya',
    baseAddress: 'Jl. Raya Utama No. 123, Jakarta',
    driverName: 'Rudi Hermawan',
    driverPhone: '081234567893',
    status: 'delivered',
    date: new Date(2024, 0, 14, 16, 45),
    items: [
      { type: '12kg', quantity: 25 },
      { type: '50kg', quantity: 5 },
    ],
    totalItems: 30,
  },
  {
    id: 'DLV-005',
    baseName: 'Pangkalan Sentosa',
    baseAddress: 'Jl. Diponegoro No. 321, Medan',
    driverName: 'Eka Putri',
    driverPhone: '081234567894',
    status: 'in_transit',
    date: new Date(2024, 0, 16, 11, 30),
    items: [
      { type: '3kg', quantity: 75 },
      { type: '12kg', quantity: 20 },
    ],
    totalItems: 95,
  },
  {
    id: 'DLV-006',
    baseName: 'Pangkalan Makmur',
    baseAddress: 'Jl. Sudirman No. 654, Semarang',
    driverName: 'Budi Santoso',
    driverPhone: '081234567890',
    status: 'cancelled',
    date: new Date(2024, 0, 13, 13, 20),
    items: [
      { type: '50kg', quantity: 8 },
    ],
    totalItems: 8,
  },
  {
    id: 'DLV-007',
    baseName: 'Pangkalan Jaya Abadi',
    baseAddress: 'Jl. Merdeka No. 987, Yogyakarta',
    driverName: 'Ahmad Wijaya',
    driverPhone: '081234567891',
    status: 'delivered',
    date: new Date(2024, 0, 15, 15, 0),
    items: [
      { type: '3kg', quantity: 60 },
      { type: '12kg', quantity: 35 },
      { type: '50kg', quantity: 3 },
    ],
    totalItems: 98,
  },
  {
    id: 'DLV-008',
    baseName: 'Pangkalan Sejahtera',
    baseAddress: 'Jl. Gatot Subroto No. 456, Bandung',
    driverName: 'Siti Nurhaliza',
    driverPhone: '081234567892',
    status: 'pending',
    date: new Date(2024, 0, 17, 8, 45),
    items: [
      { type: '12kg', quantity: 45 },
    ],
    totalItems: 45,
  },
  {
    id: 'DLV-009',
    baseName: 'Pangkalan Bersama',
    baseAddress: 'Jl. Ahmad Yani No. 789, Surabaya',
    driverName: 'Rudi Hermawan',
    driverPhone: '081234567893',
    status: 'in_transit',
    date: new Date(2024, 0, 16, 12, 15),
    items: [
      { type: '3kg', quantity: 80 },
      { type: '50kg', quantity: 6 },
    ],
    totalItems: 86,
  },
  {
    id: 'DLV-010',
    baseName: 'Pangkalan Sentosa',
    baseAddress: 'Jl. Diponegoro No. 321, Medan',
    driverName: 'Eka Putri',
    driverPhone: '081234567894',
    status: 'delivered',
    date: new Date(2024, 0, 14, 10, 30),
    items: [
      { type: '12kg', quantity: 50 },
      { type: '50kg', quantity: 12 },
    ],
    totalItems: 62,
  },
]
