import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { ExtendedUser, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUser: (userData: Partial<ExtendedUser>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ loading: false, error: error.message });
        return { error: error.message };
      }

      if (data.user) {
        const extendedUser: ExtendedUser = {
          ...data.user,
          role: data.user.user_metadata?.role,
          full_name: data.user.user_metadata?.full_name,
        };
        set({ user: extendedUser, loading: false });
      }

      return {};
    } catch (error) {
      set({ loading: false, error: 'Une erreur est survenue lors de la connexion' });
      return { error: 'Une erreur est survenue lors de la connexion' };
    }
  },

  signUp: async (email: string, password: string, userData = {}) => {
    set({ loading: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        set({ loading: false, error: error.message });
        return { error: error.message };
      }

      if (data.user) {
        const extendedUser: ExtendedUser = {
          ...data.user,
          role: userData.role,
          full_name: userData.full_name,
        };
        set({ user: extendedUser, loading: false });
      }

      return {};
    } catch (error) {
      set({ loading: false, error: 'Une erreur est survenue lors de l\'inscription' });
      return { error: 'Une erreur est survenue lors de l\'inscription' };
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      set({ user: null, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la déconnexion' });
    }
  },

  initialize: async () => {
    if (get().initialized) return;

    set({ loading: true });
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const extendedUser: ExtendedUser = {
          ...user,
          role: user.user_metadata?.role,
          full_name: user.user_metadata?.full_name,
        };
        set({ user: extendedUser, loading: false, initialized: true });
      } else {
        set({ user: null, loading: false, initialized: true });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const extendedUser: ExtendedUser = {
            ...session.user,
            role: session.user.user_metadata?.role,
            full_name: session.user.user_metadata?.full_name,
          };
          set({ user: extendedUser });
        } else {
          set({ user: null });
        }
      });
    } catch (error) {
      set({ user: null, loading: false, initialized: true, error: 'Erreur lors de l\'initialisation' });
    }
  },

  updateUser: (userData: Partial<ExtendedUser>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } });
    }
  },

  clearError: () => {
    set({ error: null });
  },
});