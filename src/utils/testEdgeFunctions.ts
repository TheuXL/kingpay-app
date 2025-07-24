import supabase from '../config/supabaseClient';

/**
 * Testa diferentes formatos de chamada para Edge Functions
 */
export const testEdgeFunctionFormats = async () => {
  console.log('🧪 Testando formatos de Edge Functions...\n');
  
  // Test 1: wallet
  console.log('1️⃣ Testando wallet...');
  try {
    const { data, error } = await supabase.functions.invoke('wallet', {
      method: 'GET'
    });
    if (error) {
      console.log('❌ wallet com GET:', error.message);
    } else {
      console.log('✅ wallet com GET funcionou!', data ? 'Com dados' : 'Sem dados');
    }
  } catch (e) {
    console.log('❌ wallet erro:', e);
  }

  // Test 2: dados-dashboard
  console.log('\n2️⃣ Testando dados-dashboard...');
  try {
    const { data, error } = await supabase.functions.invoke('dados-dashboard', {
      method: 'POST',
      body: {}
    });
    if (error) {
      console.log('❌ dados-dashboard:', error.message);
    } else {
      console.log('✅ dados-dashboard funcionou!', data ? 'Com dados' : 'Sem dados');
    }
  } catch (e) {
    console.log('❌ dados-dashboard erro:', e);
  }

  // Test 3: users
  console.log('\n3️⃣ Testando users...');
  const userId = '734bb2f1-ed63-4762-ae40-64809d4c13c3'; // Seu ID de usuário
  
  // Formato 3a: com path parameter
  try {
    const { data, error } = await supabase.functions.invoke(`users/${userId}`, {
      method: 'GET'
    });
    if (error) {
      console.log('❌ users/id com GET:', error.message);
    } else {
      console.log('✅ users/id funcionou!', data ? 'Com dados' : 'Sem dados');
    }
  } catch (e) {
    console.log('❌ users/id erro:', e);
  }
  
  // Formato 3b: sem método especificado
  try {
    const { data, error } = await supabase.functions.invoke(`users/${userId}`);
    if (error) {
      console.log('❌ users/id sem método:', error.message);
    } else {
      console.log('✅ users/id sem método funcionou!', data ? 'Com dados' : 'Sem dados');
    }
  } catch (e) {
    console.log('❌ users/id sem método erro:', e);
  }

  console.log('\n✅ Teste concluído!');
};

// Executar teste automaticamente se chamado diretamente
if (require.main === module) {
  testEdgeFunctionFormats();
} 