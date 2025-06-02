import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  isLoading: boolean
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  signIn: (email: string, password: string) => Promise<boolean>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  loading: false,
  error: null,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isLoading: false }),
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Simuler une authentification pour l'instant
      // À remplacer par votre logique d'authentification Supabase
      const mockUser = {
        id: '1',
        email,
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set({ user: mockUser, loading: false, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de connexion', 
        loading: false,
        isLoading: false 
      });
      return false;
    }
  },
  clearError: () => set({ error: null })
}))