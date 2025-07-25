import { useCallback, useEffect, useState } from 'react';
import { companyService, CompanyTaxes } from '../services/companyService';
import { useUserData } from '../../../contexts/UserDataContext';

export const useCompanyTaxes = () => {
  const { company } = useUserData();
  const [taxes, setTaxes] = useState<CompanyTaxes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaxes = useCallback(async () => {
    if (!company?.id) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const taxesData = await companyService.getCompanyTaxes(company.id);
      setTaxes(taxesData);
    } catch (err: any) {
      console.error('Erro ao buscar taxas da empresa:', err);
      setError(err.message || 'Ocorreu um erro ao carregar as taxas.');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  return {
    taxes,
    isLoading,
    error,
    refetch: fetchTaxes,
  };
}; 