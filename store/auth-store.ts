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

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { AuthService } = await import('@/lib/auth-service');
          const result = await AuthService.signIn(email, password);

          if (result?.user) {
            // Récupérer les données utilisateur complètes
            const userData = await AuthService.getCurrentUser();
            if (userData?.userData) {
              const user: User = {
                id: userData.userData.id,
                email: userData.userData.email,
                role: userData.userData.role,
                firstName: userData.userData.full_name,
                lastName: '',
                // full_name: userData.userData.full_name,
                // role: userData.userData.role,
                // created_at: userData.userData.created_at,
                // updated_at: userData.userData.updated_at,
                // avatar_url: userData.userData.avatar_url,
                // phone: userData.userData.phone,
                // department: userData.userData.department,
                // position: userData.userData.position
              };
              set({ 
                user, 
                isAuthenticated: true, 
                loading: false 
              });
              return true;
            }
          }
          throw new Error('Identifiants invalides');
        } catch (error: any) {
          set({ 
            loading: false, 
            error: error.message || 'Erreur de connexion' 
          });
          return false;
        }
      },

      signUp: async (email: string, password: string, fullName: string, role: string) => {
        set({ loading: true, error: null });
        try {
          const { AuthService } = await import('@/lib/auth-service');
          const result = await AuthService.signUp(email, password, {
            full_name: fullName,
            role: role
          });

          if (result?.user) {
            // Créer l'entrée dans la table users
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();

            const { data: userData, error: userError } = await supabase
              .from('users')
              .insert({
                id: result.user.id,
                email: result.user.email,
                full_name: fullName,
                role: role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();

            if (userError) throw userError;

            const user: User = {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              firstName: userData.full_name,
              lastName: ''
              // full_name: userData.full_name,
              // role: userData.role,
              // created_at: userData.created_at,
              // updated_at: userData.updated_at
            };

            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            });
            return true;
          }
          throw new Error('Erreur lors de l\'inscription');
        } catch (error: any) {
          set({ 
            loading: false, 
            error: error.message || 'Erreur d\'inscription' 
          });
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