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
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          if (data?.user) {
            // Attendre un peu avant de récupérer les données utilisateur
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (userError) {
              console.log('Utilisateur non trouvé dans la table users, création...');
              // Créer l'utilisateur s'il n'existe pas
              const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email || email,
                  full_name: data.user.user_metadata?.full_name || email.split('@')[0],
                  role: 'intern'
                })
                .select()
                .single();

              if (createError) throw createError;
              
              const user: User = {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                firstName: newUser.full_name,
                lastName: ''
              };

              set({ 
                user, 
                isAuthenticated: true, 
                loading: false 
              });
              return true;
            }

            const user: User = {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              firstName: userData.full_name,
              lastName: ''
            };

            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            });
            return true;
          }
          
          throw new Error('Identifiants invalides');
        } catch (error: any) {
          console.error('Erreur de connexion:', error);
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
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: role
              }
            }
          });

          if (error) throw error;

          if (data?.user) {
            // L'utilisateur sera créé automatiquement par le trigger
            // Attendre un peu pour la création
            await new Promise(resolve => setTimeout(resolve, 2000));

            const user: User = {
              id: data.user.id,
              email: data.user.email || email,
              role: role as User['role'],
              firstName: fullName,
              lastName: ''
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
          console.error('Erreur d\'inscription:', error);
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