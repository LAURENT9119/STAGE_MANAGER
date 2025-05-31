
import { createClient } from '@supabase/supabase-js'

// Vérification des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types pour l'authentification
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    role?: string
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance'
  avatar_url?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface User extends UserProfile {}

export interface Intern {
  id: string
  user_id: string
  tutor_id: string
  department: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'terminated'
  university: string
  level: string
  contract_type: string
  project?: string
  progress?: number
  evaluation_score?: number
  notes?: string
  created_at: string
  updated_at: string
  user?: UserProfile
  tutor?: UserProfile
}

export interface Request {
  id: string
  intern_id: string
  type: 'convention' | 'prolongation' | 'conge' | 'attestation' | 'evaluation' | 'extension' | 'leave' | 'termination'
  title: string
  description?: string
  status: 'pending' | 'approved' | 'rejected' | 'in_review'
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent'
  reviewer_id?: string
  reviewer_comments?: string
  reviewed_at?: string
  submitted_at: string
  documents?: any[]
  metadata?: any
  created_at: string
  updated_at: string
  intern?: Intern
}

export interface Evaluation {
  id: string
  intern_id: string
  evaluator_id: string
  period: string
  technical_skills?: number
  soft_skills?: number
  punctuality?: number
  initiative?: number
  overall_rating?: number
  comments?: string
  recommendations?: string
  status: 'draft' | 'submitted' | 'validated'
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  intern_id?: string
  request_id?: string
  name: string
  type: 'convention' | 'attestation' | 'evaluation' | 'report' | 'other'
  title: string
  file_path: string
  file_size?: number
  mime_type?: string
  uploaded_by?: string
  related_to_type?: 'intern' | 'request' | 'user'
  related_to_id?: string
  is_public: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  read: boolean
  action_url?: string
  created_at: string
}

// Fonctions d'authentification avec gestion d'erreurs
export const authService = {
  async signIn(email: string, password: string) {
    try {
      console.log('Tentative de connexion pour:', email)
      console.log('URL Supabase:', supabaseUrl)
      
      // Vérifier la connectivité réseau
      if (!navigator.onLine) {
        throw new Error('Pas de connexion Internet')
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Erreur de connexion:', error)
        
        // Messages d'erreur plus explicites
        if (error.message === 'Invalid login credentials') {
          error.message = 'Email ou mot de passe incorrect'
        } else if (error.message === 'Email not confirmed') {
          error.message = 'Veuillez confirmer votre email avant de vous connecter'
        }
      } else {
        console.log('Connexion réussie:', data)
      }
      
      return { data, error }
    } catch (err: any) {
      console.error('Erreur réseau lors de la connexion:', err)
      
      let errorMessage = 'Erreur de connexion au serveur'
      
      if (err.message === 'Failed to fetch') {
        errorMessage = 'Impossible de contacter le serveur Supabase. Vérifiez votre configuration.'
      } else if (err.message === 'Pas de connexion Internet') {
        errorMessage = 'Vérifiez votre connexion Internet'
      }
      
      return { 
        data: null, 
        error: { 
          message: errorMessage,
          name: 'NetworkError'
        } 
      }
    }
  },

  async signUp(email: string, password: string, fullName: string, role: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth/login`
        }
      })

      // Si l'inscription réussit, créer automatiquement le profil via une fonction edge
      if (data.user && !error) {
        // Attendre un peu que l'utilisateur soit créé dans auth.users
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: email,
                full_name: fullName,
                role: role,
              }
            ]);
          
          if (profileError) {
            console.warn('Profil utilisateur non créé automatiquement:', profileError);
          }
        } catch (profileErr) {
          console.warn('Erreur création profil:', profileErr);
        }
      }

      return { data, error }
    } catch (err) {
      console.error('Erreur réseau lors de l\'inscription:', err)
      return { 
        data: null, 
        error: { 
          message: 'Erreur de connexion au serveur. Vérifiez votre configuration Supabase.',
          name: 'NetworkError'
        } 
      }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
      return { 
        error: { 
          message: 'Erreur lors de la déconnexion',
          name: 'NetworkError'
        } 
      }
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err)
      return null
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      return data
    } catch (err) {
      console.error('Erreur réseau lors de la récupération du profil:', err)
      return null
    }
  }
}

// Services pour les entités
export const internService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          *,
          user:users(*),
          tutor:users!interns_tutor_id_fkey(*)
        `)
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération des stagiaires:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async getByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          *,
          user:users(*),
          tutor:users!interns_tutor_id_fkey(*)
        `)
        .eq('user_id', userId)
        .single()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération du stagiaire:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async create(internData: any) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .insert(internData)
        .select()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la création du stagiaire:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('interns')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du stagiaire:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('interns')
        .delete()
        .eq('id', id)
      return { error }
    } catch (err) {
      console.error('Erreur lors de la suppression du stagiaire:', err)
      return { error: { message: 'Erreur de connexion' } }
    }
  }
}

export const requestService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          intern:interns(
            *,
            user:users(*)
          )
        `)
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async getByIntern(internId: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          intern:interns(
            *,
            user:users(*)
          )
        `)
        .eq('intern_id', internId)
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async create(requestData: any) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la création de la demande:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async updateStatus(id: string, status: string, reviewerId: string, comments?: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({
          status,
          reviewer_id: reviewerId,
          reviewer_comments: comments,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  }
}

export const documentService = {
  async uploadFile(file: File, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(path, file)
      return { data, error }
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err)
      return { data: null, error: { message: 'Erreur de connexion' } }
    }
  },

  async getFileUrl(path: string) {
    try {
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(path)
      return data.publicUrl
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'URL:', err)
      return null
    }
  }
}
