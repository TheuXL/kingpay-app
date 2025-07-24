/**
 * Formata um objeto Date para o formato YYYY-MM-DD.
 * @param {Date} date - O objeto Date a ser formatado.
 * @returns {string} A data formatada.
 */
export const formatDateForApi = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // Retorna uma string vazia ou lança um erro se a data for inválida
    console.warn('formatDateForApi recebeu uma data inválida:', date);
    return '';
  }
  return date.toISOString().split('T')[0];
};

/**
 * Formata um número para uma string de moeda BRL (Real).
 * @param {number} value - O valor numérico.
 * @returns {string} O valor formatado como moeda.
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um número para uma string de porcentagem.
 * @param {number} value - O valor numérico (ex: 0.12 para 12%).
 * @returns {string} O valor formatado como porcentagem.
 */
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '0,0%';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}; 