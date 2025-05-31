
import { createClient } from './supabase/server';

// Server-side services that use server client
export const serverInternService = {
  async getAll() {
    try {
      const supabase = createClient();
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
      const supabase = createClient();
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
      const supabase = createClient();
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

export const serverRequestService = {
  async getAll() {
    try {
      const supabase = createClient();
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
      const supabase = createClient();
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
      const supabase = createClient();
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
