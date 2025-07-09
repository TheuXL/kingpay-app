const { authService } = require('../../src/services/authService');
const { supabase } = require('../../src/services/supabase');

// Armazenar a sessão para reutilização
let cachedSession = null;
let lastLoginTime = 0;
const LOGIN_TIMEOUT = 3600000; // 1 hora em milissegundos

/**
 * Helper para autenticação nos testes
 */
module.exports = {
  /**
   * Fazer login para testes e armazenar a sessão
   * @returns {Promise<Object>} Dados da sessão
   */
  loginForTests: async function() {
    try {
      // Verificar se já temos uma sessão válida
      const currentTime = Date.now();
      if (cachedSession && (currentTime - lastLoginTime < LOGIN_TIMEOUT)) {
        console.log('Usando sessão de login em cache');
        return cachedSession;
      }
      
      // Credenciais de teste
      const email = 'matheuss.devv@gmail.com';
      const password = '88338391Mt@';
      
      // Fazer login
      const response = await authService.login(email, password);
      
      if (response.error) {
        throw new Error(`Erro ao fazer login para testes: ${JSON.stringify(response.error)}`);
      }
      
      console.log('Login de teste realizado com sucesso');
      
      // Armazenar a sessão em cache
      cachedSession = response;
      lastLoginTime = currentTime;
      
      return response;
    } catch (error) {
      console.error('Falha na autenticação para testes:', error);
      throw error;
    }
  },
  
  /**
   * Obter a sessão atual do usuário
   * @returns {Promise<Object>} Dados da sessão
   */
  getCurrentSession: async function() {
    try {
      // Verificar se já temos uma sessão em cache
      if (cachedSession) {
        return cachedSession;
      }
      
      // Tentar obter a sessão atual
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(`Erro ao obter sessão: ${error.message}`);
      }
      
      if (data && data.session) {
        cachedSession = data;
        lastLoginTime = Date.now();
        return data;
      }
      
      // Se não tiver sessão, fazer login
      return await this.loginForTests();
    } catch (error) {
      console.error('Falha ao obter sessão:', error);
      // Tentar fazer login em caso de erro
      return await this.loginForTests();
    }
  },
  
  /**
   * Fazer logout temporário (para testar falhas de autenticação)
   * @returns {Promise<void>}
   */
  temporaryLogout: async function() {
    try {
      // Armazenar a sessão atual antes de fazer logout
      const currentSession = cachedSession;
      
      // Fazer logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(`Erro ao fazer logout temporário: ${error.message}`);
      }
      
      console.log('Logout temporário realizado com sucesso');
      
      // Limpar a sessão em cache
      cachedSession = null;
      
      // Retornar a sessão anterior para poder restaurar depois
      return currentSession;
    } catch (error) {
      console.error('Falha ao fazer logout temporário:', error);
      throw error;
    }
  },
  
  /**
   * Restaurar a sessão após um logout temporário
   * @param {Object} session Sessão a ser restaurada
   * @returns {Promise<void>}
   */
  restoreSession: function(session) {
    if (session) {
      cachedSession = session;
      lastLoginTime = Date.now();
      console.log('Sessão restaurada com sucesso');
    }
  }
}; 