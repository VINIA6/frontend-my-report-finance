import { useState } from 'react'
import {
  TrendingUp,
  Plus,
  Trash2,
  ArrowRight,
  Receipt,
} from 'lucide-react'
import type { useFinanceData } from '../hooks/useFinanceData'
import { formatCurrency, applyCurrencyMask, parseCurrency } from '../utils/currencyUtils'
import ExpenseChecklist from '../components/ui/ExpenseChecklist'

type FinanceActions = ReturnType<typeof useFinanceData>

interface DashboardPJProps {
  finance: FinanceActions
  month: string
}

export default function DashboardPJ({ finance, month }: DashboardPJProps) {
  const { period, summary, addIncome, removeIncome, addExpense, removeExpense, toggleExpensePaid, updateExpense, addTemplate, removeExpenseAndTemplate } = finance
  const [isAddingIncome, setIsAddingIncome] = useState(false)
  const [newDesc, setNewDesc] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseCurrency(newValue)
    if (!newDesc.trim() || value <= 0) return
    addIncome(newDesc.trim(), value, new Date().toISOString().split('T')[0])
    setNewDesc('')
    setNewValue('')
    setIsAddingIncome(false)
  }

  return (
    <div className="space-y-6">
      {/* Summary pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Receita Bruta
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            R$ {formatCurrency(summary.grossIncome)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {period.incomes.length} recebimento{period.incomes.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Despesas PJ
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            R$ {formatCurrency(summary.pjExpensesTotal)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {summary.pjProgress}% pago
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800 p-5">
          <div className="flex items-center space-x-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Liquido
            </p>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded">
              CPF
            </span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${summary.netToCpf >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
            R$ {formatCurrency(Math.abs(summary.netToCpf))}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Bruto - Despesas PJ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incomes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Receitas
              </h3>
            </div>
            <button
              onClick={() => setIsAddingIncome(true)}
              className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
            >
              <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
            </button>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
            {period.incomes.map(income => (
              <div
                key={income.id}
                className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Receipt className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {income.description}
                    </p>
                    {income.receivedAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Recebido em {income.receivedAt.split('-').reverse().join('/')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                    R$ {formatCurrency(income.value)}
                  </span>
                  <button
                    onClick={() => removeIncome(income.id)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}

            {period.incomes.length === 0 && !isAddingIncome && (
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Nenhuma receita registrada
                </p>
              </div>
            )}
          </div>

          {isAddingIncome && (
            <form onSubmit={handleAddIncome} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Descricao (ex: Cliente XPTO)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Valor (R$)"
                value={newValue}
                onChange={e => setNewValue(applyCurrencyMask(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingIncome(false); setNewDesc(''); setNewValue('') }}
                  className="px-3 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* PJ Expenses checklist */}
        <ExpenseChecklist
          title="Despesas PJ"
          expenses={period.pjExpenses}
          month={month}
          onTogglePaid={id => toggleExpensePaid('pj', id)}
          onAdd={(name, value, dueDay, fixed) => addExpense('pj', name, value, dueDay, fixed)}
          onRemove={id => removeExpense('pj', id)}
          onRemoveWithTemplate={(expenseId, templateId) => removeExpenseAndTemplate('pj', expenseId, templateId)}
          onUpdateValue={(id, value) => updateExpense('pj', id, { value })}
          onSaveAsTemplate={(name, value, dueDay, fixed) => addTemplate(name, value, dueDay, 'pj', fixed)}
        />
      </div>
    </div>
  )
}
