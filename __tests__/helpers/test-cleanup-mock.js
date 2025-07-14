// Este arquivo simula um endpoint de limpeza de testes que seria implementado no backend
// Para testes reais, este endpoint deve ser implementado no backend

const { createClient } = require('@supabase/supabase-js');

// Configurar cliente Supabase para testes
const supabaseUrl = process.env.SUPABASE_URL || 'https://ntswqzoftcvzsxwbmsef.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c3dxem9mdGN2enN4d2Jtc2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzkyODUsImV4cCI6MjA2NDExNTI4NX0.-UUHbgSHmEd86qgdcwgZ5p6sjBkBOPKNWls9dMaDsgs';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mock para o endpoint de limpeza de saques de teste
// Este endpoint seria implementado no backend real
async function cleanupTestWithdrawals(withdrawalIds) {
  console.log(`[MOCK] Limpando saques de teste: ${withdrawalIds.join(', ')}`);
  
  // Em um cenário real, aqui seria feita a exclusão dos saques de teste
  // Mas como é apenas um mock, apenas logamos a ação
  
  return { success: true };
}

module.exports = {
  cleanupTestWithdrawals
}; 