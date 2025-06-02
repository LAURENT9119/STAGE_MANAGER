import { useState, useEffect } from 'react';
import { requestService, Request } from '@/lib/supabase';
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
        // D'abord récupérer l'ID de stage
        const { data: internData } = await requestService.getAll();
        if (internData) {
          const userRequests = internData.filter((request: Request) => 
            request.intern?.user_id === user.id
          );
          setRequests(userRequests);
        }
      } else {
        // Pour les autres rôles, récupérer toutes les demandes
        result = await requestService.getAll();
        if (result.data) {
          setRequests(result.data);
        }
      }

      if (result?.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des demandes');
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
    updateRequest,
  };
}st,
  };
}