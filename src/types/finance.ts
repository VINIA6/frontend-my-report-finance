export interface Income {
  id: string
  description: string
  value: number
  receivedAt: string | null // ISO date or null if not yet received
}

export interface Expense {
  id: string
  name: string
  value: number | null // null = variavel, ainda nao preenchido
  dueDay: number // day of the month (1-31)
  paid: boolean
  paidAt: string | null // ISO date
  fixed: boolean // true = valor fixo todo mes, false = variavel (precisa preencher)
  templateId?: string // se veio de um template recorrente
}

export interface ExpenseTemplate {
  id: string
  name: string
  value: number | null // null for variable expenses
  dueDay: number
  type: 'pj' | 'pf'
  fixed: boolean
  startMonth: string // "2026-04" — template so aplica a partir deste mes
}

export interface MonthlyPeriod {
  month: string // "2026-04"
  incomes: Income[]
  pjExpenses: Expense[]
  pfExpenses: Expense[]
}

export interface FinanceData {
  templates: ExpenseTemplate[]
  periods: Record<string, MonthlyPeriod>
}

// Calculated values for a period
export interface PeriodSummary {
  grossIncome: number
  pjExpensesTotal: number
  pjExpensesPaid: number
  netToCpf: number
  pfExpensesTotal: number
  pfExpensesPaid: number
  saved: number
  pjProgress: number // 0-100
  pfProgress: number // 0-100
}
