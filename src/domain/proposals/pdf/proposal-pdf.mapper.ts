import type { ProposalPdfBranding, ProposalPdfDocumentData } from './proposal-pdf.types'

const stripControlCharacters = (value: string) =>
  value
    .split('')
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')

export const sanitizePdfText = (value: unknown, fallback = '', maxLength = 240) => {
  const safeValue = stripControlCharacters(String(value ?? fallback))
    .replace(/\s+/g, ' ')
    .trim()

  return safeValue.slice(0, maxLength)
}

export const sanitizePdfUrl = (value?: string) => {
  const cleaned = sanitizePdfText(value, '', 500)
  if (!cleaned) return undefined

  if (cleaned.startsWith('data:image/')) return cleaned

  try {
    const parsed = new URL(cleaned)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString()
    }
  } catch {
    return undefined
  }

  return undefined
}

export const defaultProposalPdfBranding: ProposalPdfBranding = {
  brandName: 'Sua empresa',
  legalName: 'Razão social da empresa',
  slogan: 'Soluções claras, propostas objetivas e fechamento com confiança.',
  cnpj: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  cityState: '',
  logoUrl: '',
  highlights: [
    'Atendimento consultivo e transparente do início ao fim.',
    'Escopo detalhado para reduzir retrabalho e ruído comercial.',
    'Entrega organizada com documentação pronta para aprovação.',
  ],
  paymentTerms: '50% na aprovação e 50% na entrega final.',
  deliveryEstimate: 'Conforme o escopo validado em reunião.',
  confidentialityNote: 'Esta proposta é confidencial e destinada exclusivamente ao cliente informado.',
  guaranteeNote: 'Garantia de ajuste fino após a entrega, conforme o escopo contratado.',
  signatureName: 'Seu nome',
  signatureRole: 'Consultor Comercial',
}

export const normalizeProposalPdfBranding = (branding: Partial<ProposalPdfBranding>): ProposalPdfBranding => ({
  brandName: sanitizePdfText(branding.brandName, defaultProposalPdfBranding.brandName, 80),
  legalName: sanitizePdfText(branding.legalName, defaultProposalPdfBranding.legalName, 120),
  logoUrl: sanitizePdfUrl(branding.logoUrl) ?? '',
  slogan: sanitizePdfText(branding.slogan, defaultProposalPdfBranding.slogan, 140),
  cnpj: sanitizePdfText(branding.cnpj, '', 30),
  email: sanitizePdfText(branding.email, '', 120),
  phone: sanitizePdfText(branding.phone, '', 30),
  website: sanitizePdfText(branding.website, '', 120),
  address: sanitizePdfText(branding.address, '', 140),
  cityState: sanitizePdfText(branding.cityState, '', 80),
  highlights: [
    sanitizePdfText(branding.highlights?.[0], defaultProposalPdfBranding.highlights[0], 140),
    sanitizePdfText(branding.highlights?.[1], defaultProposalPdfBranding.highlights[1], 140),
    sanitizePdfText(branding.highlights?.[2], defaultProposalPdfBranding.highlights[2], 140),
  ],
  paymentTerms: sanitizePdfText(branding.paymentTerms, defaultProposalPdfBranding.paymentTerms, 140),
  deliveryEstimate: sanitizePdfText(branding.deliveryEstimate, defaultProposalPdfBranding.deliveryEstimate, 120),
  confidentialityNote: sanitizePdfText(
    branding.confidentialityNote,
    defaultProposalPdfBranding.confidentialityNote,
    180,
  ),
  guaranteeNote: sanitizePdfText(branding.guaranteeNote, defaultProposalPdfBranding.guaranteeNote, 180),
  signatureName: sanitizePdfText(branding.signatureName, defaultProposalPdfBranding.signatureName, 80),
  signatureRole: sanitizePdfText(branding.signatureRole, defaultProposalPdfBranding.signatureRole, 80),
})

export const normalizeProposalPdfDocumentData = (data: ProposalPdfDocumentData): ProposalPdfDocumentData => ({
  generatedAt: sanitizePdfText(data.generatedAt, new Date().toISOString(), 40),
  proposal: {
    ...data.proposal,
    title: sanitizePdfText(data.proposal.title, 'Proposta comercial', 120),
    validUntil: sanitizePdfText(data.proposal.validUntil, '', 40),
    createdAt: sanitizePdfText(data.proposal.createdAt, '', 40),
    updatedAt: sanitizePdfText(data.proposal.updatedAt, '', 40),
    status: data.proposal.status,
    subtotal: data.proposal.subtotal,
    discount: data.proposal.discount,
    total: data.proposal.total,
    items: data.proposal.items.map((item) => ({
      ...item,
      description: sanitizePdfText(item.description, 'Item', 120),
    })),
    ...(data.proposal.notes ? { notes: sanitizePdfText(data.proposal.notes, '', 1200) } : {}),
  },
  ...(data.client
    ? {
        client: {
          name: sanitizePdfText(data.client.name, 'Cliente não informado', 120),
          email: sanitizePdfText(data.client.email, '', 120),
          phone: sanitizePdfText(data.client.phone, '', 30),
          secondaryPhone: sanitizePdfText(data.client.secondaryPhone, '', 30),
          document: sanitizePdfText(data.client.document, '', 30),
          zipCode: sanitizePdfText(data.client.zipCode, '', 20),
          address: sanitizePdfText(data.client.address, '', 140),
          addressNumber: sanitizePdfText(data.client.addressNumber, '', 20),
        },
      }
    : {}),
  branding: normalizeProposalPdfBranding(data.branding),
})
