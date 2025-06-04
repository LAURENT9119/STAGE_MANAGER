import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import { AuthService, type UserProfile } from '@/lib/auth-service';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, userData: { full_name: string; role: string }) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: any }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });

        const { data, error } = await AuthService.signIn(email, password);

        if (error) {
          set({ isLoading: false });
          return { success: false, error };
        }

        if (data.user) {
          const profile = await AuthService.getUserProfile(data.user.id);
          set({
            user: data.user,
            session: data.session,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
        }

        return { success: true };
      },

      signUp: async (email: string, password: string, userData: { full_name: string; role: string }) => {
        set({ isLoading: true });

        const { data, error } = await AuthService.signUp(email, password, userData);

        if (error) {
          set({ isLoading: false });
          return { success: false, error };
        }

        set({ isLoading: false });
        return { success: true };
      },

      signOut: async () => {
        set({ isLoading: true });
        await AuthService.signOut();
        set({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setSession: (session) => {
        set({ session });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      initialize: async () => {
        set({ isLoading: true });

        const { user, session } = await AuthService.getCurrentUser();

        if (user) {
          const profile = await AuthService.getUserProfile(user.id);
          set({
            user,
            session,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true });

        const { user, session } = await AuthService.getCurrentUser();

        if (user) {
          const profile = await AuthService.getUserProfile(user.id);
          set({
            user,
            session,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return { success: false, error: 'No user logged in' };

        const { data, error } = await AuthService.updateProfile(user.id, updates);

        if (error) {
          return { success: false, error };
        }

        if (data) {
          set({ profile: data });
        }

        return { success: true };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);