
import { createClient } from '@/lib/supabase/client';

let supabaseClient: any = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
};

class AuthService {
  static async signIn(email: string, password: string) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Erreur de connexion');
    }
  }

  static async signUp(email: string, password: string, userData: any) {
    try {
      const supabase = getSupabaseClient();
      
      // Inscription de l'utilisateur avec métadonnées
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone || '',
            department: userData.department || ''
          }
        }
      });
      
      if (error) throw error;
      
      // Si l'utilisateur est créé, s'assurer que le profil existe
      if (data.user && !data.user.email_confirmed_at) {
        // Pour les nouveaux utilisateurs, créer le profil immédiatement
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
          
        if (profileError) {
          console.warn('Profile creation warning:', profileError);
        }

        // Si c'est un stagiaire, créer aussi son profil stagiaire
        if (userData.role === 'intern' && userData.internData) {
          const { error: internError } = await supabase
            .from('interns')
            .insert({
              user_id: data.user.id,
              department: userData.internData.department,
              university: userData.internData.university,
              level: userData.internData.level,
              contract_type: userData.internData.contract_type,
              start_date: userData.internData.start_date,
              end_date: userData.internData.end_date,
              project: userData.internData.project || null,
              status: 'upcoming'
            });
            
          if (internError) {
            console.warn('Intern profile creation warning:', internError);
          }
        }
      }
      
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Erreur d\'inscription');
    }
  }

  static async signOut() {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Erreur de déconnexion');
    }
  }

  static async getCurrentUser() {
    try {
      const supabase = getSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!user) return null;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        
        // Si l'utilisateur n'existe pas dans la table users, le créer
        if (userError.code === 'PGRST116') {
          const { data: newUserData, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || 'Utilisateur',
              role: user.user_metadata?.role || 'intern',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating user profile:', createError);
            return { user, userData: null };
          }
          
          return { user, userData: newUserData };
        }
        
        return { user, userData: null };
      }

      return { user, userData };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: any) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Erreur de mise à jour');
    }
  }

  static async getSession() {
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error: any) {
      console.error('Get session error:', error);
      return null;
    }
  }

  static async refreshUser(userId: string) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Refresh user error:', error);
      return null;
    }
  }
}

export { AuthService };
export const authService = AuthService;
