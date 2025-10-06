import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { DollarSign, Plus, TrendingDown } from 'lucide-react'

const FixedExpenses: React.FC = () => {
  const expenses = [
    { name: 'Aluguel', value: 10000, percentage: 30, color: '#6366f1' },
    { name: 'Salários', value: 12000, percentage: 36, color: '#8b5cf6' },
    { name: 'Internet/Telefone', value: 5800, percentage: 17, color: '#ec4899' },
    { name: 'Energia', value: 1000, percentage: 3, color: '#f59e0b' },
    { name: 'Outros', value: 4200, percentage: 14, color: '#10b981' },
  ]

  const total = expenses.reduce((acc, curr) => acc + curr.value, 0)

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

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Despesas Fixas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total: R$ {total.toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Adicionar</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Lista de Despesas */}
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {expenses.map((expense, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: expense.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{expense.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    R$ {expense.value.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{expense.percentage}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico de Pizza */}
          <div className="flex items-center justify-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Variação mensal:</span>
            </div>
            <span className="text-sm font-semibold text-red-600">+5.2%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FixedExpenses
