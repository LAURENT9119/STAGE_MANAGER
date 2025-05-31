
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User } from '@/lib/auth-service';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const user = await authService.signIn(email, password);
          if (user) {
            set({ user, loading: false });
            return true;
          }
          set({ error: 'Échec de la connexion', loading: false });
          return false;
        } catch (error: any) {
          set({ error: error.message || 'Erreur de connexion', loading: false });
          return false;
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          await authService.signOut();
          set({ user: null, loading: false, error: null });
        } catch (error: any) {
          set({ error: error.message || 'Erreur de déconnexion', loading: false });
        }
      },

      signUp: async (email: string, password: string, fullName: string, role: string) => {
        set({ loading: true, error: null });
        try {
          const user = await authService.signUp(email, password, fullName, role);
          if (user) {
            set({ user, loading: false });
            return true;
          }
          set({ error: 'Échec de l\'inscription', loading: false });
          return false;
        } catch (error: any) {
          set({ error: error.message || 'Erreur d\'inscription', loading: false });
          return false;
        }
      },

      refreshUser: async () => {
        const currentUser = get().user;
        if (currentUser) {
          try {
            const refreshedUser = await authService.refreshUser(currentUser.id);
            if (refreshedUser) {
              set({ user: refreshedUser });
            }
          } catch (error) {
            console.error('Failed to refresh user:', error);
          }
        }
      },

      clearError: () => set({ error: null }),

      initializeAuth: async () => {
        set({ loading: true });
        try {
          const session = await authService.getSession();
          if (session?.user) {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userData) {
              set({ user: userData, loading: false });
            } else {
              set({ user: null, loading: false });
            }
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ user: null, loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
