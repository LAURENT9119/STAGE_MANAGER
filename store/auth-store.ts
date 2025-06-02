import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      login: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false 
        });
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...updates }
          });
        }
      },

      // Alias pour compatibilité avec les pages existantes
      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulation d'authentification - à remplacer par votre logique réelle
          const mockUser: User = {
            id: '1',
            email,
            role: 'tutor',
            firstName: 'Utilisateur',
            lastName: 'Test'
          };
          set({ 
            user: mockUser, 
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      signUp: async (email: string, password: string, fullName: string, role: string) => {
        set({ isLoading: true });
        try {
          // Simulation d'inscription - à remplacer par votre logique réelle
          const [firstName, lastName] = fullName.split(' ');
          const mockUser: User = {
            id: Date.now().toString(),
            email,
            role: role as User['role'],
            firstName: firstName || fullName,
            lastName: lastName || ''
          };
          set({ 
            user: mockUser, 
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // Simulation d'initialisation - à remplacer par votre logique réelle
          // Vérifier si l'utilisateur est déjà connecté via localStorage/session
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: 'Erreur d\'initialisation' });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;