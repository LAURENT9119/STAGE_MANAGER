
import { create } from 'zustand'

interface AppState {
  // Notifications
  notifications: any[]
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  
  // Global loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // User preferences
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Filters
  globalFilters: {
    dateRange?: { from: Date; to: Date }
    department?: string
    status?: string
  }
  setGlobalFilters: (filters: any) => void
}

export const useAppStore = create<AppState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    })),
    
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  
  globalFilters: {},
  setGlobalFilters: (filters) =>
    set((state) => ({
      globalFilters: { ...state.globalFilters, ...filters }
    }))
}))
