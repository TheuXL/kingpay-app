import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface BaaSProvider {
  id: string;
  name: string;
  ativo: boolean;
  // Outros campos relevantes
}

export interface BaaSTaxes {
  fee: number;
  // Outros campos de taxas
}

/**
 * Módulo: BaaS (Banking as a Service) - Admin
 */
export class BaasService {

  async getBaasProviders(): Promise<BaaSProvider[]> {
    const response = await edgeFunctionsProxy.invoke('baas', 'GET');
    if (response.success && response.data?.Baas) {
      return response.data.Baas as BaaSProvider[];
    }
    throw new Error(response.error || 'Erro ao listar provedores BaaS.');
  }

  async getBaasProviderById(id: string): Promise<BaaSProvider> {
    const response = await edgeFunctionsProxy.invoke(`baas/${id}`, 'GET');
    if (response.success && response.data?.Baas) {
      return response.data.Baas as BaaSProvider;
    }
    throw new Error(response.error || `Erro ao buscar provedor BaaS ${id}.`);
  }

  async getBaasProviderTaxes(id: string): Promise<BaaSTaxes> {
    const response = await edgeFunctionsProxy.invoke(`baas/${id}/taxas`, 'GET');
    if (response.success && response.data?.taxas) {
      return response.data.taxas as BaaSTaxes;
    }
    throw new Error(response.error || `Erro ao buscar taxas do BaaS ${id}.`);
  }

  async setBaasProviderStatus(id: string, isActive: boolean): Promise<any> {
    const response = await edgeFunctionsProxy.invoke(`baas/${id}/active`, 'PATCH', { active: isActive });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erro ao ativar/desativar BaaS ${id}.`);
  }

  async updateBaasProviderTax(id: string, taxData: { fee: number }): Promise<any> {
    const response = await edgeFunctionsProxy.invoke(`baas/${id}/taxa`, 'PATCH', taxData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || `Erro ao atualizar taxa do BaaS ${id}.`);
  }
}

export const baasService = new BaasService(); 