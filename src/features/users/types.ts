export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'operator';
  is_active: boolean;
  company_id: string;
  created_at: string;
}
