
import { User } from '@supabase/supabase-js';

export interface ExtendedUser extends User {
  role?: string;
  full_name?: string;
  avatar?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    [key: string]: any;
  };
}

export interface AuthState {
  user: ExtendedUser | null;
  loading: boolean;
  initialized: boolean;
}
