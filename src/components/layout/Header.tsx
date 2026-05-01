import { Menu, Moon, Sun, LogOut, User } from 'lucide-react'
import type { UserType } from '../../services/authService'

type Tab = 'pf' | 'pj'

interface HeaderProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  userType: UserType
  userEmail: string
  onLogout: () => void
  showTabs?: boolean
}

export default function Header({
  isSidebarOpen,
  onToggleSidebar,
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
  userType,
  userEmail,
  onLogout,
  showTabs = true,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Menu toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Tabs PF / PJ - only on dashboard, only for CNPJ users */}
          {showTabs ? (
            userType === 'cnpj' ? (
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => onTabChange('pj')}
                  className={`
                    px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm
                    ${
                      activeTab === 'pj'
                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  Pessoa Juridica
                </button>
                <button
                  onClick={() => onTabChange('pf')}
                  className={`
                    px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm
                    ${
                      activeTab === 'pf'
                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  Pessoa Fisica
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Financas Pessoais
                </span>
              </div>
            )
          ) : (
            <div />
          )}

          {/* Right side: user info + dark mode + logout */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300 max-w-[160px] truncate">
                {userEmail}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
