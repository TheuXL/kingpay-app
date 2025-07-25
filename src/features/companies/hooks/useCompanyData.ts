import { useCallback, useEffect, useState } from 'react';
import { useUserData } from '../../../contexts/UserDataContext';
import { Company, CompanyConfig, CompanyDocuments, CompanyReserve, companyService } from '../services/companyService';

export const useCompanyData = () => {
  const { company: userCompany } = useUserData();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [config, setConfig] = useState<CompanyConfig | null>(null);
  const [reserve, setReserve] = useState<CompanyReserve | null>(null);
  const [documents, setDocuments] = useState<CompanyDocuments | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userCompany?.id) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const [
        companyRes,
        configRes,
        reserveRes,
        docsRes
      ] = await Promise.all([
        companyService.getCompanyById(userCompany.id),
        companyService.getCompanyConfig(userCompany.id),
        companyService.getCompanyReserve(userCompany.id),
        companyService.getCompanyDocuments(userCompany.id),
      ]);

      setCompany(companyRes);
      setConfig(configRes);
      setReserve(reserveRes);
      setDocuments(docsRes);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao carregar os dados da empresa.');
    } finally {
      setIsLoading(false);
    }
  }, [userCompany?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    company,
    config,
    reserve,
    documents,
    isLoading,
    error,
    refetch: fetchData,
  };
}; 