import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { authService, type UserType } from '../services/authService'
import { setToken, removeToken, getToken } from '../services/api'

interface AuthUser {
  userId: string
  email: string
  userType: UserType
  salary: number | null
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, userType: UserType, salary?: number) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USER_KEY = 'finance_user'

function loadUser(): AuthUser | null {
  if (!getToken()) return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

function saveUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password)
    setToken(res.access_token)
    const u: AuthUser = { userId: res.user_id, email: res.email, userType: res.user_type, salary: res.salary }
    saveUser(u)
    setUser(u)
  }, [])

  const register = useCallback(async (email: string, password: string, userType: UserType, salary?: number) => {
    await authService.register(email, password, userType, salary)
    // auto-login after register
    const res = await authService.login(email, password)
    setToken(res.access_token)
    const u: AuthUser = { userId: res.user_id, email: res.email, userType: res.user_type, salary: res.salary }
    saveUser(u)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    removeToken()
    clearUser()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
