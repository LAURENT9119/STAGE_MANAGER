
import { useState, useEffect } from 'react'
import { internService } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'

export interface Intern {
  id: string
  user_id: string
  tutor_id?: string
  department: string
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'upcoming'
  progress: number
  user: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  tutor?: {
    id: string
    full_name: string
    email: string
  }
}

export const useInterns = () => {
  const [interns, setInterns] = useState<Intern[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  const fetchInterns = async () => {
    try {
      setLoading(true)
      const { data, error } = await internService.getAll()
      
      if (error) {
        setError(error.message)
        return
      }

      // Filter based on user role
      let filteredInterns = data || []
      
      if (user) {
        switch (user.role) {
          case 'tutor':
            // Tutors see only their assigned interns
            filteredInterns = filteredInterns.filter(intern => intern.tutor_id === user.id)
            break
          case 'intern':
            // Interns see only themselves
            filteredInterns = filteredInterns.filter(intern => intern.user_id === user.id)
            break
          case 'hr':
          case 'admin':
          case 'finance':
            // HR, Admin, Finance see all interns
            break
        }
      }

      setInterns(filteredInterns)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des stagiaires')
      console.error('Error fetching interns:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterns()
  }, [user])

  const createIntern = async (internData: Partial<Intern>) => {
    try {
      const { data, error } = await internService.create(internData)
      if (error) throw error
      
      await fetchInterns() // Refresh the list
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateIntern = async (id: string, updates: Partial<Intern>) => {
    try {
      const { data, error } = await internService.update(id, updates)
      if (error) throw error
      
      await fetchInterns() // Refresh the list
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteIntern = async (id: string) => {
    try {
      const { error } = await internService.delete(id)
      if (error) throw error
      
      await fetchInterns() // Refresh the list
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    interns,
    loading,
    error,
    refetch: fetchInterns,
    createIntern,
    updateIntern,
    deleteIntern
  }
}
