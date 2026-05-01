import { useState, useCallback, useMemo } from 'react'
import type {
  FinanceData,
  MonthlyPeriod,
  Income,
  Expense,
  ExpenseTemplate,
  PeriodSummary,
} from '../types/finance'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function storageKey(userId: string) {
  return `finance_data_${userId}`
}

function loadData(userId: string): FinanceData {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { templates: [], periods: {} }
}

function saveData(userId: string, data: FinanceData) {
  localStorage.setItem(storageKey(userId), JSON.stringify(data))
}

function templateToExpense(t: ExpenseTemplate): Expense {
  return {
    id: generateId(),
    name: t.name,
    value: t.fixed ? t.value : null, // variavel = null ate preencher
    dueDay: t.dueDay,
    paid: false,
    paidAt: null,
    fixed: t.fixed,
    templateId: t.id,
  }
}

function createPeriodFromTemplates(
  month: string,
  templates: ExpenseTemplate[]
): MonthlyPeriod {
  // So aplica templates que comecam neste mes ou antes
  const applicable = templates.filter(t => !t.startMonth || t.startMonth <= month)
  return {
    month,
    incomes: [],
    pjExpenses: applicable.filter(t => t.type === 'pj').map(templateToExpense),
    pfExpenses: applicable.filter(t => t.type === 'pf').map(templateToExpense),
  }
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function formatMonthLabel(month: string): string {
  const [year, m] = month.split('-')
  const months = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]
  return `${months[parseInt(m, 10) - 1]} ${year}`
}

export function navigateMonth(month: string, direction: -1 | 1): string {
  const [y, m] = month.split('-').map(Number)
  const date = new Date(y, m - 1 + direction, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function useFinanceData(selectedMonth: string, userId: string) {
  const [data, setData] = useState<FinanceData>(() => loadData(userId))

  const persist = useCallback((next: FinanceData) => {
    setData(next)
    saveData(userId, next)
  }, [userId])

  // Get or create period for selected month
  const period: MonthlyPeriod = useMemo(() => {
    if (data.periods[selectedMonth]) {
      return data.periods[selectedMonth]
    }
    return createPeriodFromTemplates(selectedMonth, data.templates)
  }, [data, selectedMonth])

  // Ensure period exists in storage
  const ensurePeriod = useCallback(() => {
    if (!data.periods[selectedMonth]) {
      const newPeriod = createPeriodFromTemplates(selectedMonth, data.templates)
      const next = {
        ...data,
        periods: { ...data.periods, [selectedMonth]: newPeriod },
      }
      persist(next)
      return newPeriod
    }
    return data.periods[selectedMonth]
  }, [data, selectedMonth, persist])

  const updatePeriod = useCallback(
    (updater: (p: MonthlyPeriod) => MonthlyPeriod) => {
      const current = data.periods[selectedMonth]
        ?? createPeriodFromTemplates(selectedMonth, data.templates)
      const updated = updater(current)
      persist({
        ...data,
        periods: { ...data.periods, [selectedMonth]: updated },
      })
    },
    [data, selectedMonth, persist]
  )

  // === INCOME ===
  const addIncome = useCallback(
    (description: string, value: number, receivedAt: string | null) => {
      updatePeriod(p => ({
        ...p,
        incomes: [...p.incomes, { id: generateId(), description, value, receivedAt }],
      }))
    },
    [updatePeriod]
  )

  const removeIncome = useCallback(
    (id: string) => {
      updatePeriod(p => ({
        ...p,
        incomes: p.incomes.filter(i => i.id !== id),
      }))
    },
    [updatePeriod]
  )

  const updateIncome = useCallback(
    (id: string, updates: Partial<Omit<Income, 'id'>>) => {
      updatePeriod(p => ({
        ...p,
        incomes: p.incomes.map(i => (i.id === id ? { ...i, ...updates } : i)),
      }))
    },
    [updatePeriod]
  )

  // === EXPENSES (PJ & PF) ===
  const addExpense = useCallback(
    (type: 'pj' | 'pf', name: string, value: number | null, dueDay: number, fixed: boolean) => {
      const expense: Expense = {
        id: generateId(),
        name,
        value,
        dueDay,
        paid: false,
        paidAt: null,
        fixed,
      }
      updatePeriod(p => ({
        ...p,
        [type === 'pj' ? 'pjExpenses' : 'pfExpenses']: [
          ...p[type === 'pj' ? 'pjExpenses' : 'pfExpenses'],
          expense,
        ],
      }))
    },
    [updatePeriod]
  )

  const removeExpense = useCallback(
    (type: 'pj' | 'pf', id: string) => {
      const key = type === 'pj' ? 'pjExpenses' : 'pfExpenses'
      updatePeriod(p => ({
        ...p,
        [key]: p[key].filter(e => e.id !== id),
      }))
    },
    [updatePeriod]
  )

  const toggleExpensePaid = useCallback(
    (type: 'pj' | 'pf', id: string) => {
      const key = type === 'pj' ? 'pjExpenses' : 'pfExpenses'
      updatePeriod(p => ({
        ...p,
        [key]: p[key].map(e =>
          e.id === id
            ? { ...e, paid: !e.paid, paidAt: !e.paid ? new Date().toISOString() : null }
            : e
        ),
      }))
    },
    [updatePeriod]
  )

  const updateExpense = useCallback(
    (type: 'pj' | 'pf', id: string, updates: Partial<Omit<Expense, 'id'>>) => {
      const key = type === 'pj' ? 'pjExpenses' : 'pfExpenses'
      updatePeriod(p => ({
        ...p,
        [key]: p[key].map(e => (e.id === id ? { ...e, ...updates } : e)),
      }))
    },
    [updatePeriod]
  )

  // === TEMPLATES ===
  const addTemplate = useCallback(
    (name: string, value: number | null, dueDay: number, type: 'pj' | 'pf', fixed: boolean) => {
      const template: ExpenseTemplate = {
        id: generateId(), name, value, dueDay, type, fixed,
        startMonth: selectedMonth,
      }
      const next = { ...data, templates: [...data.templates, template] }

      // Injetar despesa em todos os periodos ja salvos >= startMonth
      const key = type === 'pj' ? 'pjExpenses' : 'pfExpenses'
      const updatedPeriods = { ...next.periods }
      for (const [periodMonth, period] of Object.entries(updatedPeriods)) {
        if (periodMonth >= selectedMonth) {
          updatedPeriods[periodMonth] = {
            ...period,
            [key]: [...period[key], templateToExpense(template)],
          }
        }
      }
      next.periods = updatedPeriods

      persist(next)
    },
    [data, persist, selectedMonth]
  )

  const removeTemplate = useCallback(
    (id: string) => {
      persist({ ...data, templates: data.templates.filter(t => t.id !== id) })
    },
    [data, persist]
  )

  // Operacao atomica: remove despesa do mes + template (evita stale closure)
  const removeExpenseAndTemplate = useCallback(
    (type: 'pj' | 'pf', expenseId: string, templateId: string) => {
      const key = type === 'pj' ? 'pjExpenses' : 'pfExpenses'
      const currentPeriod = data.periods[selectedMonth]
        ?? createPeriodFromTemplates(selectedMonth, data.templates)
      const updatedPeriod = {
        ...currentPeriod,
        [key]: currentPeriod[key].filter(e => e.id !== expenseId),
      }
      persist({
        ...data,
        templates: data.templates.filter(t => t.id !== templateId),
        periods: { ...data.periods, [selectedMonth]: updatedPeriod },
      })
    },
    [data, selectedMonth, persist]
  )

  const updateTemplate = useCallback(
    (id: string, updates: Partial<Omit<ExpenseTemplate, 'id'>>) => {
      persist({
        ...data,
        templates: data.templates.map(t => (t.id === id ? { ...t, ...updates } : t)),
      })
    },
    [data, persist]
  )

  // === SUMMARY ===
  const summary: PeriodSummary = useMemo(() => {
    const grossIncome = period.incomes.reduce((s, i) => s + i.value, 0)
    const pjExpensesTotal = period.pjExpenses.reduce((s, e) => s + (e.value ?? 0), 0)
    const pjExpensesPaid = period.pjExpenses.filter(e => e.paid).reduce((s, e) => s + (e.value ?? 0), 0)
    const netToCpf = grossIncome - pjExpensesTotal
    const pfExpensesTotal = period.pfExpenses.reduce((s, e) => s + (e.value ?? 0), 0)
    const pfExpensesPaid = period.pfExpenses.filter(e => e.paid).reduce((s, e) => s + (e.value ?? 0), 0)
    const saved = netToCpf - pfExpensesTotal

    const pjCount = period.pjExpenses.length
    const pfCount = period.pfExpenses.length
    const pjPaidCount = period.pjExpenses.filter(e => e.paid).length
    const pfPaidCount = period.pfExpenses.filter(e => e.paid).length

    return {
      grossIncome,
      pjExpensesTotal,
      pjExpensesPaid,
      netToCpf,
      pfExpensesTotal,
      pfExpensesPaid,
      saved,
      pjProgress: pjCount > 0 ? Math.round((pjPaidCount / pjCount) * 100) : 100,
      pfProgress: pfCount > 0 ? Math.round((pfPaidCount / pfCount) * 100) : 100,
    }
  }, [period])

  return {
    period,
    summary,
    templates: data.templates,
    allPeriods: data.periods,
    ensurePeriod,
    // Income
    addIncome,
    removeIncome,
    updateIncome,
    // Expenses
    addExpense,
    removeExpense,
    toggleExpensePaid,
    updateExpense,
    // Templates
    addTemplate,
    removeTemplate,
    removeExpenseAndTemplate,
    updateTemplate,
  }
}
