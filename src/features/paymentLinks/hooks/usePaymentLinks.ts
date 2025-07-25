import { useCallback, useEffect, useState } from 'react';
import { PaymentLink, getPaymentLinks } from '../services/paymentLinkService';

export const usePaymentLinks = () => {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPaymentLinks();
      if (response.success && response.data) {
        // A API retorna { data: [...] }
        setLinks(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setError(response.error || 'Erro ao buscar links de pagamento.');
      }
    } catch (err: any) {
      console.error('Falha ao buscar links de pagamento:', err);
      setError(err.message || 'Ocorreu um erro ao carregar os links.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return {
    links,
    isLoading,
    error,
    refetch: fetchLinks,
  };
};

export const usePaymentLinkDetail = (id: string) => {
    const [link, setLink] = useState<PaymentLink | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLink = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPaymentLinkById(id);
            setLink(data);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao buscar o detalhe do link.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchLink();
    }, [fetchLink]);

    return { link, isLoading, error, refetch: fetchLink };
} 