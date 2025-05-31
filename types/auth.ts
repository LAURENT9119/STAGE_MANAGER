
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserWithMetadata extends SupabaseUser {
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    [key: string]: any;
  };
}

export interface ExtendedUser {
  id: string;
  email?: string;
  role?: string;
  full_name?: string;
  avatar?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    [key: string]: any;
  };
}
