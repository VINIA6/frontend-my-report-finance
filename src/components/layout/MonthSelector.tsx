import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { formatMonthLabel, navigateMonth, getCurrentMonth } from '../../hooks/useFinanceData'

interface MonthSelectorProps {
  month: string
  onChange: (month: string) => void
}

export default function MonthSelector({ month, onChange }: MonthSelectorProps) {
  const isCurrentMonth = month === getCurrentMonth()

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => onChange(navigateMonth(month, -1))}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="flex items-center space-x-2 min-w-[180px] justify-center">
        <Calendar className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {formatMonthLabel(month)}
        </span>
        {isCurrentMonth && (
          <span className="text-[10px] font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">
            ATUAL
          </span>
        )}
      </div>

      <button
        onClick={() => onChange(navigateMonth(month, 1))}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  )
}
