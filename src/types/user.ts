import { User as SupabaseUser } from '@supabase/supabase-js';

export interface AppUser extends SupabaseUser {
  company_id?: string;
  role?: string;
  name?: string;
  is_admin?: boolean;
} 