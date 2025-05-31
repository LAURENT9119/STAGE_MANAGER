
import { supabase } from './supabase'

export interface Evaluation {
  id: string
  intern_id: string
  evaluator_id: string
  period: string
  technical_skills: number
  soft_skills: number
  punctuality: number
  initiative: number
  overall_rating: number
  comments: string
  recommendations: string
  status: 'draft' | 'submitted' | 'validated'
  created_at: string
  updated_at: string
}

export const evaluationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        intern:interns(
          *,
          user:users(*)
        ),
        evaluator:users!evaluations_evaluator_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getByIntern(internId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('intern_id', internId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async create(evaluationData: Partial<Evaluation>) {
    const { data, error } = await supabase
      .from('evaluations')
      .insert(evaluationData)
      .select()
    return { data, error }
  },

  async update(id: string, updates: Partial<Evaluation>) {
    const { data, error } = await supabase
      .from('evaluations')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id)
    return { error }
  }
}
