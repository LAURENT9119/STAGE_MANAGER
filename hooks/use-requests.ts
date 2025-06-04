
import { useState, useEffect } from 'react';
import { requestService, Request } from '@/lib/request-service';
import { useAuthStore } from '@/store/auth-store';

interface UseRequestsState {
  requests: Request[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRequest: (data: any) => Promise<boolean>;
  updateRequest: (id: string, data: any) => Promise<boolean>;
}

export function useRequests(): UseRequestsState {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setRequests([]);
        return;
      }

      let result;
      if (user.role === 'intern') {
        // Pour les stagiaires, récupérer seulement leurs demandes
        result = await requestService.getByUser(user.id);
      } else {
        // Pour les autres rôles, récupérer toutes les demandes
        result = await requestService.getAll();
      }

      if (result.error) {
        setError(result.error.message);
        setRequests([]);
      } else {
        setRequests(result.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des demandes');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (data: any): Promise<boolean> => {
    try {
      const result = await requestService.create(data);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      await fetchRequests(); // Recharger la liste
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateRequest = async (id: string, data: any): Promise<boolean> => {
    try {
      const result = await requestService.update(id, data);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      await fetchRequests(); // Recharger la liste
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    updateRequest
  };
}
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface Request {
  id: string;
  intern_id: string;
  type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'autre';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'tutor_review' | 'hr_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  due_date?: string;
  comments?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Récupérer d'abord l'intern_id de l'utilisateur
      const { data: intern } = await supabase
        .from('interns')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!intern) {
        setRequests([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('requests')
        .select('*')
        .eq('intern_id', intern.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setRequests(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const refetch = () => {
    fetchRequests();
  };

  return {
    requests,
    isLoading,
    error,
    refetch
  };
}
