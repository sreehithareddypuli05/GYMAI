import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { User } from '@/types'

import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
  updateCurrentUser,
  type ProfileUpdateData,
} from '@/services/authService'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<void>

  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>

  updateUser: (
    payload: ProfileUpdateData,
  ) => Promise<User>

  logout: () => Promise<void>

  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

const TOKEN_KEY = 'gymai_token'
const USER_KEY = 'gymai_user'

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const saveUser = useCallback((u: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)

    if (stored && token) {
      setUser(JSON.parse(stored))

      fetchCurrentUser()
        .then((u) => {
          saveUser(u)
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          setUser(null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [saveUser])

  const persist = (
    token: string,
    u: User,
  ) => {
    localStorage.setItem(TOKEN_KEY, token)
    saveUser(u)
  }

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null)

      try {
        const res = await loginUser(email, password)
        persist(res.access_token, res.user)
      } catch (err: any) {
        const msg =
          err?.response?.data?.detail ||
          'Invalid email or password.'

        setError(msg)
        throw err
      }
    },
    [],
  )

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
    ) => {
      setError(null)

      try {
        const res = await registerUser(
          fullName,
          email,
          password,
        )

        persist(res.access_token, res.user)
      } catch (err: any) {
        const msg =
          err?.response?.data?.detail ||
          'Could not create your account.'

        setError(msg)
        throw err
      }
    },
    [],
  )

  const updateUser = useCallback(
    async (payload: ProfileUpdateData) => {
      const updatedUser =
        await updateCurrentUser(payload)

      saveUser(updatedUser)

      return updatedUser
    },
    [saveUser],
  )

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // JWT logout is client-side.
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setUser(null)
    }
  }, [])

  const clearError = useCallback(
    () => setError(null),
    [],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,

        login,
        register,
        updateUser,
        logout,

        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    )
  }

  return ctx
}