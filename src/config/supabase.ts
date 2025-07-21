// Configurações do Supabase - Usando valores diretos para resolver problemas de conectividade

const SUPABASE_URL = 'https://slsikrvjbpblioyinsxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsc2lrcnZqYnBibGlveWluc3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjgwNjksImV4cCI6MjA2Mzg0NDA2OX0.WqkSEVq2FgPXupHKbXcm04H3CJ2VHj7M8a7EUELw7OQ';

console.log('✅ Supabase configurado:', {
  url: SUPABASE_URL,
  keyConfigured: '✅ Chave configurada'
});

export { SUPABASE_ANON_KEY, SUPABASE_URL };
