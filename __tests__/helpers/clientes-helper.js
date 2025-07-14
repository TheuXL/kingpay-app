const { clientesService } = require('../../src/services/clientesService');

// Exemplos de clientes para testes
const clientesMock = [
  {
    id: '1',
    nome: 'Empresa ABC Ltda',
    taxId: '12345678000190',
    email: 'contato@empresaabc.com',
    telefone: '(11) 3456-7890',
    tipo: 'PJ',
    status: 'ativo',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      complemento: 'Sala 123',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
      pais: 'Brasil'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    limite_credito: 50000,
    empresa_id: 'empresa-1'
  },
  {
    id: '2',
    nome: 'João da Silva',
    taxId: '12345678900',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    tipo: 'PF',
    status: 'ativo',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Jardim Primavera',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04567-890',
      pais: 'Brasil'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    limite_credito: 5000,
    empresa_id: 'empresa-1'
  },
  {
    id: '3',
    nome: 'Comércio XYZ Ltda',
    taxId: '98765432000110',
    email: 'contato@comercioxyz.com',
    telefone: '(21) 2345-6789',
    tipo: 'PJ',
    status: 'inativo',
    endereco: {
      logradouro: 'Av. Rio Branco',
      numero: '500',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20040-002',
      pais: 'Brasil'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    limite_credito: 30000,
    empresa_id: 'empresa-2'
  }
];

// Rotas disponíveis para teste
const rotasMock = [
  '/functions/v1/clientes',
  '/functions/v1/clientes/:id',
  '/functions/v1/configuracoes',
  '/functions/v1/pixelTracker',
  '/functions/v1/personalization'
];

// Helper para simular as funções do serviço de clientes
module.exports = {
  /**
   * Função para simular a obtenção de clientes
   */
  getTestClientes: async (params) => {
    try {
      console.log('Usando simulação para obter clientes');
      
      // Filtrar por taxId se fornecido
      let filteredClientes = [...clientesMock];
      
      if (params?.taxId) {
        filteredClientes = filteredClientes.filter(cliente => 
          cliente.taxId.includes(params.taxId)
        );
      }
      
      if (params?.nome) {
        filteredClientes = filteredClientes.filter(cliente => 
          cliente.nome.toLowerCase().includes(params.nome.toLowerCase())
        );
      }
      
      if (params?.email) {
        filteredClientes = filteredClientes.filter(cliente => 
          cliente.email && cliente.email.toLowerCase().includes(params.email.toLowerCase())
        );
      }
      
      if (params?.status) {
        filteredClientes = filteredClientes.filter(cliente => 
          cliente.status === params.status
        );
      }
      
      // Implementar paginação
      const limit = params?.limit || 10;
      const offset = params?.offset || 0;
      const paginatedClientes = filteredClientes.slice(offset, offset + limit);
      
      // Simula resposta paginada
      return {
        success: true,
        data: {
          items: paginatedClientes,
          total: filteredClientes.length,
          limit,
          offset,
          hasMore: offset + limit < filteredClientes.length
        }
      };
    } catch (error) {
      console.error('Falha ao obter clientes de teste:', error.message);
      throw error;
    }
  },

  /**
   * Função para simular a obtenção de um cliente específico pelo ID
   */
  getTestClienteById: async (id) => {
    try {
      console.log(`Usando simulação para obter cliente com ID ${id}`);
      
      if (!id) {
        throw new Error('ID do cliente é obrigatório');
      }
      
      const cliente = clientesMock.find(c => c.id === id);
      
      if (!cliente) {
        throw new Error(`Cliente com ID ${id} não encontrado`);
      }
      
      return {
        success: true,
        data: cliente
      };
    } catch (error) {
      console.error(`Falha ao obter cliente de teste com ID ${id}:`, error.message);
      throw error;
    }
  },

  /**
   * Função para simular a criação de um cliente
   */
  createTestCliente: async (clienteData) => {
    try {
      console.log('Usando simulação para criar cliente');
      
      // Validações
      if (!clienteData) {
        throw new Error('Dados do cliente são obrigatórios');
      }
      
      if (!clienteData.nome) {
        throw new Error('Nome do cliente é obrigatório');
      }
      
      if (!clienteData.taxId) {
        throw new Error('TaxID (CPF/CNPJ) é obrigatório');
      }
      
      // Validar formato do TaxID
      if (clienteData.tipo === 'PF' && clienteData.taxId.length !== 11) {
        throw new Error('CPF deve ter 11 dígitos');
      }
      
      if (clienteData.tipo === 'PJ' && clienteData.taxId.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }
      
      // Verificar se já existe cliente com o mesmo TaxID
      const existingCliente = clientesMock.find(c => c.taxId === clienteData.taxId);
      if (existingCliente) {
        throw new Error(`Já existe um cliente com o TaxID ${clienteData.taxId}`);
      }
      
      // Simula criação de novo cliente
      const newCliente = {
        id: `new-${Date.now()}`,
        ...clienteData,
        status: clienteData.status || 'ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        empresa_id: 'empresa-1'
      };
      
      return {
        success: true,
        data: newCliente
      };
    } catch (error) {
      console.error('Falha ao criar cliente de teste:', error.message);
      throw error;
    }
  },

  /**
   * Função para simular a atualização de um cliente
   */
  updateTestCliente: async (clienteData) => {
    try {
      console.log('Usando simulação para atualizar cliente');
      
      // Validações
      if (!clienteData) {
        throw new Error('Dados do cliente são obrigatórios');
      }
      
      if (!clienteData.id) {
        throw new Error('ID do cliente é obrigatório');
      }
      
      // Busca o cliente existente
      const existingClienteIndex = clientesMock.findIndex(c => c.id === clienteData.id);
      
      if (existingClienteIndex === -1) {
        throw new Error(`Cliente com ID ${clienteData.id} não encontrado`);
      }
      
      // Atualiza os campos fornecidos
      const existingCliente = clientesMock[existingClienteIndex];
      const updatedCliente = {
        ...existingCliente,
        ...clienteData,
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedCliente
      };
    } catch (error) {
      console.error('Falha ao atualizar cliente de teste:', error.message);
      throw error;
    }
  },

  /**
   * Função para simular a obtenção de rotas
   */
  getTestRotas: async () => {
    try {
      console.log('Usando simulação para obter rotas');
      
      return {
        success: true,
        data: rotasMock
      };
    } catch (error) {
      console.error('Falha ao obter rotas de teste:', error.message);
      throw error;
    }
  }
}; 