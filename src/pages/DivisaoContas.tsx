import { useState } from 'react'
import { Plus, Trash2, Split, Users } from 'lucide-react'
import { formatCurrency } from '../utils/currencyUtils'

interface Bill {
  id: string
  name: string
  amount: number
}

interface Person {
  name: string
  salary: number
}

const COLORS = {
  a: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-600 dark:text-indigo-400',
    bar: 'bg-indigo-500',
    badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  },
  b: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-600 dark:text-purple-400',
    bar: 'bg-purple-500',
    badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  },
}

interface PersonCardProps {
  person: Person
  share: number
  total: number
  colorKey: 'a' | 'b'
  onChange: (p: Person) => void
}

function PersonCard({ person, share, total, colorKey, onChange }: PersonCardProps) {
  const c = COLORS[colorKey]
  const pct = Math.round(share * 100)

  return (
    <div className={`rounded-xl border-2 p-5 ${c.bg} ${c.border}`}>
      <input
        type="text"
        value={person.name}
        onChange={e => onChange({ ...person, name: e.target.value })}
        className="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 mb-4 placeholder-gray-400"
        placeholder="Nome da pessoa"
      />

      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
          Salario liquido
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={person.salary || ''}
            onChange={e => onChange({ ...person, salary: Number(e.target.value) })}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="0,00"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">Participacao</span>
          <span className={`text-sm font-bold ${c.text}`}>{pct}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className={`h-full ${c.bar} rounded-full transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {total > 0 && (
        <div className={`mt-5 pt-4 border-t ${c.border}`}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total a pagar</p>
          <p className={`text-2xl font-bold ${c.text}`}>
            R$ {formatCurrency(total)}
          </p>
        </div>
      )}
    </div>
  )
}

interface BillRowProps {
  bill: Bill
  shareA: number
  shareB: number
  nameA: string
  nameB: string
  onUpdate: (id: string, field: 'name' | 'amount', value: string | number) => void
  onRemove: (id: string) => void
}

function BillRow({ bill, shareA, shareB, onUpdate, onRemove }: BillRowProps) {
  const amountA = bill.amount * shareA
  const amountB = bill.amount * shareB

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      <input
        type="text"
        value={bill.name}
        onChange={e => onUpdate(bill.id, 'name', e.target.value)}
        placeholder="Ex: Aluguel, Condominio..."
        className="flex-1 min-w-0 text-sm bg-transparent border-b border-gray-200 dark:border-gray-600 focus:border-indigo-500 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 py-0.5 transition-colors"
      />
      <div className="relative w-32 flex-shrink-0">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">R$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={bill.amount || ''}
          onChange={e => onUpdate(bill.id, 'amount', Number(e.target.value))}
          className="w-full pl-8 pr-2 py-1.5 text-sm text-right bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="0,00"
        />
      </div>
      <div className="w-28 flex-shrink-0 text-right">
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          R$ {formatCurrency(amountA)}
        </span>
      </div>
      <div className="w-28 flex-shrink-0 text-right">
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
          R$ {formatCurrency(amountB)}
        </span>
      </div>
      <button
        onClick={() => onRemove(bill.id)}
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function DivisaoContas() {
  const [personA, setPersonA] = useState<Person>({ name: 'Pessoa 1', salary: 0 })
  const [personB, setPersonB] = useState<Person>({ name: 'Pessoa 2', salary: 0 })
  const [bills, setBills] = useState<Bill[]>([])

  const totalSalary = personA.salary + personB.salary
  const shareA = totalSalary > 0 ? personA.salary / totalSalary : 0.5
  const shareB = totalSalary > 0 ? personB.salary / totalSalary : 0.5

  const totalBills = bills.reduce((s, b) => s + b.amount, 0)
  const totalA = totalBills * shareA
  const totalB = totalBills * shareB

  const addBill = () => {
    setBills(prev => [...prev, { id: crypto.randomUUID(), name: '', amount: 0 }])
  }

  const removeBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id))
  }

  const updateBill = (id: string, field: 'name' | 'amount', value: string | number) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b))
  }

  const nameA = personA.name.trim() || 'Pessoa 1'
  const nameB = personB.name.trim() || 'Pessoa 2'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Split className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Divisao Proporcional de Contas
        </h2>
      </div>

      {/* Info banner */}
      {totalSalary === 0 && (
        <div className="flex items-start space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <Users className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Insira o salario liquido de cada pessoa para calcular automaticamente quanto cada um deve pagar de cada conta.
          </p>
        </div>
      )}

      {/* Person cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonCard
          person={personA}
          share={shareA}
          total={totalA}
          colorKey="a"
          onChange={setPersonA}
        />
        <PersonCard
          person={personB}
          share={shareB}
          total={totalB}
          colorKey="b"
          onChange={setPersonB}
        />
      </div>

      {/* Bills table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Contas compartilhadas
          </h3>
          <button
            onClick={addBill}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar conta</span>
          </button>
        </div>

        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Split className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma conta adicionada</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Clique em "Adicionar conta" para comecar
            </p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="flex items-center gap-3 px-5 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span className="flex-1">Descricao</span>
              <span className="w-32 flex-shrink-0 text-right">Valor total</span>
              <span className="w-28 flex-shrink-0 text-right text-indigo-600 dark:text-indigo-400">
                {nameA}
              </span>
              <span className="w-28 flex-shrink-0 text-right text-purple-600 dark:text-purple-400">
                {nameB}
              </span>
              <span className="w-8 flex-shrink-0" />
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {bills.map(bill => (
                <BillRow
                  key={bill.id}
                  bill={bill}
                  shareA={shareA}
                  shareB={shareB}
                  nameA={nameA}
                  nameB={nameB}
                  onUpdate={updateBill}
                  onRemove={removeBill}
                />
              ))}
            </div>

            {/* Totals row */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total
              </span>
              <span className="w-32 flex-shrink-0 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                R$ {formatCurrency(totalBills)}
              </span>
              <span className="w-28 flex-shrink-0 text-right text-sm font-bold text-indigo-600 dark:text-indigo-400">
                R$ {formatCurrency(totalA)}
              </span>
              <span className="w-28 flex-shrink-0 text-right text-sm font-bold text-purple-600 dark:text-purple-400">
                R$ {formatCurrency(totalB)}
              </span>
              <span className="w-8 flex-shrink-0" />
            </div>
          </>
        )}
      </div>

      {/* Summary cards */}
      {bills.length > 0 && totalBills > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {([
            { person: personA, total: totalA, share: shareA, colorKey: 'a' as const },
            { person: personB, total: totalB, share: shareB, colorKey: 'b' as const },
          ]).map(({ person, total, share, colorKey }) => {
            const c = COLORS[colorKey]
            const name = person.name.trim() || (colorKey === 'a' ? 'Pessoa 1' : 'Pessoa 2')
            return (
              <div key={colorKey} className={`rounded-xl border-2 p-5 ${c.bg} ${c.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{name}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.badge}`}>
                    {Math.round(share * 100)}% da renda
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Total a pagar</p>
                <p className={`text-3xl font-bold ${c.text}`}>
                  R$ {formatCurrency(total)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  de R$ {formatCurrency(totalBills)} no total
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
