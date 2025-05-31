
import { supabase } from './supabase'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  action_url?: string
  created_at: string
}

export const notificationService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async create(notificationData: Partial<Notification>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
    return { data, error }
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    return { data, error }
  },

  async markAllAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
    return { data, error }
  },

  // Créer des notifications automatiques
  async notifyRequestStatusChange(requestId: string, status: string) {
    // Récupérer les détails de la demande
    const { data: request } = await supabase
      .from('requests')
      .select(`
        *,
        intern:interns(
          user_id,
          user:users(full_name)
        )
      `)
      .eq('id', requestId)
      .single()

    if (request) {
      await this.create({
        user_id: request.intern.user_id,
        title: 'Mise à jour de votre demande',
        message: `Votre demande "${request.title}" a été ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
        type: status === 'approved' ? 'success' : 'error',
        action_url: '/dashboard/intern/requests'
      })
    }
  }
}
