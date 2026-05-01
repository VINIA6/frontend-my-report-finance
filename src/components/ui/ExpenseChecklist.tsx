import { useState } from 'react'
import { Plus, Trash2, Check, AlertCircle, Pencil, Pin } from 'lucide-react'
import type { Expense } from '../../types/finance'
import { formatCurrency, applyCurrencyMask, parseCurrency } from '../../utils/currencyUtils'

interface ExpenseChecklistProps {
  title: string
  expenses: Expense[]
  month: string
  onTogglePaid: (id: string) => void
  onAdd: (name: string, value: number | null, dueDay: number, fixed: boolean) => void
  onRemove: (id: string) => void
  onRemoveWithTemplate?: (expenseId: string, templateId: string) => void
  onUpdateValue: (id: string, value: number) => void
  onSaveAsTemplate?: (name: string, value: number | null, dueDay: number, fixed: boolean) => void
}

function getDueStatus(dueDay: number, month: string, paid: boolean) {
  if (paid) return 'paid' as const
  const [y, m] = month.split('-').map(Number)
  const dueDate = new Date(y, m - 1, dueDay)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (dueDate < today) return 'overdue' as const
  const threeDays = new Date(today)
  threeDays.setDate(threeDays.getDate() + 3)
  if (dueDate <= threeDays) return 'soon' as const
  return 'pending' as const
}

export default function ExpenseChecklist({
  title,
  expenses,
  month,
  onTogglePaid,
  onAdd,
  onRemove,
  onRemoveWithTemplate,
  onUpdateValue,
  onSaveAsTemplate,
}: ExpenseChecklistProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newDueDay, setNewDueDay] = useState('')
  const [newFixed, setNewFixed] = useState(true)
  const [newRecurring, setNewRecurring] = useState(false)

  // Inline value editing for variable expenses
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // Delete confirmation for recurring expenses
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  const sorted = [...expenses].sort((a, b) => a.dueDay - b.dueDay)
  const total = expenses.reduce((s, e) => s + (e.value ?? 0), 0)
  const totalPaid = expenses.filter(e => e.paid).reduce((s, e) => s + (e.value ?? 0), 0)
  const paidCount = expenses.filter(e => e.paid).length
  const pendingValueCount = expenses.filter(e => e.value === null).length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const day = parseInt(newDueDay, 10)
    if (!newName.trim() || !day || day < 1 || day > 31) return

    const value = newFixed ? parseCurrency(newValue) : null
    if (newFixed && (value === null || value <= 0)) return

    onAdd(newName.trim(), value, day, newFixed)

    // Save as recurring template
    if (newRecurring && onSaveAsTemplate) {
      onSaveAsTemplate(newName.trim(), value, day, newFixed)
    }

    setNewName('')
    setNewValue('')
    setNewDueDay('')
    setNewFixed(true)
    setNewRecurring(false)
    setIsAdding(false)
  }

  const handleInlineValueSave = (id: string) => {
    const value = parseCurrency(editValue)
    if (value > 0) {
      onUpdateValue(id, value)
    }
    setEditingId(null)
    setEditValue('')
  }

  const statusStyles = {
    paid: 'line-through text-gray-400 dark:text-gray-500',
    overdue: 'text-red-600 dark:text-red-400',
    soon: 'text-yellow-600 dark:text-yellow-400',
    pending: 'text-gray-700 dark:text-gray-300',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {paidCount}/{expenses.length} pagas &middot; R$ {formatCurrency(totalPaid)} de R$ {formatCurrency(total)}
            {pendingValueCount > 0 && (
              <span className="text-amber-500"> &middot; {pendingValueCount} sem valor</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </button>
      </div>

      {/* Progress bar */}
      {expenses.length > 0 && (
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                paidCount === expenses.length ? 'bg-green-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${(paidCount / expenses.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
        {sorted.map(expense => {
          const needsValue = expense.value === null
          const status = getDueStatus(expense.dueDay, month, expense.paid)
          const isEditing = editingId === expense.id

          return (
            <div
              key={expense.id}
              className={`group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                needsValue
                  ? 'bg-amber-50 dark:bg-amber-900/10 border border-dashed border-amber-300 dark:border-amber-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => {
                  if (needsValue) return // nao pode marcar pago sem valor
                  onTogglePaid(expense.id)
                }}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  expense.paid
                    ? 'bg-green-500 border-green-500'
                    : needsValue
                      ? 'border-amber-300 dark:border-amber-600 cursor-not-allowed'
                      : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                }`}
                title={needsValue ? 'Preencha o valor primeiro' : undefined}
              >
                {expense.paid && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium truncate ${
                    needsValue ? 'text-amber-700 dark:text-amber-400' : statusStyles[status]
                  }`}>
                    {expense.name}
                  </span>
                  {expense.fixed && (
                    <Pin className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  )}
                  {needsValue && (
                    <span className="text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded flex-shrink-0">
                      PREENCHER
                    </span>
                  )}
                  {!needsValue && status === 'overdue' && (
                    <span className="text-[10px] font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded flex-shrink-0">
                      VENCIDO
                    </span>
                  )}
                  {!needsValue && status === 'soon' && (
                    <span className="text-[10px] font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded flex-shrink-0">
                      VENCE EM BREVE
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Dia {expense.dueDay}
                </span>
              </div>

              {/* Value - inline editable for variable expenses */}
              {isEditing ? (
                <form
                  onSubmit={e => { e.preventDefault(); handleInlineValueSave(expense.id) }}
                  className="flex items-center space-x-1"
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editValue}
                    onChange={e => setEditValue(applyCurrencyMask(e.target.value))}
                    autoFocus
                    onBlur={() => handleInlineValueSave(expense.id)}
                    placeholder="0,00"
                    className="w-24 px-2 py-1 text-sm text-right border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </form>
              ) : needsValue ? (
                <button
                  onClick={() => { setEditingId(expense.id); setEditValue('') }}
                  className="px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
                >
                  R$ —
                </button>
              ) : (
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-semibold whitespace-nowrap ${statusStyles[status]}`}>
                    R$ {formatCurrency(expense.value ?? 0)}
                  </span>
                  {!expense.fixed && !expense.paid && (
                    <button
                      onClick={() => {
                        setEditingId(expense.id)
                        setEditValue(expense.value ? formatCurrency(expense.value) : '')
                      }}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      <Pencil className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
              )}

              {/* Remove */}
              <button
                onClick={() => {
                  if (expense.templateId) {
                    setDeleteTarget(expense)
                  } else {
                    onRemove(expense.id)
                  }
                }}
                className="flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          )
        })}

        {expenses.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Nenhuma despesa cadastrada
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog for recurring expenses */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Despesa recorrente
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              <strong>{deleteTarget.name}</strong> e uma despesa recorrente. O que deseja fazer?
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onRemove(deleteTarget.id)
                  setDeleteTarget(null)
                }}
                className="w-full px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors text-left"
              >
                Remover apenas deste mes
              </button>
              <button
                onClick={() => {
                  if (deleteTarget.templateId && onRemoveWithTemplate) {
                    onRemoveWithTemplate(deleteTarget.id, deleteTarget.templateId)
                  } else {
                    onRemove(deleteTarget.id)
                  }
                  setDeleteTarget(null)
                }}
                className="w-full px-4 py-2.5 text-sm font-medium bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors text-left"
              >
                Remover deste e de todos os meses futuros
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors text-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Nome da despesa"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* Fixed vs Variable toggle */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={newFixed}
                onChange={() => setNewFixed(true)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Valor fixo</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={!newFixed}
                onChange={() => { setNewFixed(false); setNewValue('') }}
                className="w-4 h-4 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Valor variavel</span>
            </label>
          </div>

          <div className="flex space-x-2">
            {newFixed ? (
              <input
                type="text"
                inputMode="numeric"
                placeholder="Valor (R$)"
                value={newValue}
                onChange={e => setNewValue(applyCurrencyMask(e.target.value))}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
            ) : (
              <div className="flex-1 px-3 py-2 text-sm text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-dashed border-amber-300 dark:border-amber-700 rounded-lg">
                Valor sera preenchido quando a conta chegar
              </div>
            )}
            <input
              type="number"
              min={1}
              max={31}
              placeholder="Dia"
              value={newDueDay}
              onChange={e => setNewDueDay(e.target.value)}
              className="w-20 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Recurring toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newRecurring}
              onChange={e => setNewRecurring(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Repetir todo mes (recorrente)
            </span>
          </label>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewName('')
                setNewValue('')
                setNewDueDay('')
                setNewFixed(true)
                setNewRecurring(false)
              }}
              className="px-3 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
