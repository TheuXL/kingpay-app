import { useCallback, useEffect, useState } from 'react';
import { useUserData } from '../../../contexts/UserDataContext';
import { walletService, type FinancialSummary, type WalletTransaction } from '../services/walletService';

export const useWalletData = () => {
  const { userProfile } = useUserData();
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [walletStatement, setWalletStatement] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const loadWalletData = useCallback(async () => {
    if (!userProfile?.id) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Carregando dados da carteira...');
      console.log(`👤 User ID: ${userProfile.id}`);

      // Carregar dados da carteira
      const summaryRes = await walletService.getWalletData(userProfile.id);
      if (summaryRes.success && summaryRes.data) {
        setFinancialSummary(summaryRes.data);
        console.log('✅ Dados da carteira carregados:', summaryRes.data);
      } else {
        throw new Error(summaryRes.error || 'Erro ao carregar dados da carteira');
      }

      // Carregar extrato
      const statementRes = await walletService.getWalletStatement(userProfile.id);
      if (statementRes.success && statementRes.data) {
        setWalletStatement(statementRes.data);
        console.log('✅ Extrato carregado:', statementRes.data.length, 'transações');
      } else {
        console.warn('⚠️ Erro ao carregar extrato:', statementRes.error);
        setWalletStatement([]);
      }

    } catch (err: any) {
      console.error('❌ Erro ao carregar dados da carteira:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  return {
    financialSummary,
    walletStatement,
    isLoading,
    error,
    refetch: loadWalletData,
  };
}; 