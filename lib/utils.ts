import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type UserRole = 'intern' | 'tutor' | 'hr' | 'finance' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Mock user data for demonstration purposes
export const MOCK_USERS: Record<string, UserProfile> = {
  'intern@example.com': {
    id: '1',
    email: 'intern@example.com',
    name: 'Jean Dupont',
    role: 'intern',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  'tutor@example.com': {
    id: '2',
    email: 'tutor@example.com',
    name: 'Marie Laurent',
    role: 'tutor',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  'hr@example.com': {
    id: '3',
    email: 'hr@example.com',
    name: 'Sophie Moreau',
    role: 'hr',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  'finance@example.com': {
    id: '4',
    email: 'finance@example.com',
    name: 'Pierre Durand',
    role: 'finance',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  'admin@example.com': {
    id: '5',
    email: 'admin@example.com',
    name: 'Claude Martin',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
};

export function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'intern':
      return 'bg-blue-100 text-blue-800';
    case 'tutor':
      return 'bg-green-100 text-green-800';
    case 'hr':
      return 'bg-purple-100 text-purple-800';
    case 'finance':
      return 'bg-amber-100 text-amber-800';
    case 'admin':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getRoleName(role: UserRole): string {
  switch (role) {
    case 'intern':
      return 'Stagiaire';
    case 'tutor':
      return 'Tuteur';
    case 'hr':
      return 'Ressources Humaines';
    case 'finance':
      return 'Finance';
    case 'admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}