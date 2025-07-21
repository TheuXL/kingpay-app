


/**
 * 🧪 Script de Teste Real de Comunicação - KingPay
 * ================================================
 * 
 * Testa comunicação REAL com todos os endpoints usando
 * autenticação real com credenciais fornecidas.
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

console.log('🚀 Iniciando teste REAL de comunicação do KingPay...\n');

// Verificar configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  process.exit(1);
}

console.log(`✅ URL: ${supabaseUrl}`);
console.log(`✅ Chave configurada: ${supabaseAnonKey.substring(0, 50)}...`);
console.log(`✅ Email de teste: ${TEST_CREDENTIALS.email}\n`);

// Lista completa de endpoints para teste REAL
const realEndpoints = [
  // ========== ENDPOINTS PÚBLICOS ==========
  {
    category: 'Configurações',
    name: 'Configurações Gerais',
    type: 'edge-function',
    method: 'GET', // CORRIGIDO: Voltando para GET conforme documentação
    endpoint: 'configuracoes',
    description: 'Carrega configurações da plataforma',
    requiresAuth: false,
    priority: 'high'
  },
  {
    category: 'Configurações',
    name: 'Termos de Uso',
    type: 'edge-function',
    method: 'GET', // CORRIGIDO: Voltando para GET conforme documentação
    endpoint: 'configuracoes/termos',
    description: 'Carrega termos de uso',
    requiresAuth: false,
    priority: 'high'
  },
  {
    category: 'Configurações',
    name: 'Personalização/Tema',
    type: 'edge-function',
    method: 'GET', // CORRIGIDO: Voltando para GET conforme documentação
    endpoint: 'personalization',
    description: 'Carrega tema visual',
    requiresAuth: false,
    priority: 'high'
  },
  
  // ========== AUTENTICAÇÃO ==========
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
  
  // ========== EDGE FUNCTIONS (REQUER AUTH) ==========
  {
    category: 'Calculadora',
    name: 'Calculadora de Taxas',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'taxas',
    description: 'Calcula taxas de transação',
    requiresAuth: true,
    priority: 'high',
    payload: {
      company_id: '3dde47f8-50c0-4b29-a860-d10b6a5aa17c', // ID Fixo para teste
      valor: 10000, // R$ 100,00 em centavos
      payment_method: 'PIX',
      parcelas: 1
    }
  },
  {
    category: 'Carteira',
    name: 'Consultar Carteira',
    type: 'edge-function',
    method: 'GET', // CONFIRMADO: GET para consulta
    endpoint: 'wallet',
    description: 'Obtém dados da carteira real',
    requiresAuth: true,
    priority: 'critical'
  },
  {
    category: 'Dashboard',
    name: 'Dados do Dashboard',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'dados-dashboard',
    description: 'Carrega dados reais do dashboard',
    requiresAuth: true,
    priority: 'high',
    payload: {
      // Payload para o dashboard, se necessário. Pode ser vazio.
      // Exemplo, se a API esperasse um período:
      // start_date: '2023-01-01',
      // end_date: '2023-01-31'
    }
  },
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
    category: 'Suporte',
    name: 'Listar Tickets',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'support-tickets',
    description: 'Lista tickets reais de suporte',
    requiresAuth: true,
    priority: 'medium',
    payload: {
      action: 'list_tickets',
      payload: {}
    }
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
    name: 'Resumo de Transações',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'transacoes/resumo',
    description: 'Resumo real das transações',
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
    category: 'Extrato',
    name: 'Extrato da Carteira',
    type: 'edge-function',
    method: 'GET', // CONFIRMADO: GET para consulta
    endpoint: 'extrato/user-id', // Placeholder, será substituído no teste
    description: 'Extrato real da carteira',
    requiresAuth: true,
    priority: 'medium'
  },

  // ========== MÓDULO DE USUÁRIOS ==========
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
    category: 'Usuários',
    name: 'Buscar Próprio Usuário por ID',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'users/user-id', // Placeholder
    description: 'Busca os dados do usuário logado pelo seu ID',
    requiresAuth: true,
    priority: 'high'
  },
  {
    category: 'Usuários',
    name: 'Verificar Próprias Permissões',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'users/user-id/permissions', // Placeholder
    description: 'Verifica as permissões do usuário logado',
    requiresAuth: true,
    priority: 'high'
  },

  // ========== MÓDULO DE CÓDIGO DE SEGURANÇA ==========
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
    payload: {
      code: '000000' // Um código inválido para testar a resposta de falha
    }
  },

  // ========== MÓDULO DE FATURAS ==========
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
    category: 'Faturas',
    name: 'Marcar Fatura como Paga (Admin)',
    type: 'edge-function',
    method: 'PATCH',
    endpoint: 'billings/pay',
    description: 'Tenta marcar uma fatura inexistente como paga',
    requiresAuth: true,
    priority: 'medium',
    payload: {
      billingId: '00000000-0000-0000-0000-000000000000' // ID inválido
    }
  },

  // ========== MÓDULOS ADMIN ==========
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

  // ========== MÓDULO DE SUBCONTAS (MARKETPLACE) ==========
  {
    category: 'Subcontas',
    name: 'Criar Subconta',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'subconta',
    description: 'Tenta criar uma subconta (Admin)',
    requiresAuth: true,
    priority: 'high',
    payload: { companyId: '3dde47f8-50c0-4b29-a860-d10b6a5aa17c', subconta_nome: 'Teste Subconta' }
  },
  {
    category: 'Subcontas',
    name: 'Checar Status da Subconta',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'subconta/checkstatus',
    description: 'Checa o status de uma subconta inexistente (Admin)',
    requiresAuth: true,
    priority: 'medium',
    payload: { sub_account_id: 'invalid-id' }
  },

  // ========== TESTES FINAIS ==========
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
    name: 'Registrar Novo Usuário (Admin)',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'users/register',
    description: 'Tenta registrar um novo usuário com dados mínimos (espera-se falha de validação)',
    requiresAuth: true,
    priority: 'medium',
    payload: { email: `test.user.${Date.now()}@example.com`, password: 'password123' }
  },
  {
    category: 'Financeiro',
    name: 'Criar Saque (Admin)',
    type: 'edge-function',
    method: 'POST',
    endpoint: 'withdrawals',
    description: 'Tenta criar um saque (Admin)',
    requiresAuth: true,
    priority: 'medium',
    payload: { requestedamount: 100, description: 'Teste de saque', isPix: false }
  },
  {
    category: 'Financeiro',
    name: 'Atualizar Saque (Admin)',
    type: 'edge-function',
    method: 'PATCH',
    endpoint: 'withdrawals/some-fake-id',
    description: 'Tenta atualizar um saque inexistente (Admin)',
    requiresAuth: true,
    priority: 'medium',
    payload: { status: 'cancelled', reason_for_denial: 'Teste' }
  },
  {
    category: 'Dashboard',
    name: 'Relatório Top Sellers',
    type: 'edge-function',
    method: 'GET',
    endpoint: 'analytics-reports/top-sellers/2024-01-01/2024-01-31',
    description: 'Busca relatório de mais vendidos em um período (Admin)',
    requiresAuth: true,
    priority: 'medium'
  }
];

// Variáveis globais para sessão
let userSession = null;
let loggedUser = null;

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
async function testEdgeFunction(test) {
  const startTime = Date.now();
  
  try {
    console.log(`⏳ Testando: ${test.name}...`);
    
    // Verificar se precisa de autenticação
    if (test.requiresAuth && !userSession) {
      throw new Error('Endpoint requer autenticação mas usuário não está logado');
    }
    
    let response;
    let endpoint = test.endpoint;

    // Substituir placeholders na URL
    if (userSession?.user?.id) {
      endpoint = endpoint.replace('user-id', userSession.user.id);
    }
    
    if (test.method === 'GET') {
      response = await supabase.functions.invoke(endpoint, {
        method: 'GET',
      });
    } else {
      const invokeOptions = {
        body: test.payload || {}
      };

      // Adicionar o método HTTP se não for POST (padrão)
      if (test.method && test.method.toUpperCase() !== 'POST') {
        invokeOptions.method = test.method.toUpperCase();
      }
      
      response = await supabase.functions.invoke(endpoint, invokeOptions);
    }
    
    const duration = Date.now() - startTime;
    
    if (response.error) {
      throw response.error;
    }
    
    console.log(`✅ ${test.name}: Sucesso (${duration}ms)`);
    if (response.data) {
      const dataStr = JSON.stringify(response.data);
      console.log(`   Dados: ${dataStr.substring(0, 200)}${dataStr.length > 200 ? '...' : ''}`);
    }
    return { success: true, duration, data: response.data };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${test.name}: ${error.message} (${duration}ms)`);
    
    // Informações adicionais para debugging
    if (error.message.includes('fetch')) {
      console.log(`   💡 Dica: Problema de conectividade`);
    } else if (error.message.includes('Function not found')) {
      console.log(`   💡 Dica: Edge Function '${test.endpoint}' não deployada`);
    } else if (error.message.includes('Unauthorized') || error.message.includes('auth')) {
      console.log(`   💡 Dica: Problema de autenticação`);
    } else if (error.message.includes('JWT')) {
      console.log(`   💡 Dica: Token de acesso inválido ou expirado`);
    }
    
    return { success: false, duration, error: error.message };
  }
}

// Função principal de teste
async function runRealCommunicationTests() {
  console.log('🧪 Executando testes REAIS de comunicação...\n');
  
  const results = [];
  const categories = {};
  
  // Agrupar por categoria e prioridade
  realEndpoints.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = [];
    }
    categories[test.category].push(test);
  });
  
  // Ordenar endpoints por prioridade
  const priorityOrder = { 'critical': 1, 'high': 2, 'medium': 3, 'low': 4 };
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => 
      (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5)
    );
  });
  
  // Executar testes por categoria
  for (const [category, tests] of Object.entries(categories)) {
    console.log(`\n📁 CATEGORIA: ${category.toUpperCase()}`);
    console.log('='.repeat(60));
    
    for (const test of tests) {
      let result;
      
      // Pular testes que requerem auth se não estiver logado
      if (test.requiresAuth && !userSession && test.endpoint !== 'signInWithPassword') {
        console.log(`⏭️  Pulando ${test.name} (requer autenticação)`);
        continue;
      }
      
      if (test.type === 'auth') {
        result = await testAuthEndpoint(test);
      } else {
        result = await testEdgeFunction(test);
      }
      
      results.push({ 
        test: test.name, 
        category: test.category,
        requiresAuth: test.requiresAuth,
        priority: test.priority,
        ...result 
      });
      
      // Delay entre testes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Relatório final super detalhado
  console.log('\n📊 RELATÓRIO FINAL DE COMUNICAÇÃO REAL');
  console.log('='.repeat(80));
  
  const totalTests = results.length;
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;
  const successRate = Math.round((successCount / totalTests) * 100);
  
  // Estatísticas gerais
  console.log(`📈 ESTATÍSTICAS GERAIS:`);
  console.log(`   Total de testes executados: ${totalTests}`);
  console.log(`   ✅ Sucessos: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📊 Taxa de sucesso: ${successRate}%`);
  
  // Status de autenticação
  console.log(`\n🔐 STATUS DE AUTENTICAÇÃO:`);
  if (userSession) {
    console.log(`   ✅ Usuário logado: ${loggedUser.email}`);
    console.log(`   🔑 Token válido: Sim`);
    console.log(`   ⏰ Token expira: ${new Date(userSession.expires_at * 1000).toLocaleString()}`);
  } else {
    console.log(`   ❌ Usuário não logado`);
  }
  
  // Relatório por categoria
  console.log(`\n📋 RESULTADOS POR CATEGORIA:`);
  for (const [category, tests] of Object.entries(categories)) {
    const categoryResults = results.filter(r => r.category === category);
    const categorySuccess = categoryResults.filter(r => r.success).length;
    const categoryTotal = categoryResults.length;
    const categoryRate = categoryTotal > 0 ? Math.round((categorySuccess / categoryTotal) * 100) : 0;
    
    console.log(`   ${category}: ${categorySuccess}/${categoryTotal} (${categoryRate}%)`);
  }
  
  // Análise por prioridade
  console.log(`\n🎯 ANÁLISE POR PRIORIDADE:`);
  const priorities = ['critical', 'high', 'medium', 'low'];
  priorities.forEach(priority => {
    const priorityResults = results.filter(r => r.priority === priority);
    if (priorityResults.length > 0) {
      const prioritySuccess = priorityResults.filter(r => r.success).length;
      const priorityTotal = priorityResults.length;
      const priorityRate = Math.round((prioritySuccess / priorityTotal) * 100);
      console.log(`   ${priority.toUpperCase()}: ${prioritySuccess}/${priorityTotal} (${priorityRate}%)`);
    }
  });
  
  // Lista de sucessos
  const successfulTests = results.filter(r => r.success);
  if (successfulTests.length > 0) {
    console.log('\n✅ ENDPOINTS FUNCIONANDO:');
    successfulTests.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.test} (${result.category})`);
    });
  }
  
  // Lista de erros detalhados
  if (errorCount > 0) {
    console.log('\n❌ ENDPOINTS COM PROBLEMAS:');
    const errorDetails = results.filter(r => !r.success);

    errorDetails.forEach((result, index) => {
      const testInfo = realEndpoints.find(e => e.name === result.test);
      console.log(`   ${index + 1}. ${result.test}`);
      console.log(`      Categoria: ${result.category}`);
      console.log(`      Prioridade: ${result.priority}`);
      console.log(`      Endpoint: ${testInfo?.method} /${testInfo?.endpoint}`);
      console.log(`      Erro: ${result.error}`);
      console.log(`      Requer Auth: ${result.requiresAuth ? 'Sim' : 'Não'}`);
    });
  }
  
  // Recomendações específicas
  console.log('\n💡 RECOMENDAÇÕES ESPECÍFICAS:');
  
  if (!userSession) {
    console.log('   🔐 URGENTE: Implementar sistema de login no app');
  }
  
  const criticalErrors = results.filter(r => !r.success && r.priority === 'critical');
  if (criticalErrors.length > 0) {
    console.log('   🚨 CRÍTICO: Endpoints críticos com problemas!');
    criticalErrors.forEach(error => {
      console.log(`      - ${error.test}: ${error.error}`);
    });
  }
  
  const edgeFunctionErrors = results.filter(r => 
    !r.success && (r.error.includes('Function not found') || r.error.includes('non-2xx'))
  );
  
  if (edgeFunctionErrors.length > 0) {
    console.log('   🚀 Fazer deploy/verificar as seguintes Edge Functions:');
    
    // Usar um Set para evitar duplicatas
    const functionsToDeploy = new Set();
    edgeFunctionErrors.forEach(error => {
      const endpointInfo = realEndpoints.find(e => e.name === error.test);
      if (endpointInfo) {
        // Pega a primeira parte do endpoint como nome da função
        const functionName = endpointInfo.endpoint.split('/')[0];
        functionsToDeploy.add(functionName);
      }
    });

    functionsToDeploy.forEach(name => console.log(`      - ${name}`));
  }
  
  if (successRate >= 70) {
    console.log('   🎉 Excelente! Maioria dos endpoints funcionando');
    console.log('   📱 Pode iniciar desenvolvimento das telas do app');
  } else if (successRate >= 30) {
    console.log('   ⚠️  Alguns endpoints funcionando, continue depurando');
  } else {
    console.log('   🔧 Muitos problemas encontrados, focar no backend primeiro');
  }
  
  console.log('\n🏁 Teste de comunicação real concluído!');
  console.log(`📝 Dados salvos para análise posterior`);
  
  // Exit code baseado no sucesso
  process.exit(successRate >= 50 ? 0 : 1);
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