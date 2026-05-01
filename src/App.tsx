import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import Sidebar, { type Page } from './components/layout/Sidebar'
import Header from './components/layout/Header'
import MonthSelector from './components/layout/MonthSelector'
import DashboardPF from './pages/DashboardPF'
import DashboardPJ from './pages/DashboardPJ'
import ReportsPage from './pages/ReportsPage'
import DivisaoContas from './pages/DivisaoContas'
import { useFinanceData, getCurrentMonth } from './hooks/useFinanceData'

type Tab = 'pf' | 'pj'

function Dashboard() {
  const { user, logout } = useAuth()

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 1024
  )
  const [activePage, setActivePage] = useState<Page>('dashboard')
  // CLT users default to PF, CNPJ users default to PJ
  const [activeTab, setActiveTab] = useState<Tab>(
    user?.userType === 'cnpj' ? 'pj' : 'pf'
  )
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const finance = useFinanceData(selectedMonth, user!.userId)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // CLT users can only see PF
  const showTab = user?.userType === 'clt' ? 'pf' : activeTab

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <main
        className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((d: boolean) => !d)}
          activeTab={showTab}
          onTabChange={setActiveTab}
          userType={user!.userType}
          userEmail={user!.email}
          onLogout={logout}
          showTabs={activePage === 'dashboard'}
        />

        {activePage === 'dashboard' && (
          <>
            <div className="px-6 pt-6 pb-2 flex items-center justify-between">
              <MonthSelector month={selectedMonth} onChange={setSelectedMonth} />
            </div>

            <div className="px-6 pb-6">
              {showTab === 'pj' ? (
                <DashboardPJ finance={finance} month={selectedMonth} />
              ) : (
                <DashboardPF finance={finance} month={selectedMonth} userType={user!.userType} salary={user!.salary} />
              )}
            </div>
          </>
        )}

        {activePage === 'relatorios' && (
          <div className="px-6 py-6">
            <ReportsPage
              allPeriods={finance.allPeriods}
              userType={user!.userType}
              salary={user!.salary}
            />
          </div>
        )}

        {activePage === 'divisao' && (
          <div className="px-6 py-6">
            <DivisaoContas />
          </div>
        )}

        {activePage === 'configuracoes' && (
          <div className="px-6 py-6">
            <div className="text-center py-20">
              <p className="text-gray-400 dark:text-gray-500">Em breve</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <Dashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
