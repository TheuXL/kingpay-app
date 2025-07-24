import supabase from '../../../config/supabaseClient';


/**
 * Realiza o login do usuário.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ data, error }>}
 */
const signIn = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

/**
 * Obtém a sessão e os dados do usuário atualmente logado.
 * @returns {Promise<{ data: { user }, error }>}
 */
const getUser = () => {
  return supabase.auth.getUser();
};

/**
 * Realiza o logout do usuário.
 */
const signOut = () => {
  return supabase.auth.signOut();
};

/**
 * Registra um novo usuário.
 * @param {string} email
 * @param {string} password
 * @param {string} [name] - Nome do usuário (opcional)
 * @returns {Promise<{ data, error }>}
 */
const signUp = (email: string, password: string, name?: string) => {
  return supabase.auth.signUp({
    email,
    password,
        options: {
          data: {
        full_name: name,
          },
        },
      });
};


/**
 * Envia um e-mail de redefinição de senha.
 * @param {string} email
 * @returns {Promise<{ data, error }>}
 */
const resetPasswordForEmail = (email: string) => {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://app.kingpay.com.br/update-password', // URL para onde o usuário será redirecionado
  });
};

export const authService = {
  signIn,
  getUser,
  signOut,
  signUp,
  resetPasswordForEmail,
}; 