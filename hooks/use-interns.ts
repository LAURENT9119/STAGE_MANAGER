import { useState, useEffect } from 'react';
import { ProductionService, ProductionIntern } from '@/lib/production-service';
import { useAppStore } from '@/store/app-store';

export const useInterns = () => {
  const {
    interns,
    setInterns,
    setInternsLoading,
    setInternsError,
    loading,
    errors,
  } = useAppStore();

  const fetchInterns = async () => {
    try {
      setInternsLoading(true);
      setInternsError(null);
      const data = await ProductionService.getAllInterns();
      setInterns(data);
    } catch (error) {
      console.error('Error fetching interns:', error);
      setInternsError(error instanceof Error ? error.message : 'Erreur lors du chargement des stagiaires');
    } finally {
      setInternsLoading(false);
    }
  };

  const fetchInternsByTutor = async (tutorId: string) => {
    try {
      setInternsLoading(true);
      setInternsError(null);
      const data = await ProductionService.getInternsByTutor(tutorId);
      setInterns(data);
    } catch (error) {
      console.error('Error fetching tutor interns:', error);
      setInternsError(error instanceof Error ? error.message : 'Erreur lors du chargement des stagiaires');
    } finally {
      setInternsLoading(false);
    }
  };

  const createIntern = async (internData: Omit<ProductionIntern, 'id' | 'user' | 'tutor'>) => {
    try {
      const newIntern = await ProductionService.createIntern(internData);
      setInterns([newIntern, ...interns]);
      return newIntern;
    } catch (error) {
      console.error('Error creating intern:', error);
      throw error;
    }
  };

  const updateIntern = async (id: string, updates: Partial<ProductionIntern>) => {
    try {
      const updatedIntern = await ProductionService.updateIntern(id, updates);
      setInterns(interns.map(intern => intern.id === id ? updatedIntern : intern));
      return updatedIntern;
    } catch (error) {
      console.error('Error updating intern:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (interns.length === 0 && !loading.interns) {
      fetchInterns();
    }
  }, []);

  const filteredInterns = interns.filter(intern => intern !== undefined);

  return {
    interns: filteredInterns,
    loading: loading.interns,
    error: errors.interns,
    refetch: fetchInterns,
    fetchInternsByTutor,
    createIntern,
    updateIntern,
  };
};