
import { useState, useEffect } from 'react'
import { requestService } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'

export interface Request {
  id: string
  intern_id: string
  type: 'convention' | 'prolongation' | 'conge' | 'gratification' | 'evaluation'
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  reviewer_id?: string
  reviewer_comments?: string
  created_at: string
  reviewed_at?: string
  intern: {
    id: string
    department: string
    user: {
      id: string
      full_name: string
      email: string
    }
  }
}

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await requestService.getAll()
      
      if (error) {
        setError(error.message)
        return
      }

      // Filter based on user role
      let filteredRequests = data || []
      
      if (user) {
        switch (user.role) {
          case 'intern':
            // Interns see only their own requests
            filteredRequests = filteredRequests.filter(req => 
              req.intern.user.id === user.id
            )
            break
          case 'tutor':
            // Tutors see requests from their assigned interns
            // This would need additional logic to check tutor assignments
            break
          case 'hr':
          case 'admin':
          case 'finance':
            // HR, Admin, Finance see all requests
            break
        }
      }

      setRequests(filteredRequests)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des demandes')
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  const createRequest = async (requestData: Partial<Request>) => {
    try {
      const { data, error } = await requestService.create({
        ...requestData,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      
      if (error) throw error
      
      await fetchRequests() // Refresh the list
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateStatus = async (id: string, status: string, reviewerId: string, comments?: string) => {
    try {
      const { data, error } = await requestService.updateStatus(id, status, reviewerId, comments)
      
      if (error) throw error
      
      await fetchRequests() // Refresh the list
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    updateStatus
  }
}
