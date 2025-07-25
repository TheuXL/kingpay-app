import { useCallback, useEffect, useState } from 'react';
import { getAnticipations } from '../services/anticipationService';

export interface Anticipation {
    id: string;
    created_at: string;
    status: 'pending' | 'approved' | 'denied';
    amount_requested: number;
    fee: number;
    net_amount: number;
    // Adicionar outros campos conforme a API
    aReceberList?: string[];
}

export const useAnticipations = () => {
  const [anticipations, setAnticipations] = useState<Anticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnticipations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAnticipations();
      if (response.success && response.data) {
        // A API retorna { data: [...] }
        setAnticipations(response.data.data || []);
      } else {
        setError(response.error || 'Erro ao buscar antecipações.');
      }
    } catch (err: any) {
      console.error('Falha ao buscar antecipações:', err);
      setError(err.message || 'Ocorreu um erro ao carregar as antecipações.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnticipations();
  }, [fetchAnticipations]);

  return {
    anticipations,
    isLoading,
    error,
    refetch: fetchAnticipations,
  };
}; 