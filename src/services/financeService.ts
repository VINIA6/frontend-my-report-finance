import { api } from './api'
import type { FinanceData, Income, Expense, ExpenseTemplate } from '../types/finance'

const BASE = '/v1/finance'

export const financeService = {
  // Carrega todos os dados do servidor
  getData: async (): Promise<FinanceData> => {
    const { data } = await api.get(`${BASE}/data`)
    return data
  },

  // Sincroniza localStorage → banco (migração inicial)
  syncData: async (financeData: FinanceData): Promise<void> => {
    await api.post(`${BASE}/sync`, financeData)
  },

  // Templates
  listTemplates: async (): Promise<ExpenseTemplate[]> => {
    const { data } = await api.get(`${BASE}/templates`)
    return data
  },

  createTemplate: async (template: Omit<ExpenseTemplate, 'id'>): Promise<ExpenseTemplate> => {
    const { data } = await api.post(`${BASE}/templates`, {
      name: template.name,
      value: template.value,
      dueDay: template.dueDay,
      type: template.type,
      fixed: template.fixed,
      startMonth: template.startMonth,
    })
    return data
  },

  updateTemplate: async (id: string, updates: Partial<ExpenseTemplate>): Promise<ExpenseTemplate> => {
    const { data } = await api.put(`${BASE}/templates/${id}`, updates)
    return data
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/templates/${id}`)
  },

  // Período
  getPeriod: async (month: string) => {
    const { data } = await api.get(`${BASE}/periods/${month}`)
    return data
  },

  // Receitas
  addIncome: async (month: string, income: Omit<Income, 'id'>): Promise<Income> => {
    const { data } = await api.post(`${BASE}/periods/${month}/incomes`, {
      description: income.description,
      value: income.value,
      receivedAt: income.receivedAt,
    })
    return data
  },

  updateIncome: async (id: string, updates: Partial<Income>): Promise<Income> => {
    const { data } = await api.put(`${BASE}/incomes/${id}`, updates)
    return data
  },

  deleteIncome: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/incomes/${id}`)
  },

  // Despesas
  addExpense: async (month: string, expense: Omit<Expense, 'id'> & { type: 'pj' | 'pf' }): Promise<Expense> => {
    const { data } = await api.post(`${BASE}/periods/${month}/expenses`, {
      name: expense.name,
      value: expense.value,
      dueDay: expense.dueDay,
      paid: expense.paid,
      paidAt: expense.paidAt,
      fixed: expense.fixed,
      templateId: expense.templateId,
      type: expense.type,
    })
    return data
  },

  updateExpense: async (id: string, updates: Partial<Expense>): Promise<Expense> => {
    const { data } = await api.put(`${BASE}/expenses/${id}`, updates)
    return data
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/expenses/${id}`)
  },
}
