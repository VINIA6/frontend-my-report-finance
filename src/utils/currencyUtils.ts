/**
 * Formata um número para o formato de moeda brasileira
 * @param value - Valor numérico
 * @returns String formatada (ex: "1.234,56")
 */
export const formatCurrency = (value: number): string => {
  if (isNaN(value)) return ''
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * Remove a formatação de moeda e retorna o valor numérico
 * @param value - String formatada (ex: "1.234,56")
 * @returns Valor numérico
 */
export const parseCurrency = (value: string): number => {
  if (!value) return 0
  
  // Remove tudo exceto números e vírgula
  const cleanValue = value.replace(/[^\d,]/g, '')
  
  // Substitui vírgula por ponto
  const numericValue = cleanValue.replace(',', '.')
  
  return parseFloat(numericValue) || 0
}

/**
 * Aplica máscara de moeda em tempo real durante digitação
 * @param value - String com o valor digitado
 * @returns String formatada
 */
export const applyCurrencyMask = (value: string): string => {
  if (!value) return ''
  
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Converte para número (considerando os últimos 2 dígitos como centavos)
  const amount = parseFloat(numbers) / 100
  
  // Formata para moeda brasileira
  return formatCurrency(amount)
}

