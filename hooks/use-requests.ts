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
  const { user, profile } = useAuthStore();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setRequests([]);
        return;
      }

      let result;
      if (profile?.role === 'intern') {
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
  }, [user, profile?.role]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    updateRequest
  };
}