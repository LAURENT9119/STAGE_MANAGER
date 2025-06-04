
import { supabase } from './supabase';

export interface Intern {
  id: string;
  user_id: string;
  tutor_id: string;
  department: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'terminated';
  university: string;
  level: string;
  contract_type: string;
  project?: string;
  progress?: number;
  evaluation_score?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    phone?: string;
    avatar_url?: string;
  };
  tutor?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
}

export const internService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          *,
          user:users!interns_user_id_fkey(
            id,
            full_name,
            email,
            role,
            phone,
            avatar_url
          ),
          tutor:users!interns_tutor_id_fkey(
            id,
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la récupération des stagiaires:', err);
      return { data: null, error: { message: err.message || 'Erreur de connexion' } };
    }
  },

  async getByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          *,
          user:users!interns_user_id_fkey(
            id,
            full_name,
            email,
            role,
            phone,
            avatar_url
          ),
          tutor:users!interns_tutor_id_fkey(
            id,
            full_name,
            email,
            role
          )
        `)
        .eq('user_id', userId)
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la récupération du stagiaire:', err);
      return { data: null, error: { message: err.message || 'Erreur de connexion' } };
    }
  },

  async getByTutor(tutorId: string) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          *,
          user:users!interns_user_id_fkey(
            id,
            full_name,
            email,
            role,
            phone,
            avatar_url
          ),
          tutor:users!interns_tutor_id_fkey(
            id,
            full_name,
            email,
            role
          )
        `)
        .eq('tutor_id', tutorId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la récupération des stagiaires du tuteur:', err);
      return { data: null, error: { message: err.message || 'Erreur de connexion' } };
    }
  },

  async create(internData: Partial<Intern>) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .insert({
          ...internData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          user:users!interns_user_id_fkey(
            id,
            full_name,
            email,
            role,
            phone,
            avatar_url
          ),
          tutor:users!interns_tutor_id_fkey(
            id,
            full_name,
            email,
            role
          )
        `)
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la création du stagiaire:', err);
      return { data: null, error: { message: err.message || 'Erreur de création' } };
    }
  },

  async update(id: string, updates: Partial<Intern>) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          user:users!interns_user_id_fkey(
            id,
            full_name,
            email,
            role,
            phone,
            avatar_url
          ),
          tutor:users!interns_tutor_id_fkey(
            id,
            full_name,
            email,
            role
          )
        `)
        .single();
      
      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du stagiaire:', err);
      return { data: null, error: { message: err.message || 'Erreur de mise à jour' } };
    }
  }
};
