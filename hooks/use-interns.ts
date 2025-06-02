import { useState, useEffect } from 'react';
import { ProductionService, ProductionIntern } from '@/lib/production-service';
import { useAuthStore } from '@/store/auth-store';

export function useInterns() {
  const [interns, setInterns] = useState<ProductionIntern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchInterns = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: ProductionIntern[] = [];

      if (!user) {
        setInterns([]);
        return;
      }

      switch (user.role) {
        case 'admin':
        case 'hr':
        case 'finance':
          data = await ProductionService.getAllInterns();
          break;
        case 'tutor':
          data = await ProductionService.getInternsByTutor(user.id);
          break;
        case 'intern':
          const internData = await ProductionService.getInternByUserId(user.id);
          data = internData ? [internData] : [];
          break;
        default:
          data = [];
      }

      setInterns(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des stagiaires:', err);
      setError(err.message || 'Erreur lors du chargement des stagiaires');
      setInterns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInterns();
    }
  }, [user]);

  const createIntern = async (internData: Partial<ProductionIntern>) => {
    try {
      const newIntern = await ProductionService.createIntern(internData);
      setInterns(prev => [newIntern, ...prev]);
      return newIntern;
    } catch (err: any) {
      console.error('Erreur lors de la création du stagiaire:', err);
      throw err;
    }
  };

  const updateIntern = async (id: string, updates: Partial<ProductionIntern>) => {
    try {
      const updatedIntern = await ProductionService.updateIntern(id, updates);
      setInterns(prev => prev.map(intern => 
        intern.id === id ? updatedIntern : intern
      ));
      return updatedIntern;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du stagiaire:', err);
      throw err;
    }
  };

  const refreshInterns = () => {
    fetchInterns();
  };

  return {
    interns,
    loading,
    error,
    createIntern,
    updateIntern,
    refreshInterns
  };
}