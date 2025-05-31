
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr' | 'tutor' | 'intern' | 'finance';
  full_name: string;
  created_at: string;
}

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

interface Request {
  id: string;
  intern_id: string;
  type: 'leave' | 'certificate' | 'extension' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  processed_at?: string;
  processed_by?: string;
}

interface AppState {
  // Current user
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Data
  interns: Intern[];
  users: User[];
  requests: Request[];
  
  // Loading states
  loading: {
    interns: boolean;
    users: boolean;
    requests: boolean;
    auth: boolean;
  };
  
  // Error states
  errors: {
    interns: string | null;
    users: string | null;
    requests: string | null;
    auth: string | null;
  };
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  
  // Interns actions
  setInterns: (interns: Intern[]) => void;
  addIntern: (intern: Intern) => void;
  updateIntern: (id: string, updates: Partial<Intern>) => void;
  removeIntern: (id: string) => void;
  setInternsLoading: (loading: boolean) => void;
  setInternsError: (error: string | null) => void;
  
  // Users actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  setUsersLoading: (loading: boolean) => void;
  setUsersError: (error: string | null) => void;
  
  // Requests actions
  setRequests: (requests: Request[]) => void;
  addRequest: (request: Request) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  removeRequest: (id: string) => void;
  setRequestsLoading: (loading: boolean) => void;
  setRequestsError: (error: string | null) => void;
  
  // Reset functions
  resetStore: () => void;
}

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  interns: [],
  users: [],
  requests: [],
  loading: {
    interns: false,
    users: false,
    requests: false,
    auth: false,
  },
  errors: {
    interns: null,
    users: null,
    requests: null,
    auth: null,
  },
};

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Auth actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      
      // Interns actions
      setInterns: (interns) => set({ interns }),
      addIntern: (intern) => set((state) => ({ interns: [intern, ...state.interns] })),
      updateIntern: (id, updates) => set((state) => ({
        interns: state.interns.map(intern => 
          intern.id === id ? { ...intern, ...updates } : intern
        )
      })),
      removeIntern: (id) => set((state) => ({
        interns: state.interns.filter(intern => intern.id !== id)
      })),
      setInternsLoading: (loading) => set((state) => ({
        loading: { ...state.loading, interns: loading }
      })),
      setInternsError: (error) => set((state) => ({
        errors: { ...state.errors, interns: error }
      })),
      
      // Users actions
      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updates } : user
        )
      })),
      removeUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),
      setUsersLoading: (loading) => set((state) => ({
        loading: { ...state.loading, users: loading }
      })),
      setUsersError: (error) => set((state) => ({
        errors: { ...state.errors, users: error }
      })),
      
      // Requests actions
      setRequests: (requests) => set({ requests }),
      addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),
      updateRequest: (id, updates) => set((state) => ({
        requests: state.requests.map(request => 
          request.id === id ? { ...request, ...updates } : request
        )
      })),
      removeRequest: (id) => set((state) => ({
        requests: state.requests.filter(request => request.id !== id)
      })),
      setRequestsLoading: (loading) => set((state) => ({
        loading: { ...state.loading, requests: loading }
      })),
      setRequestsError: (error) => set((state) => ({
        errors: { ...state.errors, requests: error }
      })),
      
      // Reset
      resetStore: () => set(initialState),
    }),
    {
      name: 'app-store',
    }
  )
);
