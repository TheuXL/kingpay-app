import { getPaymentLinks } from '@/features/paymentLinks/services/paymentLinkService';
import { useCallback, useEffect, useState } from 'react';

export const usePaymentLinks = () => {
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const linksData = await getPaymentLinks();
      
      let parsedData = [];
      if (linksData?.data) {
          parsedData = typeof linksData.data === 'string' 
              ? JSON.parse(linksData.data) 
              : linksData.data;
      }
      setPaymentLinks(Array.isArray(parsedData) ? parsedData : []);

    } catch (err: any) {
      console.error("Erro detalhado no usePaymentLinks:", err);
      setError(err.message || 'Ocorreu um erro ao buscar os links de pagamento.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    paymentLinks,
    isLoading,
    error,
    refetch: fetchData,
  };
}; 