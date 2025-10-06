import React, { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import QuarterlyChart from './components/QuarterlyChart'
import FixedExpenses from './components/FixedExpenses'
import InvoicesList from './components/InvoicesList'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Começar aberto apenas em desktop
    return window.innerWidth >= 1024
  })
  const [activeTab, setActiveTab] = useState<'pf' | 'pj'>('pf')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const menuItems = [
    { id: 1, label: 'Dashboard', active: true },
    { id: 2, label: 'Transações', active: false },
    { id: 3, label: 'Relatórios', active: false },
    { id: 4, label: 'Configurações', active: false },
    { id: 5, label: 'Ajuda', active: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay - apenas em mobile quando aberto */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Finance</span>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                  ${item.active 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium border-l-4 border-indigo-600 dark:border-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              
              {/* Tabs */}
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('pf')}
                  className={`
                    px-6 py-2 rounded-md font-medium transition-all duration-200
                    ${activeTab === 'pf' 
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  PF
                </button>
                <button
                  onClick={() => setActiveTab('pj')}
                  className={`
                    px-6 py-2 rounded-md font-medium transition-all duration-200
                    ${activeTab === 'pj' 
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  PJ
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">v1.0.0</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Coluna Principal - 2/3 */}
            <div className="xl:col-span-2 space-y-6">
              {/* Gráfico por Quartil */}
              <QuarterlyChart />
              
              {/* Despesas Fixas */}
              <FixedExpenses />
            </div>

            {/* Coluna Lateral - 1/3 */}
            <div className="xl:col-span-1">
              {/* Lista de Faturas */}
              <InvoicesList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App