import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface StandardConfig {
  paymentmethods: string[];
  reservepercentageanticipation: number;
  reservepercentageboleto: number;
  reservepercentagepix: number;
  // Adicione outros campos conforme necessário
}

/**
 * Módulo: Padrões de Configuração (Admin)
 */
export class StandardService {

  /**
   * GET /functions/v1/standard
   * Propósito: Listar os "templates" de configuração para novas empresas.
   */
  async getStandardConfigs(): Promise<StandardConfig[]> {
    const response = await edgeFunctionsProxy.invoke('standard', 'GET');
    if (response.success && response.data?.config) {
      return response.data.config as StandardConfig[];
    }
    throw new Error(response.error || 'Erro ao buscar configurações padrão.');
  }

  /**
   * PATCH /functions/v1/standard/last
   * Propósito: Editar o template de configuração padrão.
   */
  async updateStandardConfig(standardPayload: Partial<StandardConfig>): Promise<any> {
    const response = await edgeFunctionsProxy.invoke('standard/last', 'PATCH', standardPayload);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Erro ao atualizar configuração padrão.');
  }
}

export const standardService = new StandardService(); 