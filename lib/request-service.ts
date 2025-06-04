import { supabase } from './supabase';

export interface Request {
  id: string;
  intern_id: string;
  type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'autre';
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'tutor_review' | 'hr_review' | 'finance_review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submission_date: string | null;
  due_date: string | null;
  tutor_approved_at: string | null;
  tutor_approved_by: string | null;
  hr_approved_at: string | null;
  hr_approved_by: string | null;
  finance_approved_at: string | null;
  finance_approved_by: string | null;
  final_approved_at: string | null;
  rejection_reason: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  intern?: {
    id: string;
    user_id: string;
    department: string;
    university: string;
    user?: {
      id: string;
      full_name: string;
      email: string;
      role: string;
    };
  };
}

export const requestService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          intern:interns(
            id,
            user_id,
            department,
            university,
            user:users(
              id,
              full_name,
              email,
              role
            )
          )
        `)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la récupération des demandes:', err);
      return { data: null, error: { message: err.message || 'Erreur de connexion' } };
    }
  },

  async getByIntern(internId: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          intern:interns(
            id,
            user_id,
            department,
            university,
            user:users(
              id,
              full_name,
              email,
              role
            )
          )
        `)
        .eq('intern_id', internId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la récupération des demandes:', err);
      return { data: null, error: { message: err.message || 'Erreur de connexion' } };
    }
  },

  async getByUser(userId: string) {
    try {
      // D'abord récupérer l'intern associé à cet utilisateur
      const { data: internData, error: internError } = await supabase
        .from('interns')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (internError || !internData) {
        return { data: [], error: null };
      }

      return this.getByIntern(internData.id);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des demandes utilisateur:', err);
      return { data: null, error: { message: err.message || 'Erreur de connexion' } };
    }
  },

  async create(requestData: Partial<Request>) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert({
          ...requestData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          intern:interns(
            id,
            user_id,
            department,
            university,
            user:users(
              id,
              full_name,
              email,
              role
            )
          )
        `)
        .single();

      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la création de la demande:', err);
      return { data: null, error: { message: err.message || 'Erreur de création' } };
    }
  },

  async update(id: string, updates: Partial<Request>) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          intern:interns(
            id,
            user_id,
            department,
            university,
            user:users(
              id,
              full_name,
              email,
              role
            )
          )
        `)
        .single();

      return { data, error };
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la demande:', err);
      return { data: null, error: { message: err.message || 'Erreur de mise à jour' } };
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);

      return { error };
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la demande:', err);
      return { error: { message: err.message || 'Erreur de suppression' } };
    }
  }
};