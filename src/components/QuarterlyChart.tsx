import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, Info } from 'lucide-react'

const QuarterlyChart: React.FC = () => {
  const data = [
    { quarter: 'Q1', gastos: 45000, week: 'Semana 1 (Dia 1-7)' },
    { quarter: 'Q2', gastos: 52000, week: 'Semana 2 (Dia 8-14)' },
    { quarter: 'Q3', gastos: 48000, week: 'Semana 3 (Dia 15-21)' },
    { quarter: 'Q4', gastos: 55000, week: 'Semana 4 (Dia 22-30)' },
  ]

  const average = data.reduce((acc, curr) => acc + curr.gastos, 0) / data.length
  const meta = 60000 // Meta mensal

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{payload[0].payload.week}</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            Gastos: R$ {payload[0].value.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Média: R$ {average.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Meta: R$ {meta.toLocaleString('pt-BR')}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gráfico por Quartil</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Análise semanal do mês</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="quarter" 
              stroke="#9ca3af"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '14px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Linha de Média (Verde) */}
            <ReferenceLine 
              y={average} 
              stroke="#10b981" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: 'Média', position: 'right', fill: '#10b981' }}
            />
            
            {/* Linha de Meta (Azul) */}
            <ReferenceLine 
              y={meta} 
              stroke="#3b82f6" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: 'Meta', position: 'right', fill: '#3b82f6' }}
            />
            
            {/* Linha de Gastos (Vermelho) */}
            <Line 
              type="monotone" 
              dataKey="gastos" 
              stroke="#dc2626" 
              strokeWidth={3}
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm flex-wrap gap-2">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Gastos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Média: R$ {average.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Meta: R$ {meta.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        <span className="text-gray-500 dark:text-gray-400">Janeiro 2025</span>
      </div>
    </div>
  )
}

export default QuarterlyChart
