// Paleta de cores consistente para despesas
const colorPalette = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#a855f7', // Violet
  '#14b8a6', // Teal
]

/**
 * Retorna uma cor não utilizada da paleta
 * @param usedColors - Array de cores já utilizadas
 * @returns Uma cor disponível ou uma cor aleatória se todas estiverem em uso
 */
export const getAvailableColor = (usedColors: string[]): string => {
  // Filtrar cores disponíveis
  const availableColors = colorPalette.filter(color => !usedColors.includes(color))
  
  // Se houver cores disponíveis, retornar uma aleatória
  if (availableColors.length > 0) {
    return availableColors[Math.floor(Math.random() * availableColors.length)]
  }
  
  // Se todas as cores estiverem em uso, retornar uma aleatória da paleta completa
  return colorPalette[Math.floor(Math.random() * colorPalette.length)]
}

/**
 * Retorna a paleta completa de cores
 */
export const getAvailableColors = (): string[] => {
  return [...colorPalette]
}

/**
 * Retorna uma cor aleatória (sem verificar duplicatas)
 * @deprecated Use getAvailableColor para evitar duplicatas
 */
export const getRandomColor = (): string => {
  return colorPalette[Math.floor(Math.random() * colorPalette.length)]
}

