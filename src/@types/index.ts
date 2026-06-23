export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  secondaryPhone: string
  document: string
  zipCode: string
  address: string
  addressNumber: string
  createdAt: string
}

export interface ProposalItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Proposal {
  id: string
  clientId: string
  title: string
  status: ProposalStatus
  validUntil: string
  notes?: string
  publicToken: string
  items: ProposalItem[]
  subtotal: number
  discount: number
  total: number
  createdAt: string
  updatedAt: string
}
