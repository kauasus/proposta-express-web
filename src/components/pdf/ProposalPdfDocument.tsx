import type { Client, Proposal } from '@/@types'
import { formatCurrencyBRL } from '@/utils/currency'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 8 },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  tableHeader: { flexDirection: 'row', borderBottom: '1px solid #ccc', paddingBottom: 6, marginBottom: 6 },
  cell: { flex: 1 },
  cellRight: { flex: 1, textAlign: 'right' },
})

interface ProposalPdfDocumentProps {
  proposal: Pick<Proposal, 'title' | 'items' | 'subtotal' | 'discount' | 'total' | 'notes'>
  client?: Client
}

export const ProposalPdfDocument = ({ proposal, client }: ProposalPdfDocumentProps) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <Text style={styles.title}>Proposta Comercial</Text>

      <View style={styles.section}>
        <Text>Projeto: {proposal.title}</Text>
        <Text>Cliente: {client?.name ?? 'Não definido'}</Text>
        <Text>E-mail: {client?.email ?? '-'}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Descrição</Text>
        <Text style={styles.cellRight}>Qtd</Text>
        <Text style={styles.cellRight}>Unitário</Text>
        <Text style={styles.cellRight}>Total</Text>
      </View>

      {proposal.items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.cell}>{item.description}</Text>
          <Text style={styles.cellRight}>{item.quantity}</Text>
          <Text style={styles.cellRight}>{formatCurrencyBRL(item.unitPrice)}</Text>
          <Text style={styles.cellRight}>{formatCurrencyBRL(item.quantity * item.unitPrice)}</Text>
        </View>
      ))}

      <View style={styles.section}>
        <Text>Subtotal: {formatCurrencyBRL(proposal.subtotal)}</Text>
        <Text>Desconto: {formatCurrencyBRL(proposal.discount)}</Text>
        <Text>Total: {formatCurrencyBRL(proposal.total)}</Text>
      </View>

      {proposal.notes ? (
        <View style={styles.section}>
          <Text>Observações:</Text>
          <Text>{proposal.notes}</Text>
        </View>
      ) : null}
    </Page>
  </Document>
)
