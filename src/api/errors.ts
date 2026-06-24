import axios from 'axios'

type ApiErrorResponse = {
  error?: string
}

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Erro ao conectar com o servidor.',
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined
    return data?.error || error.message || fallback
  }

  return error instanceof Error ? error.message : fallback
}

export const throwApiError = (error: unknown, fallback?: string): never => {
  throw new Error(getApiErrorMessage(error, fallback))
}
