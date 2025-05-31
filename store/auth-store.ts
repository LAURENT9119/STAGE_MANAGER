
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/lib/auth-service'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance'
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: UserProfile | null
  loading: boolean
  authenticated: boolean
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setAuthenticated: (authenticated: boolean) => void
  getCurrentUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      authenticated: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setAuthenticated: (authenticated) => set({ authenticated }),
      getCurrentUser: async () => {
        set({ loading: true })
        try {
          const user = authService.getCurrentUser()
          if (user) {
            set({ user, authenticated: true })
          } else {
            set({ user: null, authenticated: false })
          }
        } catch (error) {
          console.error('Error getting current user:', error)
          set({ user: null, authenticated: false })
        } finally {
          set({ loading: false })
        }
      },
      logout: () => {
        authService.signOut()
        set({ user: null, authenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
