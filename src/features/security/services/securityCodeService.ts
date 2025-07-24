import api from '../../../services/api';

/**
 * Gera um novo código de segurança (2FA) para o usuário logado.
 * @returns Promise com o código gerado e sua data de expiração.
   */
export const generate2FACode = () => {
  // Conforme o teste, o backend identifica o usuário pelo token, sem necessidade de payload.
  return api.post('/functions/v1/validation-codes/generate');
};

  /**
 * Valida um código de segurança (2FA).
 * @param code - O código de 6 dígitos a ser validado.
 * @returns Promise com o resultado da validação.
   */
export const validate2FACode = (code: string) => {
  return api.post('/functions/v1/validation-codes/validate', { code });
}; 