
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Intern {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  tutor_id?: string;
  created_at: string;
}

interface UseInternsReturn {
  interns: Intern[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createIntern: (internData: Partial<Intern>) => Promise<void>;
  updateIntern: (id: string, updates: Partial<Intern>) => Promise<void>;
  deleteIntern: (id: string) => Promise<void>;
}

export function useInterns(): UseInternsReturn {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('interns')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setInterns(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setInterns([]);
    } finally {
      setLoading(false);
    }
  };

  const createIntern = async (internData: Partial<Intern>) => {
    try {
      const { data, error: createError } = await supabase
        .from('interns')
        .insert([internData])
        .select()
        .single();

      if (createError) throw createError;
      
      setInterns(prev => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  const updateIntern = async (id: string, updates: Partial<Intern>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('interns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setInterns(prev => prev.map(intern => 
        intern.id === id ? { ...intern, ...data } : intern
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteIntern = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('interns')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setInterns(prev => prev.filter(intern => intern.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  return {
    interns,
    loading,
    error,
    refetch: fetchInterns,
    createIntern,
    updateIntern,
    deleteIntern,
  };
}
