import { useCallback, useEffect, useState } from 'react';

// Estruturas de dados placeholder que corresponderão à API
interface FinancialSummary {
  total_balances: {
    total_balance: number;
    total_balance_card: number;
    total_financial_reserve: number;
  };
  pending_withdrawals: {
    total_pending_withdrawals: number;
  };
}

interface WalletStatement {
  id: string;
  tipo: string;
  created_at: string;
  value: number;
  entrada: boolean;
}

export const useWalletData = () => {
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [walletStatement, setWalletStatement] = useState<WalletStatement[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Corrigido: false
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // A lógica de chamada à API permanece desativada
  }, []);

  useEffect(() => {
    // fetchData(); // Permanece desativado
  }, [fetchData]);

  return {
    financialSummary,
    walletStatement,
    isLoading,
    error,
    refetch: fetchData,
  };
}; 