import type { ProposalPdfDocumentData } from '@/domain/proposals/pdf/proposal-pdf.types'
import {
  normalizeProposalPdfDocumentData,
  sanitizePdfText,
} from '@/domain/proposals/pdf/proposal-pdf.mapper'
import { formatCurrencyBRL } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 42,
    paddingHorizontal: 28,
    fontSize: 10,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  topBand: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    color: '#fff',
  },
  topBandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  brandBlock: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flex: 1,
  },
  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 14,
    objectFit: 'cover',
  },
  brandText: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 1.4,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: '#0f172a',
  },
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#64748b',
    marginBottom: 3,
  },
  value: {
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 1.4,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metric: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fff',
  },
  metricLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#64748b',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 6,
    color: '#0f172a',
  },
  metricHint: {
    fontSize: 8,
    marginTop: 4,
    color: '#64748b',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemDescription: {
    flex: 3,
    paddingRight: 8,
  },
  itemCell: {
    flex: 1,
    textAlign: 'right',
  },
  footerArea: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  footerCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  bullets: {
    gap: 6,
  },
  bullet: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 5,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 1.4,
  },
  summaryBox: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#0f172a',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#cbd5e1',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    marginTop: 4,
  },
  summaryHint: {
    fontSize: 8,
    color: '#cbd5e1',
    marginTop: 4,
  },
  signatureLine: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 10,
    width: 240,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
  },
  signatureRole: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 18,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    color: '#64748b',
  },
})

interface ProposalPdfDocumentProps {
  data: ProposalPdfDocumentData
}

export const ProposalPdfDocument = ({ data }: ProposalPdfDocumentProps) => {
  const model = normalizeProposalPdfDocumentData(data)
  const { branding, proposal, client, generatedAt } = model
  const hasLogo = Boolean(branding.logoUrl)

  const intro = sanitizePdfText(
    ` ${proposal.title}`,
    '',
    520,
  )
  const subtitle = sanitizePdfText(
    ` ${proposal.subtitle}`,
    '',
    520,
  )
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.topBand}>
          <View style={styles.topBandRow}>
            <View style={styles.brandBlock}>
              {hasLogo ? (
                <Image src={branding.logoUrl} style={styles.logo} />
              ) : (
                <View style={styles.logoBox}>
                  <Text
                    style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}
                  >
                    {branding.brandName.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={styles.brandText}>
                <Text style={styles.title}>{branding.brandName}</Text>
                <Text style={styles.subtitle}>{branding.slogan}</Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 8,
                  color: '#cbd5e1',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Documento confidencial
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fff',
                  marginTop: 4,
                }}
              >
                {formatDate(proposal.createdAt)}
              </Text>
              <Text style={{ fontSize: 8, color: '#cbd5e1', marginTop: 2 }}>
                Gerado em {formatDate(generatedAt)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>{intro}</Text>
          <Text style={styles.value}>{subtitle}</Text>
        </View>

        <View style={styles.grid2}>
          <View style={[styles.infoCard, styles.col]}>
            <Text style={styles.sectionTitle}>Dados do cliente</Text>
            <Text style={styles.label}>Cliente</Text>
            <Text style={styles.value}>{client?.name ?? 'Nao informado'}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>E-mail</Text>
            <Text style={styles.value}>{client?.email ?? '-'}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Telefone</Text>
            <Text style={styles.value}>{client?.phone ?? '-'}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Documento</Text>
            <Text style={styles.value}>{client?.document ?? '-'}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Endereco</Text>
            <Text style={styles.value}>
              {client?.address
                ? `${client.address}${client.addressNumber ? `, ${client.addressNumber}` : ''}`
                : '-'}
            </Text>
          </View>

          <View style={[styles.infoCard, styles.col]}>
            <Text style={styles.sectionTitle}>Dados da empresa</Text>
            <Text style={styles.label}>Razao social</Text>
            <Text style={styles.value}>{branding.legalName}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>CNPJ</Text>
            <Text style={styles.value}>{branding.cnpj || '-'}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Contato</Text>
            <Text style={styles.value}>{branding.email || '-'}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Telefone</Text>
            <Text style={styles.value}>{branding.phone || '-'}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Endereco</Text>
            <Text style={styles.value}>
              {branding.address
                ? `${branding.address}${branding.cityState ? ` - ${branding.cityState}` : ''}`
                : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Subtotal</Text>
            <Text style={styles.metricValue}>
              {formatCurrencyBRL(proposal.subtotal)}
            </Text>
            <Text style={styles.metricHint}>
              Somatorio dos itens da proposta.
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Desconto</Text>
            <Text style={styles.metricValue}>
              {formatCurrencyBRL(proposal.discount)}
            </Text>
            <Text style={styles.metricHint}>Desconto comercial aplicado.</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Total</Text>
            <Text style={styles.metricValue}>
              {formatCurrencyBRL(proposal.total)}
            </Text>
            <Text style={styles.metricHint}>Valor final para aprovacao.</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Escopo e entregaveis</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.itemDescription}>Descricao</Text>
            <Text style={styles.itemCell}>Qtd</Text>
            <Text style={styles.itemCell}>Unit.</Text>
            <Text style={styles.itemCell}>Total</Text>
          </View>

          {proposal.items.map((item) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <View style={styles.itemDescription}>
                <Text
                  style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}
                >
                  {item.description}
                </Text>
              </View>
              <Text style={styles.itemCell}>{item.quantity}</Text>
              <Text style={styles.itemCell}>
                {formatCurrencyBRL(item.unitPrice)}
              </Text>
              <Text style={styles.itemCell}>
                {formatCurrencyBRL(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerArea}>
          <View style={styles.footerCard}>
            <Text style={styles.sectionTitle}>Diferenciais comerciais</Text>
            <View style={styles.bullets}>
              {branding.highlights.map((highlight, index) => (
                <View key={`${highlight}-${index}`} style={styles.bullet}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footerCard}>
            <Text style={styles.sectionTitle}>Condições e segurança</Text>
            <Text style={styles.label}>Prazo estimado</Text>
            <Text style={styles.value}>{branding.deliveryEstimate}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Pagamento</Text>
            <Text style={styles.value}>{branding.paymentTerms}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>
              Confidencialidade
            </Text>
            <Text style={styles.value}>{branding.confidentialityNote}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Garantia</Text>
            <Text style={styles.value}>{branding.guaranteeNote}</Text>
          </View>
        </View>

        {proposal.notes ? (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Observacoes adicionais</Text>
            <Text style={styles.value}>{proposal.notes}</Text>
          </View>
        ) : null}

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Proxima etapa</Text>
          <Text style={styles.summaryValue}>Aguardando aprovacao</Text>
          <Text style={styles.summaryHint}>
            Após a aprovacao, seguimos com o onboarding e o alinhamento final de
            escopo.
          </Text>
        </View>

        <View style={styles.signatureLine}>
          <Text style={styles.signatureName}>{branding.signatureName}</Text>
          <Text style={styles.signatureRole}>{branding.signatureRole}</Text>
        </View>

        <View style={styles.pageFooter} fixed>
          <Text>{branding.brandName}</Text>
          <Text>Proposta {proposal.title}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Pagina ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
