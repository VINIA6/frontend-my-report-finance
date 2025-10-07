import React, { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { getAvailableColor } from '../utils/colorUtils'
import { applyCurrencyMask, parseCurrency, formatCurrency } from '../utils/currencyUtils'

interface AddExpenseFormProps {
  onSubmit: (expense: ExpenseFormData) => void
  onCancel: () => void
  usedColors?: string[]
  initialData?: ExpenseFormData
}

export interface ExpenseFormData {
  name: string
  value: number
  color: string
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onSubmit, onCancel, usedColors = [], initialData }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: initialData?.name || '',
    value: initialData?.value || 0,
    color: initialData?.color || getAvailableColor(usedColors)
  })

  const [displayValue, setDisplayValue] = useState<string>(
    initialData?.value ? formatCurrency(initialData.value) : ''
  )
  const [errors, setErrors] = useState<{ name?: string; value?: string }>({})

  // Atualizar formulário quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        value: initialData.value,
        color: initialData.color
      })
      setDisplayValue(formatCurrency(initialData.value))
    } else {
      setFormData({
        name: '',
        value: 0,
        color: getAvailableColor(usedColors)
      })
      setDisplayValue('')
    }
  }, [initialData, usedColors])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação
    const newErrors: { name?: string; value?: string } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da despesa é obrigatório'
    }
    
    if (formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    onSubmit(formData)
  }

  const handleChange = (field: keyof ExpenseFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleValueChange = (inputValue: string) => {
    // Aplicar máscara
    const masked = applyCurrencyMask(inputValue)
    setDisplayValue(masked)
    
    // Converter para número e atualizar formData
    const numericValue = parseCurrency(masked)
    setFormData(prev => ({ ...prev, value: numericValue }))
    
    // Limpar erro se existir
    if (errors.value) {
      setErrors(prev => ({ ...prev, value: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome da Despesa */}
      <div>
        <label htmlFor="expense-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nome da Despesa
        </label>
        <input
          id="expense-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ex: Aluguel, Energia, Internet..."
          className={`w-full px-4 py-2 border ${
            errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Valor */}
      <div>
        <label htmlFor="expense-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Valor (R$)
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <input
            id="expense-value"
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="0,00"
            className={`w-full pl-10 pr-4 py-2 border ${
              errors.value ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
          />
        </div>
        {errors.value && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.value}</p>
        )}
      </div>

      {/* Preview da Cor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cor da Categoria
        </label>
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: formData.color }}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cor selecionada automaticamente
          </p>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
        >
          {initialData ? 'Salvar Alterações' : 'Adicionar Despesa'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default AddExpenseForm

