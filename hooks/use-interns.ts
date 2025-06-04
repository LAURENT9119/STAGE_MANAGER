
import { useState, useEffect } from 'react';
import { internService, Intern } from '@/lib/intern-service';
import { useAuthStore } from '@/store/auth-store';

interface UseInternsState {
  interns: Intern[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createIntern: (data: any) => Promise<boolean>;
  updateIntern: (id: string, data: any) => Promise<boolean>;
}

export function useInterns(): UseInternsState {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchInterns = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setInterns([]);
        return;
      }

      let result;
      if (user.role === 'intern') {
        // Pour les stagiaires, récupérer seulement leur profil
        result = await internService.getByUser(user.id);
        if (result.error) {
          setError(result.error.message);
          setInterns([]);
        } else {
          setInterns(result.data ? [result.data] : []);
        }
      } else if (user.role === 'tutor') {
        // Pour les tuteurs, récupérer leurs stagiaires assignés
        result = await internService.getByTutor(user.id);
        if (result.error) {
          setError(result.error.message);
          setInterns([]);
        } else {
          setInterns(result.data || []);
        }
      } else {
        // Pour HR et admin, récupérer tous les stagiaires
        result = await internService.getAll();
        if (result.error) {
          setError(result.error.message);
          setInterns([]);
        } else {
          setInterns(result.data || []);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des stagiaires');
      setInterns([]);
    } finally {
      setLoading(false);
    }
  };

  const createIntern = async (data: any): Promise<boolean> => {
    try {
      const result = await internService.create(data);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      await fetchInterns(); // Recharger la liste
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateIntern = async (id: string, data: any): Promise<boolean> => {
    try {
      const result = await internService.update(id, data);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      await fetchInterns(); // Recharger la liste
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchInterns();
  }, [user]);

  return {
    interns,
    loading,
    error,
    refetch: fetchInterns,
    createIntern,
    updateIntern
  };
}
