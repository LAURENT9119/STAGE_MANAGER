
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Request = Database['public']['Tables']['requests']['Row'];
type RequestInsert = Database['public']['Tables']['requests']['Insert'];
type RequestUpdate = Database['public']['Tables']['requests']['Update'];

export interface CreateRequestData {
  intern_id: string;
  type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'autre';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  metadata?: Record<string, any>;
}

export interface RequestWithRelations extends Request {
  intern?: {
    id: string;
    user?: {
      full_name: string;
      email: string;
    };
    tutor?: {
      full_name: string;
      email: string;
    };
  };
  documents?: {
    id: string;
    name: string;
    file_path: string;
    type: string;
  }[];
}

export class RequestService {
  private static supabase = createClient();

  static async createRequest(data: CreateRequestData) {
    try {
      const requestData: RequestInsert = {
        ...data,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: request, error } = await this.supabase
        .from('requests')
        .insert([requestData])
        .select(`
          *,
          intern:interns (
            id,
            user:profiles!interns_user_id_fkey (full_name, email),
            tutor:profiles!interns_tutor_id_fkey (full_name, email)
          )
        `)
        .single();

      if (error) throw error;

      // Créer une notification pour le tuteur
      if (request.intern?.tutor) {
        await this.createNotification({
          user_id: request.intern.tutor.id,
          title: 'Nouvelle demande à examiner',
          message: `${request.intern.user?.full_name} a créé une demande: ${request.title}`,
          type: 'info',
          related_request_id: request.id,
        });
      }

      return { data: request, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getRequests(filters?: {
    status?: string;
    type?: string;
    intern_id?: string;
    user_role?: string;
    user_id?: string;
  }) {
    try {
      let query = this.supabase
        .from('requests')
        .select(`
          *,
          intern:interns (
            id,
            user:profiles!interns_user_id_fkey (id, full_name, email),
            tutor:profiles!interns_tutor_id_fkey (id, full_name, email)
          ),
          documents (id, name, file_path, type)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.intern_id) {
        query = query.eq('intern_id', filters.intern_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: data as RequestWithRelations[], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getRequestById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('requests')
        .select(`
          *,
          intern:interns (
            id,
            user:profiles!interns_user_id_fkey (id, full_name, email),
            tutor:profiles!interns_tutor_id_fkey (id, full_name, email)
          ),
          documents (id, name, file_path, type, created_at)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as RequestWithRelations, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateRequestStatus(
    id: string, 
    status: Request['status'], 
    options?: {
      approved_by?: string;
      rejection_reason?: string;
      notes?: string;
    }
  ) {
    try {
      const updateData: RequestUpdate = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Ajouter les champs spécifiques selon le statut
      if (status === 'tutor_review' && options?.approved_by) {
        updateData.tutor_approved_at = new Date().toISOString();
        updateData.tutor_approved_by = options.approved_by;
      } else if (status === 'hr_review' && options?.approved_by) {
        updateData.hr_approved_at = new Date().toISOString();
        updateData.hr_approved_by = options.approved_by;
      } else if (status === 'finance_review' && options?.approved_by) {
        updateData.finance_approved_at = new Date().toISOString();
        updateData.finance_approved_by = options.approved_by;
      } else if (status === 'approved' && options?.approved_by) {
        updateData.final_approved_at = new Date().toISOString();
      } else if (status === 'rejected' && options?.rejection_reason) {
        updateData.rejection_reason = options.rejection_reason;
      }

      const { data, error } = await this.supabase
        .from('requests')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          intern:interns (
            id,
            user:profiles!interns_user_id_fkey (id, full_name, email),
            tutor:profiles!interns_tutor_id_fkey (id, full_name, email)
          )
        `)
        .single();

      if (error) throw error;

      // Créer une notification pour l'utilisateur concerné
      const notificationMessage = this.getStatusNotificationMessage(status);
      if (notificationMessage && data.intern?.user) {
        await this.createNotification({
          user_id: data.intern.user.id,
          title: 'Mise à jour de votre demande',
          message: `${data.title}: ${notificationMessage}`,
          type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
          related_request_id: data.id,
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async submitRequest(id: string) {
    return this.updateRequestStatus(id, 'submitted', {});
  }

  static async approveRequest(id: string, approved_by: string, role: string) {
    const nextStatus = this.getNextStatusAfterApproval(role);
    return this.updateRequestStatus(id, nextStatus, { approved_by });
  }

  static async rejectRequest(id: string, rejection_reason: string) {
    return this.updateRequestStatus(id, 'rejected', { rejection_reason });
  }

  static async deleteRequest(id: string) {
    try {
      const { error } = await this.supabase
        .from('requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  private static async createNotification(notification: {
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    related_request_id?: string;
  }) {
    try {
      await this.supabase
        .from('notifications')
        .insert([notification]);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  private static getStatusNotificationMessage(status: Request['status']): string {
    const messages = {
      submitted: 'Votre demande a été soumise et est en attente de validation',
      tutor_review: 'Votre demande est en cours d\'examen par votre tuteur',
      hr_review: 'Votre demande est en cours d\'examen par les RH',
      finance_review: 'Votre demande est en cours d\'examen par le service financier',
      approved: 'Votre demande a été approuvée',
      rejected: 'Votre demande a été rejetée',
      draft: '',
    };
    return messages[status] || '';
  }

  private static getNextStatusAfterApproval(role: string): Request['status'] {
    const statusFlow = {
      tutor: 'hr_review',
      hr: 'finance_review',
      finance: 'approved',
      admin: 'approved',
    };
    return statusFlow[role as keyof typeof statusFlow] || 'approved';
  }

  static async getRequestStats(filters?: { intern_id?: string }) {
    try {
      let query = this.supabase
        .from('requests')
        .select('status, type, created_at');

      if (filters?.intern_id) {
        query = query.eq('intern_id', filters.intern_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        by_status: {} as Record<string, number>,
        by_type: {} as Record<string, number>,
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      data?.forEach(request => {
        stats.by_status[request.status] = (stats.by_status[request.status] || 0) + 1;
        stats.by_type[request.type] = (stats.by_type[request.type] || 0) + 1;

        if (['submitted', 'tutor_review', 'hr_review', 'finance_review'].includes(request.status)) {
          stats.pending++;
        } else if (request.status === 'approved') {
          stats.approved++;
        } else if (request.status === 'rejected') {
          stats.rejected++;
        }
      });

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}
