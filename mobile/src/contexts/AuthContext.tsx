import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User, AuthContextType } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token')
        const storedUser = await AsyncStorage.getItem('user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error loading auth data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Listen for token changes (for automatic logout)
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token')
        if (!storedToken && token) {
          // Token was cleared externally (e.g., by error handler)
          console.log('Token cleared externally, logging out user')
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking token:', error)
      }
    }

    // Check token every few seconds
    const interval = setInterval(checkToken, 5000)
    return () => clearInterval(interval)
  }, [token])

  const login = async (newToken: string, newUser: User) => {
    try {
      await AsyncStorage.setItem('token', newToken)
      await AsyncStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
    } catch (error) {
      console.error('Error saving auth data:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } catch (error) {
      console.error('Error clearing auth data:', error)
      throw error
    }
  }

  const forceLogout = () => {
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isLoading,
    forceLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
