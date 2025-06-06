import { createClient } from './supabase/client';
import { AuthService } from './auth-service';

// Client-side browser client only
export const supabase = createClient();

// Export browser client function
export { createClient as createBrowserClient } from './supabase/client';

export const authService = AuthService;
export { AuthService };

// Export des services
export { requestService } from './request-service';
export { internService } from './intern-service';

// Types pour l'authentification
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    role?: string
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance'
  avatar_url?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  name?: string; // Alias for full_name
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  created_at: string;
  updated_at: string;
}

export interface Intern {
  id: string
  user_id: string
  tutor_id: string
  department: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'terminated'
  university: string
  level: string
  contract_type: string
  project?: string
  progress?: number
  evaluation_score?: number
  notes?: string
  created_at: string
  updated_at: string
  user?: UserProfile
  tutor?: UserProfile
}

export interface Request {
  id: string
  intern_id: string
  type: 'leave' | 'extension' | 'evaluation' | 'document' | 'support'
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  title: string
  description: string
  start_date?: string
  end_date?: string
  documents?: string[]
  notes?: string
  created_at: string
  updated_at: string
  intern?: Intern
}

// Services pour les entités (client-side only)
export const internService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          *,
          user:users(*),
          tutor:users!interns_tutor_id_fkey(*)
        `)
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération des stagiaires:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async getByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          *,
          user:users(*),
          tutor:users!interns_tutor_id_fkey(*)
        `)
        .eq('user_id', userId)
        .single()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération du stagiaire:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async create(internData: any) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .insert(internData)
        .select()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la création du stagiaire:', err)
      return { data: null, error: { message: 'Erreur de création' } }
    }
  }
}

export const requestService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          intern:interns(
            *,
            user:users(*)
          )
        `)
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async getByIntern(internId: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('intern_id', internId)
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async create(requestData: any) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la création de la demande:', err)
      return { data: null, error: { message: 'Erreur de création' } }
    }
  }
}