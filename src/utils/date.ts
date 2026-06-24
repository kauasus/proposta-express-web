export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(
    new Date(date),
  )

export const nowIso = (): string => new Date().toISOString()
