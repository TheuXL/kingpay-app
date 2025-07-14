const { utmfyService } = require('../../src/services/utmfyService');

// Exemplos de rastreadores UTM para testes
const utmfyTrackersMock = [
  {
    id: '1',
    name: 'Facebook Ads Tracker',
    platform: 'Utmify',
    pixel_id: 'FB-12345678',
    api_key: 'fb-api-key-12345',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1'
  },
  {
    id: '2',
    name: 'Google Ads Tracker',
    platform: 'Utmify',
    pixel_id: 'GA-87654321',
    api_key: 'ga-api-key-54321',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1'
  }
];

// Helper para simular as funções do serviço de UTM
module.exports = {
  /**
   * Função para simular a obtenção de rastreadores UTM
   */
  getTestTrackers: async () => {
    try {
      console.log('Usando simulação para obter rastreadores UTM');
      
      // Simula chamada de API com dados mockados
      return {
        success: true,
        data: utmfyTrackersMock
      };
    } catch (error) {
      console.error('Falha ao obter rastreadores UTM de teste:', error.message);
      throw error;
    }
  },

  /**
   * Função para simular a criação de um rastreador UTM
   */
  createTestTracker: async (trackerData) => {
    try {
      console.log('Usando simulação para criar rastreador UTM');
      
      // Validações
      if (!trackerData) {
        throw new Error('Dados do rastreador são obrigatórios');
      }
      
      if (!trackerData.name) {
        throw new Error('Nome do rastreador é obrigatório');
      }
      
      if (!trackerData.platform) {
        throw new Error('Plataforma é obrigatória');
      }
      
      if (!trackerData.pixel_id) {
        throw new Error('ID do pixel é obrigatório');
      }
      
      if (!trackerData.api_key) {
        throw new Error('Chave de API é obrigatória');
      }
      
      // Simula criação de novo rastreador
      const newTracker = {
        id: `new-${Date.now()}`,
        name: trackerData.name,
        platform: trackerData.platform,
        pixel_id: trackerData.pixel_id,
        api_key: trackerData.api_key,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'user-1'
      };
      
      return {
        success: true,
        data: newTracker
      };
    } catch (error) {
      console.error('Falha ao criar rastreador UTM de teste:', error.message);
      throw error;
    }
  },

  /**
   * Função para simular a atualização de um rastreador UTM
   */
  updateTestTracker: async (trackerData) => {
    try {
      console.log('Usando simulação para atualizar rastreador UTM');
      
      // Validações
      if (!trackerData) {
        throw new Error('Dados do rastreador são obrigatórios');
      }
      
      if (!trackerData.id) {
        throw new Error('ID do rastreador é obrigatório');
      }
      
      // Busca o rastreador existente
      const existingTracker = utmfyTrackersMock.find(tracker => tracker.id === trackerData.id);
      
      if (!existingTracker) {
        throw new Error(`Rastreador com ID ${trackerData.id} não encontrado`);
      }
      
      // Atualiza os campos fornecidos
      const updatedTracker = {
        ...existingTracker,
        ...trackerData,
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedTracker
      };
    } catch (error) {
      console.error('Falha ao atualizar rastreador UTM de teste:', error.message);
      throw error;
    }
  }
}; 