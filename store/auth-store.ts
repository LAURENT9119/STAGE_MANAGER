import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  firstName: string;
  lastName: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        signIn: async (email: string, password: string) => {
          set({ loading: true, error: null });
          try {
            const { AuthService } = await import('@/lib/auth-service');
            const result = await AuthService.signIn(email, password);

            if (result?.user) {
              const userData = await AuthService.getCurrentUser();
              if (userData?.userData) {
                const user: User = {
                  id: userData.userData.id,
                  email: userData.userData.email,
                  role: userData.userData.role,
                  firstName: userData.userData.full_name.split(' ')[0] || userData.userData.full_name,
                  lastName: userData.userData.full_name.split(' ').slice(1).join(' ') || '',
                  full_name: userData.userData.full_name,
                  avatar_url: userData.userData.avatar_url,
                  phone: userData.userData.phone,
                  address: userData.userData.address,
                  created_at: userData.userData.created_at,
                  updated_at: userData.userData.updated_at
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
              // Attendre un peu pour que les triggers de base de données se terminent
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Récupérer les données utilisateur mises à jour
              const currentUser = await AuthService.getCurrentUser();
              if (currentUser && currentUser.userData) {
                set({ 
                  user: currentUser.userData, 
                  loading: false, 
                  error: null 
                });

                // Redirection automatique vers le dashboard approprié
                const userRole = currentUser.userData.role || 'intern';
                window.location.href = `/dashboard/${userRole}`;
                return;
              }

              // Si pas de données utilisateur, essayer de se connecter
              if (result.user.email_confirmed_at) {
                await AuthService.signIn(email, password);
                const retryUser = await AuthService.getCurrentUser();
                if (retryUser && retryUser.userData) {
                  set({ 
                    user: retryUser.userData, 
                    loading: false, 
                    error: null 
                  });
                  window.location.href = `/dashboard/${retryUser.userData.role || 'intern'}`;
                  return;
                }
              }
            }

            set({ loading: false });
          } catch (error: any) {
            console.error('Erreur d\'inscription:', error);
            set({ error: error.message, loading: false });
          }
        },

        signOut: async () => {
          try {
            const { AuthService } = await import('@/lib/auth-service');
            await AuthService.signOut();
            set({ 
              user: null, 
              isAuthenticated: false, 
              loading: false, 
              error: null 
            });
          } catch (error: any) {
            console.error('Erreur lors de la déconnexion:', error);
          }
        },

        initializeAuth: async () => {
          set({ loading: true });
          try {
            const { AuthService } = await import('@/lib/auth-service');
            const session = await AuthService.getSession();

            if (session?.user) {
              const userData = await AuthService.getCurrentUser();
              if (userData?.userData) {
                const user: User = {
                  id: userData.userData.id,
                  email: userData.userData.email,
                  role: userData.userData.role,
                  firstName: userData.userData.full_name.split(' ')[0] || userData.userData.full_name,
                  lastName: userData.userData.full_name.split(' ').slice(1).join(' ') || '',
                  full_name: userData.userData.full_name,
                  avatar_url: userData.userData.avatar_url,
                  phone: userData.userData.phone,
                  address: userData.userData.address,
                  created_at: userData.userData.created_at,
                  updated_at: userData.userData.updated_at
                };

                set({ 
                  user, 
                  isAuthenticated: true, 
                  loading: false 
                });
                return;
              }
            }
            set({ user: null, isAuthenticated: false, loading: false });
          } catch (error) {
            console.error('Erreur d\'initialisation:', error);
            set({ user: null, isAuthenticated: false, loading: false });
          }
        },

        clearError: () => set({ error: null })
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        })
      }
    ),
    { name: 'auth-store' }
  )
);