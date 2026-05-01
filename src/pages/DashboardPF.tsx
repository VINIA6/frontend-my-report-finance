import { ArrowDown, Briefcase, Wallet, PiggyBank } from 'lucide-react'
import type { useFinanceData } from '../hooks/useFinanceData'
import type { UserType } from '../services/authService'
import { formatCurrency } from '../utils/currencyUtils'
import ExpenseChecklist from '../components/ui/ExpenseChecklist'

type FinanceActions = ReturnType<typeof useFinanceData>

interface DashboardPFProps {
  finance: FinanceActions
  month: string
  userType: UserType
  salary: number | null
}

export default function DashboardPF({ finance, month, userType, salary }: DashboardPFProps) {
  const { period, summary, addExpense, removeExpense, toggleExpensePaid, updateExpense, addTemplate, removeExpenseAndTemplate } = finance

  const isClt = userType === 'clt'
  // CLT: income = salary; CNPJ: income = net after PJ expenses
  const income = isClt ? (salary ?? 0) : summary.netToCpf
  const saved = income - summary.pfExpensesTotal

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800 p-5">
          <div className="flex items-center space-x-2">
            {isClt ? (
              <Briefcase className="w-4 h-4 text-indigo-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-indigo-500" />
            )}
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {isClt ? 'Salario Bruto' : 'Recebido do CNPJ'}
            </p>
          </div>
          <p className={`text-2xl font-bold mt-1 ${income >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
            R$ {formatCurrency(Math.abs(income))}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {isClt ? 'Valor fixo mensal' : 'Liquido apos despesas PJ'}
          </p>
        </div>

        {/* Total expenses PF */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-red-500" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Despesas Pessoais
            </p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            R$ {formatCurrency(summary.pfExpensesTotal)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {summary.pfProgress}% pago
          </p>
        </div>

        {/* Saved */}
        <div className={`rounded-xl shadow-sm border p-5 ${
          saved >= 0
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800'
            : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-100 dark:border-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            <PiggyBank className={`w-4 h-4 ${saved >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {saved >= 0 ? 'Guardado' : 'Faltando'}
            </p>
          </div>
          <p className={`text-2xl font-bold mt-1 ${
            saved >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            R$ {formatCurrency(Math.abs(saved))}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {isClt ? 'Salario - Despesas pessoais' : 'Liquido - Despesas pessoais'}
          </p>
        </div>
      </div>

      {/* Financial bar */}
      {income > 0 && summary.pfExpensesTotal > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
            Comprometimento {isClt ? 'do salario' : 'do liquido'}
          </p>
          <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summary.pfExpensesTotal / income > 0.9
                  ? 'bg-red-500'
                  : summary.pfExpensesTotal / income > 0.7
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min((summary.pfExpensesTotal / income) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {Math.round((summary.pfExpensesTotal / income) * 100)}% comprometido
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              R$ {formatCurrency(income)}
            </span>
          </div>
        </div>
      )}

      {/* PF Expenses checklist */}
      <ExpenseChecklist
        title="Despesas Pessoais"
        expenses={period.pfExpenses}
        month={month}
        onTogglePaid={id => toggleExpensePaid('pf', id)}
        onAdd={(name, value, dueDay, fixed) => addExpense('pf', name, value, dueDay, fixed)}
        onRemove={id => removeExpense('pf', id)}
        onRemoveWithTemplate={(expenseId, templateId) => removeExpenseAndTemplate('pf', expenseId, templateId)}
        onUpdateValue={(id, value) => updateExpense('pf', id, { value })}
        onSaveAsTemplate={(name, value, dueDay, fixed) => addTemplate(name, value, dueDay, 'pf', fixed)}
      />
    </div>
  )
}
