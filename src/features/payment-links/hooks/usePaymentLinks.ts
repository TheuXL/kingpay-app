import { useEffect, useState, useCallback } from 'react';
import { paymentLinkService } from '../services/paymentLinkService';
import { PaymentLink } from '../types';
import { logger } from '@/lib/logger/logger';

export const usePaymentLinks = () => {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      logger.info('usePaymentLinks', 'Buscando links de pagamento');
      const links = await paymentLinkService.getPaymentLinks();
      setPaymentLinks(links);
      logger.success('usePaymentLinks', 'Links de pagamento carregados', { count: links.length });
    } catch (err: any) {
      const errorMessage = err.message || 'Ocorreu um erro ao buscar os links de pagamento.';
      setError(errorMessage);
      logger.error('usePaymentLinks', errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentLinks();
  }, [fetchPaymentLinks]);

  const refreshPaymentLinks = useCallback(() => {
    fetchPaymentLinks();
  }, [fetchPaymentLinks]);

  return {
    paymentLinks,
    isLoading,
    error,
    refreshPaymentLinks,
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