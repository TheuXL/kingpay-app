/**
 * 💰 Módulo: Financeiro (Carteira, Extrato)
 * =========================================
 * 
 * Endpoints para dados financeiros conforme documentação REFATORACAO_COMPLETA.md
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import { Movement, WalletData } from "../types";


class WalletService {
  /**
   * Busca os dados da carteira do usuário.
   */
  async getWalletData(): Promise<WalletData> {
    const response = await edgeFunctionsProxy.invoke('wallet', 'GET');
    if (!response.success) {
      throw new Error(response.error || "Erro ao buscar dados da carteira");
    }
    return response.data;
  }

  /**
   * Busca o extrato de movimentações.
   */
  async getMovements(): Promise<Movement[]> {
    const response = await edgeFunctionsProxy.invoke('movimentacoes', 'POST', {});
    if (!response.success) {
      throw new Error(response.error || "Erro ao buscar extrato");
    }
    return response.data.extrato;
  }
}

export const walletService = new WalletService(); 