/**
 * 🧪 Script de Teste Real de Comunicação - KingPay
 * ================================================
 * 
 * Testa a comunicação REAL com os 39 endpoints essenciais para a funcionalidade do App.
 * Esta lista foi curada e definida como a base funcional em 23/07/2025.
 * 
 * Execute: npm run test:real
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configurações reais do Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Mock do storage em memória para o Supabase
const memoryStorage = {};

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => memoryStorage[key] || null,
      setItem: (key, value) => { memoryStorage[key] = value; },
      removeItem: (key) => { delete memoryStorage[key]; },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});

// Credenciais reais para teste
const TEST_CREDENTIALS = {
  email: 'matheuss.devv@gmail.com',
  password: '88338391Mt@'
};

console.log('🚀 Iniciando teste REAL de comunicação do KingPay (Endpoints Funcionais)...\n');

// Verificar configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  process.exit(1);
}

console.log(`✅ URL: ${supabaseUrl}`);
console.log(`✅ Chave configurada: ${supabaseAnonKey.substring(0, 50)}...`);
console.log(`✅ Email de teste: ${TEST_CREDENTIALS.email}\n`);

// Lista dos 39 endpoints essenciais e funcionais
const functionalEndpoints = [
  // ========== AUTENTICAÇÃO E SESSÃO ==========
  {
    category: 'Autenticação',
    name: 'Login Real',
    type: 'auth',
    method: 'POST',
    endpoint: 'signInWithPassword',
    description: 'Login com credenciais reais',
    requiresAuth: false,
    priority: 'critical'
  },
  {
    category: 'Autenticação',
    name: 'Obter Usuário Logado',
    type: 'auth',
    method: 'GET',
    endpoint: 'getUser',
    description: 'Obtém dados do usuário logado',
    requiresAuth: true,
    priority: 'high'
  },
  
  // ========== DASHBOARD E RELATÓRIOS ==========
  {
    category: 'Dashboard',
    name: 'Dados do Dashboard',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'dados-dashboard',
    description: 'Carrega dados reais do dashboard',
    requiresAuth: true,
    priority: 'high',
    payload: {} // Payload será adicionado dinamicamente com as datas
  },
  {
    category: 'Dashboard',
    name: 'Dados do Gráfico do Dashboard',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'dados-dashboard/grafico',
    description: 'Carrega dados para o gráfico do dashboard',
    requiresAuth: true,
    priority: 'high',
    payload: {}
  },
  {
    category: 'Dashboard',
    name: 'Top Produtos do Dashboard',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'dados-dashboard/top-produtos',
    description: 'Busca os produtos mais vendidos',
    requiresAuth: true,
    priority: 'medium',
    payload: {}
  },
  {
    category: 'Dashboard',
    name: 'Infos Adicionais do Dashboard',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'dados-dashboard/infos-adicionais',
    description: 'Busca informações de métodos de pagamento e parcelas',
    requiresAuth: true,
    priority: 'medium',
    payload: {}
  },
  {
    category: 'Dashboard',
    name: 'Providers do Dashboard',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'dados-dashboard/providers',
    description: 'Busca os providers com melhor desempenho',
    requiresAuth: true,
    priority: 'medium',
    payload: {}
  },
  {
    category: 'Dashboard',
    name: 'Acquirers do Dashboard',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'dados-dashboard/acquirer',
    description: 'Busca os acquirers com melhor desempenho',
    requiresAuth: true,
    priority: 'medium',
    payload: {}
  },
  {
    category: 'Dashboard',
    name: 'Faturamento Whitelabel',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'faturamento-whitelabel',
    description: 'Busca dados de faturamento para whitelabel',
    requiresAuth: true,
    priority: 'medium',
    payload: {}
  },
  {
    category: 'Dashboard',
    name: 'Financeiro Whitelabel',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'whitelabel-financeiro',
    description: 'Obtém dados financeiros consolidados para o whitelabel (Admin)',
    requiresAuth: true,
    priority: 'medium',
    payload: {}
  },

  // ========== LISTAGENS GERAIS (LEITURA) ==========
  {
    category: 'Clientes',
    name: 'Listar Clientes',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'clientes',
    description: 'Lista clientes reais do CRM',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Links',
    name: 'Links de Pagamento',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'link-pagamentos',
    description: 'Lista links reais de pagamento',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'PIX',
    name: 'Chaves PIX',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'pix-key',
    description: 'Lista chaves PIX reais',
    requiresAuth: true,
    priority: 'high'
  },
  {
    category: 'Alertas',
    name: 'Listar Alertas',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'alerts',
    description: 'Lista alertas reais do usuário',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Empresas',
    name: 'Dados da Empresa',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'companies',
    description: 'Lista empresas (ou dados da empresa do usuário)',
    requiresAuth: true,
    priority: 'high'
  },
  {
    category: 'Transações',
    name: 'Histórico de Transações',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'transacoes',
    description: 'Lista transações reais',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Transações',
    name: 'Resumo de Transações',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'transacoes/resumo',
    description: 'Resumo real das transações',
    requiresAuth: true,
    priority: 'high'
  },
  {
    category: 'Extrato',
    name: 'Extrato da Carteira',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'extrato/user-id', // Placeholder
    description: 'Extrato real da carteira',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Financeiro',
    name: 'Listar Saques (Admin)',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'saques',
    description: 'Lista as solicitações de saque (Admin)',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Financeiro',
    name: 'Listar Antecipações (Admin)',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'antecipacoes/anticipations',
    description: 'Lista as solicitações de antecipação (Admin)',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Usuários',
    name: 'Listar Usuários (Admin)',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'users',
    description: 'Lista todos os usuários (requer permissão de admin)',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Faturas',
    name: 'Listar Faturas',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'billings',
    description: 'Lista as faturas do usuário logado',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: BaaS',
    name: 'Listar Provedores BaaS',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'baas',
    description: 'Lista os provedores de Banking as a Service (Admin)',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: Adquirentes',
    name: 'Listar Adquirentes',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'acquirers',
    description: 'Lista os adquirentes/gateways de pagamento (Admin)',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: Logs',
    name: 'Listar Logs de Auditoria',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'audit-log',
    description: 'Lista os logs de auditoria do sistema (Admin)',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: Padrões',
    name: 'Listar Configurações Padrão',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'standard',
    description: 'Lista os templates de configuração padrão (Admin)',
    requiresAuth: true,
    priority: 'medium'
  },

  // ========== AÇÕES DE ESCRITA (POST/PATCH) ==========
  {
    category: 'Código de Segurança',
    name: 'Gerar Código de Segurança',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'validation-codes/generate',
    description: 'Gera um código de segurança para o usuário logado',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Código de Segurança',
    name: 'Validar Código de Segurança (Inválido)',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'validation-codes/validate',
    description: 'Tenta validar um código de segurança заведомо inválido',
    requiresAuth: true,
    priority: 'medium',
    payload: { code: '000000' }
  },
  {
    category: 'Suporte',
    name: 'Listar/Criar Tickets',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'support-tickets',
    description: 'Endpoint para listar ou criar tickets de suporte',
    requiresAuth: true,
    priority: 'medium',
    payload: { action: 'list_tickets', payload: {} } // Teste default: listar
  },
  {
    category: 'Links',
    name: 'Criar Link de Pagamento',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'link-pagamentos',
    description: 'Cria um novo link de pagamento',
    requiresAuth: true,
    priority: 'high',
    payload: { nome: 'Produto de Teste Funcional', valor: 150.50, formas_de_pagamento: ['pix', 'cartao'], max_parcelamento: 3, solicitar_endereco: false, ativo: true }
  },
  {
    category: 'Carteira',
    name: 'Remover Saldo (Admin)',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'wallet/remove-balance',
    description: 'Remove um valor do saldo de um usuário (Admin)',
    requiresAuth: true,
    priority: 'critical',
    payload: { userId: 'user-id-placeholder', amount: 1, type: 'pix', motivo: 'Ajuste de teste via script' }
  },
  {
    category: 'Carteira',
    name: 'Adicionar Saldo (Admin)',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'wallet/balance-management',
    description: 'Adiciona um valor ao saldo de um usuário (Admin)',
    requiresAuth: true,
    priority: 'critical',
    payload: { userId: 'user-id-placeholder', amount: 1, type: 'pix', motivo: 'Ajuste de teste via script', operation: 'add' }
  },
  
  // ========== MÓDULOS ADMIN (DETALHES E AÇÕES) ==========
  {
    category: 'Admin: BaaS',
    name: 'Detalhes do Provedor BaaS',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'baas/baas-id', // Placeholder
    description: 'Busca detalhes de um provedor BaaS',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: BaaS',
    name: 'Taxas do Provedor BaaS',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'baas/baas-id/taxas', // Placeholder
    description: 'Busca taxas de um provedor BaaS',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: BaaS',
    name: 'Ativar/Desativar Provedor BaaS',
    type: 'edge-function',
    method: 'PATCH',
    endpoint: 'baas/baas-id/active', // Placeholder
    description: 'Ativa ou desativa um provedor BaaS',
    requiresAuth: true,
    priority: 'medium',
    payload: { active: false }
  },
  {
    category: 'Admin: Adquirentes',
    name: 'Detalhes do Adquirente',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'acquirers/acquirer-id', // Placeholder
    description: 'Busca detalhes de um adquirente',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: Adquirentes',
    name: 'Taxas do Adquirente',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'acquirers/acquirer-id/taxas', // Placeholder
    description: 'Busca taxas de um adquirente',
    requiresAuth: true,
    priority: 'medium'
  },
  {
    category: 'Admin: Adquirentes',
    name: 'Ativar/Desativar Adquirente',
    type: 'edge-function',
    method: 'PATCH',
    endpoint: 'acquirers/acquirer-id/active', // Placeholder
    description: 'Ativa ou desativa um adquirente',
    requiresAuth: true,
    priority: 'medium',
    payload: { active: false }
  },

  // ========== CALCULADORA ==========
  {
    category: 'Calculadora',
    name: 'Calculadora de Taxas',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'taxas',
    payload: {
      company_id: 'company-id-placeholder',
      valor: 10000,
      payment_method: 'PIX',
      parcelas: 1
    },
    description: 'Calcula as taxas para uma transação',
    requiresAuth: true,
    priority: 'high'
  },
];

// Variáveis globais para sessão
let userSession = null;
let loggedUser = null;
let firstBaasId = null;
let firstAcquirerId = null;
let userCompanyId = null; // Mantido para o caso de algum endpoint precisar no futuro

// Função para fazer login real
async function performRealLogin() {
  const startTime = Date.now();
  
  try {
    console.log(`🔐 Fazendo login real com ${TEST_CREDENTIALS.email}...`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_CREDENTIALS.email,
      password: TEST_CREDENTIALS.password,
    });
    
    const duration = Date.now() - startTime;
    
    if (error) {
      throw error;
    }
    
    if (!data.session) {
      throw new Error('Login não retornou uma sessão válida');
    }
    
    userSession = data.session;
    loggedUser = data.user;
    
    console.log(`✅ Login realizado com sucesso! (${duration}ms)`);
    console.log(`   👤 Usuário: ${loggedUser.email}`);
    console.log(`   🔑 Token: ${userSession.access_token.substring(0, 30)}...`);
    console.log(`   ⏰ Expira em: ${new Date(userSession.expires_at * 1000).toLocaleString()}`);
    
    return { success: true, duration, data: { user: loggedUser, session: userSession } };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ Erro no login: ${error.message} (${duration}ms)`);
    return { success: false, duration, error: error.message };
  }
}

// Função para testar endpoint de autenticação
async function testAuthEndpoint(test) {
  const startTime = Date.now();
  
  try {
    console.log(`⏳ Testando: ${test.name}...`);
    
    let response;
    
    if (test.endpoint === 'signInWithPassword') {
      return await performRealLogin();
    } else if (test.endpoint === 'getUser') {
      response = await supabase.auth.getUser();
    }
    
    const duration = Date.now() - startTime;
    
    if (response.error) {
      throw response.error;
    }
    
    console.log(`✅ ${test.name}: Sucesso (${duration}ms)`);
    if (response.data) {
      const dataStr = JSON.stringify(response.data);
      console.log(`   Dados: ${dataStr.substring(0, 150)}${dataStr.length > 150 ? '...' : ''}`);
    }
    return { success: true, duration, data: response.data };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${test.name}: ${error.message} (${duration}ms)`);
    return { success: false, duration, error: error.message };
  }
}

// Função para testar Edge Function
async function testEdgeFunction(test, index, total) {
  const startTime = Date.now();
  try {
    let endpoint = test.endpoint;
    let finalPayload = { ...(test.payload || {}) };

    // Para todos os endpoints de Dashboard com método POST, as datas vão na URL.
    if (test.category === 'Dashboard' && test.method === 'POST') {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      endpoint = `${test.endpoint}?start_date=${startDate}&end_date=${endDate}`;
      finalPayload = {}; // Corpo da requisição fica vazio
    }

    // --- Substituição de Placeholders ---
    if (userSession?.user?.id) {
        const userId = userSession.user.id;
        endpoint = endpoint.replace(/user-id-placeholder/g, userId);
        if (finalPayload.userId) {
            finalPayload.userId = userId;
        }
        if (endpoint.includes('extrato/user-id')) {
            endpoint = endpoint.replace('user-id', userId);
        }
    }

    if (userCompanyId) {
        if (finalPayload.company_id) {
            finalPayload.company_id = userCompanyId;
        }
    }

    if (firstBaasId) {
        endpoint = endpoint.replace(/baas-id/g, firstBaasId);
    }
    if (firstAcquirerId) {
        endpoint = endpoint.replace(/acquirer-id/g, firstAcquirerId);
    }
    // --- Fim da Substituição ---

    const invokeOptions = {
        method: test.method,
        body: Object.keys(finalPayload).length > 0 ? finalPayload : undefined,
    };
    
    const response = await supabase.functions.invoke(endpoint, invokeOptions);
    const duration = Date.now() - startTime;
    
    if (response.error) {
      throw response.error;
    }
    
    // Capturar dados dinâmicos para testes subsequentes
    if (test.name === 'Listar Provedores BaaS' && response.data?.success && response.data?.Baas?.length > 0) {
        firstBaasId = response.data.Baas[0].id;
        console.log(`   🏦 ID do primeiro provedor BaaS capturado: ${firstBaasId}`);
    }
    if (test.name === 'Listar Adquirentes' && response.data?.success && response.data?.acquirers?.length > 0) {
        firstAcquirerId = response.data.acquirers[0].id;
        console.log(`   💳 ID do primeiro adquirente capturado: ${firstAcquirerId}`);
    }
    if (test.name === 'Dados da Empresa' && response.data?.success && response.data?.companies?.length > 0) {
        userCompanyId = response.data.companies[0].id;
        console.log(`   🏢 ID da empresa capturado: ${userCompanyId}`);
    }
    
    console.log(`✅ ${test.name}: Sucesso (${duration}ms)`);
    if (response.data) {
      const dataStr = JSON.stringify(response.data);
      console.log(`   Dados: ${dataStr.substring(0, 200)}${dataStr.length > 200 ? '...' : ''}`);
    }
    return { success: true, duration, data: response.data };
    
  } catch (error) {
    const duration = Date.now() - (error.startTime || startTime);
    const errorMessage = error.message.includes('Function not found') 
      ? `Edge Function '${test.endpoint}' não encontrada. Verifique o nome e se foi deployada.`
      : error.message;
    console.error(`❌ ${test.name}: ${errorMessage} (${duration}ms)`);
    return { success: false, test, error: errorMessage, duration };
  }
}

// Função principal de teste
async function runRealCommunicationTests() {
  console.log('🧪 Executando testes REAIS de comunicação (Apenas Endpoints Funcionais)...\\n');
  
  const results = [];
  const categories = {};
  
  // Agrupar por categoria
  functionalEndpoints.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = [];
    }
    categories[test.category].push(test);
  });
  
  // Executar testes por categoria
  for (const [category, tests] of Object.entries(categories)) {
    console.log(`\\n📁 CATEGORIA: ${category.toUpperCase()}`);
    console.log('='.repeat(60));
    
    for (const test of tests) {
      let result;
      
      if (test.requiresAuth && !userSession && test.endpoint !== 'signInWithPassword') {
        console.log(`⏭️  Pulando ${test.name} (requer autenticação)`);
        continue;
      }
      
      if (test.type === 'auth') {
        result = await testAuthEndpoint(test);
      } else {
        result = await testEdgeFunction(test, tests.indexOf(test), tests.length);
      }
      
      results.push({ 
        test: test.name, 
        category: test.category,
        priority: test.priority,
        ...result 
      });
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Delay menor
    }
  }
  
  // Relatório final
  console.log('\\n📊 RELATÓRIO FINAL (Endpoints Funcionais)');
  console.log('='.repeat(80));
  
  const totalTests = results.length;
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;
  const successRate = totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 100;
  
  console.log(`📈 ESTATÍSTICAS GERAIS:`);
  console.log(`   Total de testes executados: ${totalTests}`);
  console.log(`   ✅ Sucessos: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📊 Taxa de sucesso: ${successRate}%`);
  
  if (errorCount > 0) {
    console.log('\\n❌ ENDPOINTS COM PROBLEMAS (DEVERIAM FUNCIONAR):');
    const errorDetails = results.filter(r => !r.success);

    errorDetails.forEach((result, index) => {
      const testInfo = functionalEndpoints.find(e => e.name === result.test);
      console.log(`   ${index + 1}. ${result.test}`);
      console.log(`      Categoria: ${result.category}`);
      console.log(`      Endpoint: ${testInfo?.method} /${testInfo?.endpoint}`);
      console.log(`      Erro: ${result.error}`);
    });
    console.log('   🚨 ATENÇÃO: Endpoints que antes funcionavam agora estão falhando. Verifique regressões no backend.');
  } else {
    console.log('\\n✅ Todos os 40 endpoints funcionais confirmados com sucesso!');
  }
  
  console.log('\\n🏁 Teste de comunicação real concluído!');
  
  process.exit(errorCount > 0 ? 1 : 0);
}

// Tratamento de erros globais
process.on('unhandledRejection', (error) => {
  console.error('💥 Erro não tratado:', error);
  process.exit(1);
});

// Executar testes
runRealCommunicationTests().catch(error => {
  console.error('💥 Erro fatal durante os testes:', error);
  process.exit(1);
});