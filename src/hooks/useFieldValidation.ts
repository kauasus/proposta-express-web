import { useState } from 'react'

interface ValidationRule {
  validate: (value: string) => boolean
  message: string
}

export function useFieldValidation(rules: ValidationRule[] = []) {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)

  const validate = (value: string) => {
    if (!value) {
      setError('')
      setSuccess(false)
      return true
    }

    for (const rule of rules) {
      if (!rule.validate(value)) {
        setError(rule.message)
        setSuccess(false)
        return false
      }
    }

    setError('')
    setSuccess(true)
    return true
  }

  const reset = () => {
    setError('')
    setSuccess(false)
  }

  return { error, success, validate, reset }
}

export const validationRules = {
  required: (field: string): ValidationRule => ({
    validate: (v) => v.trim().length > 0,
    message: `${field} é obrigatório`,
  }),
  minLength: (length: number): ValidationRule => ({
    validate: (v) => v.length >= length,
    message: `Mínimo de ${length} caracteres`,
  }),
  email: (): ValidationRule => ({
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Email inválido',
  }),
  phone: (): ValidationRule => ({
    validate: (v) => /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(v),
    message: 'Telefone inválido',
  }),
  currency: (): ValidationRule => ({
    validate: (v) => /^\d+(\.\d{1,2})?$/.test(v) && parseFloat(v) >= 0,
    message: 'Valor inválido',
  }),
  url: (): ValidationRule => ({
    validate: (v) => /^https?:\/\//.test(v),
    message: 'URL deve começar com http:// ou https://',
  }),
}
