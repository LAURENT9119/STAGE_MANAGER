
import { useState, useEffect } from 'react';
import { ProductionService, ProductionRequest } from '@/lib/production-service';
import { useAuthStore } from '@/store/auth-store';

export function useRequests() {
  const [requests, setRequests] = useState<ProductionRequest[]>([]);
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

      let data: ProductionRequest[] = [];

      switch (user.role) {
        case 'admin':
        case 'hr':
        case 'finance':
          data = await ProductionService.getAllRequests();
          break;
        case 'tutor':
          // Get requests for interns supervised by this tutor
          const tutorInterns = await ProductionService.getInternsByTutor(user.id);
          const allRequests = await ProductionService.getAllRequests();
          data = allRequests.filter(request => 
            tutorInterns.some(intern => intern.id === request.intern_id)
          );
          break;
        case 'intern':
          // Get requests for this specific intern
          const internData = await ProductionService.getInternByUserId(user.id);
          if (internData) {
            data = await ProductionService.getRequestsByIntern(internData.id);
          }
          break;
        default:
          data = [];
      }
      
      setRequests(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des demandes:', err);
      setError(err.message || 'Erreur lors du chargement des demandes');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const createRequest = async (requestData: Partial<ProductionRequest>) => {
    try {
      const newRequest = await ProductionService.createRequest(requestData);
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err: any) {
      console.error('Erreur lors de la création de la demande:', err);
      throw err;
    }
  };

  const updateRequest = async (id: string, updates: Partial<ProductionRequest>) => {
    try {
      const updatedRequest = await ProductionService.updateRequest(id, updates);
      setRequests(prev => prev.map(request => 
        request.id === id ? updatedRequest : request
      ));
      return updatedRequest;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la demande:', err);
      throw err;
    }
  };

  const refreshRequests = () => {
    fetchRequests();
  };

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequest,
    refreshRequests
  };
}

// Export the Request type for compatibility
export type Request = ProductionRequest;
