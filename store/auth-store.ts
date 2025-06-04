import { create } from 'zustand';
import { AuthService, UserProfile } from '@/lib/auth-service';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { user: authUser, session } = await AuthService.getCurrentUser();

      if (authUser && session) {
        const profile = await AuthService.getUserProfile(authUser.id);
        set({ user: profile, session, initialized: true });
      } else {
        set({ user: null, session: null, initialized: true });
      }

      // Écouter les changements d'authentification
      AuthService.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await AuthService.getUserProfile(session.user.id);
          set({ user: profile, session });
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, session: null });
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      set({ user: null, session: null, initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data, error } = await AuthService.signIn(email, password);

      if (error) {
        set({ loading: false });
        return { success: false, error: error.message };
      }

      if (data?.user && data?.session) {
        const profile = await AuthService.getUserProfile(data.user.id);
        if (profile) {
          set({ user: profile, session: data.session, loading: false });
          return { success: true };
        } else {
          set({ loading: false });
          return { success: false, error: 'Profil utilisateur introuvable' };
        }
      }

      set({ loading: false });
      return { success: false, error: 'Erreur de connexion' };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await AuthService.signOut();
      set({ user: null, session: null, loading: false });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      set({ loading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await AuthService.updateProfile(user.id, updates);
      if (data && !error) {
        set({ user: data });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  },
}));