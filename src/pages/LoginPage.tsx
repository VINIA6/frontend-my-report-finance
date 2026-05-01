import { useState } from 'react'
import {
  DollarSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  UserPlus,
  LogIn,
  Building2,
  Briefcase,
  Monitor,
  Download,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { UserType } from '../services/authService'

const BASE_URL = 'https://github.com/VINIA6/frontend-my-report-finance/releases/latest/download'

function detectPlatform(): 'mac-x64' | 'mac-arm64' | 'win' | 'linux' {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mac')) {
    return (navigator as { userAgentData?: { platform?: string } }).userAgentData?.platform === 'macOS' && ua.includes('arm')
      ? 'mac-arm64'
      : 'mac-x64'
  }
  if (ua.includes('win')) return 'win'
  return 'linux'
}

const PLATFORMS = [
  {
    id: 'linux' as const,
    label: 'Linux',
    sub: '.AppImage',
    url: `${BASE_URL}/MyReportFinance-linux.AppImage`,
  },
  {
    id: 'win' as const,
    label: 'Windows',
    sub: '.exe',
    url: `${BASE_URL}/MyReportFinance-windows.exe`,
  },
  {
    id: 'mac-x64' as const,
    label: 'Mac Intel',
    sub: '.dmg',
    url: `${BASE_URL}/MyReportFinance-mac-x64.dmg`,
  },
  {
    id: 'mac-arm64' as const,
    label: 'Mac Apple Silicon',
    sub: '.dmg',
    url: `${BASE_URL}/MyReportFinance-mac-arm64.dmg`,
  },
]

function DownloadSection() {
  if (window.electronAPI) return null

  const current = detectPlatform()
  const recommended = PLATFORMS.find(p => p.id === current) ?? PLATFORMS[0]

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Monitor className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Baixar app desktop
          </span>
        </div>

        {/* Botão principal — download direto para a plataforma detectada */}
        <a
          href={recommended.url}
          className="flex items-center justify-center space-x-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors mb-3"
        >
          <Download className="w-4 h-4" />
          <span>Baixar para {recommended.label}</span>
          <span className="opacity-70 text-xs">{recommended.sub}</span>
        </a>

        {/* Outras plataformas */}
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.filter(p => p.id !== current).map(({ id, label, sub, url }) => (
            <a
              key={id}
              href={url}
              className="flex flex-col items-center p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
            >
              <Download className="w-3.5 h-3.5 mb-1 group-hover:text-indigo-500 transition-colors" />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{sub}</span>
            </a>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-3">
          Disponivel para Mac, Windows e Linux &bull; Atualização automática inclusa
        </p>
      </div>
    </div>
  )
}

type Mode = 'login' | 'register'

export default function LoginPage() {
  const { login, register } = useAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<UserType>('clt')
  const [salary, setSalary] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setUserType('clt')
    setSalary('')
    setError(null)
    setShowPassword(false)
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.')
      return
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.')
        return
      }
      if (password !== confirmPassword) {
        setError('As senhas nao coincidem.')
        return
      }
      if (userType === 'clt' && (!salary.trim() || Number(salary) <= 0)) {
        setError('Informe seu salario bruto.')
        return
      }
    }

    try {
      setIsLoading(true)
      if (mode === 'login') {
        await login(email, password)
      } else {
        const salaryValue = userType === 'clt' ? Number(salary) : undefined
        await register(email, password, userType, salaryValue)
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } }
      const status = axiosErr?.response?.status
      const detail = axiosErr?.response?.data?.detail

      if (status === 401) {
        setError('E-mail ou senha incorretos.')
      } else if (status === 409) {
        setError('Este e-mail ja esta cadastrado.')
      } else if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Report Finance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Controle financeiro pessoal e empresarial
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-semibold transition-colors ${
                mode === 'login'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-semibold transition-colors ${
                mode === 'register'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar conta</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </h2>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* User Type (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Como voce trabalha?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('clt')}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all ${
                      userType === 'clt'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Briefcase className={`w-6 h-6 ${
                      userType === 'clt' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      userType === 'clt' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      CLT
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      Salario fixo
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('cnpj')}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all ${
                      userType === 'cnpj'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Building2 className={`w-6 h-6 ${
                      userType === 'cnpj' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      userType === 'cnpj' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      CNPJ / PJ
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      Prestador de servico
                    </span>
                  </button>
                </div>

                {/* Salary field for CLT */}
                {userType === 'clt' && (
                  <div className="mt-4">
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Salario bruto mensal
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        id="salary"
                        type="number"
                        min="0"
                        step="0.01"
                        value={salary}
                        onChange={e => setSalary(e.target.value)}
                        placeholder="Ex: 5000.00"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                      Voce podera alterar depois nas configuracoes
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimo 6 caracteres' : '••••••••'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password (register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Criar conta</span>
                </>
              )}
            </button>
          </form>
        </div>

        <DownloadSection />

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          My Report Finance &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
