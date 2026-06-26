import type { Client, Proposal } from '@/@types'

export interface ProposalPdfBranding {
  brandName: string
  legalName: string
  logoUrl?: string
  slogan?: string
  cnpj?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  cityState?: string
  highlights: [string, string, string]
  paymentTerms: string
  deliveryEstimate: string
  confidentialityNote: string
  guaranteeNote: string
  signatureName: string
  signatureRole: string
}

export interface ProposalPdfDocumentData {
  proposal: Pick<
    Proposal,
    | 'title'
    | 'subtitle'
    | 'items'
    | 'subtotal'
    | 'discount'
    | 'total'
    | 'notes'
    | 'validUntil'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  >
  client?: Pick<
    Client,
    | 'name'
    | 'email'
    | 'phone'
    | 'secondaryPhone'
    | 'document'
    | 'zipCode'
    | 'address'
    | 'addressNumber'
  >
  branding: ProposalPdfBranding
  generatedAt: string
}
