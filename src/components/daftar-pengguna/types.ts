
export interface User {
  id: number
  name: string
  phone: string
  email: string
  role: 'Admin' | 'Driver' | 'Operator'
  status: 'active' | 'inactive'
  createdAt: string
}
