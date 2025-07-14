const { configuracoesService } = require('../../src/services/configuracoesService');

// Exemplo de termos de uso
const termosDeUsoMock = {
  id: '1',
  conteudo: 'Estes são os termos de uso da plataforma. Ao utilizar nossos serviços, você concorda com estes termos.',
  versao: '1.0',
  data_atualizacao: new Date().toISOString()
};

// Exemplo de configurações gerais
const configuracoesGeraisMock = {
  id: '1',
  descontarChargebackSaldoDisponivel: true,
  reservaFinanceiraHabilitada: true,
  percentualReservaFinanceira: 10,
  diasRetencaoReservaFinanceira: 30,
  limiteTransacaoPix: 50000,
  limiteTransacaoTed: 100000,
  limiteValorDiario: 200000
};

// Exemplo de personalização
const personalizacaoMock = {
  id: '1',
  primary_color: '#007BFF',
  secondary_color: '#6C757D',
  logo_url: 'https://exemplo.com/logo.png',
  app_name: 'KingPay',
  favicon_url: 'https://exemplo.com/favicon.ico',
  empresa_id: 'empresa-1'
};

// Exemplo de configuração de empresa
const configuracaoEmpresaMock = {
  id: '1',
  nome: 'Empresa Exemplo',
  logo_url: 'https://exemplo.com/logo-empresa.png',
  cnpj: '12.345.678/0001-90',
  website: 'https://exemplo.com',
  telefone: '(11) 1234-5678',
  email_suporte: 'suporte@exemplo.com',
  endereco: 'Rua Exemplo, 123 - São Paulo, SP',
  personalizacao: personalizacaoMock,
  configuracoes: configuracoesGeraisMock
};

// Helper para simular as funções do serviço de configurações
module.exports = {
  // Função para simular a obtenção de termos de uso
  getTestTermosDeUso: async () => {
    try {
      console.log('Usando simulação para obter termos de uso');
      
      // Simula chamada de API com dados mockados
      return {
        success: true,
        data: termosDeUsoMock
      };
    } catch (error) {
      console.error('Falha ao obter termos de uso de teste:', error.message);
      throw error;
    }
  },

  // Função para simular a atualização de termos de uso
  updateTestTermosDeUso: async (termos) => {
    try {
      console.log('Usando simulação para atualizar termos de uso');
      
      if (!termos) {
        throw new Error('Conteúdo dos termos é obrigatório');
      }
      
      // Simula chamada de API com dados atualizados
      const updatedTermos = {
        ...termosDeUsoMock,
        conteudo: termos,
        data_atualizacao: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedTermos
      };
    } catch (error) {
      console.error('Falha ao atualizar termos de uso de teste:', error.message);
      throw error;
    }
  },

  // Função para simular a obtenção de configurações gerais
  getTestConfiguracoes: async () => {
    try {
      console.log('Usando simulação para obter configurações gerais');
      
      // Simula chamada de API com dados mockados
      return {
        success: true,
        data: configuracoesGeraisMock
      };
    } catch (error) {
      console.error('Falha ao obter configurações gerais de teste:', error.message);
      throw error;
    }
  },

  // Função para simular a atualização de configurações gerais
  updateTestConfiguracoes: async (configuracoes) => {
    try {
      console.log('Usando simulação para atualizar configurações gerais');
      
      if (!configuracoes) {
        throw new Error('Configurações são obrigatórias');
      }
      
      // Simula chamada de API com dados atualizados
      const updatedConfiguracoes = {
        ...configuracoesGeraisMock,
        ...configuracoes,
      };
      
      return {
        success: true,
        data: updatedConfiguracoes
      };
    } catch (error) {
      console.error('Falha ao atualizar configurações gerais de teste:', error.message);
      throw error;
    }
  },

  // Função para simular a obtenção de configurações de personalização
  getTestPersonalizacao: async () => {
    try {
      console.log('Usando simulação para obter configurações de personalização');
      
      // Simula chamada de API com dados mockados
      return {
        success: true,
        data: personalizacaoMock
      };
    } catch (error) {
      console.error('Falha ao obter configurações de personalização de teste:', error.message);
      throw error;
    }
  },

  // Função para simular a atualização de configurações de personalização
  updateTestPersonalizacao: async (personalizacao) => {
    try {
      console.log('Usando simulação para atualizar configurações de personalização');
      
      if (!personalizacao) {
        throw new Error('Configurações de personalização são obrigatórias');
      }
      
      // Valida cor primária
      if (personalizacao.primary_color && !/^#[0-9A-F]{6}$/i.test(personalizacao.primary_color)) {
        throw new Error('Formato de cor primária inválido. Use formato hexadecimal (#RRGGBB)');
      }
      
      // Valida cor secundária
      if (personalizacao.secondary_color && !/^#[0-9A-F]{6}$/i.test(personalizacao.secondary_color)) {
        throw new Error('Formato de cor secundária inválido. Use formato hexadecimal (#RRGGBB)');
      }
      
      // Simula chamada de API com dados atualizados
      const updatedPersonalizacao = {
        ...personalizacaoMock,
        ...personalizacao,
      };
      
      return {
        success: true,
        data: updatedPersonalizacao
      };
    } catch (error) {
      console.error('Falha ao atualizar configurações de personalização de teste:', error.message);
      throw error;
    }
  },

  // Função para simular a obtenção de configurações da empresa
  getTestConfiguracoesEmpresa: async () => {
    try {
      console.log('Usando simulação para obter configurações da empresa');
      
      // Simula chamada de API com dados mockados
      return {
        success: true,
        data: configuracaoEmpresaMock
      };
    } catch (error) {
      console.error('Falha ao obter configurações da empresa de teste:', error.message);
      throw error;
    }
  }
}; 