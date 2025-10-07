import React, { useState, useMemo } from 'react'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { DollarSign, Plus, TrendingDown, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import Modal from './Modal'
import AddExpenseForm, { ExpenseFormData } from './AddExpenseForm'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface StoredExpense {
  name: string
  value: number
  color: string
}

interface Expense extends StoredExpense {
  percentage: number
}

const FixedExpenses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [storedExpenses, setStoredExpenses] = useLocalStorage<StoredExpense[]>('fixed-expenses', [])

  // TODO: Esse valor virá do backend no futuro
  const totalSalary = 11000 // Salário total mensal

  // Calcular total das despesas e percentuais baseados no salário total
  const expenses: Expense[] = useMemo(() => {
    if (storedExpenses.length === 0) return []
    
    return storedExpenses.map(exp => ({
      ...exp,
      percentage: Math.round((exp.value / totalSalary) * 100)
    }))
  }, [storedExpenses, totalSalary])

  const total = expenses.reduce((acc, curr) => acc + curr.value, 0)
  
  // Percentual total das despesas em relação ao salário
  const totalPercentage = Math.round((total / totalSalary) * 100)

  // Cores já utilizadas (excluindo a cor da despesa sendo editada)
  const usedColors = useMemo(() => {
    if (editingIndex !== null) {
      return storedExpenses
        .filter((_, idx) => idx !== editingIndex)
        .map(exp => exp.color)
    }
    return storedExpenses.map(exp => exp.color)
  }, [storedExpenses, editingIndex])

  const handleAddExpense = (expenseData: ExpenseFormData) => {
    if (editingIndex !== null) {
      // Editar despesa existente
      const updatedExpenses = [...storedExpenses]
      updatedExpenses[editingIndex] = {
        name: expenseData.name,
        value: expenseData.value,
        color: expenseData.color
      }
      setStoredExpenses(updatedExpenses)
      setEditingIndex(null)
    } else {
      // Adicionar nova despesa
      const newExpense: StoredExpense = {
        name: expenseData.name,
        value: expenseData.value,
        color: expenseData.color
      }
      setStoredExpenses([...storedExpenses, newExpense])
    }
    setIsModalOpen(false)
  }

  const handleEditExpense = (index: number) => {
    setEditingIndex(index)
    setIsModalOpen(true)
    setOpenMenuIndex(null)
  }

  const handleDeleteExpense = (index: number) => {
    const updatedExpenses = storedExpenses.filter((_, idx) => idx !== index)
    setStoredExpenses(updatedExpenses)
    setOpenMenuIndex(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingIndex(null)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            R$ {payload[0].value.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{payload[0].payload.percentage}%</p>
        </div>
      )
    }
    return null
  }

  // Componente customizado para cada célula do Treemap
  const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, value, percentage, color } = props

    // Validação de dados
    if (!name || !value || !color) return null
    
    // Não renderizar se a área for muito pequena
    if (width < 40 || height < 30) return null

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color,
            stroke: '#fff',
            strokeWidth: 2,
          }}
          className="transition-opacity hover:opacity-90"
        />
        {/* Texto do nome */}
        {height > 50 && width > 80 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 12}
              textAnchor="middle"
              fill="#fff"
              className="text-xs font-semibold"
              style={{ pointerEvents: 'none' }}
            >
              {name && name.length > 12 ? name.substring(0, 12) + '...' : name}
            </text>
            {/* Texto do valor */}
            <text
              x={x + width / 2}
              y={y + height / 2 + 4}
              textAnchor="middle"
              fill="#fff"
              className="text-xs font-medium"
              style={{ pointerEvents: 'none' }}
            >
              R$ {(value || 0).toLocaleString('pt-BR')}
            </text>
            {/* Percentual */}
            <text
              x={x + width / 2}
              y={y + height / 2 + 20}
              textAnchor="middle"
              fill="#fff"
              className="text-sm font-bold"
              style={{ pointerEvents: 'none' }}
            >
              {percentage || 0}%
            </text>
          </>
        )}
        {/* Para células menores, mostrar apenas percentual */}
        {height <= 50 && height > 30 && width >= 40 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 4}
            textAnchor="middle"
            fill="#fff"
            className="text-xs font-bold"
            style={{ pointerEvents: 'none' }}
          >
            {percentage || 0}%
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-[540px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Despesas Fixas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total: R$ {total.toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
        >
          <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Info de Salário Total */}
      <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Salário Total Mensal</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              R$ {totalSalary.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Comprometimento</p>
            <p className={`text-lg font-bold ${totalPercentage > 50 ? 'text-red-600' : totalPercentage > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
              {totalPercentage}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {expenses.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Nenhuma despesa cadastrada
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Comece adicionando sua primeira despesa fixa
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Adicionar Despesa</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
            {/* Lista de Despesas */}
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar expenses-list-container">
              {expenses.map((expense, index) => (
                <div 
                  key={index}
                  className="group relative flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{expense.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        R$ {expense.value.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{expense.percentage}%</p>
                    </div>
                    
                    {/* Menu de Opções */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openMenuIndex === index && (
                        <>
                          {/* Backdrop invisível para fechar o menu */}
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuIndex(null)}
                          />
                          
                          {/* Menu posicionado dinamicamente (para cima nos últimos itens) */}
                          <div className={`dropdown-menu absolute right-0 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 ${
                            index >= expenses.length - 2 ? 'bottom-8' : 'top-8'
                          }`}>
                            <button
                              onClick={() => handleEditExpense(index)}
                              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(index)}
                              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gráfico Treemap */}
            <div className="flex items-center justify-center h-full">
              {expenses.length > 0 ? (
                <div className="w-full h-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={expenses}
                      dataKey="value"
                      aspectRatio={4 / 3}
                      stroke="#fff"
                      fill="#8884d8"
                      content={<CustomTreemapContent />}
                    >
                      <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Adicione despesas para visualizar o gráfico
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Variação mensal:</span>
              </div>
              <span className="text-sm font-semibold text-red-600">+5.2%</span>
            </div>
          </div>
        )}
        
        {expenses.length === 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Variação mensal:</span>
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">0.0%</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar Despesa */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingIndex !== null ? "Editar Despesa Fixa" : "Adicionar Despesa Fixa"}
      >
        <AddExpenseForm
          onSubmit={handleAddExpense}
          onCancel={handleCloseModal}
          usedColors={usedColors}
          initialData={editingIndex !== null ? {
            name: storedExpenses[editingIndex].name,
            value: storedExpenses[editingIndex].value,
            color: storedExpenses[editingIndex].color
          } : undefined}
        />
      </Modal>
    </div>
  )
}

export default FixedExpenses
