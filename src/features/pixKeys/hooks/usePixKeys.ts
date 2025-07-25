import { useCallback, useEffect, useState } from 'react';
import { getPixKeys, PixKey } from '../services/pixKeyService';

export const usePixKeys = () => {
  const [keys, setKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPixKeys();
      if (response.success && response.data) {
        setKeys(response.data.data || []);
      } else {
        setError(response.error || 'Erro ao buscar chaves Pix.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao carregar as chaves Pix.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  return {
    keys,
    isLoading,
    error,
    refetch: fetchKeys,
  };
}; 