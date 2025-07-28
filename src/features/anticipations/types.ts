export interface Anticipation {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'denied';
  // Adicione outros campos relevantes da antecipação aqui
} 