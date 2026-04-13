import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../services/api'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function parseJwt(token: string): User | null {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64)
    const payload = JSON.parse(json)
    return {
      id: parseInt(payload.nameid || payload.sub),
      email: payload.email || '',
      firstName: (payload.name || '').split(' ')[0] || '',
      lastName: (payload.name || '').split(' ').slice(1).join(' ') || '',
      role: payload.role || 'SalesStaff',
      isActive: true
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) {
      authApi.setToken(t)
      setToken(t)
      setUser(parseJwt(t))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem('token', response.token)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    authApi.setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

