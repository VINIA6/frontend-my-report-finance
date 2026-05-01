import { useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, PiggyBank, CalendarRange,
  ArrowUpRight, ArrowDownRight, Wallet,
} from 'lucide-react'
import type { MonthlyPeriod } from '../types/finance'
import type { UserType } from '../services/authService'
import { formatCurrency } from '../utils/currencyUtils'
import { formatMonthLabel } from '../hooks/useFinanceData'

interface ReportsPageProps {
  allPeriods: Record<string, MonthlyPeriod>
  userType: UserType
  salary: number | null
}

type Range = '3' | '6' | '12' | 'all'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
]

function shortMonth(month: string): string {
  const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const [, m] = month.split('-')
  return names[parseInt(m, 10) - 1]
}

function getMonthsRange(periods: Record<string, MonthlyPeriod>, range: Range): string[] {
  const all = Object.keys(periods).sort()
  if (range === 'all' || all.length === 0) return all
  const n = parseInt(range, 10)
  return all.slice(-n)
}

interface MonthSummary {
  month: string
  label: string
  income: number
  pjExpenses: number
  pfExpenses: number
  totalExpenses: number
  saved: number
}

function buildMonthSummaries(
  periods: Record<string, MonthlyPeriod>,
  months: string[],
  userType: UserType,
  salary: number | null,
): MonthSummary[] {
  return months.map(month => {
    const p = periods[month]
    if (!p) return { month, label: shortMonth(month), income: 0, pjExpenses: 0, pfExpenses: 0, totalExpenses: 0, saved: 0 }

    const grossIncome = p.incomes.reduce((s, i) => s + i.value, 0)
    const pjExp = p.pjExpenses.reduce((s, e) => s + (e.value ?? 0), 0)
    const pfExp = p.pfExpenses.reduce((s, e) => s + (e.value ?? 0), 0)

    const isClt = userType === 'clt'
    const income = isClt ? (salary ?? 0) : grossIncome
    const totalExpenses = isClt ? pfExp : (pjExp + pfExp)
    const saved = isClt ? (income - pfExp) : (grossIncome - pjExp - pfExp)

    return {
      month,
      label: shortMonth(month),
      income,
      pjExpenses: pjExp,
      pfExpenses: pfExp,
      totalExpenses,
      saved,
    }
  })
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">R$ {formatCurrency(entry.value)}</span>
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage({ allPeriods, userType, salary }: ReportsPageProps) {
  const [range, setRange] = useState<Range>('6')
  const isClt = userType === 'clt'

  const months = useMemo(() => getMonthsRange(allPeriods, range), [allPeriods, range])
  const summaries = useMemo(() => buildMonthSummaries(allPeriods, months, userType, salary), [allPeriods, months, userType, salary])

  // Aggregates
  const totals = useMemo(() => {
    const totalIncome = summaries.reduce((s, m) => s + m.income, 0)
    const totalExpenses = summaries.reduce((s, m) => s + m.totalExpenses, 0)
    const totalSaved = summaries.reduce((s, m) => s + m.saved, 0)
    const avgIncome = summaries.length > 0 ? totalIncome / summaries.length : 0
    const avgExpenses = summaries.length > 0 ? totalExpenses / summaries.length : 0
    const bestMonth = summaries.reduce((best, m) => m.saved > best.saved ? m : best, summaries[0])
    const worstMonth = summaries.reduce((worst, m) => m.saved < worst.saved ? m : worst, summaries[0])
    return { totalIncome, totalExpenses, totalSaved, avgIncome, avgExpenses, bestMonth, worstMonth }
  }, [summaries])

  // Expense breakdown (top expenses by name aggregated)
  const expenseBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    months.forEach(month => {
      const p = allPeriods[month]
      if (!p) return
      const expenses = isClt ? p.pfExpenses : [...p.pjExpenses, ...p.pfExpenses]
      expenses.forEach(e => {
        const val = e.value ?? 0
        map.set(e.name, (map.get(e.name) ?? 0) + val)
      })
    })
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [allPeriods, months, isClt])

  // Cumulative savings
  const cumulativeSavings = useMemo(() => {
    let acc = 0
    return summaries.map(s => {
      acc += s.saved
      return { ...s, cumulative: acc }
    })
  }, [summaries])

  if (months.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CalendarRange className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400">Sem dados ainda</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Registre receitas e despesas no Dashboard para ver os relatorios.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Relatorios
        </h2>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {([['3', '3M'], ['6', '6M'], ['12', '12M'], ['all', 'Tudo']] as [Range, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setRange(val)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                range === val
                  ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Receita total</span>
          </div>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            R$ {formatCurrency(totals.totalIncome)}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            Media R$ {formatCurrency(totals.avgIncome)}/mes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Despesa total</span>
          </div>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            R$ {formatCurrency(totals.totalExpenses)}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            Media R$ {formatCurrency(totals.avgExpenses)}/mes
          </p>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 ${
          totals.totalSaved >= 0
            ? 'border-green-200 dark:border-green-800'
            : 'border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <PiggyBank className={`w-4 h-4 ${totals.totalSaved >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              {totals.totalSaved >= 0 ? 'Total guardado' : 'Total deficit'}
            </span>
          </div>
          <p className={`text-xl font-bold ${
            totals.totalSaved >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            R$ {formatCurrency(Math.abs(totals.totalSaved))}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            {summaries.length} mes{summaries.length !== 1 ? 'es' : ''}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Wallet className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Comprometimento</span>
          </div>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {totals.totalIncome > 0 ? Math.round((totals.totalExpenses / totals.totalIncome) * 100) : 0}%
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            Da receita em despesas
          </p>
        </div>
      </div>

      {/* Best/Worst months */}
      {totals.bestMonth && totals.worstMonth && summaries.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4 flex items-center space-x-4">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-700 dark:text-green-400 uppercase">Melhor mes</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">
                {formatMonthLabel(totals.bestMonth.month)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                R$ {formatCurrency(totals.bestMonth.saved)} guardado
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4 flex items-center space-x-4">
            <div className="p-2.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-red-700 dark:text-red-400 uppercase">Pior mes</p>
              <p className="text-lg font-bold text-red-700 dark:text-red-300">
                {formatMonthLabel(totals.worstMonth.month)}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                R$ {formatCurrency(Math.abs(totals.worstMonth.saved))} {totals.worstMonth.saved >= 0 ? 'guardado' : 'deficit'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Income vs Expenses bar chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Receita vs Despesas
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summaries} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" opacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value: string) => <span className="text-gray-600 dark:text-gray-300">{value}</span>}
            />
            <Bar name="Receita" dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar name="Despesas" dataKey="totalExpenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Evolucao do Saldo Acumulado
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={cumulativeSavings}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" opacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                name="Saldo acumulado"
                dataKey="cumulative"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                name="Guardado no mes"
                dataKey="saved"
                stroke="#22c55e"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ fill: '#22c55e', strokeWidth: 0, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense breakdown donut */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Composicao de Despesas
          </h3>
          {expenseBreakdown.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `R$ ${formatCurrency(value)}`}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg, #fff)',
                      border: '1px solid var(--tooltip-border, #e5e7eb)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full mt-2 space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar">
                {expenseBreakdown.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap ml-2">
                      R$ {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">
              Nenhuma despesa registrada
            </p>
          )}
        </div>
      </div>

      {/* Monthly table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Resumo Mensal
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase px-5 py-3">Mes</th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase px-5 py-3">Receita</th>
                {!isClt && (
                  <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase px-5 py-3">Desp. PJ</th>
                )}
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase px-5 py-3">Desp. Pessoais</th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase px-5 py-3">Guardado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...summaries].reverse().map(s => (
                <tr key={s.month} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatMonthLabel(s.month)}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-green-600 dark:text-green-400 font-medium">
                    R$ {formatCurrency(s.income)}
                  </td>
                  {!isClt && (
                    <td className="px-5 py-3 text-sm text-right text-red-500 dark:text-red-400">
                      R$ {formatCurrency(s.pjExpenses)}
                    </td>
                  )}
                  <td className="px-5 py-3 text-sm text-right text-red-500 dark:text-red-400">
                    R$ {formatCurrency(s.pfExpenses)}
                  </td>
                  <td className={`px-5 py-3 text-sm text-right font-semibold ${
                    s.saved >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    R$ {formatCurrency(Math.abs(s.saved))}
                    {s.saved < 0 && <span className="text-[10px] ml-1">deficit</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
